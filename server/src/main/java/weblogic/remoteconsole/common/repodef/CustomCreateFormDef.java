// Copyright (c) 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef;

import java.util.List;

/**
 * POJO that implements CreateFormDef.
 * 
 * Used for building custom pages.
 */
public class CustomCreateFormDef implements CreateFormDef {
  private CustomFormDef formDef = new CustomFormDef();
  private CreateFormPresentationDef presentationDef;

  public CustomCreateFormDef() {
  }

  public CustomCreateFormDef(CreateFormDef toClone) {
    formDef = new CustomFormDef(toClone);
    setPresentationDef(toClone.getPresentationDef());
  }

  @Override
  public CreateFormPresentationDef getPresentationDef() {
    return presentationDef;
  }

  public void setPresentationDef(CreateFormPresentationDef val) {
    presentationDef = val;
  }

  public CustomCreateFormDef presentationDef(CreateFormPresentationDef val) {
    setPresentationDef(val);
    return this;
  }

  @Override
  public List<PagePropertyDef> getPropertyDefs() {
    return formDef.getPropertyDefs();
  }

  public void setPropertyDefs(List<PagePropertyDef> val) {
    formDef.setPropertyDefs(val);
  }

  public CustomCreateFormDef propertyDefs(List<PagePropertyDef> val) {
    setPropertyDefs(val);
    return this;
  }

  @Override
  public List<PagePropertyDef> getAllPropertyDefs() {
    return formDef.getAllPropertyDefs();
  }

  @Override
  public List<FormSectionDef> getSectionDefs() {
    return formDef.getSectionDefs();
  }

  public void setSectionDefs(List<FormSectionDef> val) {
    formDef.setSectionDefs(val);
  }

  public CustomCreateFormDef sectionDefs(List<FormSectionDef> val) {
    setSectionDefs(val);
    return this;
  }

  @Override
  public List<FormSectionDef> getAllSectionDefs() {
    return formDef.getAllSectionDefs();
  }

  @Override
  public PagePath getPagePath() {
    return formDef.getPagePath();
  }

  public void setPagePath(PagePath val) {
    formDef.setPagePath(val);
  }

  public CustomCreateFormDef pagePath(PagePath val) {
    setPagePath(val);
    return this;
  }

  @Override
  public LocalizableString getIntroductionHTML() {
    return formDef.getIntroductionHTML();
  }

  public void setIntroductionHTML(LocalizableString val) {
    formDef.setIntroductionHTML(val);
  }

  public CustomCreateFormDef introductionHTML(LocalizableString val) {
    setIntroductionHTML(val);
    return this;
  }

  @Override
  public LocalizableString getHelpPageTitle() {
    return formDef.getHelpPageTitle();
  }

  public void setHelpPageTitle(LocalizableString val) {
    formDef.setHelpPageTitle(val);
  }

  public CustomCreateFormDef helpPageTitle(LocalizableString val) {
    setHelpPageTitle(val);
    return this;
  }

  @Override
  public List<HelpTopicDef> getHelpTopicDefs() {
    return formDef.getHelpTopicDefs();
  }

  public void setHelpTopicDefs(List<HelpTopicDef> val) {
    formDef.setHelpTopicDefs(val);
  }

  public CustomCreateFormDef helpTopicDefs(List<HelpTopicDef> val) {
    setHelpTopicDefs(val);
    return this;
  }

  @Override
  public String getCustomizePageMethod() {
    return formDef.getCustomizePageMethod();
  }

  @Override
  public String getCustomizePageDefMethod() {
    return formDef.getCustomizePageDefMethod();
  }

  public void setCustomizePageMethod(String val) {
    formDef.setCustomizePageMethod(val);
  }

  public CustomCreateFormDef customizePageMethod(String val) {
    setCustomizePageMethod(val);
    return this;
  }
}
