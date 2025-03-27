// Copyright (c) 2021, 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.schema;

import java.util.ArrayList;
import java.util.List;

/**
 * This class manages a list that can be configured in a yaml file.
 */
public class ListValue<T> extends Value<List<T>> {

  public ListValue() {
    super(new ArrayList<T>());
  }

  public void add(T element) {
    List<T> elements = new ArrayList<>(getValue());
    elements.add(element);
    setValue(elements);
  }
}
