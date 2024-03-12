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
class CustomFormDef {
  private CustomPageDef pageDef = new CustomPageDef();
  private List<PagePropertyDef> propertyDefs = new ArrayList<>();
  private List<FormSectionDef> sectionDefs = new ArrayList<>();

  public CustomFormDef() {
  }

  public CustomFormDef(FormDef toClone) {
    pageDef = new CustomPageDef(toClone);
    getPropertyDefs().addAll(ListUtils.nonNull(toClone.getPropertyDefs()));
    getSectionDefs().addAll(ListUtils.nonNull(toClone.getSectionDefs()));
  }

  List<PagePropertyDef> getPropertyDefs() {
    return propertyDefs;
  }

  void setPropertyDefs(List<PagePropertyDef> val) {
    propertyDefs = val;
  }
  
  List<PagePropertyDef> getAllPropertyDefs() {
    List<PagePropertyDef> allDefs = new ArrayList<>(propertyDefs);
    for (FormSectionDef sectionDef : sectionDefs) {
      allDefs.addAll(sectionDef.getAllPropertyDefs());
    }
    return allDefs;
  }

  List<FormSectionDef> getSectionDefs() {
    return sectionDefs;
  }

  void setSectionDefs(List<FormSectionDef> val) {
    sectionDefs = val;
  }

  List<FormSectionDef> getAllSectionDefs() {
    List<FormSectionDef> allDefs = new ArrayList<>(sectionDefs);
    for (FormSectionDef sectionDef : sectionDefs) {
      allDefs.addAll(sectionDef.getAllSectionDefs());
    }
    return allDefs;
  }

  PagePath getPagePath() {
    return pageDef.getPagePath();
  }

  void setPagePath(PagePath val) {
    pageDef.setPagePath(val);
  }

  LocalizableString getIntroductionHTML() {
    return pageDef.getIntroductionHTML();
  }

  void setIntroductionHTML(LocalizableString val) {
    pageDef.setIntroductionHTML(val);
  }

  LocalizableString getHelpPageTitle() {
    return pageDef.getHelpPageTitle();
  }

  void setHelpPageTitle(LocalizableString val) {
    pageDef.setHelpPageTitle(val);
  }

  List<HelpTopicDef> getHelpTopicDefs() {
    return pageDef.getHelpTopicDefs();
  }

  void setHelpTopicDefs(List<HelpTopicDef> val) {
    pageDef.setHelpTopicDefs(val);
  }

  List<PageActionDef> getActionDefs() {
    return pageDef.getActionDefs();
  }

  void setActionDefs(List<PageActionDef> val) {
    pageDef.setActionDefs(val);
  }

  String getCustomizePageMethod() {
    return pageDef.getCustomizePageMethod();
  }

  void setCustomizePageMethod(String val) {
    pageDef.setCustomizePageMethod(val);
  }

  String getCustomizePageDefMethod() {
    return pageDef.getCustomizePageDefMethod();
  }

  void setCustomizePageDefMethod(String val) {
    pageDef.setCustomizePageDefMethod(val);
  }
}
