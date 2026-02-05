// Copyright (c) 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef;

import java.util.ArrayList;
import java.util.List;

import weblogic.remoteconsole.common.utils.ListUtils;

/**
 * POJO that implements ActionInputFormDef.
 * 
 * Used for building custom pages.
 */
public class CustomActionInputFormDef implements ActionInputFormDef {
  private CustomPageDef pageDef = new CustomPageDef();
  private PageActionDef actionDef;
  private List<PageActionParamDef> paramDefs = new ArrayList<>();
  private ActionInputFormPresentationDef presentationDef;

  public CustomActionInputFormDef() {
  }

  public CustomActionInputFormDef(ActionInputFormDef toClone) {
    pageDef = new CustomPageDef(toClone);
    setActionDef(toClone.getActionDef());
    getParamDefs().addAll(ListUtils.nonNull(toClone.getParamDefs()));
  }

  @Override
  public PageActionDef getActionDef() {
    return actionDef;
  }

  public void setActionDef(PageActionDef val) {
    actionDef = val;
  }

  public CustomActionInputFormDef actionDef(PageActionDef val) {
    setActionDef(val);
    return this;
  }

  @Override
  public List<PageActionParamDef> getParamDefs() {
    return paramDefs;
  }

  public void setParamDefs(List<PageActionParamDef> val) {
    paramDefs = val;
  }

  public CustomActionInputFormDef paramDefs(List<PageActionParamDef> val) {
    setParamDefs(val);
    return this;
  }

  @Override
  public List<PagePropertyDef> getAllPropertyDefs() {
    return List.of(); // not used
  }

  @Override
  public PagePath getPagePath() {
    return pageDef.getPagePath();
  }

  public void setPagePath(PagePath val) {
    pageDef.setPagePath(val);
  }

  public CustomActionInputFormDef pagePath(PagePath val) {
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

  public CustomActionInputFormDef introductionHTML(LocalizableString val) {
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

  public CustomActionInputFormDef helpPageTitle(LocalizableString val) {
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

  public CustomActionInputFormDef helpTopicDefs(List<HelpTopicDef> val) {
    setHelpTopicDefs(val);
    return this;
  }

  public List<PageActionDef> getActionDefs() {
    return pageDef.getActionDefs();
  }

  public void setActionDefs(List<PageActionDef> val) {
    pageDef.setActionDefs(val);
  }

  public CustomActionInputFormDef actionDefs(List<PageActionDef> val) {
    setActionDefs(val);
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

  public CustomActionInputFormDef customizePageMethod(String val) {
    setCustomizePageMethod(val);
    return this;
  }

  @Override
  public boolean isInstanceBasedPDJ() {
    return pageDef.isInstanceBasedPDJ();
  }

  public void setInstanceBasedPDJ(boolean val) {
    pageDef.setInstanceBasedPDJ(val);
  }

  @Override
  public ActionInputFormPresentationDef getPresentationDef() {
    return presentationDef;
  }

  public void setPresentationDef(ActionInputFormPresentationDef val) {
    presentationDef = val;
  }

  public CustomActionInputFormDef presentationDef(ActionInputFormPresentationDef val) {
    setPresentationDef(val);
    return this;
  }

  public CustomActionInputFormDef instanceBasedPDJ(boolean val) {
    setInstanceBasedPDJ(val);
    return this;
  }
}
