// Copyright (c) 2020, 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.pagedesc;

/**
 * This POJO mirrors the yaml source file format for configuring information about a property on a
 * weblogic bean's form page, e.g. ServerMBean/slices/General/form.yaml
 */
public class WeblogicPropertySource {
  private String name;

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  private String label;

  public String getLabel() {
    return label;
  }

  public void setLabel(String label) {
    this.label = label;
  }

  private WeblogicPropertyPresentationSource presentation;

  public WeblogicPropertyPresentationSource getPresentation() {
    return this.presentation;
  }

  public void setPresentation(WeblogicPropertyPresentationSource presentation) {
    this.presentation = presentation;
  }
}
