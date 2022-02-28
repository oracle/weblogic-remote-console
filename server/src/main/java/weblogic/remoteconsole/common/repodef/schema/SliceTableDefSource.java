// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.schema;

import java.util.List;

/**
 * This POJO mirrors the yaml source file format for configuring information about
 * a slice table page, e.g. DomainSecurityRuntimeMBean/slices/SecurityWarnings/table.yaml
 */
public class SliceTableDefSource extends PageDefSource {
  private ListValue<BeanPropertyDefCustomizerSource> displayedColumns = new ListValue<>();
  private ListValue<BeanPropertyDefCustomizerSource> hiddenColumns = new ListValue<>();
  private StringValue getTableRowsMethod = new StringValue();

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
    getTableRowsMethod.setValue(value);
  }
}
