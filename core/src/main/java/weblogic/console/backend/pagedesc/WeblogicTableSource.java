// Copyright (c) 2020, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.pagedesc;

import java.util.ArrayList;
import java.util.List;

import weblogic.console.backend.utils.ListUtils;

/**
 * This POJO mirrors the yaml source file format for configuring information about a table on a
 * weblogic bean's table page, e.g. pages/weblogic/configuration/Domain/Clusters/table.yaml
 */
public class WeblogicTableSource extends BaseWeblogicPageSource {
  private List<WeblogicColumnSource> displayedColumns = new ArrayList<>();

  public List<WeblogicColumnSource> getDisplayedColumns() {
    return displayedColumns;
  }

  public void setDisplayedColumns(List<WeblogicColumnSource> displayedColumns) {
    this.displayedColumns = ListUtils.nonNull(displayedColumns);
  }

  private List<WeblogicColumnSource> hiddenColumns = new ArrayList<>();

  public List<WeblogicColumnSource> getHiddenColumns() {
    return hiddenColumns;
  }

  public void setHiddenColumns(List<WeblogicColumnSource> hiddenColumns) {
    this.hiddenColumns = ListUtils.nonNull(hiddenColumns);
  }

  private List<WeblogicActionSource> actions = new ArrayList<>();

  public List<WeblogicActionSource> getActions() {
    return actions;
  }

  public void setActions(List<WeblogicActionSource> actions) {
    this.actions = ListUtils.nonNull(actions);
  }
}
