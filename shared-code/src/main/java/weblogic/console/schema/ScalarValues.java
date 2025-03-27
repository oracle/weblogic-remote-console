// Copyright (c) 2021, 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.schema;

import java.util.List;

import weblogic.console.schema.ListValue;

/**
 * This class manages a list of scalar values (null, string, boolean, int, long)
 * that can be configured in a yaml file.
 */
public class ScalarValues extends ListValue<Object> {

  public ScalarValues() {
    super();
  }

  @Override
  protected void validateValue(List<Object> value) {
    super.validateValue(value);
    ScalarUtils.validateScalars(value);
  }
}

