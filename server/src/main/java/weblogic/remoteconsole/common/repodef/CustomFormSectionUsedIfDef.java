// Copyright (c) 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef;

import java.util.List;

import weblogic.remoteconsole.server.repo.Value;

/**
 * POJO that implements FormSectionUsedIfDef.
 * 
 * Used for building custom pages.
 */
public class CustomFormSectionUsedIfDef implements FormSectionUsedIfDef {
  private CustomUsedIfDef usedIfDef = new CustomUsedIfDef();
  private FormSectionDef formSectionDef;

  public CustomFormSectionUsedIfDef() {
  }

  public CustomFormSectionUsedIfDef(FormSectionUsedIfDef toClone) {
    usedIfDef = new CustomUsedIfDef(toClone);
    setFormSectionDef(toClone.getFormSectionDef());
  }

  @Override
  public FormSectionDef getFormSectionDef() {
    return formSectionDef;
  }

  public void setFormSectionDef(FormSectionDef val) {
    formSectionDef = val;
  }

  public CustomFormSectionUsedIfDef formSectionDef(FormSectionDef val) {
    setFormSectionDef(val);
    return this;
  }

  @Override
  public PagePropertyDef getPropertyDef() {
    return usedIfDef.getPropertyDef();
  }

  public void setPropertyDef(PagePropertyDef val) {
    usedIfDef.setPropertyDef(val);
  }

  public CustomFormSectionUsedIfDef propertyDef(PagePropertyDef val) {
    setPropertyDef(val);
    return this;
  }

  @Override
  public List<Value> getValues() {
    return usedIfDef.getValues();
  }

  public void setValues(List<Value> val) {
    usedIfDef.setValues(val);
  }

  public CustomFormSectionUsedIfDef values(List<Value> val) {
    setValues(val);
    return this;
  }
}
