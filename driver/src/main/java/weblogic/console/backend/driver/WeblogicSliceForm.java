// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.driver;

import java.util.ArrayList;
import java.util.List;

/**
 * This POJO contains information that the UI needs about a form that
 * manages a slice of a weblogic bean.
 */
public class WeblogicSliceForm {
  private List<Slice> slices = new ArrayList<>();

  public List<Slice> getSlices() {
    return slices;
  }

  public void setSlices(List<Slice> slices) {
    this.slices = slices;
  }

  private List<WeblogicProperty> properties = new ArrayList<>();

  public List<WeblogicProperty> getProperties() {
    return properties;
  }

  public void setProperties(List<WeblogicProperty> properties) {
    this.properties = properties;
  }

  private List<WeblogicProperty> advancedProperties = new ArrayList<>();

  public List<WeblogicProperty> getAdvancedProperties() {
    return advancedProperties;
  }

  public void setAdvancedProperties(List<WeblogicProperty> advancedProperties) {
    this.advancedProperties = advancedProperties;
  }

  private WeblogicSliceFormPresentation presentation;

  public WeblogicSliceFormPresentation getPresentation() {
    return this.presentation;
  }

  public void setPresentation(WeblogicSliceFormPresentation presentation) {
    this.presentation = presentation;
  }

  private List<FormSection> sections = new ArrayList<>();

  public List<FormSection> getSections() {
    return sections;
  }

  public void setSections(List<FormSection> sections) {
    this.sections = sections;
  }

  public FormSection addSection() {
    FormSection section = new FormSection();
    sections.add(section);
    return section;
  }
}
