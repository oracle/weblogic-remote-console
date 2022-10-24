// Copyright (c) 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * POJO that holds the definintion of a custom filtering dashboard including:
 * - its name
 * - its bean tree path pattern (i.e. defines all the candidate beans that the dashboard needs to filter)
 * - the filters for the bean tree path
 * - the filters for the beans' properties (split into basic and advanced lists)
 * Only beans that match the bean tree path pattern, pass the bean tree path filters
 * and pass the property filters will be returned by the dashboard.
 */
public class CustomFilteringDashboardDef {
  private BeanTreePath beanTreePathTemplate;
  private List<CustomFilteringDashboardPathSegmentDef> pathDef;
  private List<CustomFilteringDashboardPropertyDef> allPropertyDefs;
  private List<CustomFilteringDashboardPropertyDef> basicPropertyDefs;
  private List<CustomFilteringDashboardPropertyDef> advancedPropertyDefs;

  public CustomFilteringDashboardDef(
    // ic,
    BeanTreePath beanTreePathTemplate,
    List<CustomFilteringDashboardPathSegmentDef> pathDef,
    List<CustomFilteringDashboardPropertyDef> basicPropertyDefs,
    List<CustomFilteringDashboardPropertyDef> advancedPropertyDefs
  ) {
    this.beanTreePathTemplate = beanTreePathTemplate;
    this.pathDef = Collections.unmodifiableList(pathDef);
    this.basicPropertyDefs = Collections.unmodifiableList(basicPropertyDefs);
    this.advancedPropertyDefs = Collections.unmodifiableList(advancedPropertyDefs);
    allPropertyDefs = new ArrayList<>(this.basicPropertyDefs);
    allPropertyDefs.addAll(this.advancedPropertyDefs);
    // sort allPropertyDefs by localized name then form name
    this.allPropertyDefs = Collections.unmodifiableList(allPropertyDefs);
  }

  // The bean tree path pattern for selecting beans that this
  // dashboard could potentially return
  public BeanTreePath getBeanTreePathTemplate() {
    return beanTreePathTemplate;
  }

  // The filtering rules for selecting beans based on their bean tree path
  public List<CustomFilteringDashboardPathSegmentDef> getPathDef() {
    return pathDef;
  }

  // The filtering rules for selecting beans based on their basic values.
  public List<CustomFilteringDashboardPropertyDef> getBasicPropertyDefs() {
    return basicPropertyDefs;
  }

  // The filtering rules for selecting beans based on their advanced values.
  public List<CustomFilteringDashboardPropertyDef> getAdvancedPropertyDefs() {
    return advancedPropertyDefs;
  }

  // The filtering rules for selecting beans based on their values.
  public List<CustomFilteringDashboardPropertyDef> getAllPropertyDefs() {
    return allPropertyDefs;
  }
}
