// Copyright (c) 2021, 2023, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef;

import weblogic.remoteconsole.server.repo.Value;

/**
 * This interface describes an input parameter of a bean action.
 *
 * It contains all of the information about the tree that the different
 * parts of the backend needs (e.g. english resource bundle, PDJ, RDJ).
 */
public interface BeanActionParamDef extends BeanFieldDef {

  // The action that uses this parameter.
  public BeanActionDef getActionDef();

  // The name of this parameter.
  public String getParamName();

  // The online WLS REST name of the parameter.
  public String getOnlineParamName();

  // The default value to use
  public Value getDefaultValue();
}
