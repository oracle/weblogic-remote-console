// Copyright (c) 2021, 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.schema;

import java.util.List;

import weblogic.console.schema.ListValue;
import weblogic.console.schema.StringValue;
import weblogic.console.utils.StringUtils;
import weblogic.remoteconsole.common.utils.CustomizerInvocationUtils;

/**
 * This POJO mirrors the yaml source file format for configuring information about
 * a table page, e.g. ClusterMBean/table.yaml
 */
public class TableDefSource extends PageDefSource {
  private ListValue<BeanPropertyDefCustomizerSource> displayedColumns = ListValue.create();
  private ListValue<BeanPropertyDefCustomizerSource> hiddenColumns = ListValue.create();
  private StringValue getTableRowsMethod = StringValue.create();

  // The columns to initially display in the table.
  public List<BeanPropertyDefCustomizerSource> getDisplayedColumns() {
    return displayedColumns.getValue();
  }

  public void setDisplayedColumns(List<BeanPropertyDefCustomizerSource> value) {
    displayedColumns = displayedColumns.setValue(value);
  }

  public void addDisplayedColumn(BeanPropertyDefCustomizerSource value) {
    displayedColumns = displayedColumns.add(value);
  }

  // The columns to initially hide in the table.
  public List<BeanPropertyDefCustomizerSource> getHiddenColumns() {
    return hiddenColumns.getValue();
  }

  public void setHiddenColumns(List<BeanPropertyDefCustomizerSource> value) {
    hiddenColumns = hiddenColumns.setValue(value);
  }

  public void addHiddenColumn(BeanPropertyDefCustomizerSource value) {
    hiddenColumns = hiddenColumns.add(value);
  }

  // Specifics a custom static method to call to customize getting this page's table rows.
  // The format is <package>.<class>.<method>
  //
  // required signature:
  //  public static Response<List<TableRow>> <method>(InvocationContext ic)
  //
  // The CBE ensures that the bean referenced by ic exists
  // before calling this method.
  public String getGetTableRowsMethod() {
    return getTableRowsMethod.getValue();
  }

  public void setGetTableRowsMethod(String value) {
    if (StringUtils.isEmpty(value) || CustomizerInvocationUtils.methodExists(value)) {
      getTableRowsMethod = getTableRowsMethod.setValue(value);
    }
  }

  @Override
  protected void validateExtension() {
    super.validateExtension();
    validateExtensionChildren(getDisplayedColumns(), "displayedColumns");
    validateExtensionChildren(getHiddenColumns(), "hiddenColumns");
  }
}
