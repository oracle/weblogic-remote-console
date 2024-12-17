// Copyright (c) 2021, 2024, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.schema;

import java.util.List;

/**
 * This POJO mirrors the yaml source file format for configuring information about
 * a table page, e.g. ClusterMBean/table.yaml
 */
public class TableDefSource extends PageDefSource {
  private ListValue<BeanPropertyDefCustomizerSource> displayedColumns = new ListValue<>();
  private ListValue<BeanPropertyDefCustomizerSource> hiddenColumns = new ListValue<>();

  // The columns to initially display in the table.
  public List<BeanPropertyDefCustomizerSource> getDisplayedColumns() {
    return displayedColumns.getValue();
  }

  public void setDisplayedColumns(List<BeanPropertyDefCustomizerSource> value) {
    displayedColumns.setValue(value);
  }

  public void addDisplayedColumn(BeanPropertyDefCustomizerSource value) {
    displayedColumns.add(value);
  }

  // The columns to initially hide in the table.
  public List<BeanPropertyDefCustomizerSource> getHiddenColumns() {
    return hiddenColumns.getValue();
  }

  public void setHiddenColumns(List<BeanPropertyDefCustomizerSource> value) {
    hiddenColumns.setValue(value);
  }

  public void addHiddenColumn(BeanPropertyDefCustomizerSource value) {
    hiddenColumns.add(value);
  }

  @Override
  protected void validateExtension() {
    super.validateExtension();
    validateExtensionChildren(getDisplayedColumns(), "displayedColumns");
    validateExtensionChildren(getHiddenColumns(), "hiddenColumns");
  }
}
