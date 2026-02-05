// Copyright (c) 2021, 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.schema;

import weblogic.console.utils.Deduplicator;
import weblogic.console.utils.Path;

/**
 * This class manages a boolean that can configured in a yaml file.
 */
public class BooleanValue extends ReadOnlyValue<Boolean> {

  private static final Deduplicator<BooleanValue> DEDUPLICATOR = new Deduplicator<>("BooleanValue");

  private BooleanValue(
    Boolean defaultValue,
    Boolean yamlValue,
    boolean specifiedInYaml,
    Path containedBeanPath
  ) {
    super(defaultValue, yamlValue, specifiedInYaml, containedBeanPath);
  }

  public static BooleanValue create() {
    return create(false);
  }

  public static BooleanValue create(Boolean defaultValue) {
    return create(defaultValue, null, false, new Path());
  }
  
  private static BooleanValue create(
    Boolean defaultValue,
    Boolean yamlValue,
    boolean specifiedInYaml,
    Path containedBeanPath
  ) {
    return
      DEDUPLICATOR.deduplicate(
        new BooleanValue(defaultValue, yamlValue, specifiedInYaml, containedBeanPath)
      );
  }

  public BooleanValue setValue(Boolean value) {
    validateValue(value);
    return create(getDefaultValue(), value, true, getContainedBeanPath());
  }

  public BooleanValue copyFrom(BooleanValue from, Path fromContainedBeanPath) {
    return
      create(
        getDefaultValue(),
        from.getValue(),
        from.isSpecifiedInYaml(),
        fromContainedBeanPath.childPath(from.getContainedBeanPath())
      );
  }

  public BooleanValue merge(BooleanValue from, Path fromContainedBeanPath) {
    if (from.isSpecifiedInYaml()) {
      return copyFrom(from, fromContainedBeanPath);
    } else {
      return this;
    }
  }
}
