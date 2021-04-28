// Copyright (c) 2020, 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.pagedesc;

import java.util.ArrayList;
import java.util.List;

import weblogic.console.backend.utils.ListUtils;

/**
 * This POJO mirrors the yaml source file format for configuring information about a form on a
 * weblogic bean's form page, e.g. ClusterMBean/slices/General/form.yaml
 */
public class WeblogicSliceFormSource extends BaseWeblogicPageSource {
  private List<WeblogicPropertySource> properties = new ArrayList<>();
  private List<WeblogicSectionSource> sections = new ArrayList<>();

  public List<WeblogicSectionSource> getSections() {
    return sections;
  }

  public void setSections(List<WeblogicSectionSource> sections) {
    this.sections = ListUtils.nonNull(sections);
  }

  public List<WeblogicPropertySource> getProperties() {
    return properties;
  }

  public List<WeblogicPropertySource> getAllProperties() {
    List<WeblogicPropertySource> ret = new ArrayList<>();
    for (WeblogicSectionSource section : getSections()) {
      ret.addAll(section.getProperties());
    }
    ret.addAll(getProperties());
    ret.addAll(getAdvancedProperties());
    return ret;
  }

  public void setProperties(List<WeblogicPropertySource> properties) {
    this.properties = ListUtils.nonNull(properties);
  }

  private List<WeblogicPropertySource> advancedProperties = new ArrayList<>();

  public List<WeblogicPropertySource> getAdvancedProperties() {
    return advancedProperties;
  }

  public void setAdvancedProperties(List<WeblogicPropertySource> advancedProperties) {
    this.advancedProperties = ListUtils.nonNull(advancedProperties);
  }

  private WeblogicSliceFormPresentationSource presentation;

  public WeblogicSliceFormPresentationSource getPresentation() {
    return this.presentation;
  }

  public void setPresentation(WeblogicSliceFormPresentationSource presentation) {
    this.presentation = presentation;
  }
}
