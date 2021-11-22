// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.schema;

/**
 * This POJO mirrors the yaml source file format for configuring presentation
 * information about a slice form
 */
public class SliceFormPresentationDefSource {
  private BooleanValue useCheckBoxesForBooleans = new BooleanValue();
  private BooleanValue singleColumn = new BooleanValue();

  // Whether to display boolean properties on this form as check boxes.
  // If not specified, they're displayed as sliders.
  //
  // This feature is used for the ServerDebug pages which
  // have long lists of booleans.
  public boolean isUseCheckBoxesForBooleans() {
    return useCheckBoxesForBooleans.getValue();
  }

  public void setUseCheckBoxesForBooleans(boolean val) {
    useCheckBoxesForBooleans.setValue(val);
  }

  // Whether to display the properties in a single column.
  // If not specified, the properties are displayed in two columns.
  public boolean isSingleColumn() {
    return singleColumn.getValue();
  }

  public void setSingleColumn(boolean val) {
    singleColumn.setValue(val);
  }
}
