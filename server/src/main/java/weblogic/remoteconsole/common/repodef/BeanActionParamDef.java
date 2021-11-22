// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef;

/**
 * This interface describes an input parameter of a bean action.
 *
 * It contains all of the information about the tree that the different
 * parts of the backend needs (e.g. english resource bundle, PDJ, RDJ).
 */
public interface BeanActionParamDef extends BeanValueDef {

  // The action that uses this parameter.
  public BeanActionDef getActionDef();

  // The name of this parameter, e.g. the one used when invoking the
  // corresponding action in the WLS REST api.
  public String getParamName();
}
