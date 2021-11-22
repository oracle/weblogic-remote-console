// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.schema;

import java.util.List;

/**
 * This POJO mirrors the yaml source file format for configuring information about
 * a section on a slice form page or create form page.
 */
public class FormSectionDefSource {
  private ListValue<BeanPropertyDefCustomizerSource> properties = new ListValue<>();
  private ListValue<FormSectionDefSource> sections = new ListValue<>();
  private StringValue name = new StringValue();
  private StringValue title = new StringValue();
  private StringValue introductionHTML = new StringValue();
  private Value<UsedIfDefSource> usedIf = new Value<>(null);

  // The properties to display in this section.
  // Must be empty if 'sections' is not.
  // (i.e. a section must contain only properties or only sections)
  public List<BeanPropertyDefCustomizerSource> getProperties() {
    return properties.getValue();
  }

  public void setProperties(List<BeanPropertyDefCustomizerSource> value) {
    properties.setValue(value);
  }

  public void addProperty(BeanPropertyDefCustomizerSource value) {
    properties.add(value);
  }

  // The sections to display in this section.
  // Must be empty if 'properties' is not.
  // (i.e. a section must contain only properties or only sections)
  public List<FormSectionDefSource> getSections() {
    return sections.getValue();
  }

  public void setSections(List<FormSectionDefSource> value) {
    sections.setValue(value);
  }

  public void addSection(FormSectionDefSource value) {
    sections.add(value);
  }

  // The name of this section (used for generating its resource bundle key).
  // Must be specified if title or introductionHTML is specified.
  public String getName() {
    return name.getValue();
  }

  public void setName(String value) {
    name.setValue(value);
  }

  // The english text of the title to display for this section.  Optional.
  public String getTitle() {
    return title.getValue();
  }

  public void setTitle(String value) {
    title.setValue(value);
  }

  // The english text of the introduction to display for this section.  Optional.
  public String getIntroductionHTML() {
    return introductionHTML.getValue();
  }

  public void setIntroductionHTML(String value) {
    introductionHTML.setValue(value);
  }

  // When this section should be enabled.
  // If not specified, then this section should always be enabled.
  public UsedIfDefSource getUsedIf() {
    return usedIf.getValue();
  }

  public void setUsedIf(UsedIfDefSource value) {
    usedIf.setValue(value);
  }
}
