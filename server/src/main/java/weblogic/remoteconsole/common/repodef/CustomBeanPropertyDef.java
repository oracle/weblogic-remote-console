// Copyright (c) 2022, 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef;

import java.util.HashSet;
import java.util.Set;

import weblogic.console.utils.Path;
import weblogic.console.utils.StringUtils;
import weblogic.remoteconsole.common.utils.WebLogicRoles;
import weblogic.remoteconsole.server.repo.Value;

/**
 * POJO that implements BeanPropertyDef.
 * 
 * Used for building custom pages.
 */
public class CustomBeanPropertyDef implements BeanPropertyDef {
  private CustomBeanFieldDef fieldDef = new CustomBeanFieldDef();
  private BeanTypeDef typeDef;
  private String propertyName;
  private String onlinePropertyName;
  private String offlinePropertyName;
  private Path parentPath = new Path();
  private boolean key;
  private boolean createWritable;
  private boolean updateWritable;
  private GetPropertyValueCustomizerDef getValueCustomizerDef;
  private GetPropertyOptionsCustomizerDef getOptionsCustomizerDef;
  private boolean restartNeeded;
  private boolean supportsModelTokens;
  private boolean supportsUnresolvedReferences;
  private Value secureDefaultValue;
  private Value productionDefaultValue;
  private Value standardDefaultValue;
  private Set<String> getRoles = WebLogicRoles.ALL;
  private Set<String> setRoles = WebLogicRoles.ADMIN_ROLES;

  public CustomBeanPropertyDef() {
  }

  public CustomBeanPropertyDef(BeanPropertyDef toClone) {
    fieldDef = new CustomBeanFieldDef(toClone);
    setTypeDef(toClone.getTypeDef());
    setPropertyName(toClone.getPropertyName());
    setOnlinePropertyName(toClone.getOnlinePropertyName());
    setOfflinePropertyName(toClone.getOfflinePropertyName());
    setParentPath(toClone.getParentPath());
    setKey(toClone.isKey());
    setCreateWritable(toClone.isCreateWritable());
    setUpdateWritable(toClone.isUpdateWritable());
    setGetValueCustomizerDef(toClone.getGetValueCustomizerDef());
    setGetOptionsCustomizerDef(toClone.getGetOptionsCustomizerDef());
    setRestartNeeded(toClone.isRestartNeeded());
    setSupportsModelTokens(toClone.isSupportsModelTokens());
    setSupportsUnresolvedReferences(toClone.isSupportsUnresolvedReferences());
    setSecureDefaultValue(toClone.getSecureDefaultValue());
    setProductionDefaultValue(toClone.getProductionDefaultValue());
    setStandardDefaultValue(toClone.getStandardDefaultValue());
    setGetRoles(new HashSet<>(toClone.getGetRoles()));
    setSetRoles(new HashSet<>(toClone.getSetRoles()));
  }

  @Override
  public BeanTypeDef getTypeDef() {
    return typeDef;
  }

  public void setTypeDef(BeanTypeDef val) {
    typeDef = val;
  }

  public CustomBeanPropertyDef typeDef(BeanTypeDef val) {
    setTypeDef(val);
    return this;
  }

  @Override
  public String getPropertyName() {
    return propertyName;
  }

  public void setPropertyName(String val) {
    propertyName = val;
  }

  public CustomBeanPropertyDef propertyName(String val) {
    setPropertyName(val);
    return this;
  }

  @Override
  public String getOnlinePropertyName() {
    return (onlinePropertyName != null) ? onlinePropertyName : StringUtils.getRestName(getPropertyName());
  }

  public void setOnlinePropertyName(String val) {
    onlinePropertyName = val;
  }

  public CustomBeanPropertyDef onlinePropertyName(String val) {
    setOnlinePropertyName(val);
    return this;
  }

  @Override
  public String getOfflinePropertyName() {
    if (offlinePropertyName != null) {
      return offlinePropertyName;
    }
    if (isArray()) {
      return StringUtils.getSingular(getPropertyName());
    } 
    return getPropertyName();
  }

  public void setOfflinePropertyName(String val) {
    offlinePropertyName = val;
  }

  public CustomBeanPropertyDef offlinePropertyName(String val) {
    setOfflinePropertyName(val);
    return this;
  }

  @Override
  public Path getParentPath() {
    return parentPath;
  }

  public void setParentPath(Path val) {
    parentPath = val;
  }

  public CustomBeanPropertyDef parentPath(Path val) {
    setParentPath(val);
    return this;
  }

  @Override
  public boolean isKey() {
    return key;
  }

  public void setKey(boolean val) {
    key = val;
  }

  public CustomBeanPropertyDef key(boolean val) {
    setKey(val);
    return this;
  }

  @Override
  public boolean isCreateWritable() {
    return createWritable;
  }

  public void setCreateWritable(boolean val) {
    createWritable = val;
  }

  public CustomBeanPropertyDef createWritable(boolean val) {
    setCreateWritable(val);
    return this;
  }

  @Override
  public boolean isUpdateWritable() {
    return updateWritable;
  }

  public void setUpdateWritable(boolean val) {
    updateWritable = val;
  }

  public CustomBeanPropertyDef updateWritable(boolean val) {
    setUpdateWritable(val);
    return this;
  }

  public void setWritable(boolean val) {
    setCreateWritable(val);
    setUpdateWritable(val);
  }

  public CustomBeanPropertyDef writable(boolean val) {
    setWritable(val);
    return this;
  }

  @Override
  public GetPropertyValueCustomizerDef getGetValueCustomizerDef() {
    return getValueCustomizerDef;
  }

  public void setGetValueCustomizerDef(GetPropertyValueCustomizerDef val) {
    getValueCustomizerDef = val;
  }

  public CustomBeanPropertyDef getValueCustomizerDef(GetPropertyValueCustomizerDef val) {
    setGetValueCustomizerDef(val);
    return this;
  }

  @Override
  public GetPropertyOptionsCustomizerDef getGetOptionsCustomizerDef() {
    return getOptionsCustomizerDef;
  }

  public void setGetOptionsCustomizerDef(GetPropertyOptionsCustomizerDef val) {
    getOptionsCustomizerDef = val;
  }

  public CustomBeanPropertyDef getOptionsCustomizerDef(GetPropertyOptionsCustomizerDef val) {
    setGetOptionsCustomizerDef(val);
    return this;
  }

  @Override
  public boolean isRestartNeeded() {
    return restartNeeded;
  }

  public void setRestartNeeded(boolean val) {
    restartNeeded = val;
  }

  public CustomBeanPropertyDef restartNeeded(boolean val) {
    setRestartNeeded(val);
    return this;
  }

  @Override
  public boolean isSupportsModelTokens() {
    return supportsModelTokens;
  }

  public void setSupportsModelTokens(boolean val) {
    supportsModelTokens = val;
  }

  public CustomBeanPropertyDef supportsModelTokens(boolean val) {
    setSupportsModelTokens(val);
    return this;
  }

  @Override
  public boolean isSupportsUnresolvedReferences() {
    return supportsUnresolvedReferences;
  }

  public void setSupportsUnresolvedReferences(boolean val) {
    supportsUnresolvedReferences = val;
  }

  public CustomBeanPropertyDef supportsUnresolvedReferences(boolean val) {
    setSupportsUnresolvedReferences(val);
    return this;
  }

  @Override
  public Value getSecureDefaultValue() {
    return secureDefaultValue;
  }

  public void setSecureDefaultValue(Value val) {
    secureDefaultValue = val;
  }

  public CustomBeanPropertyDef secureDefaultValue(Value val) {
    setSecureDefaultValue(val);
    return this;
  }

  @Override
  public Value getProductionDefaultValue() {
    return productionDefaultValue;
  }

  public void setProductionDefaultValue(Value val) {
    productionDefaultValue = val;
  }

  public CustomBeanPropertyDef productionDefaultValue(Value val) {
    setProductionDefaultValue(val);
    return this;
  }

  @Override
  public Value getStandardDefaultValue() {
    return standardDefaultValue;
  }

  public void setStandardDefaultValue(Value val) {
    standardDefaultValue = val;
  }

  public CustomBeanPropertyDef standardDefaultValue(Value val) {
    setStandardDefaultValue(val);
    return this;
  }

  @Override
  public Set<String> getGetRoles() {
    return getRoles;
  }

  public void setGetRoles(Set<String> val) {
    getRoles = val;
  }

  public CustomBeanPropertyDef getRoles(Set<String> val) {
    setGetRoles(val);
    return this;
  }

  @Override
  public Set<String> getSetRoles() {
    return setRoles;
  }

  public void setSetRoles(Set<String> val) {
    setRoles = val;
  }

  public CustomBeanPropertyDef setRoles(Set<String> val) {
    setSetRoles(val);
    return this;
  }

  @Override
  public String getFormFieldName() {
    String formFieldName = fieldDef.getFormFieldName();
    return (formFieldName != null) ? formFieldName : getPropertyPath().getUnderscoreSeparatedPath();
  }

  public void setFormFieldName(String val) {
    fieldDef.setFormFieldName(val);
  }

  public CustomBeanPropertyDef formFieldName(String val) {
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

  public CustomBeanPropertyDef required(boolean val) {
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

  public CustomBeanPropertyDef valueKind(ValueKind val) {
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

  public CustomBeanPropertyDef array(boolean val) {
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

  public CustomBeanPropertyDef ordered(boolean val) {
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

  public CustomBeanPropertyDef referenceTypeDef(BeanTypeDef val) {
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

  public CustomBeanPropertyDef referenceAsReferences(boolean val) {
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

  public CustomBeanPropertyDef dateAsLong(boolean val) {
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

  public CustomBeanPropertyDef multiLineString(boolean val) {
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

  public CustomBeanPropertyDef dynamicEnum(boolean val) {
    setDynamicEnum(val);
    return this;
  }
}
