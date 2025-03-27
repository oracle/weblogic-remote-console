// Copyright (c) 2021, 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.schema;

/**
 * This class manages a polymorphic scalar value that can be configured in a yaml file.
 * 
 * The value must be null or a String, boolean or number.
 */
public class ScalarValue extends NullableValue<Object> {

  public ScalarValue() {
    super(null);
  }

  @Override
  protected void validateValue(Object value) {
    super.validateValue(value);
    ScalarUtils.validateScalar(value);
  }
}
