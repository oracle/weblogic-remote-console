// Copyright (c) 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef;

import weblogic.console.utils.StringUtils;
import weblogic.remoteconsole.server.repo.Value;

/**
 * POJO that implements BeanActionParamDef.
 * 
 * Used for building custom pages.
 */
public class CustomBeanActionParamDef implements BeanActionParamDef {
  private CustomBeanFieldDef fieldDef = new CustomBeanFieldDef();
  private BeanActionDef actionDef;
  private String paramName;
  private String onlineParamName;
  private Value defaultValue;

  public CustomBeanActionParamDef() {
  }

  public CustomBeanActionParamDef(BeanActionParamDef toClone) {
    fieldDef = new CustomBeanFieldDef(toClone);
    setActionDef(toClone.getActionDef());
    setParamName(toClone.getParamName());
    setOnlineParamName(toClone.getOnlineParamName());
    setDefaultValue(toClone.getDefaultValue());
  }

  @Override
  public BeanActionDef getActionDef() {
    return actionDef;
  }

  public void setActionDef(BeanActionDef val) {
    actionDef = val;
  }

  public CustomBeanActionParamDef actionDef(BeanActionDef val) {
    setActionDef(val);
    return this;
  }

  @Override
  public String getParamName() {
    return paramName;
  }

  public void setParamName(String val) {
    paramName = val;
  }

  public CustomBeanActionParamDef paramName(String val) {
    setParamName(val);
    return this;
  }

  @Override
  public String getOnlineParamName() {
    return (onlineParamName != null) ? onlineParamName : StringUtils.getRestName(getParamName());
  }

  public void setOnlineParamName(String val) {
    onlineParamName = val;
  }

  public CustomBeanActionParamDef onlineParamName(String val) {
    setOnlineParamName(val);
    return this;
  }

  @Override
  public Value getDefaultValue() {
    return defaultValue;
  }

  public void setDefaultValue(Value val) {
    defaultValue = val;
  }

  public CustomBeanActionParamDef defaultValue(Value val) {
    setDefaultValue(val);
    return this;
  }

  @Override
  public String getFormFieldName() {
    String formFieldName = fieldDef.getFormFieldName();
    return (formFieldName != null) ? formFieldName : getParamName();
  }

  public void setFormFieldName(String val) {
    fieldDef.setFormFieldName(val);
  }

  public CustomBeanActionParamDef formFieldName(String val) {
    setFormFieldName(val);
    return this;
  }

  @Override
  public boolean isRequired() {
    return fieldDef.isRequired();
  }

  public void setRequired(boolean val) {
    fieldDef.setRequired(val);
  }

  public CustomBeanActionParamDef required(boolean val) {
    setRequired(val);
    return this;
  }

  @Override
  public ValueKind getValueKind() {
    return fieldDef.getValueKind();
  }

  public void setValueKind(ValueKind val) {
    fieldDef.setValueKind(val);
  }

  public CustomBeanActionParamDef valueKind(ValueKind val) {
    setValueKind(val);
    return this;
  }

  @Override
  public boolean isArray() {
    return fieldDef.isArray();
  }

  public void setArray(boolean val) {
    fieldDef.setArray(val);
  }

  public CustomBeanActionParamDef array(boolean val) {
    setArray(val);
    return this;
  }

  @Override
  public boolean isOrdered() {
    return fieldDef.isOrdered();
  }

  public void setOrdered(boolean val) {
    fieldDef.setOrdered(val);
  }

  public CustomBeanActionParamDef ordered(boolean val) {
    setOrdered(val);
    return this;
  }

  @Override
  public BeanTypeDef getReferenceTypeDef() {
    return fieldDef.getReferenceTypeDef();
  }

  public void setReferenceTypeDef(BeanTypeDef val) {
    fieldDef.setReferenceTypeDef(val);
  }

  public CustomBeanActionParamDef referenceTypeDef(BeanTypeDef val) {
    setReferenceTypeDef(val);
    return this;
  }

  @Override
  public boolean isReferenceAsReferences() {
    return fieldDef.isReferenceAsReferences();
  }

  public void setReferenceAsReferences(boolean val) {
    fieldDef.setReferenceAsReferences(val);
  }

  public CustomBeanActionParamDef referenceAsReferences(boolean val) {
    setReferenceAsReferences(val);
    return this;
  }

  @Override
  public boolean isDateAsLong() {
    return fieldDef.isDateAsLong();
  }

  public void setDateAsLong(boolean val) {
    fieldDef.setDateAsLong(val);
  }

  public CustomBeanActionParamDef dateAsLong(boolean val) {
    setDateAsLong(val);
    return this;
  }

  @Override
  public boolean isMultiLineString() {
    return fieldDef.isMultiLineString();
  }

  public void setMultiLineString(boolean val) {
    fieldDef.setMultiLineString(val);
  }

  public CustomBeanActionParamDef multiLineString(boolean val) {
    setMultiLineString(val);
    return this;
  }

  @Override
  public boolean isDynamicEnum() {
    return fieldDef.isDynamicEnum();
  }

  public void setDynamicEnum(boolean val) {
    fieldDef.setDynamicEnum(val);
  }

  public CustomBeanActionParamDef dynamicEnum(boolean val) {
    setDynamicEnum(val);
    return this;
  }
}
