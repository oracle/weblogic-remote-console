// Copyright (c) 2020, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.typedesc;

/**
 * This POJO mirrors the yaml file format for a weblogic bean property's default or legal value
 */
public class HarvestedValue {

  // The value, as an object, so we can handle strings, booleans, ints, ...
  private Object value;

  public Object getValue() {
    return value;
  }

  public void setValue(Object value) {
    this.value = value;
  }
}
