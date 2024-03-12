// Copyright (c) 2022, 2023, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import weblogic.remoteconsole.common.repodef.PageActionDef;

/**
 * POJO that holds the definintion of a filtering dashboard including:
 * - its bean tree path pattern (i.e. defines all the candidate beans that the dashboard needs to filter)
 * - the filters for the bean tree path
 * - the filters for the beans' properties (split into basic and advanced lists)
 * Only beans that match the bean tree path pattern, pass the bean tree path filters
 * and pass the property filters will be returned by the dashboard.
 */
public class FilteringDashboardDef {
  boolean builtin;
  private BeanTreePath beanTreePathTemplate;
  private List<FilteringDashboardPathSegmentDef> pathDef;
  private List<FilteringDashboardPropertyDef> allPropertyDefs;
  private List<FilteringDashboardPropertyDef> basicPropertyDefs;
  private List<FilteringDashboardPropertyDef> advancedPropertyDefs;
  private List<PageActionDef> actionDefs;

  public FilteringDashboardDef(
    // ic,
    BeanTreePath beanTreePathTemplate,
    List<FilteringDashboardPathSegmentDef> pathDef,
    List<FilteringDashboardPropertyDef> basicPropertyDefs,
    List<FilteringDashboardPropertyDef> advancedPropertyDefs,
    List<PageActionDef> actionDefs
  ) {
    this.beanTreePathTemplate = beanTreePathTemplate;
    this.pathDef = Collections.unmodifiableList(pathDef);
    this.basicPropertyDefs = Collections.unmodifiableList(basicPropertyDefs);
    this.advancedPropertyDefs = Collections.unmodifiableList(advancedPropertyDefs);
    allPropertyDefs = new ArrayList<>(this.basicPropertyDefs);
    allPropertyDefs.addAll(this.advancedPropertyDefs);
    // sort allPropertyDefs by localized name then form name
    this.allPropertyDefs = Collections.unmodifiableList(allPropertyDefs);
    this.actionDefs = Collections.unmodifiableList(actionDefs);
  }

  // The bean tree path pattern for selecting beans that this
  // dashboard could potentially return
  public BeanTreePath getBeanTreePathTemplate() {
    return beanTreePathTemplate;
  }

  // The filtering rules for selecting beans based on their bean tree path
  public List<FilteringDashboardPathSegmentDef> getPathDef() {
    return pathDef;
  }

  // The filtering rules for selecting beans based on their basic values.
  public List<FilteringDashboardPropertyDef> getBasicPropertyDefs() {
    return basicPropertyDefs;
  }

  // The filtering rules for selecting beans based on their advanced values.
  public List<FilteringDashboardPropertyDef> getAdvancedPropertyDefs() {
    return advancedPropertyDefs;
  }

  // The filtering rules for selecting beans based on their values.
  public List<FilteringDashboardPropertyDef> getAllPropertyDefs() {
    return allPropertyDefs;
  }

  // The actions that can be invoked on the beans in this dashboard's 'View' slice
  public List<PageActionDef> getActionDefs() {
    return actionDefs;
  }
}
