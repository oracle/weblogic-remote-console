// Copyright (c) 2023, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef;

import java.util.ArrayList;
import java.util.List;

import weblogic.remoteconsole.common.utils.ListUtils;

/**
 * POJO that implements TableDef.
 * 
 * Used for building custom pages.
 */
public class CustomTableDef implements TableDef {
  private CustomPageDef pageDef = new CustomPageDef();
  private List<PagePropertyDef> displayedColumnDefs = new ArrayList<>();
  private List<PagePropertyDef> hiddenColumnDefs = new ArrayList<>();
  private List<PagePropertyDef> allPropertyDefs = new ArrayList<>();

  public CustomTableDef() {
  }

  public CustomTableDef(TableDef toClone) {
    pageDef = new CustomPageDef(toClone);
    getDisplayedColumnDefs().addAll(ListUtils.nonNull(toClone.getDisplayedColumnDefs()));
    getHiddenColumnDefs().addAll(ListUtils.nonNull(toClone.getHiddenColumnDefs()));
    computeAllPropertyDefs();
  }

  @Override
  public List<PagePropertyDef> getDisplayedColumnDefs() {
    return displayedColumnDefs;
  }

  public void setDisplayedColumnDefs(List<PagePropertyDef> val) {
    displayedColumnDefs = val;
    computeAllPropertyDefs();
  }

  public CustomTableDef displayedColumnDefs(List<PagePropertyDef> val) {
    setDisplayedColumnDefs(val);
    return this;
  }

  @Override
  public List<PagePropertyDef> getHiddenColumnDefs() {
    return hiddenColumnDefs;
  }

  public void setHiddenColumnDefs(List<PagePropertyDef> val) {
    hiddenColumnDefs = val;
    computeAllPropertyDefs();
  }

  public CustomTableDef hiddenColumnDefs(List<PagePropertyDef> val) {
    setHiddenColumnDefs(val);
    return this;
  }

  @Override
  public List<PagePropertyDef> getAllPropertyDefs() {
    return allPropertyDefs;
  }

  private void computeAllPropertyDefs() {
    allPropertyDefs.clear();
    allPropertyDefs.addAll(getDisplayedColumnDefs());
    allPropertyDefs.addAll(getHiddenColumnDefs());
  }

  @Override
  public List<PageActionDef> getActionDefs() {
    return pageDef.getActionDefs();
  }

  public void setActionDefs(List<PageActionDef> val) {
    pageDef.setActionDefs(val);
  }

  public CustomTableDef actionDefs(List<PageActionDef> val) {
    setActionDefs(val);
    return this;
  }

  @Override
  public PagePath getPagePath() {
    return pageDef.getPagePath();
  }

  public void setPagePath(PagePath val) {
    pageDef.setPagePath(val);
  }

  public CustomTableDef pagePath(PagePath val) {
    setPagePath(val);
    return this;
  }

  @Override
  public LocalizableString getIntroductionHTML() {
    return pageDef.getIntroductionHTML();
  }

  public void setIntroductionHTML(LocalizableString val) {
    pageDef.setIntroductionHTML(val);
  }

  public CustomTableDef introductionHTML(LocalizableString val) {
    setIntroductionHTML(val);
    return this;
  }

  @Override
  public LocalizableString getHelpPageTitle() {
    return pageDef.getHelpPageTitle();
  }

  public void setHelpPageTitle(LocalizableString val) {
    pageDef.setHelpPageTitle(val);
  }

  public CustomTableDef helpPageTitle(LocalizableString val) {
    setHelpPageTitle(val);
    return this;
  }

  @Override
  public List<HelpTopicDef> getHelpTopicDefs() {
    return pageDef.getHelpTopicDefs();
  }

  public void setHelpTopicDefs(List<HelpTopicDef> val) {
    pageDef.setHelpTopicDefs(val);
  }

  public CustomTableDef helpTopicDefs(List<HelpTopicDef> val) {
    setHelpTopicDefs(val);
    return this;
  }

  @Override
  public String getCustomizePageDefMethod() {
    return pageDef.getCustomizePageDefMethod();
  }

  @Override
  public String getCustomizePageMethod() {
    return pageDef.getCustomizePageMethod();
  }

  public void setCustomizePageMethod(String val) {
    pageDef.setCustomizePageMethod(val);
  }

  public CustomTableDef customizePageMethod(String val) {
    setCustomizePageMethod(val);
    return this;
  }
}
