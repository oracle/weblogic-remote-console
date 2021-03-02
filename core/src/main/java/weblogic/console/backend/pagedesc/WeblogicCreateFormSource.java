// Copyright (c) 2020, 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.pagedesc;

import java.util.ArrayList;
import java.util.List;

import weblogic.console.backend.utils.ListUtils;

/**
 * This POJO mirrors the yaml source file format for configuring information about a form on a
 * weblogic bean's create form page, e.g. ClusterMBean/createForm.yaml
 */
public class WeblogicCreateFormSource extends BaseWeblogicPageSource {
  private List<WeblogicPropertySource> properties = new ArrayList<>();

  public List<WeblogicPropertySource> getProperties() {
    return properties;
  }

  public void setProperties(List<WeblogicPropertySource> properties) {
    this.properties = ListUtils.nonNull(properties);
  }

  private WeblogicCreateFormPresentationSource presentation;

  public WeblogicCreateFormPresentationSource getPresentation() {
    return this.presentation;
  }

  public void setPresentation(WeblogicCreateFormPresentationSource presentation) {
    this.presentation = presentation;
  }
}
