// Copyright (c) 2021, 2024, Oracle and/or its affiliates.
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

  // Get the name of the method to call to get the table rows.
  public String getGetTableRowsMethod();

  // Returns whether this slice is read-only.
  // Currently slice tables are always read-only.
  public default boolean isReadOnly() {
    return true;
  }

  // Whether this slice table's rows can be used to navigate to other beans
  // (via an per-row 'identity' provider in the RDJ)
  public boolean isSupportsNavigation();

  // Use the row identities instead of the row identifiers (e.g. for actions)
  public boolean isUseRowIdentities();

  // Get this page's slice defs.
  public default SlicesDef getSlicesDef() {
    return
      getPagePath().getPagesPath().getPageRepoDef().getSlicesDef(
        getPagePath().getPagesPath().getTypeDef()
      );
  }
}
