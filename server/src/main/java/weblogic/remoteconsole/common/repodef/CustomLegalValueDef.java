// Copyright (c) 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef;

import weblogic.remoteconsole.server.repo.Value;

/**
 * POJO that implements LegalValueDef.
 * 
 * Used for building custom pages.
 */
public class CustomLegalValueDef implements LegalValueDef {
  private PageFieldDef fieldDef;
  private Value value;
  private LocalizableString label;

  public CustomLegalValueDef() {
  }

  public CustomLegalValueDef(LegalValueDef toClone) {
    setFieldDef(toClone.getFieldDef());
    setValue(toClone.getValue());
    setLabel(toClone.getLabel());
  }

  @Override
  public PageFieldDef getFieldDef() {
    return fieldDef;
  }

  public void setFieldDef(PageFieldDef val) {
    fieldDef = val;
  }

  public CustomLegalValueDef fieldDef(PageFieldDef val) {
    setFieldDef(val);
    return this;
  }

  @Override
  public Value getValue() {
    return value;
  }

  public void setValue(Value val) {
    value = val;
  }

  public CustomLegalValueDef value(Value val) {
    setValue(val);
    return this;
  }

  @Override
  public LocalizableString getLabel() {
    return label;
  }

  public void setLabel(LocalizableString val) {
    label = val;
  }

  public CustomLegalValueDef label(LocalizableString val) {
    setLabel(val);
    return this;
  }
}
