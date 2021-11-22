// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

import java.util.ArrayList;
import java.util.List;

/**
 * This class holds the values for the properties of a table row.
 */
public class TableRow {
  private List<TableCell> cells = new ArrayList<>();

  public List<TableCell> getCells() {
    return this.cells;
  }

  @Override
  public String toString() {
    return "TableRow<" + getCells() + ">";
  }
}
