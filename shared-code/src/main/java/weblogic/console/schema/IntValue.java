// Copyright (c) 2023, 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.schema;

import weblogic.console.utils.Deduplicator;
import weblogic.console.utils.Path;

/**
 * This class manages an integer value that can be configured in a yaml file.
 */
public class IntValue extends ReadOnlyValue<Integer> {


  private static final Deduplicator<IntValue> DEDUPLICATOR = new Deduplicator<>("IntValue");

  private IntValue(
    Integer defaultValue,
    Integer yamlValue,
    boolean specifiedInYaml,
    Path containedBeanPath
  ) {
    super(defaultValue, yamlValue, specifiedInYaml, containedBeanPath);
  }

  public static IntValue create() {
    return create(0);
  }

  public static IntValue create(Integer defaultValue) {
    return create(defaultValue, null, false, new Path());
  }
  
  private static IntValue create(
    Integer defaultValue,
    Integer yamlValue,
    boolean specifiedInYaml,
    Path containedBeanPath
  ) {
    return
      DEDUPLICATOR.deduplicate(
        new IntValue(defaultValue, yamlValue, specifiedInYaml, containedBeanPath)
      );
  }

  public IntValue setValue(Integer value) {
    validateValue(value);
    return create(getDefaultValue(), value, true, getContainedBeanPath());
  }

  public IntValue copyFrom(IntValue from, Path fromContainedBeanPath) {
    return
      create(
        getDefaultValue(),
        from.getValue(),
        from.isSpecifiedInYaml(),
        fromContainedBeanPath.childPath(from.getContainedBeanPath())
      );
  }

  public IntValue merge(IntValue from, Path fromContainedBeanPath) {
    if (from.isSpecifiedInYaml()) {
      return copyFrom(from, fromContainedBeanPath);
    } else {
      return this;
    }
  }
}
