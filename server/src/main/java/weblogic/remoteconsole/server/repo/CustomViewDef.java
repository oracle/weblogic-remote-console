// Copyright (c) 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

import java.util.Collections;
import java.util.List;

/**
 * POJO that holds the definintion of a custom view including:
 * - its name
 * - its bean tree path pattern (i.e. defines all the candidate beans that the view needs to filter)
 * - the filters for the bean tree path
 * - the filters for the beans' properties
 * Only beans that match the bean tree path pattern, pass the bean tree path filters
 * and pass the property filters will be returned by the custom view.
 */
public class CustomViewDef {
  private String name;
  private BeanTreePath beanTreePathTemplate;
  private List<CustomViewPathSegmentDef> pathDef;
  private List<CustomViewPropertyDef> propertyDefs;

  public CustomViewDef(
    BeanTreePath beanTreePathTemplate,
    List<CustomViewPathSegmentDef> pathDef,
    List<CustomViewPropertyDef> propertyDefs
  ) {
    this.beanTreePathTemplate = beanTreePathTemplate;
    this.pathDef = Collections.unmodifiableList(pathDef);
    this.propertyDefs = Collections.unmodifiableList(propertyDefs);
  }

  // The bean tree path pattern for selecting beans that this
  // view could potentially return
  public BeanTreePath getBeanTreePathTemplate() {
    return beanTreePathTemplate;
  }

  // The filtering rules for selecting beans based on their bean tree path
  public List<CustomViewPathSegmentDef> getPathDef() {
    return pathDef;
  }

  // The filtering rules for selecting beans based on their values.
  public List<CustomViewPropertyDef> getPropertyDefs() {
    return propertyDefs;
  }
}
