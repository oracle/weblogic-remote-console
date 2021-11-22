// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef;

import java.util.List;

/**
 * This interface describes a form page.
 * 
 * It contains all of the information about the tree that the different
 * parts of the backend needs (e.g. english resource bundle, PDJ, RDJ).
 */
public interface FormDef extends PageDef {

  // Returns the top-level properties on this form
  public List<PagePropertyDef> getPropertyDefs();

  // Returns the top-level sections on this form
  public List<FormSectionDef> getSectionDefs();

  // Returns all the sections on this form (i.e. the
  // top level ones and any sections they contain recursively)
  public List<FormSectionDef> getAllSectionDefs();
}
