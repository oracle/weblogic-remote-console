// Copyright (c) 2023, 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef;

/**
 * This interface describes a parameter on an action input form.
 * 
 * It contains all of the information about the tree that the different
 * parts of the backend needs (e.g. english resource bundle, PDJ, RDJ).
 */
public interface PageActionParamDef extends PageFieldDef, BeanActionParamDef {
  // Get the corresponding action input form def
  public ActionInputFormDef getInputFormDef();

  // Whether this parameter is a read-only field on the action input form
  // that is never used to invoke the action.
  public boolean isReadOnly();
}
