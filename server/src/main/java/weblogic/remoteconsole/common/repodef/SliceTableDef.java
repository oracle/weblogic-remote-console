// Copyright (c) 2021, 2023, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef;

import java.util.List;

/**
 * This interface describes the contents of a slice table page.
 *
 * It contains all of the information about the link that the different
 * parts of the backend needs (e.g. english resource bundle, PDJ, RDJ).
 */
public interface SliceTableDef extends PageDef {

  // Gets the column defs for columns that are displayed by default.
  public List<PagePropertyDef> getDisplayedColumnDefs();

  // Gets the column defs for columns that are hidden by default.
  public List<PagePropertyDef> getHiddenColumnDefs();

  // Gets the action defs for no-arg / no-return value actions
  // that can be invoked on the slice table's rows
  // (e.g. start data source on a server from the aggregated data source's slice table).
  public List<TableActionDef> getActionDefs();

  // Get the name of the method to call to get the table rows.
  public String getGetTableRowsMethod();

  // Get the name of the method to call to invoke actions.
  public String getActionMethod();

  // Returns whether this slice is read-only.
  // Currently slice tables are always read-only.
  public default boolean isReadOnly() {
    return true;
  }
}
