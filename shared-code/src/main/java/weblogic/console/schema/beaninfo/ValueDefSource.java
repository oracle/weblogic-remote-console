// Copyright (c) 2021, 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.schema.beaninfo;

import weblogic.console.schema.NullableValue;
import weblogic.console.schema.YamlSource;

/**
 * This POJO mirrors the yaml file format for a bean property's default or legal value
 */
public class ValueDefSource extends YamlSource {
  private NullableValue<Object> value = new NullableValue<>();

  // The value, as an object, so we can handle strings, booleans, ints, ...
  // It must be the same type as the corresponding property.

  public Object getValue() {
    return value.getValue();
  }

  public void setValue(Object val) {
    value.setValue(val);
  }
}
