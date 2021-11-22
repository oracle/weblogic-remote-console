// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.schema;

/**
 * This class manages a boolean value that can be configured in a yaml file.
 */
class BooleanValue extends Value<Boolean> {

  BooleanValue() {
    this(false);
  }

  BooleanValue(Boolean defaultValue) {
    super(defaultValue);
  }
}
