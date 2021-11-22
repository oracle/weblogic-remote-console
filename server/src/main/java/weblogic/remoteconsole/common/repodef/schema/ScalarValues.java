// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.schema;

import java.util.List;

/**
 * This class manages a list of scalar values (null, string, boolean, int, long)
 * that can be configured in a yaml file.
 */
class ScalarValues extends ListValue<Object> {

  ScalarValues() {
    super();
  }

  @Override
  protected void validateValue(List<Object> value) {
    super.validateValue(value);
    ScalarUtils.validateScalars(value);
  }
}

