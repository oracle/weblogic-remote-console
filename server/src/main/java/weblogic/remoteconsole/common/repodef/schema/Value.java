// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.schema;

import weblogic.remoteconsole.common.utils.Path;

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
class Value<T> {
  private T defaultValue;
  private T value;
  private boolean specifiedInYaml;
  private Path containedBeanPath = new Path();

  Value(T defaultValue) {
    this.defaultValue = defaultValue;
  }

  T getValue() {
    return (specifiedInYaml) ? value : defaultValue;
  }

  void setValue(T val) {
    validateValue(val);
    value = val;
    specifiedInYaml = true;
  }

  protected void validateValue(T value) {
    if (value == null) {
      throw new AssertionError("yaml error. The value cannot be set to null");
    }
  }

  boolean isSpecifiedInYaml() {
    return specifiedInYaml;
  }

  Path getContainedBeanPath() {
    return containedBeanPath;
  }

  void copyFrom(Value<T> from, Path fromContainedBeanPath) {
    value = from.value;
    specifiedInYaml = from.specifiedInYaml;
    containedBeanPath = fromContainedBeanPath.childPath(from.containedBeanPath);
  }

  void merge(Value<T> from, Path fromContainedBeanPath) {
    if (from.isSpecifiedInYaml()) {
      copyFrom(from, fromContainedBeanPath);
    }
  }
}
