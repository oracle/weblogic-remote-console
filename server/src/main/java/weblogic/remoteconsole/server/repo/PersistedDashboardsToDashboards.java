// Copyright (c) 2022, 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

import java.text.ParseException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import weblogic.console.utils.Path;
import weblogic.console.utils.StringUtils;
import weblogic.remoteconsole.common.repodef.BeanTypeDef;
import weblogic.remoteconsole.common.repodef.PagePropertyDef;
import weblogic.remoteconsole.common.utils.DateUtils;

/**
 * Utility class to convert the persisted dashboards to in-memory dashboards.
 */
class PersistedDashboardsToDashboards {

  private PersistedDashboardsToDashboards() {
  }

  // Convert the persisted dashboards into in-memory ones.
  // Retain cached results for dashboards that haven't changed.
  public static Dashboards fromPersistedData(
    InvocationContext ic,
    Dashboards oldDashboards,
    PersistedDashboards persistedBuiltinDashboards,
    PersistedDashboards persistedCustomDashboards
  ) {
    Dashboards newDashboards = new Dashboards();
    addDashboards(ic, oldDashboards, newDashboards, persistedBuiltinDashboards, true);
    addDashboards(ic, oldDashboards, newDashboards, persistedCustomDashboards, false);
    return newDashboards;
  }

  private static void addDashboards(
    InvocationContext ic,
    Dashboards oldDashboards,
    Dashboards newDashboards,
    PersistedDashboards persistedDashboards,
    boolean builtin
  ) {
    if (persistedDashboards != null) {
      for (Map.Entry<String,PersistedDashboard> entry : persistedDashboards.getDashboards().entrySet()) {
        String dashboardName = entry.getKey();
        PersistedDashboard persistedDashboard = entry.getValue();
        boolean unsupported = true;
        if (!newDashboards.getDashboards().containsKey(dashboardName)) {
          if (persistedDashboard.isFilteringDashboard()) {
            FilteringDashboard newDashboard =
              filteringDashboardFromPersistedData(
                ic,
                builtin,
                dashboardName,
                persistedDashboard.asFilteringDashboard()
              );
            if (newDashboard != null) {
              Dashboard oldDash =
                oldDashboards.getDashboards().get(dashboardName);
              FilteringDashboard oldDashboard =
                (oldDash != null) ? oldDash.asFilteringDashboard() : null;
              if (reuseCachedResults(oldDashboard, newDashboard)) {
                // The dashboard previously existed.  Reuse its cached results
                // but use the newest list of unsupported properties.
                newDashboard =
                  newDashboard.clone(
                    oldDashboard.getResults(),
                    oldDashboard.getResultsDate(),
                    oldDashboard.getExpirationDate()
                  );
              }
              newDashboards.getDashboards().put(dashboardName, newDashboard);
              unsupported = false;
            }
          }
        }
        if (unsupported) {
          newDashboards.getUnsupportedDashboards().put(dashboardName, persistedDashboard);
        }
      }
    }
  }

  // Convert a persisted filtering dashboard to an in-memory dashboard
  // (without any cached results)
  private static FilteringDashboard filteringDashboardFromPersistedData(
    InvocationContext ic,
    boolean builtin,
    String dashboardName,
    PersistedFilteringDashboard persistedDashboard
  ) {
    BeanTreePath btpTemplate = getBeanTreePathTemplate(ic, persistedDashboard);
    if (btpTemplate == null) {
      return null;
    }
    Response<FilteringDashboardConfig> configResponse =
      FilteringDashboardConfigManager.createDefaultConfig(
        ic,
        btpTemplate,
        dashboardName,
        persistedDashboard.getDescription(),
        persistedDashboard.getDefaultColumns()
      );
    if (!configResponse.isSuccess()) {
      // The btpTemplate doesn't support filtering dashboards in this version of WebLogic.
      return null;
    }
    FilteringDashboardConfig defaultConfig = configResponse.getResults();
    FilteringDashboardConfig config =
      new FilteringDashboardConfig(
        defaultConfig.getDashboardDef(),
        defaultConfig.getName(),
        defaultConfig.getDescription(),
        defaultConfig.getDefaultColumns(),
        computePath(defaultConfig, persistedDashboard),
        computeProperties(defaultConfig, persistedDashboard),
        computeUnsupportedPropertyFilters(defaultConfig, persistedDashboard)
      );
    return (builtin) ? new BuiltinFilteringDashboard(config) : new CustomFilteringDashboard(config);
  }

  // Compute the in-memory dashboard's list of path segments
  // by starting with the default list of unfiltered segments
  // for the btpTemplate then overlaying any persisted
  // bean filters.
  private static List<FilteringDashboardPathSegment> computePath(
    FilteringDashboardConfig defaultConfig,
    PersistedFilteringDashboard persistedDashboard
  ) {
    List<FilteringDashboardPathSegment> path = new ArrayList<>();
    for (FilteringDashboardPathSegment defaultSegment : defaultConfig.getPath()) {
      path.add(computeSegment(defaultSegment, persistedDashboard));
    }
    return path;
  }

  // Compute an in-memory path segment of a filtering dashboard
  // by starting with its default unfiltered segment then overlaying
  // its persisted bean filter if there is one.
  private static FilteringDashboardPathSegment computeSegment(
    FilteringDashboardPathSegment defaultSegment,
    PersistedFilteringDashboard persistedDashboard
  ) {
    String beanKey =
      defaultSegment
        .getSegmentDef()
        .getSegmentTemplate()
        .getChildDef()
        .getChildTypeDef()
        .getInstanceName();
    PersistedBeanKeyFilter filter =
      persistedDashboard.getBeanFilters().get(beanKey);
    if (filter == null) {
      return defaultSegment;
    }
    FilteringDashboardPathSegmentDef segmentDef = defaultSegment.getSegmentDef();
    String criteria = null;
    String value = filter.getEquals();
    if (value  != null) {
      criteria = FilteringDashboardPathSegmentDef.CRITERIA_EQUALS;
    }
    if (criteria == null) {
      value = filter.getContains();
      if (value != null) {
        criteria = FilteringDashboardPathSegmentDef.CRITERIA_CONTAINS;
      }
    }
    if (criteria == null) {
      throw new AssertionError(beanKey + " must specify == or contains");
    }
    return new FilteringDashboardPathSegment(segmentDef, criteria, value);
  }

  // Compute an in-memory filtering dashboard's list of properties by
  // starting with the default unfiltered ones for the
  // btpTemplate then overlaying the persisted property filters.
  public static List<FilteringDashboardProperty> computeProperties(
    FilteringDashboardConfig defaultConfig,
    PersistedFilteringDashboard persistedDashboard
  ) {
    List<FilteringDashboardProperty> properties = new ArrayList<>();
    for (FilteringDashboardProperty defaultProperty : defaultConfig.getProperties()) {
      properties.add(computeProperty(defaultProperty, persistedDashboard));
    }
    return properties;
  }

  // Compute an in-memory property of a filtering dashboard by
  // starting with the default unfiltered one for the btpTemplate then
  // overlaying the persisted property filter if there is one.
  private static FilteringDashboardProperty computeProperty(
    FilteringDashboardProperty defaultProperty,
    PersistedFilteringDashboard persistedDashboard
  ) {
    FilteringDashboardPropertyDef propertyDef = defaultProperty.getPropertyDef();
    PersistedPropertyFilter filter =
      persistedDashboard.getPropertyFilters().get(
        getPropertyPath(propertyDef)
      );
    if (filter == null) {
      return defaultProperty;
    }
    PagePropertyDef sourceDef = propertyDef.getSourcePropertyDef();
    if (sourceDef.isString() || sourceDef.isHealthState()) {
      boolean isEnum = !sourceDef.getLegalValueDefs().isEmpty();
      return computeStringProperty(isEnum, propertyDef, filter);
    }
    if (sourceDef.isInt()) {
      return computeIntProperty(propertyDef, filter);
    }
    if (sourceDef.isLong()) {
      return computeLongProperty(propertyDef, filter);
    }
    if (sourceDef.isDouble()) {
      return computeDoubleProperty(propertyDef, filter);
    }
    if (sourceDef.isBoolean()) {
      return computeBooleanProperty(propertyDef, filter);
    }
    if (sourceDef.isDate()) {
      return computeDateProperty(propertyDef, filter);
    }
    if (sourceDef.isDateAsLong()) {
      return computeDateAsLongProperty(propertyDef, filter);
    }
    return computeGenericProperty(propertyDef, filter);
  }

  // Compute an in-memory string property of a filtering dashboard by
  // starting with its default unfiltered one then overlaying its persisted filter.
  private static FilteringDashboardProperty computeStringProperty(
    boolean isEnum,
    FilteringDashboardPropertyDef propertyDef,
    PersistedPropertyFilter filter
  ) {
    String criteria = null;
    Object value = filter.getEquals();
    if (value != null) {
      criteria = FilteringDashboardPropertyDef.CRITERIA_EQUALS;
    }
    if (criteria == null) {
      value = filter.getNotEquals();
      if (value != null) {
        criteria = FilteringDashboardPropertyDef.CRITERIA_NOT_EQUALS;
      }
    }
    if (isEnum) {
      if (criteria == null) {
        throw new AssertionError(getPropertyPath(propertyDef) + " must specify == or !=");
      }
    } else {
      if (criteria == null) {
        value = filter.getContains();
        if (value != null) {
          criteria = FilteringDashboardPropertyDef.CRITERIA_CONTAINS;
        }
      }
      if (criteria == null) {
        throw new AssertionError(getPropertyPath(propertyDef) + " must specify ==, != or contains");
      }
    }
    return
      new FilteringDashboardProperty(
        propertyDef,
        criteria,
        new StringValue(value.toString())
      );
  }

  // Compute an in-memory int property of a filtering dashboard by
  // starting with its default unfiltered one then overlaying its persisted filter.
  private static FilteringDashboardProperty computeIntProperty(
    FilteringDashboardPropertyDef propertyDef,
    PersistedPropertyFilter filter
  ) {
    boolean isEnum = !propertyDef.getSourcePropertyDef().getLegalValueDefs().isEmpty();
    String criteria = getNumberPropertyCriteria(isEnum, propertyDef, filter);
    Object value = getNumberPropertyValue(propertyDef, filter);
    try {
      return
        new FilteringDashboardProperty(
          propertyDef,
          criteria,
          new IntValue(Integer.parseInt(value.toString()))
        );
    } catch (NumberFormatException e) {
      throw new AssertionError(getPropertyPath(propertyDef) + " must be an int: " + value);
    }
  }

  // Compute an in-memory long property of a filtering dashboard by
  // starting with its default unfiltered one then overlaying its persisted filter.
  private static FilteringDashboardProperty computeLongProperty(
    FilteringDashboardPropertyDef propertyDef,
    PersistedPropertyFilter filter
  ) {
    String criteria = getNumberPropertyCriteria(propertyDef, filter);
    Object value = getNumberPropertyValue(propertyDef, filter);
    try {
      return
        new FilteringDashboardProperty(
          propertyDef,
          criteria,
          new LongValue(Long.parseLong(value.toString()))
        );
    } catch (NumberFormatException e) {
      throw new AssertionError(getPropertyPath(propertyDef) + " must be a long: " + value);
    }
  }

  // Compute an in-memory double property of a filtering dashboard by
  // starting with its default unfiltered one then overlaying its persisted filter.
  private static FilteringDashboardProperty computeDoubleProperty(
    FilteringDashboardPropertyDef propertyDef,
    PersistedPropertyFilter filter
  ) {
    String criteria = getNumberPropertyCriteria(propertyDef, filter);
    Object value = getNumberPropertyValue(propertyDef, filter);
    try {
      return
        new FilteringDashboardProperty(
          propertyDef,
          criteria,
          new DoubleValue(Double.parseDouble(value.toString()))
        );
    } catch (NumberFormatException e) {
      throw new AssertionError(getPropertyPath(propertyDef) + " must be  double: " + value);
    }
  }

  // Compute an in-memory date property of a filtering dashboard by
  // starting with its default unfiltered one then overlaying its persisted filter.
  private static FilteringDashboardProperty computeDateProperty(
    FilteringDashboardPropertyDef propertyDef,
    PersistedPropertyFilter filter
  ) {
    String criteria = getNumberPropertyCriteria(propertyDef, filter);
    Object value = getNumberPropertyValue(propertyDef, filter);
    return
      new FilteringDashboardProperty(
        propertyDef,
        criteria,
        new DateValue(getDateFromPersistedValue(propertyDef, value))
      );
  }

  // Compute an in-memory date as long property of a filtering dashboard by
  // starting with its default unfiltered one then overlaying its persisted filter.
  private static FilteringDashboardProperty computeDateAsLongProperty(
    FilteringDashboardPropertyDef propertyDef,
    PersistedPropertyFilter filter
  ) {
    String criteria = getNumberPropertyCriteria(propertyDef, filter);
    Object value = getNumberPropertyValue(propertyDef, filter);
    return
      new FilteringDashboardProperty(
        propertyDef,
        criteria,
        new DateAsLongValue(getDateFromPersistedValue(propertyDef, value))
      );
  }

  private static Date getDateFromPersistedValue(
    FilteringDashboardPropertyDef propertyDef,
    Object value
  ) {
    try {
      // The date was persisted in its string form:
      return DateUtils.parseDate((String)value);
    } catch (ParseException e) {
      long sampleTime = 1675691213448L;
      throw new AssertionError(
        getPropertyPath(propertyDef)
        + " must be a date and time, e.g. "
        + DateUtils.formatDate(new Date(sampleTime))
        + " : "
        + value
      );
    }
  }

  // Get the in-memory criteria for a persisted non-enum number property filter
  private static String getNumberPropertyCriteria(
    FilteringDashboardPropertyDef propertyDef,
    PersistedPropertyFilter filter
  ) {
    return getNumberPropertyCriteria(false, propertyDef, filter);
  }

  // Get the in-memory criteria for a persisted number property filter
  private static String getNumberPropertyCriteria(
    boolean isEnum,
    FilteringDashboardPropertyDef propertyDef,
    PersistedPropertyFilter filter
  ) {
    if (filter.getEquals() != null) {
      return FilteringDashboardPropertyDef.CRITERIA_EQUALS;
    }
    if (filter.getNotEquals() != null) {
      return FilteringDashboardPropertyDef.CRITERIA_NOT_EQUALS;
    }
    if (isEnum) {
      throw new AssertionError(getPropertyPath(propertyDef) + " must specify == or !=");
    } else {
      if (filter.getLessThan() != null) {
        return FilteringDashboardPropertyDef.CRITERIA_LESS_THAN;
      }
      if (filter.getLessThanOrEquals() != null) {
        return FilteringDashboardPropertyDef.CRITERIA_LESS_THAN_OR_EQUALS;
      }
      if (filter.getGreaterThan() != null) {
        return FilteringDashboardPropertyDef.CRITERIA_GREATER_THAN;
      }
      if (filter.getGreaterThanOrEquals() != null) {
        return FilteringDashboardPropertyDef.CRITERIA_GREATER_THAN_OR_EQUALS;
      }
      throw new AssertionError(getPropertyPath(propertyDef) + " must specify ==, !=, <, <=, > or >=");
    }
  }

  // Get the in-memory value for a persisted number property filter
  private static Object getNumberPropertyValue(
    FilteringDashboardPropertyDef propertyDef,
    PersistedPropertyFilter filter
  ) {
    Object value = filter.getEquals();
    if (value == null) {
      value = filter.getNotEquals();
    }
    if (value == null) {
      value = filter.getLessThan();
    }
    if (value == null) {
      value = filter.getLessThanOrEquals();
    }
    if (value == null) {
      value = filter.getGreaterThan();
    }
    if (value == null) {
      value = filter.getGreaterThanOrEquals();
    }
    if (value == null) {
      throw new AssertionError(getPropertyPath(propertyDef) + " must specify ==, !=, <, <=, > or >=");
    }
    return value;
  }

  // Compute an in-memory boolean property of a filtering dashboard by
  // starting with its default unfiltered one then overlaying its persisted filter.
  private static FilteringDashboardProperty computeBooleanProperty(
    FilteringDashboardPropertyDef propertyDef,
    PersistedPropertyFilter filter
  ) {
    Object value = filter.getEquals();
    if (value == null) {
      throw new AssertionError(getPropertyPath(propertyDef) + " must specify ==");
    }
    String str = value.toString();
    BooleanValue boolVal = null;
    if ("true".equals(str)) {
      boolVal = new BooleanValue(true);
    } else if ("false".equals(str)) {
      boolVal = new BooleanValue(false);
    } else {
      throw new AssertionError(getPropertyPath(propertyDef) + " must be true or false: " + value);
    }
    return
      new FilteringDashboardProperty(
        propertyDef,
        FilteringDashboardPropertyDef.CRITERIA_EQUALS,
        boolVal
      );
  }

  // Compute an in-memory generic property of a filtering dashboard by
  // starting with its default unfiltered one then overlaying its persisted filter.
  private static FilteringDashboardProperty computeGenericProperty(
    FilteringDashboardPropertyDef propertyDef,
    PersistedPropertyFilter filter
  ) {
    String value = filter.getContains();
    if (value != null) {
      return
        new FilteringDashboardProperty(
          propertyDef,
          FilteringDashboardPropertyDef.CRITERIA_CONTAINS,
          new StringValue(value)
        );
    }
    throw new AssertionError(getPropertyPath(propertyDef) + " must specify contains");
  }

  // Get a filtering dashboard's property's dot separated path
  private static String getPropertyPath(FilteringDashboardPropertyDef propertyDef) {
    return propertyDef.getSourcePropertyDef().getPropertyPath().getDotSeparatedPath();
  }

  // Return the persisted properties of a persisted filtering dashboard that its btpTemplate doesn't support.
  public static Map<String,PersistedPropertyFilter> computeUnsupportedPropertyFilters(
    FilteringDashboardConfig defaultConfig,
    PersistedFilteringDashboard persistedDashboard
  ) {
    Map<String,PersistedPropertyFilter> unsupported = new HashMap<>();
    for (Map.Entry<String,PersistedPropertyFilter> entry :
         persistedDashboard.getPropertyFilters().entrySet()
    ) {
      if (!isSupportedProperty(entry.getKey(), defaultConfig)) {
        unsupported.put(entry.getKey(), entry.getValue());
      }
    }
    return unsupported;
  }

  // Return whether the current version of WebLogic for this btpTemplate supports a property
  private static boolean isSupportedProperty(String property, FilteringDashboardConfig defaultConfig) {
    for (FilteringDashboardPropertyDef propertyDef : defaultConfig.getDashboardDef().getAllPropertyDefs()) {
      if (propertyDef.getSourcePropertyDef().getPropertyPath().getDotSeparatedPath().equals(property)) {
        return true;
      }
    }
    return false;
  }

  // Convert a persisted filtering dashboard to its btpTemplate.
  // Returns null if this version of WebLogic doesn't support the dashboard's btpTemplate.
  private static BeanTreePath getBeanTreePathTemplate(
    InvocationContext ic,
    PersistedFilteringDashboard persistedDashboard
  ) {
    BeanRepo beanRepo = ic.getPageRepo().getBeanRepo();
    BeanTreePath btpTemplate = BeanTreePath.create(beanRepo, new Path());
    boolean searchSubTypes = true;
    for (String childName : new Path(persistedDashboard.getBeanTreePathTemplate()).getComponents()) {
      Path childPath = new Path(childName);
      BeanTypeDef typeDef = btpTemplate.getTypeDef();
      if (typeDef.hasChildDef(childPath, searchSubTypes)) {
        btpTemplate = btpTemplate.childPath(childPath);
      } else {
        return null;
      }
    }
    return btpTemplate;
  }

  // Determine whether the previous filtering dashboard's cached results should be re-used.
  // They're reusable if the dashboard previously existed and its path segments and properties
  // haven't changed.
  private static boolean reuseCachedResults(
    FilteringDashboard oldDashboard,
    FilteringDashboard newDashboard
  ) {
    if (oldDashboard == null) {
      return false;
    }
    FilteringDashboardConfig oldConfig = oldDashboard.getConfig();
    FilteringDashboardConfig newConfig = newDashboard.getConfig();
    {
      int oldSize = oldConfig.getPath().size();
      int newSize = newConfig.getPath().size();
      if (oldSize != newSize) {
        return false;
      }
      for (int i = 0; i < newSize; i++) {
        FilteringDashboardPathSegment oldSegment = oldConfig.getPath().get(i);
        FilteringDashboardPathSegment newSegment = newConfig.getPath().get(i);
        Path oldChildPath = oldSegment.getSegmentDef().getSegmentTemplate().getChildDef().getChildPath();
        Path newChildPath = newSegment.getSegmentDef().getSegmentTemplate().getChildDef().getChildPath();
        if (!oldChildPath.equals(newChildPath)) {
          return false;
        }
        String oldCriteria = StringUtils.nonNull(oldSegment.getCriteria());
        String newCriteria = StringUtils.nonNull(newSegment.getCriteria());;
        if (!oldCriteria.equals(newCriteria)) {
          return false;
        }
        String oldValue = StringUtils.nonNull(oldSegment.getValue());
        String newValue = StringUtils.nonNull(newSegment.getValue());
        if (!oldValue.equals(newValue)) {
          return false;
        }
      }
    }
    {
      int oldSize = oldConfig.getProperties().size();
      int newSize = newConfig.getProperties().size();
      if (oldSize != newSize) {
        return false;
      }
      for (int i = 0; i < newSize; i++) {
        FilteringDashboardProperty oldProperty = oldConfig.getProperties().get(i);
        FilteringDashboardProperty newProperty = newConfig.getProperties().get(i);
        Path oldPropPath = oldProperty.getPropertyDef().getSourcePropertyDef().getPropertyPath();
        Path newPropPath = newProperty.getPropertyDef().getSourcePropertyDef().getPropertyPath();
        if (!oldPropPath.equals(newPropPath)) {
          return false;
        }
        String oldCriteria = StringUtils.nonNull(oldProperty.getCriteria());
        String newCriteria = StringUtils.nonNull(newProperty.getCriteria());
        if (!oldCriteria.equals(newCriteria)) {
          return false;
        }
        Value oldValue = oldProperty.getValue();
        Value newValue = newProperty.getValue();
        String oldValueAsString = (oldValue != null) ? oldValue.toString() : "";
        String newValueAsString = (newValue != null) ? newValue.toString() : "";
        if (!oldValueAsString.equals(newValueAsString)) {
          return false;
        }
      }
    }
    return true;
  }
}
