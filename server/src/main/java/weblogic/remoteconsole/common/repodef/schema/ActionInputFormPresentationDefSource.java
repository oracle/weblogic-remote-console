// Copyright (c) 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.schema;

import weblogic.console.schema.BooleanValue;
import weblogic.console.schema.YamlSource;

/**
 * This POJO mirrors the yaml source file format for configuring presentation
 * information about an action input form
 */
public class ActionInputFormPresentationDefSource extends YamlSource {
  private BooleanValue singleColumn = BooleanValue.create();

  // Whether the properties on this action input form should be
  // displayed in a single column.  If false, then they
  // are displayed in two columns.

  public boolean isSingleColumn() {
    return singleColumn.getValue();
  }

  public void setSingleColumn(boolean val) {
    singleColumn = singleColumn.setValue(val);
  }
}
