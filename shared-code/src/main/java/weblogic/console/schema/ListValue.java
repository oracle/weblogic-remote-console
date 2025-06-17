// Copyright (c) 2021, 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.schema;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import weblogic.console.utils.Deduplicator;
import weblogic.console.utils.Path;

/**
 * This class manages a list that can be configured in a yaml file.
 */
public class ListValue<T> extends ReadOnlyValue<List<T>> {

  private static final Deduplicator DEDUPLICATOR = new Deduplicator("ListValue"); // untyped

  private ListValue(
    List<T> defaultValue,
    List<T> yamlValue,
    boolean specifiedInYaml,
    Path containedBeanPath
  ) {
    super(toReadOnly(defaultValue), toReadOnly(yamlValue), specifiedInYaml, containedBeanPath);
  }

  private static <T> List<T> toReadOnly(List<T> list) {
    return (list != null) ? Collections.unmodifiableList(list) : null;
  }

  public static <T> ListValue<T> create() {
    return create(new ArrayList<>());
  }

  public static <T> ListValue<T> create(List<T> defaultValue) {
    return create(defaultValue, null, false, new Path());
  }

  @SuppressWarnings("unchecked")
  private static <T> ListValue<T> create(
    List<T> defaultValue,
    List<T> yamlValue,
    boolean specifiedInYaml,
    Path containedBeanPath
  ) {
    return
      (ListValue<T>)DEDUPLICATOR.deduplicate(
        new ListValue<T>(defaultValue, yamlValue, specifiedInYaml, containedBeanPath)
      );
  }

  public ListValue<T> setValue(List<T> value) {
    validateValue(value);
    return create(getDefaultValue(), value, true, getContainedBeanPath());
  }

  public ListValue<T> add(T value) {
    List<T> currentValue = getValue();
    List<T> newValue = (currentValue != null) ? new ArrayList<>(currentValue) : new ArrayList<>();
    newValue.add(value);
    return setValue(newValue);
  }

  public ListValue<T> copyFrom(ListValue<T> from, Path fromContainedBeanPath) {
    return
      create(
        getDefaultValue(),
        from.getValue(),
        from.isSpecifiedInYaml(),
        fromContainedBeanPath.childPath(from.getContainedBeanPath())
      );
  }

  public ListValue<T> merge(ListValue<T> from, Path fromContainedBeanPath) {
    if (from.isSpecifiedInYaml()) {
      return copyFrom(from, fromContainedBeanPath);
    } else {
      return this;
    }
  }

  @Override
  protected String getValueKey(List<T> value) {
    // Share nulls and empty lists.
    // Don't share non-empty lists.
    if (value == null) {
      return "null";
    }
    if (value.isEmpty()) {
      return "empty";
    }
    return null;
  }
}
