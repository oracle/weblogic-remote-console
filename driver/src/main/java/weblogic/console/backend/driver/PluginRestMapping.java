// Copyright (c) 2020, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.driver;

import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;

/**
 * Repackages static information about a custom plugin to used to read or write beans so that the
 * RDS can efficiently convert between RDJ REST requests and WLS REST requests.
 * <p>
 * Think of it as pre-computing some of the mapping between the page's
 * CBE REST interface and the underlying WLS REST interface and caching it.
 * <p>
 * It holds the following static information about a plugin:
 * <ul>
 *   <li>method - the java method to call</li>
 *   <li>parameters - the parameters that are passed into this plugin</li>
 * </ul>
 */
public abstract class PluginRestMapping {

  private static final Logger LOGGER = Logger.getLogger(PluginRestMapping.class.getName());

  private Method method;

  public Method getMethod() {
    return this.method;
  }

  private List<PluginParameterRestMapping> parameters = new ArrayList<>();

  public List<PluginParameterRestMapping> getParameters() {
    return this.parameters;
  }

  public void addParameter(PluginParameterRestMapping parameter) {
    this.parameters.add(parameter);
  }

  public PluginRestMapping(Method method) {
    this.method = method;
  }

  public boolean isPropertyPlugin() {
    return false;
  }

  public PropertyPluginRestMapping asPropertyPlugin() {
    Thread.dumpStack();
    throw new AssertionError("Not a PropertyPluginRestMapping");
  }

  public boolean isGetPropertyPlugin() {
    return false;
  }

  public GetPropertyPluginRestMapping asGetPropertyPlugin() {
    throw new AssertionError("Not a GetPropertyPluginRestMapping");
  }

  public boolean isTypePlugin() {
    return false;
  }

  public TypePluginRestMapping asTypePlugin() {
    throw new AssertionError("Not a TypePluginRestMapping");
  }

  // A string indicating who references this plugin.
  // Used for displaying build errors.
  public abstract String getReferrer();

  @Override
  public String toString() {
    return "method=" + getMethod() + ", params=" + getParameters();
  }
}
