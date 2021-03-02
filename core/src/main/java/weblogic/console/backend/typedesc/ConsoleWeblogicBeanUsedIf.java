// Copyright (c) 2020, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.typedesc;

import java.util.ArrayList;
import java.util.List;

import weblogic.console.backend.utils.ListUtils;

/**
 * This POJO mirrors the yaml file format for configuring console-specific information
 * about when a weblogic bean property is used by weblogic, e.g. ClusterMBean/type.yaml
 * <p>
 * For example, a ClusterMBean's MulticastAddress property is only used when its
 * ClusterMessagingMode property has the value 'multicast'.
 */
public class ConsoleWeblogicBeanUsedIf {
  private String property;

  public String getProperty() {
    return property;
  }

  public void setProperty(String property) {
    this.property = property;
  }

  private List<Object> values = new ArrayList<>();

  public List<Object> getValues() {
    return values;
  }

  public void setValues(List<Object> values) {
    this.values = ListUtils.nonNull(values);
  }

  private boolean hide;

  public boolean isHide() {
    return hide;
  }

  public void setHide(boolean hide) {
    this.hide = hide;
  }
}
