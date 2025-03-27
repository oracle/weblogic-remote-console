// Copyright (c) 2021, 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.schema;

import weblogic.console.utils.Path;

/**
 * This class manages a value that can be configured in a yaml file.
 *
 * It tracks whether the value has been set in the yaml file.
 *
 * It also track the path from the bean that the value was set on
 * relative to the bean this value is on (so that as we fold
 * child beans into parent beans, we know where values came from)
 * 
 * It ensures that the yaml file doesn't set the value to null.
 *
 * It return the appropriate default value if the value hasn't been set in the yaml file.
 */
public class Value<T> {
  private T defaultValue;
  private T value;
  private boolean specifiedInYaml;
  private Path containedBeanPath = new Path();

  public Value(T defaultValue) {
    this.defaultValue = defaultValue;
  }

  public T getValue() {
    return (specifiedInYaml) ? value : defaultValue;
  }

  public void setValue(T val) {
    validateValue(val);
    value = val;
    specifiedInYaml = true;
  }

  protected void validateValue(T value) {
    if (value == null) {
      throw new AssertionError("yaml error. The value cannot be set to null");
    }
  }

  public boolean isSpecifiedInYaml() {
    return specifiedInYaml;
  }

  public Path getContainedBeanPath() {
    return containedBeanPath;
  }

  public void copyFrom(Value<T> from, Path fromContainedBeanPath) {
    value = from.value;
    specifiedInYaml = from.specifiedInYaml;
    containedBeanPath = fromContainedBeanPath.childPath(from.containedBeanPath);
  }

  public void merge(Value<T> from, Path fromContainedBeanPath) {
    if (from.isSpecifiedInYaml()) {
      copyFrom(from, fromContainedBeanPath);
    }
  }
}
