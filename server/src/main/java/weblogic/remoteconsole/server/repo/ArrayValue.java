// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

import java.util.ArrayList;
import java.util.List;

/**
 * This class holds an array of values.
 */
public class ArrayValue extends Value {

  private List<Value> values = new ArrayList<>();

  public ArrayValue(List<Value> values) {
    this.values = values;
  }

  public List<Value> getValues() {
    return this.values;
  }

  @Override
  public String toString() {
    return "ArrayValue<" + getValues() + ">";
  }
}
