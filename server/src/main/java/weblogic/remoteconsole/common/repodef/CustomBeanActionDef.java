// Copyright (c) 2023, 2024, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import weblogic.remoteconsole.common.utils.ListUtils;
import weblogic.remoteconsole.common.utils.Path;
import weblogic.remoteconsole.common.utils.WebLogicRoles;

/**
 * POJO that implements BeanActionDef.
 * 
 * Used for building custom pages.
 */
public class CustomBeanActionDef implements BeanActionDef {
  private CustomBeanValueDef valueDef = new CustomBeanValueDef();
  private BeanTypeDef typeDef;
  private String actionName;
  private String remoteActionName;
  private Path parentPath = new Path();
  private boolean asynchronous;
  private Set<String> invokeRoles = WebLogicRoles.ADMIN_ROLES;
  private List<BeanActionParamDef> paramDefs = new ArrayList<>();
  private String impact;

  public CustomBeanActionDef() {
  }

  public CustomBeanActionDef(BeanActionDef toClone) {
    valueDef = new CustomBeanValueDef(toClone);
    setTypeDef(toClone.getTypeDef());
    setActionName(toClone.getActionName());
    setRemoteActionName(toClone.getRemoteActionName());
    setParentPath(toClone.getParentPath());
    setAsynchronous(toClone.isAsynchronous());
    setInvokeRoles(new HashSet<>(toClone.getInvokeRoles()));
    getParamDefs().addAll(ListUtils.nonNull(toClone.getParamDefs()));
    setImpact(toClone.getImpact());
  }

  @Override
  public BeanTypeDef getTypeDef() {
    return typeDef;
  }

  public void setTypeDef(BeanTypeDef val) {
    typeDef = val;
  }

  public CustomBeanActionDef typeDef(BeanTypeDef val) {
    setTypeDef(val);
    return this;
  }

  @Override
  public String getActionName() {
    return actionName;
  }

  public void setActionName(String val) {
    actionName = val;
  }

  public CustomBeanActionDef actionName(String val) {
    setActionName(val);
    return this;
  }

  @Override
  public String getRemoteActionName() {
    return (remoteActionName != null) ? remoteActionName : getActionPath().getUnderscoreSeparatedPath();
  }

  public void setRemoteActionName(String val) {
    remoteActionName = val;
  }

  public CustomBeanActionDef remoteActionName(String val) {
    setRemoteActionName(val);
    return this;
  }

  @Override
  public Path getParentPath() {
    return parentPath;
  }

  public void setParentPath(Path val) {
    parentPath = val;
  }

  public CustomBeanActionDef parentPath(Path val) {
    setParentPath(val);
    return this;
  }

  @Override
  public boolean isAsynchronous() {
    return asynchronous;
  }

  public void setAsynchronous(boolean val) {
    asynchronous = val;
  }

  public CustomBeanActionDef asynchronous(boolean val) {
    setAsynchronous(val);
    return this;
  }

  @Override
  public Set<String> getInvokeRoles() {
    return invokeRoles;
  }

  public void setInvokeRoles(Set<String> val) {
    invokeRoles = val;
  }

  public CustomBeanActionDef invokeRoles(Set<String> val) {
    setInvokeRoles(val);
    return this;
  }

  @Override
  public List<BeanActionParamDef> getParamDefs() {
    return paramDefs;
  }

  public void setParamDefs(List<BeanActionParamDef> val) {
    paramDefs = val;
  }

  public CustomBeanActionDef paramDefs(List<BeanActionParamDef> val) {
    setParamDefs(val);
    return this;
  }

  @Override
  public ValueKind getValueKind() {
    return valueDef.getValueKind();
  }

  public void setValueKind(ValueKind val) {
    valueDef.setValueKind(val);
  }

  public CustomBeanActionDef valueKind(ValueKind val) {
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

  public CustomBeanActionDef array(boolean val) {
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

  public CustomBeanActionDef ordered(boolean val) {
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

  public CustomBeanActionDef referenceTypeDef(BeanTypeDef val) {
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

  public CustomBeanActionDef referenceAsReferences(boolean val) {
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

  public CustomBeanActionDef dateAsLong(boolean val) {
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

  public CustomBeanActionDef multiLineString(boolean val) {
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

  public CustomBeanActionDef dynamicEnum(boolean val) {
    setDynamicEnum(val);
    return this;
  }

  @Override
  public String getImpact() {
    return impact;
  }

  public void setImpact(String val) {
    impact = val;
  }

  public CustomBeanActionDef impact(String val) {
    setImpact(val);
    return this;
  }
}
