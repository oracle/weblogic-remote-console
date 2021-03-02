// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.driver;

/**
 * This POJO contains presentation information that the UI needs about a slice form.
 */
public class WeblogicSliceFormPresentation {
  private boolean useCheckBoxesForBooleans;

  public boolean isUseCheckBoxesForBooleans() {
    return this.useCheckBoxesForBooleans;
  }

  public void setUseCheckBoxesForBooleans(boolean useCheckBoxesForBooleans) {
    this.useCheckBoxesForBooleans = useCheckBoxesForBooleans;
  }

  private boolean singleColumn;

  public boolean isSingleColumn() {
    return this.singleColumn;
  }

  public void setSingleColumn(boolean singleColumn) {
    this.singleColumn = singleColumn;
  }
}
