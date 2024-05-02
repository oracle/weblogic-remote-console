// Copyright (c) 2022, 2024, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef;

import java.util.ArrayList;
import java.util.List;

import weblogic.remoteconsole.common.utils.ListUtils;

/**
 * POJO that implements SliceTableDef.
 * 
 * Used for building custom pages.
 */
public class CustomSliceTableDef implements SliceTableDef {
  private CustomPageDef pageDef = new CustomPageDef();
  private boolean setReadOnly = false;
  private boolean readOnly;
  private List<PagePropertyDef> displayedColumnDefs = new ArrayList<>();
  private List<PagePropertyDef> hiddenColumnDefs = new ArrayList<>();
  private List<PagePropertyDef> allPropertyDefs = new ArrayList<>();
  private String getTableRowsMethod;
  private boolean supportsNavigation;
  private boolean useRowIdentities;

  public CustomSliceTableDef() {
  }

  public CustomSliceTableDef(SliceTableDef toClone) {
    pageDef = new CustomPageDef(toClone);
    readOnly = toClone.isReadOnly();
    getDisplayedColumnDefs().addAll(ListUtils.nonNull(toClone.getDisplayedColumnDefs()));
    getHiddenColumnDefs().addAll(ListUtils.nonNull(toClone.getHiddenColumnDefs()));
    computeAllPropertyDefs();
    setGetTableRowsMethod(toClone.getGetTableRowsMethod());
    setUseRowIdentities(toClone.isUseRowIdentities());
  }

  @Override
  public boolean isReadOnly() {
    if (setReadOnly) {
      return readOnly;
    }
    for (PagePropertyDef propertyDef : getAllPropertyDefs()) {
      if (propertyDef.isUpdateWritable()) {
        return false;
      }
    }
    return true;
  }

  public void setReadOnly(boolean val) {
    readOnly = val;
    setReadOnly = true;
  }

  public CustomSliceTableDef readOnly(boolean val) {
    setReadOnly(val);
    return this;
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
  public List<PagePropertyDef> getAllPropertyDefs() {
    return allPropertyDefs;
  }

  private void computeAllPropertyDefs() {
    allPropertyDefs.clear();
    allPropertyDefs.addAll(getDisplayedColumnDefs());
    allPropertyDefs.addAll(getHiddenColumnDefs());
  }

  @Override
  public String getGetTableRowsMethod() {
    return getTableRowsMethod;
  }

  public void setGetTableRowsMethod(String val) {
    getTableRowsMethod = val;
  }

  public CustomSliceTableDef getTableRowsMethod(String val) {
    setGetTableRowsMethod(val);
    return this;
  }

  @Override
  public boolean isSupportsNavigation() {
    return supportsNavigation;
  }

  public void setSupportsNavigation(boolean val) {
    supportsNavigation = val;
  }

  public CustomSliceTableDef supportsNavigation(boolean val) {
    setSupportsNavigation(val);
    return this;
  }

  @Override
  public boolean isUseRowIdentities() {
    return useRowIdentities;
  }

  public void setUseRowIdentities(boolean val) {
    useRowIdentities = val;
  }

  public CustomSliceTableDef useRowIdentities(boolean val) {
    setUseRowIdentities(val);
    return this;
  }

  @Override
  public List<PageActionDef> getActionDefs() {
    return pageDef.getActionDefs();
  }

  public void setActionDefs(List<PageActionDef> val) {
    pageDef.setActionDefs(val);
  }

  public CustomSliceTableDef actionDefs(List<PageActionDef> val) {
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

  public CustomSliceTableDef customizePageMethod(String val) {
    setCustomizePageMethod(val);
    return this;
  }
}
