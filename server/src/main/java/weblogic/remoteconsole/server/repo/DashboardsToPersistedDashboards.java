// Copyright (c) 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

import java.util.HashMap;
import java.util.Map;

import weblogic.remoteconsole.common.repodef.BeanChildDef;
import weblogic.remoteconsole.common.repodef.PagePropertyDef;
import weblogic.remoteconsole.common.utils.Path;

/**
 * Utility class to convert the in-memory dashboards to the
 * persisted dashboards that should be written to disk.
 */
class DashboardsToPersistedDashboards {

  private DashboardsToPersistedDashboards() {
  }

  // Convert the in-memory dashboards to their persistent form
  public static PersistedDashboards toPersistedData(
    InvocationContext ic,
    Dashboards dashboards
  ) {
    PersistedDashboards persisted = new PersistedDashboards();
    Map<String,PersistedDashboard> persistedDashboards = new HashMap<>();
    for (Dashboard dashboard : dashboards.getDashboards().values()) {
      if (dashboard.isCustomFilteringDashboard()) {
        CustomFilteringDashboardConfig config = dashboard.asCustomFilteringDashboard().getConfig();
        persistedDashboards.put(config.getName(), customFilteringDashboardConfigtoPersistedData(config));
      } else {
        throw new AssertionError("Unsupported dashboard: " + dashboard.getName() + " " + dashboard.getClass());
      }
    }
    persistedDashboards.putAll(dashboards.getUnsupportedDashboards());
    persisted.setDashboards(persistedDashboards);
    return persisted;
  }

  // Convert an in-memory custom custom filtering dashboard's config to its persistent form
  private static PersistedDashboard customFilteringDashboardConfigtoPersistedData(
    CustomFilteringDashboardConfig config
  ) {
    PersistedCustomFilteringDashboard persisted = new PersistedCustomFilteringDashboard();
    Map<String,PersistedBeanKeyFilter> beanKeyFilters = new HashMap<>();
    Map<String,PersistedPropertyFilter> propertyFilters = new HashMap<>();
    Path beanTreePathTemplate = new Path();
    for (CustomFilteringDashboardPathSegment pathSegment : config.getPath()) {
      BeanTreePathSegment btpSegment = pathSegment.getSegmentDef().getSegmentTemplate();
      beanTreePathTemplate.addPath(btpSegment.getChildDef().getChildPath());
      PersistedBeanKeyFilter filter = pathSegmentToPersistedData(pathSegment);
      if (filter != null) {
        beanKeyFilters.put(btpSegment.getChildDef().getChildTypeDef().getInstanceName(), filter);
      }
    }
    for (CustomFilteringDashboardProperty property : config.getProperties()) {
      PersistedPropertyFilter filter = propertyToPersistedData(property);
      if (filter != null) {
        propertyFilters.put(
          property.getPropertyDef().getSourcePropertyDef().getPropertyPath().getDotSeparatedPath(),
          filter
        );
      }
    }
    propertyFilters.putAll(config.getUnsupportedPropertyFilters());
    persisted.setBeanTreePathTemplate(beanTreePathTemplate.getDotSeparatedPath());
    if (!beanKeyFilters.isEmpty()) {
      persisted.setBeanFilters(beanKeyFilters);
    }
    if (!propertyFilters.isEmpty()) {
      persisted.setPropertyFilters(propertyFilters);
    }
    return persisted;
  }

  // Convert an in-memory custom filtering dashboard path segment to its persistent form.
  private static PersistedBeanKeyFilter pathSegmentToPersistedData(
    CustomFilteringDashboardPathSegment pathSegment
  ) {
    String criteria = pathSegment.getCriteria();
    if (CustomFilteringDashboardPathSegmentDef.CRITERIA_UNFILTERED.equals(criteria)) {
      return null; // we only persist filtered path segments
    }
    BeanChildDef childDef = pathSegment.getSegmentDef().getSegmentTemplate().getChildDef();
    if (!childDef.isCollection()) {
      return null; // we only filter collections
    }
    PersistedBeanKeyFilter persisted =
      new PersistedBeanKeyFilter();
    String val = pathSegment.getValue();
    if (CustomFilteringDashboardPathSegmentDef.CRITERIA_EQUALS.equals(criteria)) {
      persisted.setEquals(val);
    } else if (CustomFilteringDashboardPathSegmentDef.CRITERIA_CONTAINS.equals(criteria)) {
      persisted.setContains(val);
    } else {
      throw new AssertionError("Unsupported criteria " + childDef + " " + criteria);
    }
    return persisted;
  }

  // Convert an in-memory custom filtering dashboard property to its persistent form.
  private static PersistedPropertyFilter propertyToPersistedData(CustomFilteringDashboardProperty property) {
    String criteria = property.getCriteria();
    Value value = property.getValue();
    if (CustomFilteringDashboardPropertyDef.CRITERIA_UNFILTERED.equals(criteria)) {
      return null; // we only persist filtered properties
    }
    PersistedPropertyFilter persisted =
      new PersistedPropertyFilter();
    PagePropertyDef sourceDef = property.getPropertyDef().getSourcePropertyDef();
    if (sourceDef.isString() || sourceDef.isHealthState()) {
      persisted = stringPropertyToPersistedData(criteria, value.asString().getValue(), persisted);
    } else if (sourceDef.isInt()) {
      persisted = numberPropertyToPersistedData(criteria, value.asInt().getValue(), persisted);
    } else if (sourceDef.isLong()) {
      persisted = numberPropertyToPersistedData(criteria, value.asLong().getValue(), persisted);
    } else if (sourceDef.isDouble()) {
      persisted = numberPropertyToPersistedData(criteria, value.asDouble().getValue(), persisted);
    } else if (sourceDef.isBoolean()) {
      persisted = booleanPropertyToPersistedData(criteria, value.asBoolean().getValue(), persisted);
    } else {
      persisted = genericPropertyToPersistedData(criteria, value.asString().getValue(), persisted);
    }
    if (persisted == null) {
      throw new AssertionError("Unsupported criteria " + sourceDef + " " + criteria);
    }
    return persisted;
  }

  // Convert an in-memory custom filtering dashboard string property to its persistent form.
  private static PersistedPropertyFilter stringPropertyToPersistedData(
    String criteria,
    String value,
    PersistedPropertyFilter persisted
  ) {
    if (CustomFilteringDashboardPropertyDef.CRITERIA_EQUALS.equals(criteria)) {
      persisted.setEquals(value);
    } else if (CustomFilteringDashboardPropertyDef.CRITERIA_NOT_EQUALS.equals(criteria)) {
      persisted.setNotEquals(value);
    } else if (CustomFilteringDashboardPropertyDef.CRITERIA_CONTAINS.equals(criteria)) {
      persisted.setContains(value);
    } else {
      return null;
    }
    return persisted;
  }

  // Convert an in-memory custom filtering dashboard number (int/long/double) property to its persistent form.
  private static PersistedPropertyFilter numberPropertyToPersistedData(
    String criteria,
    Object value,
    PersistedPropertyFilter persisted
  ) {
    if (CustomFilteringDashboardPropertyDef.CRITERIA_EQUALS.equals(criteria)) {
      persisted.setEquals(value);
    } else if (CustomFilteringDashboardPropertyDef.CRITERIA_NOT_EQUALS.equals(criteria)) {
      persisted.setNotEquals(value);
    } else if (CustomFilteringDashboardPropertyDef.CRITERIA_LESS_THAN.equals(criteria)) {
      persisted.setLessThan(value);
    } else if (CustomFilteringDashboardPropertyDef.CRITERIA_LESS_THAN_OR_EQUALS.equals(criteria)) {
      persisted.setLessThanOrEquals(value);
    } else if (CustomFilteringDashboardPropertyDef.CRITERIA_GREATER_THAN.equals(criteria)) {
      persisted.setGreaterThan(value);
    } else if (CustomFilteringDashboardPropertyDef.CRITERIA_GREATER_THAN_OR_EQUALS.equals(criteria)) {
      persisted.setGreaterThanOrEquals(value);
    } else {
      return null;
    }
    return persisted;
  }

  // Convert an in-memory custom filtering dashboard boolean property to its persistent form.
  private static PersistedPropertyFilter booleanPropertyToPersistedData(
    String criteria,
    Object value,
    PersistedPropertyFilter persisted
  ) {
    if (CustomFilteringDashboardPropertyDef.CRITERIA_EQUALS.equals(criteria)) {
      persisted.setEquals(value);
    } else {
      return null;
    }
    return persisted;
  }

  // Convert an in-memory custom filtering dashboard generic property to its persistent form.
  private static PersistedPropertyFilter genericPropertyToPersistedData(
    String criteria,
    String value,
    PersistedPropertyFilter persisted
  ) {
    if (CustomFilteringDashboardPropertyDef.CRITERIA_EQUALS.equals(criteria)) {
      persisted.setEquals(value);
    } else {
      return null;
    }
    return persisted;
  }
}
