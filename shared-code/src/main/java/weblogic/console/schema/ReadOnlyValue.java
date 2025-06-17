// Copyright (c) 2021, 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.schema;

import weblogic.console.utils.Deduplicatable;
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
public class ReadOnlyValue<T> implements Deduplicatable {

  private static final Deduplicator<Path> DEDUPLICATOR = new Deduplicator<>("Path");

  private T defaultValue;
  private T yamlValue;
  private boolean specifiedInYaml;
  private Path containedBeanPath = new Path();

  public ReadOnlyValue(T defaultValue, T yamlValue, boolean specifiedInYaml, Path containedBeanPath) {
    this.defaultValue = defaultValue;
    this.yamlValue = yamlValue;
    this.specifiedInYaml = specifiedInYaml;
    this.containedBeanPath = DEDUPLICATOR.deduplicate(containedBeanPath);
  }

  public boolean isSpecifiedInYaml() {
    return specifiedInYaml;
  }

  public Path getContainedBeanPath() {
    return containedBeanPath;
  }

  public T getDefaultValue() {
    return defaultValue;
  }

  public T getYamlValue() {
    return yamlValue;
  }

  public T getValue() {
    return isSpecifiedInYaml() ? getYamlValue() : getDefaultValue();
  }

  protected void validateValue(T value) {
    if (value == null) {
      throw new AssertionError("yaml error. The value cannot be set to null");
    }
  }

  @Override
  public String getDeduplicationKey() {
    String defaultValueKey = getValueKey(getDefaultValue());
    if (defaultValueKey == null) {
      return null; // not deduplicatable
    }
    String yamlValueKey = getValueKey(getYamlValue());
    if (yamlValueKey == null) {
      return null; // not deduplicatable
    }
    return
      "defaultValue<" + defaultValueKey + ">"
      + "yamlValue<" + yamlValueKey + ">"
      + "specifiedInYaml<" + isSpecifiedInYaml() + ">"
      + "containedBeanPath<" + getContainedBeanPath() + ">";
  }

  protected String getValueKey(T value) {
    if (value == null) {
      return "null";
    }
    return ("value<" + value.toString() + ">");
  }
}
