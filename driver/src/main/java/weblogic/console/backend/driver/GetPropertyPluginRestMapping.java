// Copyright (c) 2020, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.driver;

import java.lang.reflect.Method;
import java.util.logging.Logger;

/**
 * Repackages static information about a weblogic mbean property that uses a custom plugin
 * to get its value so that the RDS can efficiently convert between RDJ REST requests and
 * WLS REST requests.
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
public class GetPropertyPluginRestMapping extends PropertyPluginRestMapping {

  private static final Logger LOGGER =
    Logger.getLogger(GetPropertyPluginRestMapping.class.getName());

  public GetPropertyPluginRestMapping(Method method, PropertyRestMapping referringProperty) {
    super(method, referringProperty);
  }

  @Override
  public boolean isGetPropertyPlugin() {
    return true;
  }

  @Override
  public GetPropertyPluginRestMapping asGetPropertyPlugin() {
    return this;
  }
}
