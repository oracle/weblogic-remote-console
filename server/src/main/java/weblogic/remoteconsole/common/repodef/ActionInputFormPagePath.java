// Copyright (c) 2023, 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef;

import weblogic.console.utils.StringUtils;

/**
 * This class contains the path needed to identify an action input form
 */
public class ActionInputFormPagePath extends PagePath {
  private PagePath parentPagePath; // the page the action is on
  private String action;

  ActionInputFormPagePath(PagePath parentPagePath, String action) {
    super(parentPagePath.getPagesPath());
    this.parentPagePath = parentPagePath;
    this.action = action;
  }

  // Returns the name of the action on the type.
  public String getAction() {
    return this.action;
  }

  // Returns the page path of the page that inclues the action that uses this input form
  public PagePath getParentPagePath() {
    return parentPagePath;
  }

  @Override
  public String getRDJQueryParams() {
    return addActionInputFormQueryParams(parentPagePath.getRDJQueryParams());
  }

  @Override
  public String getPDJQueryParams() {
    return addActionInputFormQueryParams(parentPagePath.getPDJQueryParams());
  }

  private String addActionInputFormQueryParams(String pageQueryParams) {
    String separator = StringUtils.isEmpty(pageQueryParams) ? "?" : "&";
    return pageQueryParams + separator + "actionForm=inputForm&action=" + getAction();
  }

  @Override
  public String computeKey() {
    return parentPagePath.computeKey() + "actionForm=<inputForm>action=<" + getAction() + ">";
  }
}
