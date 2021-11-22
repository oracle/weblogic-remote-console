// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef;

/**
 * This interface describes a create form page.
 * 
 * It contains all of the information about the tree that the different
 * parts of the backend needs (e.g. english resource bundle, PDJ, RDJ).
 */
public interface CreateFormDef extends FormDef {

  // Returns presentation info about this create form
  // (e.g. whether the properties should be displayed
  // in a single column).
  //
  // Returns null if the default presentation should be used.
  public CreateFormPresentationDef getPresentationDef();
}
