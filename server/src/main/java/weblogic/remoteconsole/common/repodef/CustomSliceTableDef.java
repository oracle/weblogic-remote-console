// Copyright (c) 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef;

import java.util.ArrayList;
import java.util.List;

/**
 * POJO that implements SliceTableDef.
 * 
 * Used for building custom pages.
 */
public class CustomSliceTableDef implements SliceTableDef {
  private CustomPageDef pageDef = new CustomPageDef();
  private List<PagePropertyDef> displayedColumnDefs = new ArrayList<>();
  private List<PagePropertyDef> hiddenColumnDefs = new ArrayList<>();
  private String getTableRowsMethod;
  private List<PagePropertyDef> allPropertyDefs = new ArrayList<>();

  public CustomSliceTableDef() {
  }

  public CustomSliceTableDef(SliceTableDef toClone) {
    pageDef = new CustomPageDef(toClone);
    getDisplayedColumnDefs().addAll(toClone.getDisplayedColumnDefs());
    getHiddenColumnDefs().addAll(toClone.getHiddenColumnDefs());
    setGetTableRowsMethod(toClone.getGetTableRowsMethod());
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

  public CustomSliceTableDef displayedColumnDefs(List<PagePropertyDef> val) {
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

  public CustomSliceTableDef hiddenColumnDefs(List<PagePropertyDef> val) {
    setHiddenColumnDefs(val);
    return this;
  }

  @Override
  public String getGetTableRowsMethod() {
    return getTableRowsMethod;
  }

  public void setGetTableRowsMethod(String val) {
    getTableRowsMethod = val;
  }

  public CustomSliceTableDef presentationDef(String val) {
    setGetTableRowsMethod(val);
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
  public PagePath getPagePath() {
    return pageDef.getPagePath();
  }

  public void setPagePath(PagePath val) {
    pageDef.setPagePath(val);
  }

  public CustomSliceTableDef pagePath(PagePath val) {
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

  public CustomSliceTableDef introductionHTML(LocalizableString val) {
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

  public CustomSliceTableDef helpPageTitle(LocalizableString val) {
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

  public CustomSliceTableDef helpTopicDefs(List<HelpTopicDef> val) {
    setHelpTopicDefs(val);
    return this;
  }

  @Override
  public String getCustomizePageMethod() {
    return pageDef.getCustomizePageMethod();
  }

  @Override
  public String getCustomizePageDefMethod() {
    return pageDef.getCustomizePageDefMethod();
  }

  public void setCustomizePageMethod(String val) {
    pageDef.setCustomizePageMethod(val);
  }

  public CustomSliceTableDef customizePageMethod(String val) {
    setCustomizePageMethod(val);
    return this;
  }
}
