// Copyright (c) 2020, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.driver;

import java.util.List;
import java.util.logging.Logger;

import weblogic.console.backend.typedesc.WeblogicBeanProperty;

/**
 * Repackages static information about a weblogic mbean property displayed on a page
 * so that the RDS can efficiently convert between RDJ REST requests and WLS REST requests.
 * <p>
 * Think of it as pre-computing some of the mapping between the page's CBE REST interface
 * and the underlying WLS REST interface and caching it.
 * <p>
 * It holds the following static information about a path segment:
 * <ul>
 *   <li>
 *     parent - this property's path segment
 *   </li>
 *   <li>
 *     beanProperty - the WeblogicBeanProperty corresponding to this property
 *     (null for the domain's path segment)
 *   </li>
 *   <li>
 *     options - The list of properties holding the list of options for this property.
 *     <p>
 *     For example, a ServerMBean's Machine property gets its list available machines
 *     from the DomainMBean's Machines property.
 *     <p>
 *     options is null if the property does not have a corresponding set of options,
 *     or if the property is read-only on the page.
 *   </li>
 * </ul>
 */
public class PropertyRestMapping {

  private static final Logger LOGGER = Logger.getLogger(PropertyRestMapping.class.getName());

  private PathSegmentRestMapping parent;

  public PathSegmentRestMapping getParent() {
    return this.parent;
  }

  private WeblogicBeanProperty beanProperty;

  public WeblogicBeanProperty getBeanProperty() {
    return this.beanProperty;
  }

  private List<OptionsRestMapping> options;

  public List<OptionsRestMapping> getOptions() {
    return this.options;
  }

  // setter v.s. the constructor so the property and options can refer to each other
  /*package*/ void setOptions(List<OptionsRestMapping> options) {
    this.options = options;
  }

  private PropertyPluginRestMapping getMethod;

  public PropertyPluginRestMapping getGetMethod() {
    return this.getMethod;
  }

  // setter v.s. the constructor so the property and get method can refer to each other
  /*package*/ void setGetMethod(PropertyPluginRestMapping getMethod) {
    this.getMethod = getMethod;
  }

  private PropertyPluginRestMapping optionsMethod;

  public PropertyPluginRestMapping getOptionsMethod() {
    return this.optionsMethod;
  }

  // setter v.s. the constructor so the property and options method can refer to each other
  /*package*/ void setOptionsMethod(PropertyPluginRestMapping optionsMethod) {
    this.optionsMethod = optionsMethod;
  }

  public PropertyRestMapping(
    PathSegmentRestMapping parent,
    WeblogicBeanProperty beanProperty
  ) throws Exception {
    this.parent = parent;
    this.beanProperty = beanProperty;
    getParent().addProperty(this);
    LOGGER.finest("new " + this);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb
      .append("PropertyRestMapping(")
      .append("parent=")
      .append(getParent())
      .append(", prop=")
      .append(getBeanProperty().getRestName());
    if (getOptions() != null) {
      sb
        .append(", options=")
        .append(getOptions());
    }
    sb.append(")");
    return sb.toString();
  }
}
