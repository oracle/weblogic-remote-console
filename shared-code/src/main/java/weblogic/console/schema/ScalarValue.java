// Copyright (c) 2021, 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.schema;

import weblogic.console.utils.Deduplicator;
import weblogic.console.utils.Path;

/**
 * This class manages a polymorphic scalar value that can be configured in a yaml file.
 * 
 * The value must be null or a String, boolean or number.
 */
public class ScalarValue extends ReadOnlyValue<Object> {

  private static final Deduplicator<ScalarValue> DEDUPLICATOR = new Deduplicator<>("ScalarValue");

  private ScalarValue(
    Object defaultValue,
    Object yamlValue,
    boolean specifiedInYaml,
    Path containedBeanPath
  ) {
    super(defaultValue, yamlValue, specifiedInYaml, containedBeanPath);
  }

  public static ScalarValue create() {
    return create(false);
  }

  public static ScalarValue create(Object defaultValue) {
    return create(defaultValue, null, false, new Path());
  }
  
  private static ScalarValue create(
    Object defaultValue,
    Object yamlValue,
    boolean specifiedInYaml,
    Path containedBeanPath
  ) {
    return
      DEDUPLICATOR.deduplicate(
        new ScalarValue(defaultValue, yamlValue, specifiedInYaml, containedBeanPath)
      );
  }

  public ScalarValue setValue(Object value) {
    validateValue(value);
    return create(getDefaultValue(), value, true, getContainedBeanPath());
  }

  public ScalarValue copyFrom(ScalarValue from, Path fromContainedBeanPath) {
    return
      create(
        getDefaultValue(),
        from.getValue(),
        from.isSpecifiedInYaml(),
        fromContainedBeanPath.childPath(from.getContainedBeanPath())
      );
  }

  public ScalarValue merge(ScalarValue from, Path fromContainedBeanPath) {
    if (from.isSpecifiedInYaml()) {
      return copyFrom(from, fromContainedBeanPath);
    } else {
      return this;
    }
  }

  @Override
  public String getValueKey(Object value) {
    if (value == null) {
      return "null";
    }
    if (value instanceof String) {
      return "string<" + value.toString() + ">";
    }
    // TBD - handle boolean, int, long
    return null;
  }

  @Override
  protected void validateValue(Object value) {
    // Don't call super because it doesn't allow null and we do.
    ScalarUtils.validateScalar(value);
  }
}
