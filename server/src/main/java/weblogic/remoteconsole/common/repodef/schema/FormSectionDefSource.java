// Copyright (c) 2021, 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.schema;

import java.util.List;

import weblogic.console.schema.ListValue;
import weblogic.console.schema.StringValue;
import weblogic.console.schema.Value;
import weblogic.console.schema.YamlSource;

/**
 * This POJO mirrors the yaml source file format for configuring information about
 * a section on a slice form page or create form page.
 */
public class FormSectionDefSource extends YamlSource {
  private ListValue<BeanPropertyDefCustomizerSource> properties = ListValue.create();
  private ListValue<FormSectionDefSource> sections = ListValue.create();
  private StringValue name = StringValue.create();
  private StringValue title = StringValue.create();
  private StringValue introductionHTML = StringValue.create();
  private Value<UsedIfDefSource> usedIf = Value.create();

  // The properties to display in this section.
  // Must be empty if 'sections' is not.
  // (i.e. a section must contain only properties or only sections)
  public List<BeanPropertyDefCustomizerSource> getProperties() {
    return properties.getValue();
  }

  public void setProperties(List<BeanPropertyDefCustomizerSource> value) {
    properties = properties.setValue(value);
  }

  public void addProperty(BeanPropertyDefCustomizerSource value) {
    properties = properties.add(value);
  }

  // The sections to display in this section.
  // Must be empty if 'properties' is not.
  // (i.e. a section must contain only properties or only sections)
  public List<FormSectionDefSource> getSections() {
    return sections.getValue();
  }

  public void setSections(List<FormSectionDefSource> value) {
    sections = sections.setValue(value);
  }

  public void addSection(FormSectionDefSource value) {
    sections = sections.add(value);
  }

  // The name of this section (used for generating its resource bundle key).
  // Must be specified if title or introductionHTML is specified.
  public String getName() {
    return name.getValue();
  }

  public void setName(String value) {
    name = name.setValue(value);
  }

  // The english text of the title to display for this section.  Optional.
  public String getTitle() {
    return title.getValue();
  }

  public void setTitle(String value) {
    title = title.setValue(value);
  }

  // The english text of the introduction to display for this section.  Optional.
  public String getIntroductionHTML() {
    return introductionHTML.getValue();
  }

  public void setIntroductionHTML(String value) {
    introductionHTML = introductionHTML.setValue(value);
  }

  // When this section should be enabled.
  // If not specified, then this section should always be enabled.
  public UsedIfDefSource getUsedIf() {
    return usedIf.getValue();
  }

  public void setUsedIf(UsedIfDefSource value) {
    usedIf = usedIf.setValue(value);
  }

  @Override
  protected void validateExtension() {
    super.validateExtension();
    validateExtensionChildren(getProperties(), "properties");
    validateExtensionChildren(getSections(), "sections");
    validateExtensionChild(getUsedIf(), "usedIf");
  }
}
