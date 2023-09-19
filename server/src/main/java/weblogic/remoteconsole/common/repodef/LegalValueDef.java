// Copyright (c) 2021, 2023, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef;

import weblogic.remoteconsole.server.repo.Value;

/**
 * This interface describes a legal value for a field.
 * It maps a legal value to the label that should
 * be displayed for it.
 * 
 * It contains all of the information about the tree that the different
 * parts of the backend needs (e.g. english resource bundle, PDJ, RDJ).
 */
public interface LegalValueDef {

  // Returns the correponding field.
  public PageFieldDef getFieldDef();

  // Returns the value (i.e. the value in the RDJ)
  public Value getValue(); // null, String, boolean, int or long

  // Returns the correponding label to display for that value.
  public LocalizableString getLabel();
}
