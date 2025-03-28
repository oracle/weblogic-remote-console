// Copyright (c) 2022, 2024, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef;

/**
 * POJO used to help build implementations of interfaces that extend BeanValueDef.
 * 
 * Used for building custom pages.
 */
class CustomBeanValueDef {
  private BeanValueDef.ValueKind kind;
  private boolean array;
  private boolean ordered;
  private BeanTypeDef referenceTypeDef;
  private boolean referenceAsReferences;
  private boolean dateAsLong;
  private boolean multiLineString;
  private boolean dynamicEnum;

  public CustomBeanValueDef() {
  }

  public CustomBeanValueDef(BeanValueDef toClone) {
    setValueKind(toClone.getValueKind());
    setArray(toClone.isArray());
    setOrdered(toClone.isOrdered());
    setReferenceTypeDef(toClone.getReferenceTypeDef());
    setReferenceAsReferences(toClone.isReferenceAsReferences());
    setDateAsLong(toClone.isDateAsLong());
    setMultiLineString(toClone.isMultiLineString());
    setDynamicEnum(toClone.isDynamicEnum());
  }

  BeanValueDef.ValueKind getValueKind() {
    return kind;
  }

  void setValueKind(BeanValueDef.ValueKind val) {
    kind = val;
  }

  boolean isArray() {
    return array;
  }

  void setArray(boolean val) {
    array = val;
  }

  boolean isOrdered() {
    return ordered;
  }

  void setOrdered(boolean val) {
    ordered = val;
  }

  BeanTypeDef getReferenceTypeDef() {
    return referenceTypeDef;
  }

  void setReferenceTypeDef(BeanTypeDef val) {
    referenceTypeDef = val;
  }

  boolean isReferenceAsReferences() {
    return referenceAsReferences;
  }

  void setReferenceAsReferences(boolean val) {
    referenceAsReferences = val;
  }

  boolean isDateAsLong() {
    return dateAsLong;
  }

  void setDateAsLong(boolean val) {
    dateAsLong = val;
  }

  boolean isMultiLineString() {
    return multiLineString;
  }

  void setMultiLineString(boolean val) {
    multiLineString = val;
  }

  boolean isDynamicEnum() {
    return dynamicEnum;
  }

  void setDynamicEnum(boolean val) {
    dynamicEnum = val;
  }
}
