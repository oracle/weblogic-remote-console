// Copyright (c) 2021, 2024, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

import java.util.List;

import weblogic.remoteconsole.common.repodef.PageFieldDef;

/**
 * This class holds the value of a property on a form.
 * 
 * It also holds the list of available options if the property
 * is a reference or a list of references.
 */
public class FormProperty {

  private PageFieldDef fieldDef;

  // Note: SettableValue and UnknownValue handle isSet and the property value not being available
  private Value value;

  // Null if this property doesn't support options.
  private List<Option> options;

  // Null if this property doesn't support options or if this property isn't a Reference
  // (e.g. if the options are strings, then we don't support options sources).
  private List<OptionsSource> optionsSources;

  public FormProperty(PageFieldDef fieldDef, Value value) {
    this.fieldDef = fieldDef;
    this.value = value;
  }

  public PageFieldDef getFieldDef() {
    return fieldDef;
  }

  public String getName() {
    return fieldDef.getFormFieldName();
  }

  public Value getValue() {
    return value;
  }

  public List<Option> getOptions() {
    return options;
  }

  public void setOptions(List<Option> val) {
    options = val;
  }

  public List<OptionsSource> getOptionsSources() {
    return optionsSources;
  }

  public void setOptionsSources(List<OptionsSource> val) {
    optionsSources = val;
  }

  @Override
  public String toString() {
    return "FormProperty<" + getName() + ", " + getValue() + ">";
  }

  public static String getStringPropertyValue(
    String formFieldName,
    List<FormProperty> properties,
    String defaultValue
  ) {
    return
      getPropertyValue(
        formFieldName,
        properties,
        new StringValue(defaultValue)
      ).asString().getValue();
  }

  public static Value getPropertyValue(
    String formFieldName,
    List<FormProperty> properties,
    Value defaultValue
  ) {
    Value value = findPropertyValue(formFieldName, properties);
    return (value != null) ? value : defaultValue;
  }

  public static Value findPropertyValue(
    String formFieldName,
    List<FormProperty> properties
  ) {
    FormProperty property = findProperty(formFieldName, properties);
    return (property != null) ? property.getValue().asSettable().getValue() : null;
  }

  public static FormProperty findProperty(
    String formFieldName,
    List<FormProperty> properties
  ) {
    for (FormProperty property : properties) {
      if (formFieldName.equals(property.getName())) {
        return property;
      }
    }
    return null;
  }
}
