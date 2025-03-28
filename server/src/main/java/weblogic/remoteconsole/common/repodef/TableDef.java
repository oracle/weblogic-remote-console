// Copyright (c) 2021, 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef;

import java.util.List;

/**
 * This interface describes the contents of a table page.
 *
 * It contains all of the information about the link that the different
 * parts of the backend needs (e.g. english resource bundle, PDJ, RDJ).
 */
public interface TableDef extends PageDef {

  // Gets the column defs for columns that are displayed by default.
  public List<PagePropertyDef> getDisplayedColumnDefs();

  // Gets the column defs for columns that are hidden by default.
  public List<PagePropertyDef> getHiddenColumnDefs();

  // Get the name of the method to call to get the table rows.
  public String getGetTableRowsMethod();
}
