// Copyright (c) 2022, 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef;

/**
 * POJO that implements BeanFieldDef.
 * 
 * Used for building custom pages.
 */
public class CustomBeanFieldDef implements BeanFieldDef {
  private CustomBeanValueDef valueDef = new CustomBeanValueDef();
  private String formFieldName;
  private boolean required;

  public CustomBeanFieldDef() {
  }

  public CustomBeanFieldDef(BeanFieldDef toClone) {
    valueDef = new CustomBeanValueDef(toClone);
    setFormFieldName(toClone.getFormFieldName());
    setRequired(toClone.isRequired());
  }

  @Override
  public String getFormFieldName() {
    return formFieldName;
  }

  public void setFormFieldName(String val) {
    formFieldName = val;
  }

  public CustomBeanFieldDef formFieldName(String val) {
    setFormFieldName(val);
    return this;
  }

  @Override
  public boolean isRequired() {
    return required;
  }

  public void setRequired(boolean val) {
    required = val;
  }

  public CustomBeanFieldDef required(boolean val) {
    setRequired(val);
    return this;
  }

  @Override
  public ValueKind getValueKind() {
    return valueDef.getValueKind();
  }

  public void setValueKind(ValueKind val) {
    valueDef.setValueKind(val);
  }

  public CustomBeanFieldDef valueKind(ValueKind val) {
    setValueKind(val);
    return this;
  }

  @Override
  public boolean isArray() {
    return valueDef.isArray();
  }

  public void setArray(boolean val) {
    valueDef.setArray(val);
  }

  public CustomBeanFieldDef array(boolean val) {
    setArray(val);
    return this;
  }

  @Override
  public boolean isOrdered() {
    return valueDef.isOrdered();
  }

  public void setOrdered(boolean val) {
    valueDef.setOrdered(val);
  }

  public CustomBeanFieldDef ordered(boolean val) {
    setOrdered(val);
    return this;
  }

  @Override
  public BeanTypeDef getReferenceTypeDef() {
    return valueDef.getReferenceTypeDef();
  }

  public void setReferenceTypeDef(BeanTypeDef val) {
    valueDef.setReferenceTypeDef(val);
  }

  public CustomBeanFieldDef referenceTypeDef(BeanTypeDef val) {
    setReferenceTypeDef(val);
    return this;
  }

  @Override
  public boolean isReferenceAsReferences() {
    return valueDef.isReferenceAsReferences();
  }

  public void setReferenceAsReferences(boolean val) {
    valueDef.setReferenceAsReferences(val);
  }

  public CustomBeanFieldDef referenceAsReferences(boolean val) {
    setReferenceAsReferences(val);
    return this;
  }

  @Override
  public boolean isDateAsLong() {
    return valueDef.isDateAsLong();
  }

  public void setDateAsLong(boolean val) {
    valueDef.setDateAsLong(val);
  }

  public CustomBeanFieldDef dateAsLong(boolean val) {
    setDateAsLong(val);
    return this;
  }

  @Override
  public boolean isMultiLineString() {
    return valueDef.isMultiLineString();
  }

  public void setMultiLineString(boolean val) {
    valueDef.setMultiLineString(val);
  }

  public CustomBeanFieldDef multiLineString(boolean val) {
    setMultiLineString(val);
    return this;
  }

  @Override
  public boolean isDynamicEnum() {
    return valueDef.isDynamicEnum();
  }

  public void setDynamicEnum(boolean val) {
    valueDef.setDynamicEnum(val);
  }

  public CustomBeanFieldDef dynamicEnum(boolean val) {
    setDynamicEnum(val);
    return this;
  }
}
