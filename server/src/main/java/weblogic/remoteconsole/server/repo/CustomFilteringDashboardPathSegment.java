// Copyright (c) 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

/**
 * POJO that holds information about how to filter beans based on a path segment of their bean tree path
 */
public class CustomFilteringDashboardPathSegment {

  private CustomFilteringDashboardPathSegmentDef segmentDef;
  private String criteria;
  private String value;

  // Collection segments let the user filter the children's keys:
  public CustomFilteringDashboardPathSegment(
    CustomFilteringDashboardPathSegmentDef segmentDef,
    String criteria,
    String value
  ) {
    this.segmentDef = segmentDef;
    this.criteria = criteria;
    this.value = value;
  }

  // Singleton segments don't let the user filter anything:
  public CustomFilteringDashboardPathSegment(CustomFilteringDashboardPathSegmentDef segmentDef) {
    this.segmentDef = segmentDef;
  }

  // The details of this bean tree path segment
  public CustomFilteringDashboardPathSegmentDef getSegmentDef() {
    return segmentDef;
  }

  // The criteria for filtering beans by this segent (unordered, contains, ...)
  public String getCriteria() {
    return criteria;
  }

  // The value for the filter (only if criteria isn't ordered)
  public String getValue() {
    return value;
  }

  // Convert the criteria to a property to include in the create form or query slice RDJ
  public FormProperty getCriteriaFormProperty() {
    return new FormProperty(segmentDef.getCriteriaPropertyDef(), new StringValue(criteria));
  }

  // Convert the value to a property to include in the create form or query slice RDJ
  public FormProperty getValueFormProperty() {
    return new FormProperty(segmentDef.getValuePropertyDef(), new StringValue(value));
  }
}
