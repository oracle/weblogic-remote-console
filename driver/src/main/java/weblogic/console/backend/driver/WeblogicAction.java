// Copyright (c) 2020, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.driver;

import java.util.ArrayList;
import java.util.List;

import weblogic.console.backend.utils.ListUtils;

/**
 * This POJO contains information that the UI needs about a table action
 * on a weblogic bean table page.
 */
public class WeblogicAction {
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

  private boolean asynchronous = false;

  public boolean isAsynchronous() {
    return asynchronous;
  }

  public void setAsynchronous(boolean asynchronous) {
    this.asynchronous = asynchronous;
  }

  private List<WeblogicAction> actions = new ArrayList<>();

  public List<WeblogicAction> getActions() {
    return actions;
  }

  public void setActions(List<WeblogicAction> actions) {
    this.actions = ListUtils.nonNull(actions);
  }
}
