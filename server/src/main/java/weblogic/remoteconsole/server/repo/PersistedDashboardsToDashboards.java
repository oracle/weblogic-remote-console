// Copyright (c) 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import weblogic.remoteconsole.common.repodef.BeanTypeDef;
import weblogic.remoteconsole.common.repodef.PagePropertyDef;
import weblogic.remoteconsole.common.utils.Path;
import weblogic.remoteconsole.common.utils.StringUtils;

/**
 * Utility class to convert the persisted dashboards to in-memory dashboards.
 */
class PersistedDashboardsToDashboards {

  private PersistedDashboardsToDashboards() {
  }

  // Convert the persisted dashboards into in-memory ones.
  // Retain cached results for dashboards that haven't  changed.
  public static Dashboards fromPersistedData(
    InvocationContext ic,
    Dashboards oldDashboards,
    PersistedDashboards persistedDashboards
  ) {
    Dashboards newDashboards = new Dashboards();
    if (persistedDashboards != null) {
      for (Map.Entry<String,PersistedDashboard> entry : persistedDashboards.getDashboards().entrySet()) {
        String dashboardName = entry.getKey();
        PersistedDashboard persistedDashboard = entry.getValue();
        if (persistedDashboard.isCustomFilteringDashboard()) {
          CustomFilteringDashboard newDashboard =
            customFilteringDashboardFromPersistedData(
              ic,
              dashboardName,
              persistedDashboard.asCustomFilteringDashboard()
            );
          if (newDashboard != null) {
            Dashboard oldDash =
              oldDashboards.getDashboards().get(dashboardName);
            CustomFilteringDashboard oldDashboard =
              (oldDash != null) ? oldDash.asCustomFilteringDashboard() : null;
            if (reuseCachedResults(oldDashboard, newDashboard)) {
              // The dashboard previously existed.  Reuse its cached results
              // but use the newest list of unsupported properties.
              newDashboard =
                new CustomFilteringDashboard(
                  newDashboard.getConfig(),
                  oldDashboard.getResults(),
                  oldDashboard.getResultsDate(),
                  oldDashboard.getExpirationDate()
                );
            }
            newDashboards.getDashboards().put(dashboardName, newDashboard);
          } else {
            newDashboards.getUnsupportedDashboards().put(dashboardName, persistedDashboard);
          }
        } else {
          throw new AssertionError("Unsupported dashboard " + persistedDashboard.getClass());
        }
      }
    }
    return newDashboards;
  }

  // Convert a persisted custom filtering dashboard to an in-memory dashboard
  // (without any cached results)
  private static CustomFilteringDashboard customFilteringDashboardFromPersistedData(
    InvocationContext ic,
    String dashboardName,
    PersistedCustomFilteringDashboard persistedDashboard
  ) {
    BeanTreePath btpTemplate = getBeanTreePathTemplate(ic, persistedDashboard);
    if (btpTemplate == null) {
      return null;
    }
    Response<CustomFilteringDashboardConfig> configResponse =
      CustomFilteringDashboardConfigManager.createDefaultConfig(ic, btpTemplate, dashboardName);
    if (!configResponse.isSuccess()) {
      // The btpTemplate doesn't support custom filtering dashboards in this version of WebLogic.
      return null;
    }
    CustomFilteringDashboardConfig defaultConfig = configResponse.getResults();
    return
      new CustomFilteringDashboard(
        new CustomFilteringDashboardConfig(
          defaultConfig.getDashboardDef(),
          defaultConfig.getName(),
          computePath(defaultConfig, persistedDashboard),
          computeProperties(defaultConfig, persistedDashboard),
          computeUnsupportedPropertyFilters(defaultConfig, persistedDashboard)
        )
      );
  }

  // Compute the in-memory dashboard's list of path segments
  // by starting with the default list of unfiltered segments
  // for the btpTemplate then overlaying any persisted
  // bean filters.
  private static List<CustomFilteringDashboardPathSegment> computePath(
    CustomFilteringDashboardConfig defaultConfig,
    PersistedCustomFilteringDashboard persistedDashboard
  ) {
    List<CustomFilteringDashboardPathSegment> path = new ArrayList<>();
    for (CustomFilteringDashboardPathSegment defaultSegment : defaultConfig.getPath()) {
      path.add(computeSegment(defaultSegment, persistedDashboard));
    }
    return path;
  }

  // Compute an in-memory path segment of a custom filtering dashboard
  // by starting with its default unfiltered segment then overlaying
  // its persisted bean filter if there is one.
  private static CustomFilteringDashboardPathSegment computeSegment(
    CustomFilteringDashboardPathSegment defaultSegment,
    PersistedCustomFilteringDashboard persistedDashboard
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
    CustomFilteringDashboardPathSegmentDef segmentDef = defaultSegment.getSegmentDef();
    String criteria = null;
    String value = filter.getEquals();
    if (value  != null) {
      criteria = CustomFilteringDashboardPathSegmentDef.CRITERIA_EQUALS;
    }
    if (criteria == null) {
      value = filter.getContains();
      if (value != null) {
        criteria = CustomFilteringDashboardPathSegmentDef.CRITERIA_CONTAINS;
      }
    }
    if (criteria == null) {
      throw new AssertionError(beanKey + " must specify == or contains");
    }
    return new CustomFilteringDashboardPathSegment(segmentDef, criteria, value);
  }

  // Compute an in-memory custom filtering dashboard's list of properties by
  // starting with the default unfiltered ones for the
  // btpTemplate then overlaying the persisted property filters.
  public static List<CustomFilteringDashboardProperty> computeProperties(
    CustomFilteringDashboardConfig defaultConfig,
    PersistedCustomFilteringDashboard persistedDashboard
  ) {
    List<CustomFilteringDashboardProperty> properties = new ArrayList<>();
    for (CustomFilteringDashboardProperty defaultProperty : defaultConfig.getProperties()) {
      properties.add(computeProperty(defaultProperty, persistedDashboard));
    }
    return properties;
  }

  // Compute an in-memory property of a custom filtering dashboard by
  // starting with the default unfiltered one for the btpTemplate then
  // overlaying the persisted property filter if there is one.
  private static CustomFilteringDashboardProperty computeProperty(
    CustomFilteringDashboardProperty defaultProperty,
    PersistedCustomFilteringDashboard persistedDashboard
  ) {
    CustomFilteringDashboardPropertyDef propertyDef = defaultProperty.getPropertyDef();
    PersistedPropertyFilter filter =
      persistedDashboard.getPropertyFilters().get(
        getPropertyPath(propertyDef)
      );
    if (filter == null) {
      return defaultProperty;
    }
    PagePropertyDef sourceDef = propertyDef.getSourcePropertyDef();
    if (sourceDef.isString() || sourceDef.isHealthState()) {
      return computeStringProperty(propertyDef, filter);
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
    return computeGenericProperty(propertyDef, filter);
  }

  // Compute an in-memory string property of a custom filtering dashboard by
  // starting with its default unfiltered one then overlaying its persisted filter.
  private static CustomFilteringDashboardProperty computeStringProperty(
    CustomFilteringDashboardPropertyDef propertyDef,
    PersistedPropertyFilter filter
  ) {
    String criteria = null;
    Object value = filter.getEquals();
    if (value != null) {
      criteria = CustomFilteringDashboardPropertyDef.CRITERIA_EQUALS;
    }
    if (criteria == null) {
      value = filter.getNotEquals();
      if (value != null) {
        criteria = CustomFilteringDashboardPropertyDef.CRITERIA_NOT_EQUALS;
      }
    }
    if (criteria == null) {
      value = filter.getContains();
      if (value != null) {
        criteria = CustomFilteringDashboardPropertyDef.CRITERIA_CONTAINS;
      }
    }
    if (criteria == null) {
      throw new AssertionError(getPropertyPath(propertyDef) + " must specify ==, != or contains");
    }
    return
      new CustomFilteringDashboardProperty(
        propertyDef,
        criteria,
        new StringValue(value.toString())
      );
  }

  // Compute an in-memory int property of a custom filtering dashboard by
  // starting with its default unfiltered one then overlaying its persisted filter.
  private static CustomFilteringDashboardProperty computeIntProperty(
    CustomFilteringDashboardPropertyDef propertyDef,
    PersistedPropertyFilter filter
  ) {
    String criteria = getNumberPropertyCriteria(propertyDef, filter);
    Object value = getNumberPropertyValue(propertyDef, filter);
    try {
      return
        new CustomFilteringDashboardProperty(
          propertyDef,
          criteria,
          new IntValue(Integer.parseInt(value.toString()))
        );
    } catch (NumberFormatException e) {
      throw new AssertionError(getPropertyPath(propertyDef) + " must be an int: " + value);
    }
  }

  // Compute an in-memory long property of a custom filtering dashboard by
  // starting with its default unfiltered one then overlaying its persisted filter.
  private static CustomFilteringDashboardProperty computeLongProperty(
    CustomFilteringDashboardPropertyDef propertyDef,
    PersistedPropertyFilter filter
  ) {
    String criteria = getNumberPropertyCriteria(propertyDef, filter);
    Object value = getNumberPropertyValue(propertyDef, filter);
    try {
      return
        new CustomFilteringDashboardProperty(
          propertyDef,
          criteria,
          new LongValue(Long.parseLong(value.toString()))
        );
    } catch (NumberFormatException e) {
      throw new AssertionError(getPropertyPath(propertyDef) + " must be a long: " + value);
    }
  }

  // Compute an in-memory double property of a custom filtering dashboard by
  // starting with its default unfiltered one then overlaying its persisted filter.
  private static CustomFilteringDashboardProperty computeDoubleProperty(
    CustomFilteringDashboardPropertyDef propertyDef,
    PersistedPropertyFilter filter
  ) {
    String criteria = getNumberPropertyCriteria(propertyDef, filter);
    Object value = getNumberPropertyValue(propertyDef, filter);
    try {
      return
        new CustomFilteringDashboardProperty(
          propertyDef,
          criteria,
          new DoubleValue(Double.parseDouble(value.toString()))
        );
    } catch (NumberFormatException e) {
      throw new AssertionError(getPropertyPath(propertyDef) + " must be  double: " + value);
    }
  }

  // Get the in-memory criteria for a persisted number property filter
  private static String getNumberPropertyCriteria(
    CustomFilteringDashboardPropertyDef propertyDef,
    PersistedPropertyFilter filter
  ) {
    if (filter.getEquals() != null) {
      return CustomFilteringDashboardPropertyDef.CRITERIA_EQUALS;
    }
    if (filter.getNotEquals() != null) {
      return CustomFilteringDashboardPropertyDef.CRITERIA_NOT_EQUALS;
    }
    if (filter.getLessThan() != null) {
      return CustomFilteringDashboardPropertyDef.CRITERIA_LESS_THAN;
    }
    if (filter.getLessThanOrEquals() != null) {
      return CustomFilteringDashboardPropertyDef.CRITERIA_LESS_THAN_OR_EQUALS;
    }
    if (filter.getGreaterThan() != null) {
      return CustomFilteringDashboardPropertyDef.CRITERIA_GREATER_THAN;
    }
    if (filter.getGreaterThanOrEquals() != null) {
      return CustomFilteringDashboardPropertyDef.CRITERIA_GREATER_THAN_OR_EQUALS;
    }
    throw new AssertionError(getPropertyPath(propertyDef) + " must specify ==, !=, <, <=, > or >=");
  }

  // Get the in-memory value for a persisted number property filter
  private static Object getNumberPropertyValue(
    CustomFilteringDashboardPropertyDef propertyDef,
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

  // Compute an in-memory boolean property of a custom filtering dashboard by
  // starting with its default unfiltered one then overlaying its persisted filter.
  private static CustomFilteringDashboardProperty computeBooleanProperty(
    CustomFilteringDashboardPropertyDef propertyDef,
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
      new CustomFilteringDashboardProperty(
        propertyDef,
        CustomFilteringDashboardPropertyDef.CRITERIA_EQUALS,
        boolVal
      );
  }

  // Compute an in-memory generic property of a custom filtering dashboard by
  // starting with its default unfiltered one then overlaying its persisted filter.
  private static CustomFilteringDashboardProperty computeGenericProperty(
    CustomFilteringDashboardPropertyDef propertyDef,
    PersistedPropertyFilter filter
  ) {
    String value = filter.getContains();
    if (value != null) {
      return
        new CustomFilteringDashboardProperty(
          propertyDef,
          CustomFilteringDashboardPropertyDef.CRITERIA_CONTAINS,
          new StringValue(value)
        );
    }
    throw new AssertionError(getPropertyPath(propertyDef) + " must specify contains");
  }

  // Get a custom filtering dashboard's property's dot separated path
  private static String getPropertyPath(CustomFilteringDashboardPropertyDef propertyDef) {
    return propertyDef.getSourcePropertyDef().getPropertyPath().getDotSeparatedPath();
  }

  // Return the persisted properties of a persisted custom filtering dashboard that its btpTemplate doesn't support.
  public static Map<String,PersistedPropertyFilter> computeUnsupportedPropertyFilters(
    CustomFilteringDashboardConfig defaultConfig,
    PersistedCustomFilteringDashboard persistedDashboard
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
  private static boolean isSupportedProperty(String property, CustomFilteringDashboardConfig defaultConfig) {
    for (CustomFilteringDashboardPropertyDef propertyDef : defaultConfig.getDashboardDef().getAllPropertyDefs()) {
      if (propertyDef.getSourcePropertyDef().getPropertyPath().getDotSeparatedPath().equals(property)) {
        return true;
      }
    }
    return false;
  }

  // Convert a persisted custom filtering dashboard to its btpTemplate.
  // Returns null if this version of WebLogic doesn't support the dashboard's btpTemplate.
  private static BeanTreePath getBeanTreePathTemplate(
    InvocationContext ic,
    PersistedCustomFilteringDashboard persistedDashboard
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

  // Determine whether the previous custom filtering dashboard's cached results should be re-used.
  // They're reusable if the dashboard previously existed and its path segments and properties
  // haven't changed.
  private static boolean reuseCachedResults(
    CustomFilteringDashboard oldDashboard,
    CustomFilteringDashboard newDashboard
  ) {
    if (oldDashboard == null) {
      return false;
    }
    CustomFilteringDashboardConfig oldConfig = oldDashboard.getConfig();
    CustomFilteringDashboardConfig newConfig = newDashboard.getConfig();
    {
      int oldSize = oldConfig.getPath().size();
      int newSize = newConfig.getPath().size();
      if (oldSize != newSize) {
        return false;
      }
      for (int i = 0; i < newSize; i++) {
        CustomFilteringDashboardPathSegment oldSegment = oldConfig.getPath().get(i);
        CustomFilteringDashboardPathSegment newSegment = newConfig.getPath().get(i);
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
        CustomFilteringDashboardProperty oldProperty = oldConfig.getProperties().get(i);
        CustomFilteringDashboardProperty newProperty = newConfig.getProperties().get(i);
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
