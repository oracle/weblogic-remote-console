// Copyright (c) 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef;

import java.util.ArrayList;
import java.util.List;

/**
 * POJO that implements SliceFormDef.
 * 
 * Used for building custom pages.
 */
public class CustomSliceFormDef implements SliceFormDef {
  private CustomFormDef formDef = new CustomFormDef();
  private List<PagePropertyDef> advancedPropertyDefs = new ArrayList<>();
  private SliceFormPresentationDef presentationDef;

  public CustomSliceFormDef() {
  }

  public CustomSliceFormDef(SliceFormDef toClone) {
    formDef = new CustomFormDef(toClone);
    getAdvancedPropertyDefs().addAll(toClone.getAdvancedPropertyDefs());
    setPresentationDef(toClone.getPresentationDef());
  }

  @Override
  public List<PagePropertyDef> getAdvancedPropertyDefs() {
    return advancedPropertyDefs;
  }

  public void setAdvancedPropertyDefs(List<PagePropertyDef> val) {
    advancedPropertyDefs = val;
  }

  public CustomSliceFormDef advancedPropertyDefs(List<PagePropertyDef> val) {
    setAdvancedPropertyDefs(val);
    return this;
  }

  @Override
  public SliceFormPresentationDef getPresentationDef() {
    return presentationDef;
  }

  public void setPresentationDef(SliceFormPresentationDef val) {
    presentationDef = val;
  }

  public CustomSliceFormDef presentationDef(SliceFormPresentationDef val) {
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

  public CustomSliceFormDef propertyDefs(List<PagePropertyDef> val) {
    setPropertyDefs(val);
    return this;
  }

  @Override
  public List<PagePropertyDef> getAllPropertyDefs() {
    List<PagePropertyDef> allDefs = formDef.getAllPropertyDefs();
    allDefs.addAll(advancedPropertyDefs);
    return allDefs;
  }

  @Override
  public List<FormSectionDef> getSectionDefs() {
    return formDef.getSectionDefs();
  }

  public void setSectionDefs(List<FormSectionDef> val) {
    formDef.setSectionDefs(val);
  }

  public CustomSliceFormDef sectionDefs(List<FormSectionDef> val) {
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

  public CustomSliceFormDef pagePath(PagePath val) {
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

  public CustomSliceFormDef introductionHTML(LocalizableString val) {
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

  public CustomSliceFormDef helpPageTitle(LocalizableString val) {
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

  public CustomSliceFormDef helpTopicDefs(List<HelpTopicDef> val) {
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

  public CustomSliceFormDef customizePageMethod(String val) {
    setCustomizePageMethod(val);
    return this;
  }
}
