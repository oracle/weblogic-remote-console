// Copyright (c) 2020, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.driver;

import java.util.logging.Logger;

/**
 * Repackages static information about a parameter to a property's read plugin that
 * gets its value a bean's property so that the RDS can efficiently convert between
 * RDJ REST requests and WLS REST requests.
 * <p>
 * Think of it as pre-computing some of the mapping between the page's CBE REST 
 * interface and the underlying WLS REST interface and caching it.
 * <p>
 * It holds the following static information about a parameter:
 * <ul>
 *   <li>javaClass - the java class of this parameter</li>
 *   <li>pluginBeanProperty - the bean property to include in this parameter</li>
 *   <li>referringPlugin - the plugin that uses this parameter</li>
 * </ul>
 */
public class PropertyPluginParameterRestMapping extends PluginParameterRestMapping {

  private static final Logger LOGGER =
    Logger.getLogger(BeanPluginParameterRestMapping.class.getName());

  private PluginBeanPropertyRestMapping pluginBeanProperty;

  public PluginBeanPropertyRestMapping getPluginBeanProperty() {
    return this.pluginBeanProperty;
  }

  public PropertyPluginParameterRestMapping(
    PluginBeanPropertyRestMapping pluginBeanProperty,
    PluginRestMapping referringPlugin
  ) {
    super(pluginBeanProperty.getJavaClass(), referringPlugin);
    this.pluginBeanProperty = pluginBeanProperty;
    pluginBeanProperty.setReferringPluginParameter(this);
    LOGGER.finest("new " + this);
  }

  @Override
  public boolean isPropertyParameter() {
    return true;
  }

  @Override
  public PropertyPluginParameterRestMapping asPropertyParameter() {
    return this;
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb
      .append("PropertyPluginParameterRestMapping(")
      .append(super.toString())
      .append(", prop=")
      .append(getPluginBeanProperty())
      .append(")");
    return sb.toString();
  }
}
