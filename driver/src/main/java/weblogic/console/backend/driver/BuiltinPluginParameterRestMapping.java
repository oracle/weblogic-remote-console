// Copyright (c) 2020, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.driver;

import java.util.logging.Logger;

/**
 * Repackages static information about a builtin parameter (e.g. WeblogicConfiguration) to a
 * property's read plugin so that the RDS can efficiently convert between RDJ REST requests
 * and WLS REST requests.
 * <p>
 * Think of it as pre-computing some of the mapping between the page's CBE REST interface
 * and the underlying WLS REST interface and caching it.
 * <p>
 * It holds the following static information about a builtin parameter:
 * <ul>
 *   <li>referringReadPlugin - the read plugin that uses this parameter</li>
 * </ul>
 */
public class BuiltinPluginParameterRestMapping extends PluginParameterRestMapping {

  private static final Logger LOGGER =
    Logger.getLogger(BuiltinPluginParameterRestMapping.class.getName());

  public BuiltinPluginParameterRestMapping(
    Class<?> javaClass,
    PluginRestMapping referringPlugin
  ) {
    super(javaClass, referringPlugin);
  }

  @Override
  public boolean isBuiltinParameter() {
    return true;
  }

  @Override
  public BuiltinPluginParameterRestMapping asBuiltinParameter() {
    return this;
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb
      .append("BuiltinPluginParameterRestMapping(")
      .append(super.toString())
      .append(")");
    return sb.toString();
  }
}
