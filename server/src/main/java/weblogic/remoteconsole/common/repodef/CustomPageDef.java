// Copyright (c) 2022, 2023, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef;

import java.util.ArrayList;
import java.util.List;

import weblogic.remoteconsole.common.utils.ListUtils;

/**
 * POJO used to help build implementations of interfaces that extend PageDef.
 * 
 * Used for building custom pages.
 */
class CustomPageDef {
  private PagePath pagePath;
  private LocalizableString introductionHTML;
  private LocalizableString helpPageTitle;
  private List<HelpTopicDef> helpTopicDefs = new ArrayList<>();
  private List<PageActionDef> actionDefs = new ArrayList<>();
  private String customizePageMethod;
  private String customizePageDefMethod;

  public CustomPageDef() {
  }

  public CustomPageDef(PageDef toClone) {
    setPagePath(toClone.getPagePath());
    setIntroductionHTML(toClone.getIntroductionHTML());
    setHelpPageTitle(toClone.getHelpPageTitle());
    getHelpTopicDefs().addAll(ListUtils.nonNull(toClone.getHelpTopicDefs()));
    getActionDefs().addAll(ListUtils.nonNull(toClone.getActionDefs()));
    setCustomizePageMethod(toClone.getCustomizePageMethod());
    setCustomizePageDefMethod(toClone.getCustomizePageDefMethod());
  }

  PagePath getPagePath() {
    return pagePath;
  }

  void setPagePath(PagePath val) {
    pagePath = val;
  }

  LocalizableString getIntroductionHTML() {
    return introductionHTML;
  }

  void setIntroductionHTML(LocalizableString val) {
    introductionHTML = val;
  }

  LocalizableString getHelpPageTitle() {
    return helpPageTitle;
  }

  void setHelpPageTitle(LocalizableString val) {
    helpPageTitle = val;
  }

  List<HelpTopicDef> getHelpTopicDefs() {
    return helpTopicDefs;
  }

  void setHelpTopicDefs(List<HelpTopicDef> val) {
    helpTopicDefs = val;
  }

  List<PageActionDef> getActionDefs() {
    return actionDefs;
  }

  void setActionDefs(List<PageActionDef> val) {
    actionDefs = val;
  }

  String getCustomizePageMethod() {
    return customizePageMethod;
  }

  void setCustomizePageMethod(String val) {
    customizePageMethod = val;
  }

  String getCustomizePageDefMethod() {
    return customizePageDefMethod;
  }

  void setCustomizePageDefMethod(String val) {
    customizePageDefMethod = val;
  }
}
