// Copyright (c) 2020, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.typedesc;

import java.util.ArrayList;
import java.util.List;

import weblogic.console.backend.utils.ListUtils;

/**
 * This POJO mirrors the yaml file format for configuring REST extension properties
 * about a weblogic bean type, e.g. ClusterMBean/extension.yaml
 */
public class HarvestedWeblogicBeanTypeExtension {
  private List<HarvestedWeblogicBeanProperty> properties = new ArrayList<>();

  public List<HarvestedWeblogicBeanProperty> getProperties() {
    return properties;
  }

  public void setProperties(List<HarvestedWeblogicBeanProperty> properties) {
    this.properties = ListUtils.nonNull(properties);
  }
}
