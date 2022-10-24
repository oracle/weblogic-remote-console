// Copyright (c) 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef;

import java.util.ArrayList;
import java.util.List;

/**
 * POJO that implements CreateFormDef.
 * 
 * Used for building custom pages.
 */
public class CustomFormSectionDef implements FormSectionDef {

  private FormDef formDef;
  private LocalizableString title;
  private LocalizableString introductionHTML;
  private FormSectionUsedIfDef usedIfDef;
  List<PagePropertyDef> propertyDefs = new ArrayList<>();
  List<FormSectionDef> sectionDefs = new ArrayList<>();

  public CustomFormSectionDef() {
  }

  public CustomFormSectionDef(FormSectionDef toClone) {
    setFormDef(toClone.getFormDef());
    setTitle(toClone.getTitle());
    setIntroductionHTML(toClone.getIntroductionHTML());
    setUsedIfDef(toClone.getUsedIfDef());
    getPropertyDefs().addAll(toClone.getPropertyDefs());
    getSectionDefs().addAll(toClone.getSectionDefs());
  }

  @Override
  public FormDef getFormDef() {
    return formDef;
  }

  public void setFormDef(FormDef val) {
    formDef = val;
  }

  public CustomFormSectionDef formDef(FormDef val) {
    setFormDef(val);
    return this;
  }

  @Override
  public LocalizableString getTitle() {
    return title;
  }

  public void setTitle(LocalizableString val) {
    title = val;
  }

  public CustomFormSectionDef title(LocalizableString val) {
    setTitle(val);
    return this;
  }

  @Override
  public LocalizableString getIntroductionHTML() {
    return introductionHTML;
  }

  public void setIntroductionHTML(LocalizableString val) {
    introductionHTML = val;
  }

  public CustomFormSectionDef introductionHTML(LocalizableString val) {
    setIntroductionHTML(val);
    return this;
  }

  @Override
  public FormSectionUsedIfDef getUsedIfDef() {
    return usedIfDef;
  }

  public void setUsedIfDef(FormSectionUsedIfDef val) {
    usedIfDef = val;
  }

  public CustomFormSectionDef usedIfDef(FormSectionUsedIfDef val) {
    setUsedIfDef(val);
    return this;
  }

  @Override
  public List<PagePropertyDef> getPropertyDefs() {
    return propertyDefs;
  }

  public void setPropertyDefs(List<PagePropertyDef> val) {
    propertyDefs = val;
  }

  public CustomFormSectionDef propertyDefs(List<PagePropertyDef> val) {
    setPropertyDefs(val);
    return this;
  }

  @Override
  public List<FormSectionDef> getSectionDefs() {
    return sectionDefs;
  }

  public void setSectionDefs(List<FormSectionDef> val) {
    sectionDefs = val;
  }

  public CustomFormSectionDef sectionDefs(List<FormSectionDef> val) {
    setSectionDefs(val);
    return this;
  }
}
