// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.schema;

/**
 * This POJO mirrors the yaml source file format for configuring presentation
 * information about a create form
 */
public class CreateFormPresentationDefSource {
  private BooleanValue singleColumn = new BooleanValue();

  // Whether the properties on this create form should be
  // displayed in a single column.  If false, then they
  // are displayed in two columns.

  public boolean isSingleColumn() {
    return singleColumn.getValue();
  }

  public void setSingleColumn(boolean val) {
    singleColumn.setValue(val);
  }
}
