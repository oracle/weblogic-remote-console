// Copyright (c) 2021, 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

import java.util.ArrayList;
import java.util.List;

/**
 * This class holds all of the data on a table or slice table page.
 */
public class Table extends Page {
  private List<TableRow> rows = new ArrayList<>();
  private List<String> displayedColumns = new ArrayList<>();
  private List<String> hiddenColumns = new ArrayList<>();

  public List<TableRow> getRows() {
    return this.rows;
  }

  public List<String> getDisplayedColumns() {
    return displayedColumns;
  }

  public List<String> getHiddenColumns() {
    return hiddenColumns;
  }

  @Override
  public String toString() {
    return "Table<" + getPageDef() + "," + getBeanTreePath() + ">";
  }
}
