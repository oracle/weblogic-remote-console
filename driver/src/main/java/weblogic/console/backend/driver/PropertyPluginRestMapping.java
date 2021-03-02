// Copyright (c) 2020, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.driver;

import java.lang.reflect.Method;
import java.util.logging.Logger;

/**
 * Repackages static information about a weblogic mbean property that uses a custom plugin
 * to manage its value so that the RDS can efficiently convert between RDJ REST requests
 * and WLS REST requests.
 * <p>
 * Think of it as pre-computing some of the mapping between the page's CBE REST interface
 * and the underlying WLS REST interface and caching it.
 * <p>
 * It holds the following static information about a property:
 * <ul>
 *   <li>method - the java method to call</li>
 *   <li>parameters - the parameters that are passed into this read plugin</li>
 *   <li>referringProperty - the property that uses this plugin</li>
 * </ul>
 */
public class PropertyPluginRestMapping extends PluginRestMapping {

  private static final Logger LOGGER = Logger.getLogger(PropertyPluginRestMapping.class.getName());

  private PropertyRestMapping referringProperty;

  public PropertyRestMapping getReferringProperty() {
    return this.referringProperty;
  }

  public PropertyPluginRestMapping(Method method, PropertyRestMapping referringProperty) {
    super(method);
    this.referringProperty = referringProperty;
  }

  @Override
  public boolean isPropertyPlugin() {
    return true;
  }

  @Override
  public PropertyPluginRestMapping asPropertyPlugin() {
    return this;
  }

  @Override
  public String getReferrer() {
    StringBuilder sb = new StringBuilder();
    sb
      .append("referringProperty=(")
      .append("parent=")
      .append(getReferringProperty().getParent())
      .append(", prop=")
      .append(getReferringProperty().getBeanProperty().getRestName())
      .append(")");
    return sb.toString();
  }

  @Override
  public String toString() {
    return getClass().getSimpleName() + "(" + super.toString() + ", " + getReferrer() + ")";
  }
}
