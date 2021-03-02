// Copyright (c) 2020, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.driver;

import java.util.ArrayList;
import java.util.List;

/**
 * This POJO contains information that the UI needs about a section of a
 * weblogic bean's create or slice form page.
 */
public class FormSection {

  private String title;

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  private String introductionHTML;

  public String getIntroductionHTML() {
    return introductionHTML;
  }

  public void setIntroductionHTML(String introductionHTML) {
    this.introductionHTML = introductionHTML;
  }

  private UsedIf usedIf;

  public UsedIf getUsedIf() {
    return usedIf;
  }

  public void setUsedIf(UsedIf usedIf) {
    this.usedIf = usedIf;
  }

  // The properties to display in this section.
  // Note: if properties is set, then sections must not be set.
  private List<WeblogicProperty> properties = new ArrayList<>();

  public List<WeblogicProperty> getProperties() {
    return properties;
  }

  public void setProperties(List<WeblogicProperty> properties) {
    this.properties = properties;
  }

  // The sections to display inside this section.
  // Note: if sections is set, then properties must not be set.
  private List<FormSection> sections = new ArrayList<>();

  public List<FormSection> getSections() {
    return sections;
  }

  public void setSections(List<FormSection> sections) {
    this.sections = sections;
  }
}
