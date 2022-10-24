// Copyright (c) 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

import weblogic.remoteconsole.common.repodef.PagePropertyDef;

/**
 * POJO that holds the page property defs related to a bean property for a custom filtering dashboard.
 */
public class CustomFilteringDashboardPropertyDef {

  public static final String CRITERIA_UNFILTERED = "unfiltered";
  public static final String CRITERIA_EQUALS = "equals";
  public static final String CRITERIA_CONTAINS = "contains";
  public static final String CRITERIA_NOT_EQUALS = "notEquals";
  public static final String CRITERIA_LESS_THAN = "lessThan";
  public static final String CRITERIA_LESS_THAN_OR_EQUALS = "lessThanOrEquals";
  public static final String CRITERIA_GREATER_THAN = "greaterThan";
  public static final String CRITERIA_GREATER_THAN_OR_EQUALS = "greaterThanOrEquals";

  private PagePropertyDef sourcePropertyDef;
  private PagePropertyDef criteriaPropertyDef;
  private PagePropertyDef valuePropertyDef;

  public CustomFilteringDashboardPropertyDef(
    PagePropertyDef sourcePropertyDef,
    PagePropertyDef criteriaPropertyDef,
    PagePropertyDef valuePropertyDef
  ) {
    this.sourcePropertyDef = sourcePropertyDef;
    this.criteriaPropertyDef = criteriaPropertyDef;
    this.valuePropertyDef = valuePropertyDef;
  }

  // The property def of the property on the actual bean that we're filtering on.
  public PagePropertyDef getSourcePropertyDef() {
    return sourcePropertyDef;
  }

  // The filtering rule (criteria), e.g. unfiltered, equals, ...
  // The allowable criteria are determined by the property's type.
  // For example only property that's a number supports 'lessThan'
  public PagePropertyDef getCriteriaPropertyDef() {
    return criteriaPropertyDef;
  }

  // If the criteria isn't 'unfiltered', then this is the value
  // that we're looking for when applying the filter.
  public PagePropertyDef getValuePropertyDef() {
    return valuePropertyDef;
  }
}
