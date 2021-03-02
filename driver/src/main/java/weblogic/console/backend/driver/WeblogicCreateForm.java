// Copyright (c) 2020, 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.driver;

import java.util.ArrayList;
import java.util.List;

/** This POJO contains information that the UI needs about a weblogic bean's create form page. */
public class WeblogicCreateForm {

  // The properties to display on this form.
  // Note: if properties is set, then sections must not be set.
  private List<WeblogicProperty> properties = new ArrayList<>();

  public List<WeblogicProperty> getProperties() {
    return properties;
  }

  public void setProperties(List<WeblogicProperty> properties) {
    this.properties = properties;
  }

  // The sections to display on this form.
  // Note: if sections is set, then properties must not be set.
  private List<FormSection> sections = new ArrayList<>();

  public List<FormSection> getSections() {
    return sections;
  }

  public void setSections(List<FormSection> sections) {
    this.sections = sections;
  }

  private WeblogicCreateFormPresentation presentation;

  public WeblogicCreateFormPresentation getPresentation() {
    return this.presentation;
  }

  public void setPresentation(WeblogicCreateFormPresentation presentation) {
    this.presentation = presentation;
  }
}
