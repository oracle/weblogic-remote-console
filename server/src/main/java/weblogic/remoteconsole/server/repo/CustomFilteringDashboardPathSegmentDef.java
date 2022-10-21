// Copyright (c) 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

import weblogic.remoteconsole.common.repodef.PagePropertyDef;

/**
 * POJO that holds info about a bean tree path segment of a custom filtering dashboard
 */
public class CustomFilteringDashboardPathSegmentDef {

  public static final String CRITERIA_UNFILTERED = "unfiltered";
  public static final String CRITERIA_EQUALS = "equals";
  public static final String CRITERIA_CONTAINS = "contains";

  private BeanTreePathSegment segmentTemplate;
  private PagePropertyDef criteriaPropertyDef;
  private PagePropertyDef valuePropertyDef;
  private PagePropertyDef resultPropertyDef;

  // Collection segments let the user filter the children's keys:
  public CustomFilteringDashboardPathSegmentDef(
    BeanTreePathSegment segmentTemplate,
    PagePropertyDef criteriaPropertyDef,
    PagePropertyDef valuePropertyDef,
    PagePropertyDef resultPropertyDef
  ) {
    this.segmentTemplate = segmentTemplate;
    this.criteriaPropertyDef = criteriaPropertyDef;
    this.valuePropertyDef = valuePropertyDef;
    this.resultPropertyDef = resultPropertyDef;
  }

  // Singleton segments don't let the user filter anything:
  public CustomFilteringDashboardPathSegmentDef(BeanTreePathSegment segmentTemplate) {
    this.segmentTemplate = segmentTemplate;
  }

  // Indicates whether the user can filter beans based on this segment.
  // Ff this segment is a collection, it can be filtered (e.g. filtering by the Servers' name).
  // If it's a singleton, it cannot be filtered (since the name is the same for all instances).
  public boolean isFilterable() {
    return getSegmentTemplate().getChildDef().isCollection();
  }

  // Get the corresponding bean tree path segment
  public BeanTreePathSegment getSegmentTemplate() {
    return segmentTemplate;
  }

  // Returns the property def of the property on the create form and query slice
  // for configuring the filter criteria for this segment.
  public PagePropertyDef getCriteriaPropertyDef() {
    return criteriaPropertyDef;
  }

  // Returns the property def of the property on the create form and query slice
  // for configuring the filter value for this segment.
  public PagePropertyDef getValuePropertyDef() {
    return valuePropertyDef;
  }

  // Returns the property def of the property on the results slice for returning
  // the name of this segment (e.g. the Server's name)
  public PagePropertyDef getResultPropertyDef() {
    return resultPropertyDef;
  }
}
