// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.schema;

import java.util.List;

/**
 * Utitlies for validating Object values in yaml files that
 * are supposed to be polymorphic scalars.
 */
class ScalarUtils {

  private ScalarUtils() {
  }

  static void validateScalar(Object value) {
    if (value == null
        || value instanceof String
        || value instanceof Boolean || Boolean.TYPE.isInstance(value)
        || value instanceof Integer || Integer.TYPE.isInstance(value)
        || value instanceof Long || Long.TYPE.isInstance(value)) {
      return;
    }
    throw new AssertionError("Unsupported value: " + value + " " + value.getClass());
  }

  static void validateScalars(List<Object> values) {
    if (values == null) {
      return;
    }
    for (Object value : values) {
      validateScalar(value);
    }
  }
}
