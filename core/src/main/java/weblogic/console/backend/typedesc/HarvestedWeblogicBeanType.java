// Copyright (c) 2020, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.typedesc;

import java.util.ArrayList;
import java.util.List;

import weblogic.console.backend.utils.ListUtils;

/**
 * This POJO mirrors the yaml file format for the weblogic bean type information harvested from a
 * weblogic BeanInfo, e.g. harvestedWeblogicBeanTypes/14.1.1.0.0/ClusterMBean.yaml
 */
public class HarvestedWeblogicBeanType {
  private String name;

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  private String descriptionHTML;

  public String getDescriptionHTML() {
    return descriptionHTML;
  }

  public void setDescriptionHTML(String descriptionHTML) {
    this.descriptionHTML = descriptionHTML;
  }

  private List<String> baseTypes = new ArrayList<>();

  public List<String> getBaseTypes() {
    return baseTypes;
  }

  public void setBaseTypes(List<String> baseTypes) {
    this.baseTypes = ListUtils.nonNull(baseTypes);
  }

  private List<String> derivedTypes = new ArrayList<>();

  public List<String> getDerivedTypes() {
    return derivedTypes;
  }

  public void setDerivedTypes(List<String> derivedTypes) {
    this.derivedTypes = ListUtils.nonNull(derivedTypes);
  }

  private List<HarvestedWeblogicBeanProperty> properties = new ArrayList<>();

  public List<HarvestedWeblogicBeanProperty> getProperties() {
    return properties;
  }

  public void setProperties(List<HarvestedWeblogicBeanProperty> properties) {
    this.properties = ListUtils.nonNull(properties);
  }
}
