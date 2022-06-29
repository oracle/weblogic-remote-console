// Copyright (c) 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import weblogic.remoteconsole.common.repodef.BeanChildDef;
import weblogic.remoteconsole.common.repodef.LocalizedConstants;
import weblogic.remoteconsole.common.repodef.PagePropertyDef;

/**
 * Utility class for managing a set of custom views.
 */
public class CustomViewManager {

  private Map<String,CustomView> viewNameToView = new HashMap<>();

  // Search results are not cached when they take less that this amount of time to fetch:
  private static final int MINIMUM_CACHEABLE_SEARCH_TIME = 3 * 1000; // milliseconds

  // Cache search results for this many times how long it took to compute them.
  // For example, if it takes 10 seconds to do a search, don't bother redoing the search
  // for 50 seconds (unless the user explicitly does a reload)
  private static final int SEARCH_TIME_TO_EXPIRATION_TIME = 5;

  CustomViewManager() {
  }

  // Create a custom view
  public synchronized Response<String> createView(InvocationContext ic, CustomViewQuery query) {
    Response<String> response = new Response<>();
    String viewName = query.getName();
    if (viewNameToView.containsKey(viewName)) {
      response.setUserBadRequest();
      response.addFailureMessage(
        ic.getLocalizer().localizeString(
          LocalizedConstants.ALREADY_EXISTS,
          viewName
        )
      );
      return response;
    }

    // Add the search to the list of recent searches but don't actually do it yet.
    // That will happen later when getSearchResults is called.
    CustomView view = new CustomView(query, null, null, null);
    viewNameToView.put(viewName, view);
    return response.setSuccess(viewName);
  }

  // Delete an existing custom view.
  public synchronized Response<Void> deleteView(InvocationContext ic, String viewName) {
    Response<Void> response = new Response<>();
    CustomView deletedView = viewNameToView.remove(viewName);
    if (deletedView != null) {
      return response.setSuccess(null);
    } else {
      return response.setNotFound();
    }
  }

  // Update the filtering rules for an existing custom view.
  public synchronized Response<Void> updateView(InvocationContext ic, CustomViewQuery query) {
    Response<Void> response = new Response<>();
    String viewName = query.getName();
    CustomView view = viewNameToView.get(viewName);
    if (view == null) {
      return response.setNotFound();
    }
    CustomView updatedView = new CustomView(query, null, null, null);
    viewNameToView.put(viewName, updatedView);
    return response.setSuccess(null);
  }

  // Get all of the custom views.
  public synchronized List<CustomView> getCustomViews(InvocationContext ic) {
    // Send back a copy to avoid multi-threading issues:
    return List.copyOf(viewNameToView.values());
  }

  // Find a custom view given an ic whose bean tree path references the custom view.
  public synchronized Response<CustomView> getCustomView(InvocationContext ic) {
    return getCustomView(ic, ic.getBeanTreePath().getLastSegment().getKey());
  }

  // Find a custom view given the view's name.
  public synchronized Response<CustomView> getCustomView(InvocationContext ic, String viewName) {
    Response<CustomView> response = new Response<>();
    CustomView view = viewNameToView.get(viewName);
    if (view == null) {
      return response.setNotFound();
    }
    return response.setSuccess(view);
  }

  // Get the results of a custom view (i.e. the set of matching mbeans).
  // If there's cached results that haven't expired, it will return them.
  // Otherwise it will perform the search, cache the results, and return them.
  public synchronized Response<CustomView> getSearchResults(InvocationContext ic, String viewName) {
    Response<CustomView> response = new Response<>();
    CustomView view = viewNameToView.get(viewName);
    if (view == null) {
      return response.setNotFound();
    }
    if (!ic.isReload() && view.isCurrent()) {
      // Reuse the cached search results
      return response.setSuccess(view);
    }
    // Do the search, cache it and return it.
    long startTime = System.currentTimeMillis();
    Response<List<SearchBeanResults>> searchResponse = doSearch(ic, view.getQuery());
    if (!searchResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(searchResponse);
    }
    long endTime = System.currentTimeMillis();
    CustomView newView =
      new CustomView(
        view.getQuery(),
        searchResponse.getResults(),
        new Date(endTime), // results date
        getExpirationDate(startTime, endTime)
      );
    viewNameToView.put(viewName, newView);
    return response.setSuccess(newView);
  }

  private Response<List<SearchBeanResults>> doSearch(InvocationContext ic, CustomViewQuery query) {
    Response<List<SearchBeanResults>> response = new Response<>();
    SearchCriteria genericCriteria = createSearchCriteria(query);
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

  private static SearchCriteria createSearchCriteria(CustomViewQuery query) {
    SearchCriteria criteria = new SearchCriteria();
    List<SearchBeanFilter> filters = new ArrayList<>();
    List<SearchProperty> searchProperties = new ArrayList<>();
    filters.add(createPathFilter(query));
    for (CustomViewProperty property :  query.getProperties()) {
      addProperty(property, filters, searchProperties);
    }
    criteria.setFilters(filters);
    criteria.setProperties(searchProperties);
    return criteria;
  }

  private static SearchBeanFilter createPathFilter(CustomViewQuery query) {
    List<SearchPathSegmentFilter> segmentFilters = new ArrayList<>();
    for (CustomViewPathSegment segment : query.getPath()) {
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
        if (CustomViewPathSegmentDef.CRITERIA_EQUALS.equals(criteria)) {
          segmentFilter.setEquals(segment.getValue());
        } else if (CustomViewPathSegmentDef.CRITERIA_CONTAINS.equals(criteria)) {
          segmentFilter.setContains(segment.getValue());
        } else if (CustomViewPathSegmentDef.CRITERIA_UNFILTERED.equals(criteria)) {
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
    CustomViewProperty property,
    List<SearchBeanFilter> beanFilters,
    List<SearchProperty> searchProperties
  ) {
    String criteria = property.getCriteria();
    String propertyName = property.getPropertyDef().getSourcePropertyDef().getFormPropertyName();
    if (CustomViewPropertyDef.CRITERIA_UNFILTERED.equals(criteria)) {
      SearchProperty searchProperty = new SearchProperty();
      searchProperty.setPropertyName(propertyName);
      searchProperties.add(searchProperty);
    } else {
      beanFilters.add(createPropertyFilter(property));
    }
  }

  private static SearchBeanFilter createPropertyFilter(CustomViewProperty property) {
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
    if (CustomViewPropertyDef.CRITERIA_EQUALS.equals(criteria)) {
      valueFilter.setEquals(value);
    } else if (CustomViewPropertyDef.CRITERIA_NOT_EQUALS.equals(criteria)) {
      valueFilter.setEquals(value);
      beanFilter.setMatches(false);
    } else if (CustomViewPropertyDef.CRITERIA_CONTAINS.equals(criteria)) {
      valueFilter.setContains(value.asString().getValue());
    } else {
      throw new AssertionError("Unsupported string property criteria:" + criteria);
    }
    beanFilter.setValueFilter(valueFilter);
  }

  private static void completeNumberPropertyFilter(SearchBeanFilter beanFilter, String criteria, Value value) {
    SearchValueFilter valueFilter = new SearchValueFilter();
    if (CustomViewPropertyDef.CRITERIA_EQUALS.equals(criteria)) {
      valueFilter.setEquals(value);
    } else if (CustomViewPropertyDef.CRITERIA_NOT_EQUALS.equals(criteria)) {
      valueFilter.setEquals(value);
      beanFilter.setMatches(false);
    } else if (CustomViewPropertyDef.CRITERIA_LESS_THAN.equals(criteria)) {
      valueFilter.setLessThan(value);
    } else if (CustomViewPropertyDef.CRITERIA_LESS_THAN_OR_EQUALS.equals(criteria)) {
      valueFilter.setLessThanOrEquals(value);
    } else if (CustomViewPropertyDef.CRITERIA_GREATER_THAN.equals(criteria)) {
      valueFilter.setGreaterThan(value);
    } else if (CustomViewPropertyDef.CRITERIA_GREATER_THAN_OR_EQUALS.equals(criteria)) {
      valueFilter.setGreaterThanOrEquals(value);
    } else {
      throw new AssertionError("Unsupported number property criteria:" + criteria);
    }
    beanFilter.setValueFilter(valueFilter);
  }

  private static void completeBooleanPropertyFilter(SearchBeanFilter beanFilter, String criteria, Value value) {
    SearchValueFilter valueFilter = new SearchValueFilter();
    if (CustomViewPropertyDef.CRITERIA_TRUE.equals(criteria)) {
      valueFilter.setEquals(new BooleanValue(true));
    } else if (CustomViewPropertyDef.CRITERIA_FALSE.equals(criteria)) {
      valueFilter.setEquals(new BooleanValue(false));
    } else {
      throw new AssertionError("Unsupported boolean property criteria:" + criteria);
    }
    beanFilter.setValueFilter(valueFilter);
  }

  private static void completeGenericPropertyFilter(SearchBeanFilter beanFilter, String criteria, Value value) {
    SearchValueFilter valueFilter = new SearchValueFilter();
    if (CustomViewPropertyDef.CRITERIA_CONTAINS.equals(criteria)) {
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
