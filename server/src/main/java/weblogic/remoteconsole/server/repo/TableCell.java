// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

/**
 * This class holds the value of a property in a table row, i.e. a cell.
 */
public class TableCell {
  private String name;

  // UnknownValue handles the property value not being available
  private Value value;

  public TableCell(String name, Value value) {
    this.name = name;
    this.value = value;
  }

  public String getName() {
    return this.name;
  }

  public Value getValue() {
    return this.value;
  }

  @Override
  public String toString() {
    return "TableCell<" + getName() + ", " + getValue() + ">";
  }
}
