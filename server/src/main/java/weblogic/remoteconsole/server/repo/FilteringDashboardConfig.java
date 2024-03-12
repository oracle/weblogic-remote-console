// Copyright (c) 2022, 2023, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

import java.util.Collections;
import java.util.List;
import java.util.Map;

/**
 * POJO that holds information about a filtering dashboard's configuration
 * (i.e. the filtering rules for selecting matching beans
 * based on their bean tree paths and on their property values)
 */
public class FilteringDashboardConfig {
  private String name;
  private String description;
  private FilteringDashboardDef dashboardDef;
  private List<FilteringDashboardPathSegment> path;
  private List<FilteringDashboardProperty> properties;
  private Map<String,PersistedPropertyFilter> unsupportedPropertyFilters;
  private List<String> defaultColumns;

  public FilteringDashboardConfig(
    FilteringDashboardDef dashboardDef,
    String name,
    String description,
    List<String> defaultColumns,
    List<FilteringDashboardPathSegment> path,
    List<FilteringDashboardProperty> properties
  ) {
    this(dashboardDef, name, description, defaultColumns, path, properties, Map.of());
  }

  public FilteringDashboardConfig(
    String name,
    FilteringDashboardConfig toCopy
  ) {
    this(
      toCopy.getDashboardDef(),
      name,
      toCopy.getDescription(),
      toCopy.getDefaultColumns(),
      toCopy.getPath(),
      toCopy.getProperties(),
      toCopy.getUnsupportedPropertyFilters()
    );
  }

  public FilteringDashboardConfig(
    FilteringDashboardDef dashboardDef,
    String name,
    String description,
    List<String> defaultColumns,
    List<FilteringDashboardPathSegment> path,
    List<FilteringDashboardProperty> properties,
    Map<String,PersistedPropertyFilter> unsupportedPropertyFilters
  ) {
    this.dashboardDef = dashboardDef;
    this.name = name;
    this.description = description;
    this.defaultColumns = Collections.unmodifiableList(defaultColumns);
    this.path = Collections.unmodifiableList(path);
    this.properties = Collections.unmodifiableList(properties);
    this.unsupportedPropertyFilters = Collections.unmodifiableMap(unsupportedPropertyFilters);
  }

  public FilteringDashboardDef getDashboardDef() {
    return dashboardDef;
  }

  // The dashboard's name
  public String getName() {
    return name;
  }

  // The dashboard's description
  public String getDescription() {
    return description;
  }

  // The dashboard's default displayed columns
  public List<String> getDefaultColumns() {
    return defaultColumns;
  }

  // The filtering rules for selecting beans based on their bean tree path:
  public List<FilteringDashboardPathSegment> getPath() {
    return path;
  }

  // The filtering rules for selecting beans based on their property values:
  public List<FilteringDashboardProperty> getProperties() {
    return properties;
  }

  // The filtering rules that were read in from a persisted filtering dashboard
  // for properties that this version of WebLogic does not suppport
  // (so that we can pass them through the next time we need to persist the dashboard)
  public Map<String,PersistedPropertyFilter> getUnsupportedPropertyFilters() {
    return unsupportedPropertyFilters;
  }
}
