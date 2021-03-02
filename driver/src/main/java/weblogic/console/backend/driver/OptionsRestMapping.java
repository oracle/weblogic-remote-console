// Copyright (c) 2020, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.driver;

import java.util.logging.Logger;

import weblogic.console.backend.typedesc.WeblogicBeanProperty;

/**
 * Repackages static information about a weblogic mbean property used to find the options
 * for a reference/s property on the page so that the RDS can efficiently convert between
 * RDJ REST requests and WLS REST requests.
 * <p>
 * Think of it as pre-computing some of the mapping between the page's CBE REST interface
 * and the underlying WLS REST interface and caching it.
 * <p>
 * It holds the following static information about a property:
 * <ul>
 *   <li>parent - this property's path segment</li>
 *   <li>beanProperty - the WeblogicBeanProperty to fetch the options from</li>
 *   <li>referringProperty - the property that uses this options property</li>
 * </ul>
 */
public class OptionsRestMapping {

  private static final Logger LOGGER = Logger.getLogger(OptionsRestMapping.class.getName());

  private PathSegmentRestMapping parent;

  public PathSegmentRestMapping getParent() {
    return this.parent;
  }

  private WeblogicBeanProperty beanProperty;

  public WeblogicBeanProperty getBeanProperty() {
    return this.beanProperty;
  }

  private PropertyRestMapping referringProperty;

  private PropertyRestMapping getReferringProperty() {
    return this.referringProperty;
  }

  private String labelPrefix;

  public String getLabelPrefix() {
    return this.labelPrefix;
  }

  public OptionsRestMapping(
    PathSegmentRestMapping parent,
    WeblogicBeanProperty beanProperty,
    PropertyRestMapping referringProperty
  ) throws Exception {
    this.parent = parent;
    this.beanProperty = beanProperty;
    this.referringProperty = referringProperty;
    getParent().addOptions(this);
    LOGGER.finest("new " + this);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb
      .append("OptionsRestMapping(")
      .append("parent=")
      .append(getParent())
      .append(", beanProp=")
      .append(getBeanProperty().getRestName())
      .append(", referringProperty=(")
      .append("parent=")
      .append(getReferringProperty().getParent())
      .append(", prop=")
      .append(getReferringProperty().getBeanProperty().getRestName())
      .append(")")
      .append(")");
    return sb.toString();
  }
}
