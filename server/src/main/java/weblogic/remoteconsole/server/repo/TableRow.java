// Copyright (c) 2021, 2023, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

import java.util.ArrayList;
import java.util.List;

/**
 * This class holds the values for the properties of a table row.
 * It also holds an identifier that is used when invoking actions
 * on the row when it's part of a slice table.
 */
public class TableRow {
  private String identifier;

  private List<TableCell> cells = new ArrayList<>();

  public List<TableCell> getCells() {
    return this.cells;
  }

  public void setIdentifier(String val) {
    identifier = val;
  }

  public String getIdentifier() {
    return identifier;
  }

  @Override
  public String toString() {
    return "TableRow<" + getCells() + ">";
  }
}
