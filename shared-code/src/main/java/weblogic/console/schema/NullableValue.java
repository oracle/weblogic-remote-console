// Copyright (c) 2021, 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.schema;

import weblogic.console.utils.Deduplicator;
import weblogic.console.utils.Path;

/**
 * This class manages a value that can be configured in a yaml file.
 * 
 * It supports null values (unlike its base class, Value)
 */
public class NullableValue<T> extends ReadOnlyValue<T> {

  private static final Deduplicator DEDUPLICATOR = new Deduplicator("NullableValue"); // untyped

  private NullableValue(
    T defaultValue,
    T yamlValue,
    boolean specifiedInYaml,
    Path containedBeanPath
  ) {
    super(defaultValue, yamlValue, specifiedInYaml, containedBeanPath);
  }

  public static <T> NullableValue<T> create() {
    return create(null);
  }

  public static <T> NullableValue<T> create(T defaultValue) {
    return create(defaultValue, null, false, new Path());
  }

  @SuppressWarnings("unchecked")
  private static <T> NullableValue<T> create(
    T defaultValue,
    T yamlValue,
    boolean specifiedInYaml,
    Path containedBeanPath
  ) {
    return
      (NullableValue<T>)DEDUPLICATOR.deduplicate(
        new NullableValue<T>(defaultValue, yamlValue, specifiedInYaml, containedBeanPath)
      );
  }

  public NullableValue<T> setValue(T value) {
    validateValue(value);
    return create(getDefaultValue(), value, true, getContainedBeanPath());
  }

  public NullableValue<T> copyFrom(NullableValue<T> from, Path fromContainedBeanPath) {
    return
      create(
        getDefaultValue(),
        from.getValue(),
        from.isSpecifiedInYaml(),
        fromContainedBeanPath.childPath(from.getContainedBeanPath())
      );
  }

  public NullableValue<T> merge(NullableValue<T> from, Path fromContainedBeanPath) {
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

  @Override
  protected void validateValue(T value) {
    // Don't call super because it doesn't allow null and we do.
  }
}