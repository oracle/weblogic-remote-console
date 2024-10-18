// Copyright (c) 2023, 2024, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import weblogic.remoteconsole.common.utils.ListUtils;
import weblogic.remoteconsole.common.utils.Path;

/**
 * POJO that implements PageActionDef.
 * 
 * Used for building custom pages.
 */

public class CustomPageActionDef implements PageActionDef {
  private CustomBeanActionDef beanActionDef = new CustomBeanActionDef();
  private PageDef pageDef;
  private LocalizableString label;
  private LocalizableString helpLabel;
  private LocalizableString successMessage;
  private LocalizableString failureMessage;
  private String actionMethod;
  private LocalizableString helpSummaryHTML;
  private LocalizableString detailedHelpHTML;
  private PageActionExternalHelpDef externalHelpDef;
  private boolean pageLevelAction;
  private List<PageActionDef> actionDefs = new ArrayList<>();
  private String rows;
  private ActionInputFormDef inputFormDef;
  private PageActionPollingDef pollingDef;
  private String impact;

  public CustomPageActionDef() {
  }

  public CustomPageActionDef(PageActionDef toClone) {
    beanActionDef = new CustomBeanActionDef(toClone);
    setPageDef(toClone.getPageDef());
    setLabel(toClone.getLabel());
    setHelpLabel(toClone.getHelpLabel());
    setSuccessMessage(toClone.getSuccessMessage());
    setFailureMessage(toClone.getFailureMessage());
    setActionMethod(toClone.getActionMethod());
    setHelpSummaryHTML(toClone.getHelpSummaryHTML());
    setDetailedHelpHTML(toClone.getDetailedHelpHTML());
    setExternalHelpDef(toClone.getExternalHelpDef());
    setPageLevelAction(toClone.isPageLevelAction());
    getActionDefs().addAll(ListUtils.nonNull(toClone.getActionDefs()));
    setRows(toClone.getRows());
    setInputFormDef(toClone.getInputFormDef());
    setPollingDef(toClone.getPollingDef());
  }

  @Override
  public PageDef getPageDef() {
    return pageDef;
  }

  public void setPageDef(PageDef val) {
    pageDef = val;

  }

  public CustomPageActionDef pageDef(PageDef val) {
    setPageDef(val);
    return this;
  }

  @Override
  public LocalizableString getLabel() {
    return label;
  }

  public void setLabel(LocalizableString val) {
    label = val;
  }

  public CustomPageActionDef label(LocalizableString val) {
    setLabel(val);
    return this;
  }

  @Override
  public LocalizableString getHelpLabel() {
    return helpLabel;
  }

  public void setHelpLabel(LocalizableString val) {
    helpLabel = val;
  }

  public CustomPageActionDef helpLabel(LocalizableString val) {
    setHelpLabel(val);
    return this;
  }

  @Override
  public LocalizableString getSuccessMessage() {
    return successMessage;
  }

  public void setSuccessMessage(LocalizableString val) {
    successMessage = val;
  }

  public CustomPageActionDef successMessage(LocalizableString val) {
    setSuccessMessage(val);
    return this;
  }

  @Override
  public LocalizableString getFailureMessage() {
    return failureMessage;
  }

  public void setFailureMessage(LocalizableString val) {
    failureMessage = val;
  }

  public CustomPageActionDef failureMessage(LocalizableString val) {
    setFailureMessage(val);
    return this;
  }

  @Override
  public String getActionMethod() {
    return actionMethod;
  }

  public void setActionMethod(String val) {
    actionMethod = val;
  }

  public CustomPageActionDef actionMethod(String val) {
    setActionMethod(val);
    return this;
  }

  @Override
  public LocalizableString getHelpSummaryHTML() {
    return helpSummaryHTML;
  }

  public void setHelpSummaryHTML(LocalizableString val) {
    helpSummaryHTML = val;
  }

  public CustomPageActionDef helpSummaryHTML(LocalizableString val) {
    setHelpSummaryHTML(val);
    return this;
  }

  @Override
  public LocalizableString getDetailedHelpHTML() {
    return detailedHelpHTML;
  }

  public void setDetailedHelpHTML(LocalizableString val) {
    detailedHelpHTML = val;
  }

  public CustomPageActionDef detailedHelpHTML(LocalizableString val) {
    setDetailedHelpHTML(val);
    return this;
  }

  @Override
  public PageActionExternalHelpDef getExternalHelpDef() {
    return externalHelpDef;
  }

  public void setExternalHelpDef(PageActionExternalHelpDef val) {
    externalHelpDef = val;
  }

  public CustomPageActionDef externalHelpDef(PageActionExternalHelpDef val) {
    setExternalHelpDef(val);
    return this;
  }

  @Override
  public boolean isPageLevelAction() {
    return pageLevelAction;
  }

  public void setPageLevelAction(boolean val) {
    pageLevelAction = val;
  }

  public CustomPageActionDef pageLevelAction(boolean val) {
    setPageLevelAction(val);
    return this;
  }

  @Override
  public List<PageActionDef> getActionDefs() {
    return actionDefs;
  }

  public void setActionDefs(List<PageActionDef> val) {
    actionDefs = val;
  }

  public CustomPageActionDef actionDefs(List<PageActionDef> val) {
    setActionDefs(val);
    return this;
  }

  @Override
  public String getRows() {
    return rows;
  }

  public void setRows(String val) {
    rows = val;
  }

  public CustomPageActionDef rows(String val) {
    setRows(val);
    return this;
  }

  @Override
  public PageActionPollingDef getPollingDef() {
    return pollingDef;
  }

  public void setPollingDef(PageActionPollingDef val) {
    pollingDef = val;
  }

  public CustomPageActionDef pollingDef(PageActionPollingDef val) {
    setPollingDef(val);
    return this;
  }

  @Override
  public ActionInputFormDef getInputFormDef() {
    return inputFormDef;
  }

  public void setInputFormDef(ActionInputFormDef val) {
    inputFormDef = val;
  }

  public CustomPageActionDef inputFormDef(ActionInputFormDef val) {
    setInputFormDef(val);
    return this;
  }

  @Override
  public BeanTypeDef getTypeDef() {
    return beanActionDef.getTypeDef();
  }

  public void setTypeDef(BeanTypeDef val) {
    beanActionDef.setTypeDef(val);
  }

  public CustomPageActionDef typeDef(BeanTypeDef val) {
    setTypeDef(val);
    return this;
  }

  @Override
  public String getActionName() {
    return beanActionDef.getActionName();
  }

  public void setActionName(String val) {
    beanActionDef.setActionName(val);
  }

  public CustomPageActionDef actionName(String val) {
    setActionName(val);
    return this;
  }

  @Override
  public String getRemoteActionName() {
    return beanActionDef.getRemoteActionName();
  }

  public void setRemoteActionName(String val) {
    beanActionDef.setRemoteActionName(val);
  }

  public CustomPageActionDef remoteActionName(String val) {
    setRemoteActionName(val);
    return this;
  }

  @Override
  public Path getParentPath() {
    return beanActionDef.getParentPath();
  }

  public void setParentPath(Path val) {
    beanActionDef.setParentPath(val);
  }

  public CustomPageActionDef parentPath(Path val) {
    setParentPath(val);
    return this;
  }

  @Override
  public boolean isAsynchronous() {
    return beanActionDef.isAsynchronous();
  }

  public void setAsynchronous(boolean val) {
    beanActionDef.setAsynchronous(val);
  }

  public CustomPageActionDef asynchronous(boolean val) {
    setAsynchronous(val);
    return this;
  }

  @Override
  public Set<String> getInvokeRoles() {
    return beanActionDef.getInvokeRoles();
  }

  public void setInvokeRoles(Set<String> val) {
    beanActionDef.setInvokeRoles(val);
  }

  public CustomPageActionDef invokeRoles(Set<String> val) {
    setInvokeRoles(val);
    return this;
  }

  @Override
  public List<BeanActionParamDef> getParamDefs() {
    return beanActionDef.getParamDefs();
  }

  public void setParamDefs(List<BeanActionParamDef> val) {
    beanActionDef.setParamDefs(val);
  }

  public CustomPageActionDef paramDefs(List<BeanActionParamDef> val) {
    setParamDefs(val);
    return this;
  }

  @Override
  public ValueKind getValueKind() {
    return beanActionDef.getValueKind();
  }

  public void setValueKind(ValueKind val) {
    beanActionDef.setValueKind(val);
  }

  public CustomPageActionDef valueKind(ValueKind val) {
    setValueKind(val);
    return this;
  }

  @Override
  public boolean isArray() {
    return beanActionDef.isArray();
  }

  public void setArray(boolean val) {
    beanActionDef.setArray(val);
  }

  public CustomPageActionDef array(boolean val) {
    setArray(val);
    return this;
  }

  @Override
  public boolean isOrdered() {
    return beanActionDef.isOrdered();
  }

  public void setOrdered(boolean val) {
    beanActionDef.setOrdered(val);
  }

  public CustomPageActionDef ordered(boolean val) {
    setOrdered(val);
    return this;
  }

  @Override
  public BeanTypeDef getReferenceTypeDef() {
    return beanActionDef.getReferenceTypeDef();
  }

  public void setReferenceTypeDef(BeanTypeDef val) {
    beanActionDef.setReferenceTypeDef(val);
  }

  public CustomPageActionDef referenceTypeDef(BeanTypeDef val) {
    setReferenceTypeDef(val);
    return this;
  }

  @Override
  public boolean isReferenceAsReferences() {
    return beanActionDef.isReferenceAsReferences();
  }

  public void setReferenceAsReferences(boolean val) {
    beanActionDef.setReferenceAsReferences(val);
  }

  public CustomPageActionDef referenceAsReferences(boolean val) {
    setReferenceAsReferences(val);
    return this;
  }

  @Override
  public boolean isDateAsLong() {
    return beanActionDef.isDateAsLong();
  }

  public void setDateAsLong(boolean val) {
    beanActionDef.setDateAsLong(val);
  }

  public CustomPageActionDef dateAsLong(boolean val) {
    setDateAsLong(val);
    return this;
  }

  @Override
  public boolean isMultiLineString() {
    return beanActionDef.isMultiLineString();
  }

  public void setMultiLineString(boolean val) {
    beanActionDef.setMultiLineString(val);
  }

  public CustomPageActionDef multiLineString(boolean val) {
    setMultiLineString(val);
    return this;
  }

  @Override
  public boolean isDynamicEnum() {
    return beanActionDef.isDynamicEnum();
  }

  public void setDynamicEnum(boolean val) {
    beanActionDef.setDynamicEnum(val);
  }

  public CustomPageActionDef dynamicEnum(boolean val) {
    setDynamicEnum(val);
    return this;
  }

  @Override
  public String getImpact() {
    return beanActionDef.getImpact();
  }

  public void setImpact(String val) {
    beanActionDef.setImpact(val);
  }

  public CustomPageActionDef impact(String val) {
    setImpact(val);
    return this;
  }
}
