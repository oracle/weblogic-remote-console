// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.pagedesc;

/**
 * This POJO mirrors the yaml source file format for configuring presentation
 * information about a create form
 */
public class WeblogicCreateFormPresentationSource {
  private boolean singleColumn;

  public boolean isSingleColumn() {
    return this.singleColumn;
  }

  public void setSingleColumn(boolean singleColumn) {
    this.singleColumn = singleColumn;
  }
}
