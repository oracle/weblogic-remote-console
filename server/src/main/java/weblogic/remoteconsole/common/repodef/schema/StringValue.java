// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.schema;

/**
 * This class manages a string that can configured in a yaml file.
 */
class StringValue extends Value<String> {

  StringValue() {
    super("");
  }
}
