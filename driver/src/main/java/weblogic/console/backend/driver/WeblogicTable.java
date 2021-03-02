// Copyright (c) 2020, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.driver;

import java.util.ArrayList;
import java.util.List;

/** This POJO contains information that the UI needs about a weblogic beans table page. */
public class WeblogicTable {
  private List<WeblogicColumn> displayedColumns = new ArrayList<>();

  public List<WeblogicColumn> getDisplayedColumns() {
    return displayedColumns;
  }

  public void setDisplayedColumns(List<WeblogicColumn> displayedColumns) {
    this.displayedColumns = displayedColumns;
  }

  private List<WeblogicColumn> hiddenColumns = new ArrayList<>();

  public List<WeblogicColumn> getHiddenColumns() {
    return hiddenColumns;
  }

  public void setHiddenColumns(List<WeblogicColumn> hiddenColumns) {
    this.hiddenColumns = hiddenColumns;
  }

  private List<WeblogicAction> actions = new ArrayList<>();

  public List<WeblogicAction> getActions() {
    return actions;
  }

  public void setActions(List<WeblogicAction> actions) {
    this.actions = actions;
  }
}
