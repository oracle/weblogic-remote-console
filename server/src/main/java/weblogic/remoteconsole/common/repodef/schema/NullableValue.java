// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.schema;

/**
 * This class manages a value that can be configured in a yaml file.
 * 
 * It supports null values (unlike its base class, Value)
 */
class NullableValue<T> extends Value<T> {

  NullableValue() {
    this(null);
  }

  NullableValue(T defaultValue) {
    super(defaultValue);
  }

  @Override
  protected void validateValue(T value) {
    // Don't call super because it doesn't allow null but we do.
  }
}
