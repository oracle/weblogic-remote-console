// Copyright (c) 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import weblogic.remoteconsole.common.repodef.BeanChildDef;
import weblogic.remoteconsole.common.repodef.LocalizedConstants;
import weblogic.remoteconsole.common.repodef.PageDef;
import weblogic.remoteconsole.common.repodef.PagePropertyDef;
import weblogic.remoteconsole.server.PersistableFeature;
import weblogic.remoteconsole.server.PersistenceManager;

/**
 * Utility class for managing dashboards, including their persistence.
 */
public class DashboardManager extends PersistableFeature<PersistedDashboards> {

  private static final PersistenceManager<PersistedDashboards> PERSISTENCE_MANAGER =
    new PersistenceManager<>(PersistedDashboards.class, "dashboards");

  private Dashboards dashboards = new Dashboards();

  // Search results are not cached when they take less that this amount of time to fetch:
  private static final int MINIMUM_CACHEABLE_SEARCH_TIME = 3 * 1000; // milliseconds

  // Cache search results for this many times how long it took to compute them.
  // For example, if it takes 10 seconds to do a search, don't bother redoing the search
  // for 50 seconds (unless the user explicitly does a reload)
  private static final int SEARCH_TIME_TO_EXPIRATION_TIME = 5;

  DashboardManager() {
  }

  @Override
  protected PersistenceManager<PersistedDashboards> getPersistenceManager() {
    return PERSISTENCE_MANAGER;
  }

  @Override
  protected void fromPersistedData(InvocationContext ic, PersistedDashboards persistedData) {
    dashboards = PersistedDashboardsToDashboards.fromPersistedData(ic, dashboards, persistedData);
  }

  @Override
  protected PersistedDashboards toPersistedData(InvocationContext ic) {
    return DashboardsToPersistedDashboards.toPersistedData(ic, dashboards);
  }

  // Create a custom filtering dashboard
  public synchronized Response<String> createCustomFilteringDashboard(
    InvocationContext ic,
    CustomFilteringDashboardConfig config
  ) {
    refresh(ic);
    Response<String> response = new Response<>();
    String dashboardName = config.getName();
    if (dashboards.getDashboards().containsKey(dashboardName)) {
      response.setUserBadRequest();
      response.addFailureMessage(
        ic.getLocalizer().localizeString(
          LocalizedConstants.ALREADY_EXISTS,
          dashboardName
        )
      );
      return response;
    }

    // Add the search to the list of recent searches but don't actually do it yet.
    // That will happen later when getSearchResults is called.
    CustomFilteringDashboard dashboard = new CustomFilteringDashboard(config);
    dashboards.getDashboards().put(dashboardName, dashboard);
    update(ic);
    return response.setSuccess(dashboardName);
  }

  // Delete an existing dashboard.
  public synchronized Response<Void> deleteDashboard(InvocationContext ic, String dashboardName) {
    refresh(ic);
    Response<Void> response = new Response<>();
    Dashboard dashboard = dashboards.getDashboards().get(dashboardName);
    if (dashboard == null) {
      return response.setNotFound();
    }
    if (dashboard.isCustomFilteringDashboard()) {
      dashboards.getDashboards().remove(dashboardName);
      update(ic);
      TableCustomizationsManager tcManager = ic.getPageRepo().asPageReaderRepo().getTableCustomizationsManager();
      tcManager.deleteTableCustomizations(ic, tcManager.getCustomFilteringDashboardTableId(ic));
      return response.setSuccess(null);
    } else {
      // Add support for other kinds of dashboards here
      // e.g. built-in dashboards should return a 400 since they can't be deleted.
      throw new AssertionError("Unsupported dashboard " + dashboardName + " " + dashboard.getClass());
    }
  }

  // Update the filtering rules for an existing custom filtering dashboard
  public synchronized Response<Void> updateCustomFilteringDashboard(
    InvocationContext ic,
    CustomFilteringDashboardConfig config
  ) {
    refresh(ic);
    Response<Void> response = new Response<>();
    String dashboardName = config.getName();
    Dashboard dashboard = dashboards.getDashboards().get(dashboardName);
    if (dashboard == null) {
      return response.setNotFound();
    }
    Dashboard updatedDashboard = new CustomFilteringDashboard(config);
    dashboards.getDashboards().put(dashboardName, updatedDashboard);
    update(ic);
    return response.setSuccess(null);
  }

  // Get all of the dashboards.
  public synchronized List<Dashboard> getDashboards(InvocationContext ic) {
    refresh(ic);
    // Send back a copy to avoid multi-threading issues:
    return List.copyOf(dashboards.getDashboards().values());
  }

  // Find a dashboard given an ic whose bean tree path references the dashboard.
  public Response<Dashboard> getDashboard(InvocationContext ic) {
    return getDashboard(ic, ic.getBeanTreePath().getLastSegment().getKey());
  }

  // Find a dashboard given its name.
  public synchronized Response<Dashboard> getDashboard(InvocationContext ic, String dashboardName) {
    refresh(ic);
    Response<Dashboard> response = new Response<>();
    Dashboard dashboard = dashboards.getDashboards().get(dashboardName);
    if (dashboard == null) {
      return response.setNotFound();
    }
    return response.setSuccess(dashboard);
  }

  // Get the results of a custom filtering dashboard (i.e. the set of matching mbeans).
  // If there's cached results that haven't expired, it will return them.
  // Otherwise it will perform the search, cache the results, and return them.
  public synchronized Response<CustomFilteringDashboard> getCustomFilteringDashboardSearchResults(
    InvocationContext ic,
    PageDef pageDef,
    String dashboardName
  ) {
    refresh(ic);
    Response<CustomFilteringDashboard> response = new Response<>();
    Dashboard db = dashboards.getDashboards().get(dashboardName);
    if (db == null) {
      return response.setNotFound();
    }
    CustomFilteringDashboard dashboard = db.asCustomFilteringDashboard();
    if (!ic.isReload() && dashboard.isCurrent()) {
      // Reuse the cached search results
      return response.setSuccess(dashboard);
    }
    // Do the search, cache it and return it.
    long startTime = System.currentTimeMillis();
    Response<List<SearchBeanResults>> searchResponse = doSearch(ic, pageDef, dashboard.getConfig());
    if (!searchResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(searchResponse);
    }
    long endTime = System.currentTimeMillis();
    CustomFilteringDashboard newDashboard =
      new CustomFilteringDashboard(
        dashboard.getConfig(),
        searchResponse.getResults(),
        new Date(endTime), // results date
        getExpirationDate(startTime, endTime)
      );
    dashboards.getDashboards().put(dashboardName, newDashboard);
    return response.setSuccess(newDashboard);
  }

  private Response<List<SearchBeanResults>> doSearch(
    InvocationContext ic,
    PageDef pageDef,
    CustomFilteringDashboardConfig config
  ) {
    Response<List<SearchBeanResults>> response = new Response<>();
    SearchCriteria genericCriteria = createSearchCriteria(ic, pageDef, config);
    SearchBeanFinder finder = new SearchBeanFinder(ic, genericCriteria);
    boolean includeIsSet = false;
    BeanReaderRepoSearchBuilder builder =
      ic.getPageRepo().getBeanRepo().asBeanReaderRepo().createSearchBuilder(ic, includeIsSet);
    finder.addToSearchBuilder(builder);
    Response<BeanReaderRepoSearchResults> searchResponse = builder.search();
    if (!searchResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(searchResponse);
    }
    List<SearchBeanResults> searchResults = finder.getResults(searchResponse.getResults());
    return response.setSuccess(searchResults);
  }

  private static SearchCriteria createSearchCriteria(
    InvocationContext ic,
    PageDef pageDef,
    CustomFilteringDashboardConfig config
  ) {
    SearchCriteria criteria = new SearchCriteria();
    List<SearchBeanFilter> filters = new ArrayList<>();
    List<SearchProperty> searchProperties = new ArrayList<>();
    filters.add(createPathFilter(config));
    TableCustomizationsManager tcManager = ic.getPageRepo().asPageReaderRepo().getTableCustomizationsManager();
    TableCustomizations customizations = tcManager.getTableCustomizations(ic, pageDef);
    List<String> displayedColumns =
      customizations != null
      ? customizations.getDisplayedColumns()
      : tcManager.getDefaultDisplayedColumns(pageDef);
    for (CustomFilteringDashboardProperty property :  config.getProperties()) {
      addProperty(property, displayedColumns, filters, searchProperties);
    }
    criteria.setFilters(filters);
    criteria.setProperties(searchProperties);
    return criteria;
  }

  private static SearchBeanFilter createPathFilter(CustomFilteringDashboardConfig config) {
    List<SearchPathSegmentFilter> segmentFilters = new ArrayList<>();
    for (CustomFilteringDashboardPathSegment segment : config.getPath()) {
      BeanChildDef childDef = segment.getSegmentDef().getSegmentTemplate().getChildDef();
      {
        // Add a segment for the child, e.g. DomainRuntime or CombinedServerRuntimes
        SearchPathSegmentFilter segmentFilter = new SearchPathSegmentFilter();
        segmentFilter.setEquals(childDef.getChildName());
        segmentFilters.add(segmentFilter);
      }
      if (childDef.isCollection()) {
        // The child is a collection.
        // Add another segment for selecting the collection's children,
        // e.g. any server, exactly Server1, or any server whose name contains FA
        String criteria = segment.getCriteria();
        SearchPathSegmentFilter segmentFilter = new SearchPathSegmentFilter();
        if (CustomFilteringDashboardPathSegmentDef.CRITERIA_EQUALS.equals(criteria)) {
          segmentFilter.setEquals(segment.getValue());
        } else if (CustomFilteringDashboardPathSegmentDef.CRITERIA_CONTAINS.equals(criteria)) {
          segmentFilter.setContains(segment.getValue());
        } else if (CustomFilteringDashboardPathSegmentDef.CRITERIA_UNFILTERED.equals(criteria)) {
          segmentFilter.setAnyValue(true);
        } else {
          throw new AssertionError("Unsupported path segment criteria: " + criteria);
        }
        segmentFilters.add(segmentFilter);  
      }
    }
    SearchBeanFilter beanFilter = new SearchBeanFilter();
    beanFilter.setRequired(true);
    beanFilter.setBeanTreePath(segmentFilters);
    return beanFilter;
  }

  private static void addProperty(
    CustomFilteringDashboardProperty property,
    List<String> displayedColumns,
    List<SearchBeanFilter> beanFilters,
    List<SearchProperty> searchProperties
  ) {
    PagePropertyDef pagePropertyDef = property.getPropertyDef().getSourcePropertyDef();
    String propertyName = pagePropertyDef.getFormPropertyName();
    if (!displayedColumns.contains(propertyName) && pagePropertyDef.isDontReturnIfHiddenColumn()) {
      // This property is for a hidden column which shouldn't be returned
      // (e.g. ServerLifeCycleRuntimeMBean State, which takes a long time to compute)
      return;
    }
    String criteria = property.getCriteria();
    if (CustomFilteringDashboardPropertyDef.CRITERIA_UNFILTERED.equals(criteria)) {
      SearchProperty searchProperty = new SearchProperty();
      searchProperty.setPropertyName(propertyName);
      searchProperties.add(searchProperty);
    } else {
      beanFilters.add(createPropertyFilter(property));
    }
  }

  private static SearchBeanFilter createPropertyFilter(CustomFilteringDashboardProperty property) {
    PagePropertyDef sourcePropertyDef = property.getPropertyDef().getSourcePropertyDef();
    SearchBeanFilter beanFilter = new SearchBeanFilter();
    String criteria = property.getCriteria();
    Value value = property.getValue();
    boolean completed = false;
    beanFilter.setRequired(true);
    beanFilter.setPropertyName(sourcePropertyDef.getFormPropertyName());
    if (!sourcePropertyDef.isArray()) {
      completed = true;
      if (sourcePropertyDef.isString() || sourcePropertyDef.isHealthState()) {
        completeStringPropertyFilter(beanFilter, criteria, value);
      } else if (sourcePropertyDef.isInt() || sourcePropertyDef.isLong() || sourcePropertyDef.isDouble()) {
        completeNumberPropertyFilter(beanFilter, criteria, value);
      } else if (sourcePropertyDef.isBoolean()) {
        completeBooleanPropertyFilter(beanFilter, criteria, value);
      } else {
        completed = false;
      }
    }
    if (!completed) {
      completeGenericPropertyFilter(beanFilter, criteria, value);
    }
    return beanFilter;
  }

  private static void completeStringPropertyFilter(SearchBeanFilter beanFilter, String criteria, Value value) {
    SearchValueFilter valueFilter = new SearchValueFilter();
    if (CustomFilteringDashboardPropertyDef.CRITERIA_EQUALS.equals(criteria)) {
      valueFilter.setEquals(value);
    } else if (CustomFilteringDashboardPropertyDef.CRITERIA_NOT_EQUALS.equals(criteria)) {
      valueFilter.setEquals(value);
      beanFilter.setMatches(false);
    } else if (CustomFilteringDashboardPropertyDef.CRITERIA_CONTAINS.equals(criteria)) {
      valueFilter.setContains(value.asString().getValue());
    } else {
      throw new AssertionError("Unsupported string property criteria:" + criteria);
    }
    beanFilter.setValueFilter(valueFilter);
  }

  private static void completeNumberPropertyFilter(SearchBeanFilter beanFilter, String criteria, Value value) {
    SearchValueFilter valueFilter = new SearchValueFilter();
    if (CustomFilteringDashboardPropertyDef.CRITERIA_EQUALS.equals(criteria)) {
      valueFilter.setEquals(value);
    } else if (CustomFilteringDashboardPropertyDef.CRITERIA_NOT_EQUALS.equals(criteria)) {
      valueFilter.setEquals(value);
      beanFilter.setMatches(false);
    } else if (CustomFilteringDashboardPropertyDef.CRITERIA_LESS_THAN.equals(criteria)) {
      valueFilter.setLessThan(value);
    } else if (CustomFilteringDashboardPropertyDef.CRITERIA_LESS_THAN_OR_EQUALS.equals(criteria)) {
      valueFilter.setLessThanOrEquals(value);
    } else if (CustomFilteringDashboardPropertyDef.CRITERIA_GREATER_THAN.equals(criteria)) {
      valueFilter.setGreaterThan(value);
    } else if (CustomFilteringDashboardPropertyDef.CRITERIA_GREATER_THAN_OR_EQUALS.equals(criteria)) {
      valueFilter.setGreaterThanOrEquals(value);
    } else {
      throw new AssertionError("Unsupported number property criteria:" + criteria);
    }
    beanFilter.setValueFilter(valueFilter);
  }

  private static void completeBooleanPropertyFilter(SearchBeanFilter beanFilter, String criteria, Value value) {
    SearchValueFilter valueFilter = new SearchValueFilter();
    if (CustomFilteringDashboardPropertyDef.CRITERIA_EQUALS.equals(criteria)) {
      valueFilter.setEquals(value);
    } else {
      throw new AssertionError("Unsupported boolean property criteria:" + criteria);
    }
    beanFilter.setValueFilter(valueFilter);
  }

  private static void completeGenericPropertyFilter(SearchBeanFilter beanFilter, String criteria, Value value) {
    SearchValueFilter valueFilter = new SearchValueFilter();
    if (CustomFilteringDashboardPropertyDef.CRITERIA_CONTAINS.equals(criteria)) {
      valueFilter.setContains(value.asString().getValue());
    } else {
      throw new AssertionError("Unsupported generic property criteria:" + criteria);
    }
    beanFilter.setValueFilter(valueFilter);
  }

  private Date getExpirationDate(long startTime, long endTime) {
    long searchTime = endTime - startTime;
    if (searchTime < MINIMUM_CACHEABLE_SEARCH_TIME) {
      return new Date(endTime);
    } else {
      long expirationTime = endTime + (SEARCH_TIME_TO_EXPIRATION_TIME  * searchTime);
      return new Date(expirationTime);
    }
  }
}
