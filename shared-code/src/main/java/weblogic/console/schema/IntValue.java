// Copyright (c) 2023, 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.schema;

/**
 * This class manages an integer value that can be configured in a yaml file.
 */
public class IntValue extends Value<Integer> {

  public IntValue() {
    this(0);
  }

  public IntValue(Integer defaultValue) {
    super(defaultValue);
  }
}
