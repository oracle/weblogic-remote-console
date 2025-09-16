// Copyright (c) 2021, 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.schema;

import weblogic.console.utils.Deduplicator;
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
public class Value<T> extends ReadOnlyValue<T> {

  private static final Deduplicator DEDUPLICATOR = new Deduplicator("Value"); // untyped

  private Value(
    T defaultValue,
    T yamlValue,
    boolean specifiedInYaml,
    Path containedBeanPath
  ) {
    super(defaultValue, yamlValue, specifiedInYaml, containedBeanPath);
  }

  public static <T> Value<T> create() {
    return create(null);
  }

  public static <T> Value<T> create(T defaultValue) {
    return create(defaultValue, null, false, new Path());
  }

  @SuppressWarnings("unchecked")
  private static <T> Value<T> create(
    T defaultValue,
    T yamlValue,
    boolean specifiedInYaml,
    Path containedBeanPath
  ) {
    return
      (Value<T>)DEDUPLICATOR.deduplicate(
        new Value<T>(defaultValue, yamlValue, specifiedInYaml, containedBeanPath)
      );
  }

  public Value<T> setValue(T value) {
    validateValue(value);
    return create(getDefaultValue(), value, true, getContainedBeanPath());
  }

  public Value<T> copyFrom(Value<T> from, Path fromContainedBeanPath) {
    return
      create(
        getDefaultValue(),
        from.getValue(),
        from.isSpecifiedInYaml(),
        fromContainedBeanPath.childPath(from.getContainedBeanPath())
      );
  }

  public Value<T> merge(Value<T> from, Path fromContainedBeanPath) {
    if (from.isSpecifiedInYaml()) {
      return copyFrom(from, fromContainedBeanPath);
    } else {
      return this;
    }
  }

  @Override
  protected String getValueKey(T value) {
    if (value == null) {
      // Treat all nulls as the same regardless of T:
      return "null";
    }
    return null;
  }
}
