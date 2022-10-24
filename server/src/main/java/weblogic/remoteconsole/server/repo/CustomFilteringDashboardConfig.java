// Copyright (c) 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

import java.util.Collections;
import java.util.List;
import java.util.Map;

/**
 * POJO that holds information about a custom filtering dashboard's configuration
 * (i.e. the filtering rules for selecting matching beans
 * based on their bean tree paths and on their property values)
 */
public class CustomFilteringDashboardConfig {
  private String name;
  private CustomFilteringDashboardDef dashboardDef;
  private List<CustomFilteringDashboardPathSegment> path;
  private List<CustomFilteringDashboardProperty> properties;
  private Map<String,PersistedPropertyFilter> unsupportedPropertyFilters;

  public CustomFilteringDashboardConfig(
    CustomFilteringDashboardDef dashboardDef,
    String name,
    List<CustomFilteringDashboardPathSegment> path,
    List<CustomFilteringDashboardProperty> properties
  ) {
    this(dashboardDef, name, path, properties, Map.of());
  }

  public CustomFilteringDashboardConfig(
    CustomFilteringDashboardDef dashboardDef,
    String name,
    List<CustomFilteringDashboardPathSegment> path,
    List<CustomFilteringDashboardProperty> properties,
    Map<String,PersistedPropertyFilter> unsupportedPropertyFilters
  ) {
    this.dashboardDef = dashboardDef;
    this.name = name;
    this.path = Collections.unmodifiableList(path);
    this.properties = Collections.unmodifiableList(properties);
    this.unsupportedPropertyFilters = Collections.unmodifiableMap(unsupportedPropertyFilters);
  }

  // The dashboard's name
  public String getName() {
    return name;
  }

  public CustomFilteringDashboardDef getDashboardDef() {
    return dashboardDef;
  }

  // The filtering rules for selecting beans based on their bean tree path:
  public List<CustomFilteringDashboardPathSegment> getPath() {
    return path;
  }

  // The filtering rules for selecting beans based on their property values:
  public List<CustomFilteringDashboardProperty> getProperties() {
    return properties;
  }

  // The filtering rules that were read in from a persisted filtering dashboard
  // for properties that this version of WebLogic does not suppport
  // (so that we can pass them through the next time we need to persist the dashboard)
  public Map<String,PersistedPropertyFilter> getUnsupportedPropertyFilters() {
    return unsupportedPropertyFilters;
  }
}
