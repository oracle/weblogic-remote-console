// Copyright (c) 2020, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.driver;

import java.util.logging.Logger;

/**
 * Repackages static information about a parameter to a property's read plugin so that
 * the RDS can efficiently convert between RDJ REST requests and WLS REST requests.
 * <p>
 * Think of it as pre-computing some of the mapping between the page's CBE REST interface
 * and the underlying WLS REST interface and caching it.
 * <p>
 * It holds the following static information about a parameter:
 * <ul>
 *   <li>javaClass</li>
 *   <li>the java class of this parameter</li>
 *   <li>referringPlugin</li>
 *   <li>the plugin that uses this parameter</li>
 * </ul>
 */
public class PluginParameterRestMapping {

  private static final Logger LOGGER = Logger.getLogger(PluginParameterRestMapping.class.getName());

  private Class<?> javaClass;

  public Class<?> getJavaClass() {
    return this.javaClass;
  }

  private PluginRestMapping referringPlugin;

  public PluginRestMapping getReferringPlugin() {
    return this.referringPlugin;
  }

  protected PluginParameterRestMapping(Class<?> javaClass, PluginRestMapping referringPlugin) {
    this.javaClass = javaClass;
    this.referringPlugin = referringPlugin;
  }

  public boolean isBuiltinParameter() {
    return false;
  }

  public BuiltinPluginParameterRestMapping asBuiltinParameter() {
    throw new AssertionError("Not a BuiltinPluginParameterRestMapping");
  }

  public boolean isCollectionParameter() {
    return false;
  }

  public CollectionPluginParameterRestMapping asCollectionParameter() {
    throw new AssertionError("Not a CollectionPluginParameterRestMapping");
  }

  public boolean isBeanParameter() {
    return false;
  }

  public BeanPluginParameterRestMapping asBeanParameter() {
    throw new AssertionError("Not a BeanPluginParameterRestMapping");
  }

  public boolean isPropertyParameter() {
    return false;
  }

  public PropertyPluginParameterRestMapping asPropertyParameter() {
    throw new AssertionError("Not a PropertyPluginParameterRestMapping");
  }

  @Override
  public String toString() {
    return getReferringPlugin().getReferrer() + ", javaClass=" + getJavaClass();
  }
}
