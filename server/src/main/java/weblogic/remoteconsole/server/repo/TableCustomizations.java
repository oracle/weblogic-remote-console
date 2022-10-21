// Copyright (c) 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;


import java.util.List;

/**
 * POJO that holds information about a table's customizations
 * - it's id
 *   - normal tables use their type's name
 *   - slice tables each have their own custom id
 */
public class TableCustomizations {
  private String tableId;
  private List<String> displayedColumns;

  TableCustomizations(String tableId, List<String> displayedColumns) {
    this.tableId = tableId;
    this.displayedColumns = displayedColumns;
  }

  public String getTableId() {
    return tableId;
  }

  public List<String> getDisplayedColumns() {
    return displayedColumns;
  }
}
