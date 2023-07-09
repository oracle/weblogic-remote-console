// Copyright (c) 2023, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.schema;

/**
 * This class manages an integer value that can be configured in a yaml file.
 */
class IntValue extends Value<Integer> {

  IntValue() {
    this(0);
  }

  IntValue(Integer defaultValue) {
    super(defaultValue);
  }
}
