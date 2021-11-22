// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.schema;

/**
 * This class manages a polymorphic scalar value that can be configured in a yaml file.
 * 
 * The value must be null or a String, boolean or number.
 */
class ScalarValue extends NullableValue<Object> {

  ScalarValue() {
    super(null);
  }

  @Override
  protected void validateValue(Object value) {
    super.validateValue(value);
    ScalarUtils.validateScalar(value);
  }
}
