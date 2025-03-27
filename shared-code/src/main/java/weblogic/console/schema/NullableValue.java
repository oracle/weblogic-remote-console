// Copyright (c) 2021, 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.schema;

/**
 * This class manages a value that can be configured in a yaml file.
 * 
 * It supports null values (unlike its base class, Value)
 */
public class NullableValue<T> extends Value<T> {

  public NullableValue() {
    this(null);
  }

  public NullableValue(T defaultValue) {
    super(defaultValue);
  }

  @Override
  protected void validateValue(T value) {
    // Don't call super because it doesn't allow null but we do.
  }
}
