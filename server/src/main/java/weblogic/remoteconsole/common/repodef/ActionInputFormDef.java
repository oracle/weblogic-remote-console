// Copyright (c) 2023, 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef;

import java.util.List;

/**
 * This interface describes the contents of an action input form.
 *
 * It contains all of the information about the link that the different
 * parts of the backend needs (e.g. english resource bundle, PDJ, RDJ).
 */
public interface ActionInputFormDef extends PageDef {

  // Note: currently unused inherited stuff
  //   AllPropertyDefs
  //   ActionDefs
  //   CustomizePageMethod
  //   CustomizePageDefMethod

  // Gets the corresponding action def.
  public PageActionDef getActionDef();

  // Gets the param defs for this form.
  public List<PageActionParamDef> getParamDefs();

  // Returns presentation info about this action input form
  // (e.g. whether the properties should be displayed
  // in a single column).
  //
  // Returns null if the default presentation should be used.
  public ActionInputFormPresentationDef getPresentationDef();
}
