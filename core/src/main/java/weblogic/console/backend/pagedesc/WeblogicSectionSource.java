// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.pagedesc;

import java.util.ArrayList;
import java.util.List;

import weblogic.console.backend.utils.ListUtils;

/**
 * This POJO mirrors the yaml source file format for configuring information
 * about a section on a weblogic bean's form page
 */
public class WeblogicSectionSource {
  private String title;
  private List<WeblogicPropertySource> properties = new ArrayList<>();

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public List<WeblogicPropertySource> getProperties() {
    return properties;
  }

  public void setProperties(List<WeblogicPropertySource> properties) {
    this.properties = ListUtils.nonNull(properties);
  }
}
