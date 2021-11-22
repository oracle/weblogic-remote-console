// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef;

import java.util.List;
import java.util.Set;

import weblogic.remoteconsole.common.utils.Path;

/**
 * This interface describes a bean action.
 * 
 * It contains all of the information about the tree that the different
 * parts of the backend needs (e.g. english resource bundle, PDJ, RDJ).
 *
 * Note: currently we only support actions that don't return values.
 */
public interface BeanActionDef extends BeanValueDef {

  // The page-relative bean type containing this property, e.g. Server
  public BeanTypeDef getTypeDef();

  // The name of the action in the leaf bean that contains the action,
  // e.g. ServerLifeCycleRuntimeMBean's "start".
  // The name must uniquely identify the action in the type, e.g.
  // - shutdown (no args) v.s shutdown_timeout_ignoreSessions (two arg)
  // Typically the name is made unique by appending the parameter names.
  // This is not a requirement - the only requirement is that it uniquely
  // identifies the action in the type.
  public String getActionName();

  // The name of the underling remote action the bean repo needs to delegate to.
  // e.g.  shutdown_timeout_ignoreSessions is 'shutdown' in the WLS REST api.
  public String getRemoteActionName();

  // The path from the page-relative bean type to the leaf bean that contains the action,
  // e.g. if the top level bean is Server, and this action is on the SSL mbean, then
  // parentPath is "SSL"
  public Path getParentPath();

  // The path from the page-relative bean type to this action.
  public default Path getActionPath() {
    return getParentPath().childPath(getActionName());
  }

  // Describes the input parameters that must be passed in the request body
  // to invoke this action.
  public List<BeanActionParamDef> getParamDefs();

  // Returns whether this is an asynchronous action
  // (e.g. starting a server is, while restarting the SSL channels is not)
  public boolean isAsynchronous();

  // Lookup the description of an input parameter given its name.
  public default BeanActionParamDef getParamDef(String paramName) {
    for (BeanActionParamDef paramDef : getParamDefs()) {
      if (paramDef.getParamName().equals(paramName)) {
        return paramDef;
      }
    }
    throw new AssertionError(
      getTypeDef().getTypeName()
      + " " + getActionPath()
      + " ParamDef not found :"
      + " " + paramName
    );
  }

  // The roles that are allowed to invoke this action
  public Set<String> getInvokeRoles();
}
