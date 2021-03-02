// Copyright (c) 2020, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.driver;

import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;
import javax.json.JsonObject;

/**
 * Repackages static information about a parameter to a property's read plugin that gets
 * its value a bean's properties so that the RDS can efficiently convert between RDJ REST
 * requests and WLS REST requests.
 * <p>
 * Think of it as pre-computing some of the mapping between the page's CBE REST interface
 * and the underlying WLS REST interface and caching it.
 * <p>
 * It holds the following static information about a parameter:
 * <ul>
 *   <li>javaClass - the java class of this parameter</li>
 *   <li>parent - the path segment of the bean to read properties from</li>
 *   <li>pluginBeanProperties - the properties on the bean
 *       (and its singleton children beans)to include in this parameter</li>
 *   <li>referringPlugin - the plugin that uses this parameter</li>
 * </ul>
 */
public class BeanPluginParameterRestMapping extends PluginParameterRestMapping {

  private static final Logger LOGGER =
    Logger.getLogger(BeanPluginParameterRestMapping.class.getName());

  private PathSegmentRestMapping parent;

  public PathSegmentRestMapping getParent() {
    return this.parent;
  }

  private List<PluginBeanPropertyRestMapping> pluginBeanProperties = new ArrayList<>();

  public List<PluginBeanPropertyRestMapping> getPluginBeanProperties() {
    return this.pluginBeanProperties;
  }

  public BeanPluginParameterRestMapping(
    PathSegmentRestMapping parent,
    List<PluginBeanPropertyRestMapping> pluginBeanProperties,
    PluginRestMapping referringPlugin
  ) {
    super(JsonObject.class, referringPlugin);
    this.parent = parent;
    this.pluginBeanProperties = pluginBeanProperties;
    for (PluginBeanPropertyRestMapping pluginBeanProperty : getPluginBeanProperties()) {
      pluginBeanProperty.setReferringPluginParameter(this);
    }
    LOGGER.finest("new " + this);
  }

  @Override
  public boolean isBeanParameter() {
    return true;
  }

  @Override
  public BeanPluginParameterRestMapping asBeanParameter() {
    return this;
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb
      .append("BeanPluginParameterRestMapping(")
      .append(super.toString())
      .append(", parent=")
      .append(getParent())
      .append(", props=")
      .append(getPluginBeanProperties())
      .append(")");
    return sb.toString();
  }
}
