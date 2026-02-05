// Copyright (c) 2021, 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.schema;

import java.util.ArrayList;
import java.util.List;

import weblogic.console.utils.Deduplicator;
import weblogic.console.utils.Path;

/**
 * This class manages a list of scalar values (null, string, boolean, int, long)
 * that can be configured in a yaml file.
 */
public class ScalarValues extends ReadOnlyValue<List<Object>> {
  private static final Deduplicator<ScalarValues> DEDUPLICATOR = new Deduplicator<>("ScalarsValue");

  private ScalarValues(
    List<Object> defaultValue,
    List<Object> yamlValue,
    boolean specifiedInYaml,
    Path containedBeanPath
  ) {
    super(defaultValue, yamlValue, specifiedInYaml, containedBeanPath);
  }

  public static <T> ScalarValues create() {
    return create(new ArrayList<>());
  }

  public static <T> ScalarValues create(List<Object> defaultValue) {
    return create(defaultValue, null, false, new Path());
  }

  private static <T> ScalarValues create(
    List<Object> defaultValue,
    List<Object> yamlValue,
    boolean specifiedInYaml,
    Path containedBeanPath
  ) {
    return
      DEDUPLICATOR.deduplicate(
        new ScalarValues(defaultValue, yamlValue, specifiedInYaml, containedBeanPath)
      );
  }

  public ScalarValues setValue(List<Object> value) {
    validateValue(value);
    return create(getDefaultValue(), value, true, getContainedBeanPath());
  }

  public ScalarValues add(Object value) {
    List<Object> currentValue = getValue();
    List<Object> newValue = (currentValue != null) ? new ArrayList<>(currentValue) : new ArrayList<>();
    newValue.add(value);
    return setValue(newValue);
  }

  public ScalarValues copyFrom(ScalarValues from, Path fromContainedBeanPath) {
    return
      create(
        getDefaultValue(),
        from.getValue(),
        from.isSpecifiedInYaml(),
        fromContainedBeanPath.childPath(from.getContainedBeanPath())
      );
  }

  public ScalarValues merge(ScalarValues from, Path fromContainedBeanPath) {
    if (from.isSpecifiedInYaml()) {
      return copyFrom(from, fromContainedBeanPath);
    } else {
      return this;
    }
  }

  @Override
  protected String getValueKey(List<Object> value) {
    // Share nulls and empty lists.
    // Don't share non-empty lists.
    if (value == null) {
      return "null";
    }
    if (value.isEmpty()) {
      return "empty";
    }
    // TBD - should the lists since their types are fixed
    return null;
  }

  @Override
  protected void validateValue(List<Object> value) {
    super.validateValue(value);
    ScalarUtils.validateScalars(value);
  }
}

