// Copyright (c) 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef;

import java.util.List;

import weblogic.remoteconsole.server.repo.Value;

/**
 * POJO that implements PagePropertyUsedIfDef.
 * 
 * Used for building custom pages.
 */
public class CustomPagePropertyUsedIfDef implements PagePropertyUsedIfDef {
  private CustomUsedIfDef usedIfDef = new CustomUsedIfDef();
  private PagePropertyDef parentPropertyDef;

  public CustomPagePropertyUsedIfDef() {
  }

  public CustomPagePropertyUsedIfDef(PagePropertyUsedIfDef toClone) {
    usedIfDef = new CustomUsedIfDef(toClone);
    setParentPropertyDef(toClone.getParentPropertyDef());
  }

  @Override
  public PagePropertyDef getParentPropertyDef() {
    return parentPropertyDef;
  }

  public void setParentPropertyDef(PagePropertyDef val) {
    parentPropertyDef = val;
  }

  public CustomPagePropertyUsedIfDef parentPropertyDef(PagePropertyDef val) {
    setParentPropertyDef(val);
    return this;
  }

  @Override
  public PagePropertyDef getPropertyDef() {
    return usedIfDef.getPropertyDef();
  }

  public void setPropertyDef(PagePropertyDef val) {
    usedIfDef.setPropertyDef(val);
  }

  public CustomPagePropertyUsedIfDef propertyDef(PagePropertyDef val) {
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

  public CustomPagePropertyUsedIfDef values(List<Value> val) {
    setValues(val);
    return this;
  }
}
