// Copyright (c) 2020, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.driver;

import java.util.ArrayList;
import java.util.List;

import weblogic.console.backend.utils.ListUtils;

/**
 * This POJO contains information that the UI needs about the when a property displayed
 * in a table column or form property on page is used.
 * <p>
 * For example, the clusterBroadcastChannel property on the weblogic configuration cluster
 * general page is only used if the clusterMessagingMode property on that page has the value
 * 'unicast'.
 */
public class UsedIf {
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
