// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.yaml;

import java.util.ArrayList;
import java.util.List;

import weblogic.remoteconsole.server.repo.ArrayValue;
import weblogic.remoteconsole.server.repo.BooleanValue;
import weblogic.remoteconsole.server.repo.DoubleValue;
import weblogic.remoteconsole.server.repo.IntValue;
import weblogic.remoteconsole.server.repo.LongValue;
import weblogic.remoteconsole.server.repo.StringValue;
import weblogic.remoteconsole.server.repo.Value;

/**
 * Utilities to handle values defined in yaml files
 * (e.g. boolean, ints and strings for default property values)
 */
class ValueUtils {

  private ValueUtils() {
  }

  public static List<Value> createValues(List<Object> objects) {
    List<Value> values = new ArrayList<>();
    for (Object object : objects) {
      values.add(createValue(object));
    }
    return values;
  }

  public static Value createValue(Object object) {
    if (object == null) {
      return new StringValue(null);
    }
    if (object instanceof String) {
      return new StringValue(String.class.cast(object));
    }
    if (object instanceof Boolean) {
      return new BooleanValue(Boolean.class.cast(object));
    }
    if (object instanceof Integer) {
      return new IntValue(Integer.class.cast(object));
    }
    if (object instanceof Long) {
      return new LongValue(Long.class.cast(object));
    }
    if (object instanceof Double) {
      return new DoubleValue(Double.class.cast(object));
    }
    if (object instanceof ArrayList) {
      List<Value> values = new ArrayList<>();
      for (Object obj : ArrayList.class.cast(object)) {
        values.add(createValue(obj));
      }
      return new ArrayValue(values);
    }
    throw new AssertionError("Unsupported type: " + object.getClass() + " " + object);
  }
}
