// Copyright (c) 2021, 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.schema;

import weblogic.console.utils.Deduplicator;
import weblogic.console.utils.Path;

/**
 * This class manages a string that can configured in a yaml file.
 */
public class StringValue extends ReadOnlyValue<String> {

  private static final Deduplicator<StringValue> DEDUPLICATOR = new Deduplicator<>("StringValue");

  private StringValue(
    String defaultValue,
    String yamlValue,
    boolean specifiedInYaml,
    Path containedBeanPath
  ) {
    super(defaultValue, yamlValue, specifiedInYaml, containedBeanPath);
  }

  public static StringValue create() {
    return create("");
  }

  public static StringValue create(String defaultValue) {
    return create(defaultValue, null, false, new Path());
  }

  private static StringValue create(
    String defaultValue,
    String yamlValue,
    boolean specifiedInYaml,
    Path containedBeanPath
  ) {
    return
      DEDUPLICATOR.deduplicate(
        new StringValue(defaultValue, yamlValue, specifiedInYaml, containedBeanPath)
      );
  }

  public StringValue setValue(String value) {
    validateValue(value);
    return create(getDefaultValue(), value, true, getContainedBeanPath());
  }

  public StringValue copyFrom(StringValue from, Path fromContainedBeanPath) {
    return
      create(
        getDefaultValue(),
        from.getValue(),
        from.isSpecifiedInYaml(),
        fromContainedBeanPath.childPath(from.getContainedBeanPath())
      );
  }

  public StringValue merge(StringValue from, Path fromContainedBeanPath) {
    if (from.isSpecifiedInYaml()) {
      return copyFrom(from, fromContainedBeanPath);
    } else {
      return this;
    }
  }
}
