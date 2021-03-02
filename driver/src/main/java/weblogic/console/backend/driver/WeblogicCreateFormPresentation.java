// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.driver;

/**
 * This POJO contains presentation information that the UI needs about a create form.
 */
public class WeblogicCreateFormPresentation {
  private boolean singleColumn;

  public boolean isSingleColumn() {
    return this.singleColumn;
  }

  public void setSingleColumn(boolean singleColumn) {
    this.singleColumn = singleColumn;
  }
}
