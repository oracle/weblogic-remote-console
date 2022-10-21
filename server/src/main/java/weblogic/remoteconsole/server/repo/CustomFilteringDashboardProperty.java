// Copyright (c) 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

/**
 * POJO that holds information about how to filter a bean property of a custom filtering dashboard.
 */
public class CustomFilteringDashboardProperty {

  private CustomFilteringDashboardPropertyDef propertyDef;
  private String criteria;
  private Value value;

  public CustomFilteringDashboardProperty(
    CustomFilteringDashboardPropertyDef propertyDef,
    String criteria,
    Value value
  ) {
    this.propertyDef = propertyDef;
    this.criteria = criteria;
    this.value = value;
  }

  // The property def on the beans being filtered
  public CustomFilteringDashboardPropertyDef getPropertyDef() {
    return propertyDef;
  }

  // The filtering rule (unordered, equals, ...)
  public String getCriteria() {
    return criteria;
  }

  // The value to filter on (only if the criteria isn't unordered)
  public Value getValue() {
    return value;
  }

  // Convert the criteria to a property to include in the create form or query slice RDJ
  public FormProperty getCriteriaFormProperty() {
    return new FormProperty(propertyDef.getCriteriaPropertyDef(), new StringValue(criteria));
  }

  // Convert the value to a property to include in the create form or query slice RDJ
  public FormProperty getValueFormProperty() {
    return new FormProperty(propertyDef.getValuePropertyDef(), value);
  }
}
