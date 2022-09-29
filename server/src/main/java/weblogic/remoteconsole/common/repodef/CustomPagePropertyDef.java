// Copyright (c) 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import weblogic.remoteconsole.common.utils.Path;
import weblogic.remoteconsole.server.repo.Value;

/**
 * POJO that implements PagePropertyDef.
 * 
 * Used for building custom pages.
 */
public class CustomPagePropertyDef implements PagePropertyDef {
  private CustomBeanPropertyDef beanPropertyDef = new CustomBeanPropertyDef();
  private PageDef pageDef;
  private LocalizableString helpSummaryHTML;
  private LocalizableString detailedHelpHTML;
  private List<LegalValueDef> legalValueDefs = new ArrayList<>();
  private boolean supportsOptions;
  private List<String> optionsSources = new ArrayList<>();
  private boolean allowNoneOption;
  private LocalizableString label;
  private PagePropertyUsedIfDef usedIfDef;
  private PagePropertyPresentationDef presentationDef;
  private PagePropertyExternalHelpDef externalHelpDef;
  private boolean pageLevelProperty;
  private boolean dontReturnIfHiddenColumn;

  public CustomPagePropertyDef() {
  }

  public CustomPagePropertyDef(PagePropertyDef toClone) {
    beanPropertyDef = new CustomBeanPropertyDef(toClone);
    setPageDef(toClone.getPageDef());
    setHelpSummaryHTML(toClone.getHelpSummaryHTML());
    setDetailedHelpHTML(toClone.getDetailedHelpHTML());
    setLegalValueDefs(toClone.getLegalValueDefs());
    setSupportsOptions(toClone.isSupportsOptions());
    setOptionsSources(toClone.getOptionsSources());
    setAllowNoneOption(toClone.isAllowNoneOption());
    setLabel(toClone.getLabel());
    setUsedIfDef(toClone.getUsedIfDef());
    setPresentationDef(toClone.getPresentationDef());
    setExternalHelpDef(toClone.getExternalHelpDef());
    setPageLevelProperty(toClone.isPageLevelProperty());
    setDontReturnIfHiddenColumn(toClone.isDontReturnIfHiddenColumn());
  }

  @Override
  public PageDef getPageDef() {
    return pageDef;
  }

  public void setPageDef(PageDef val) {
    pageDef = val;

  }

  public CustomPagePropertyDef pageDef(PageDef val) {
    setPageDef(val);
    return this;
  }

  @Override
  public LocalizableString getHelpSummaryHTML() {
    return helpSummaryHTML;
  }

  public void setHelpSummaryHTML(LocalizableString val) {
    helpSummaryHTML = val;
  }

  public CustomPagePropertyDef helpSummaryHTML(LocalizableString val) {
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

  public CustomPagePropertyDef detailedHelpHTML(LocalizableString val) {
    setDetailedHelpHTML(val);
    return this;
  }

  @Override
  public List<LegalValueDef> getLegalValueDefs() {
    return legalValueDefs;
  }

  public void setLegalValueDefs(List<LegalValueDef> val) {
    legalValueDefs = val;
  }

  public CustomPagePropertyDef legalValueDefs(List<LegalValueDef> val) {
    setLegalValueDefs(val);
    return this;
  }

  @Override
  public boolean isSupportsOptions() {
    return supportsOptions;
  }

  public void setSupportsOptions(boolean val) {
    supportsOptions = val;
  }

  public CustomPagePropertyDef supportsOptions(boolean val) {
    setSupportsOptions(val);
    return this;
  }

  @Override
  public List<String> getOptionsSources() {
    return optionsSources;
  }

  public void setOptionsSources(List<String> val) {
    optionsSources = val;
  }

  public CustomPagePropertyDef optionsSources(List<String> val) {
    setOptionsSources(val);
    return this;
  }

  @Override
  public boolean isAllowNoneOption() {
    return allowNoneOption;
  }

  public void setAllowNoneOption(boolean val) {
    allowNoneOption = val;
  }

  public CustomPagePropertyDef allowNoneOption(boolean val) {
    setAllowNoneOption(val);
    return this;
  }

  @Override
  public LocalizableString getLabel() {
    return label;
  }

  public void setLabel(LocalizableString val) {
    label = val;
  }

  public CustomPagePropertyDef label(LocalizableString val) {
    setLabel(val);
    return this;
  }

  @Override
  public PagePropertyUsedIfDef getUsedIfDef() {
    return usedIfDef;
  }

  public void setUsedIfDef(PagePropertyUsedIfDef val) {
    usedIfDef = val;
  }

  public CustomPagePropertyDef usedIfDef(PagePropertyUsedIfDef val) {
    setUsedIfDef(val);
    return this;
  }

  @Override
  public PagePropertyPresentationDef getPresentationDef() {
    return presentationDef;
  }

  public void setPresentationDef(PagePropertyPresentationDef val) {
    presentationDef = val;
  }

  public CustomPagePropertyDef presentationDef(PagePropertyPresentationDef val) {
    setPresentationDef(val);
    return this;
  }

  @Override
  public PagePropertyExternalHelpDef getExternalHelpDef() {
    return externalHelpDef;
  }

  public void setExternalHelpDef(PagePropertyExternalHelpDef val) {
    externalHelpDef = val;
  }

  public CustomPagePropertyDef externalHelpDef(PagePropertyExternalHelpDef val) {
    setExternalHelpDef(val);
    return this;
  }

  @Override
  public boolean isPageLevelProperty() {
    return pageLevelProperty;
  }

  public void setPageLevelProperty(boolean val) {
    pageLevelProperty = val;
  }

  public CustomPagePropertyDef pageLevelProperty(boolean val) {
    setPageLevelProperty(val);
    return this;
  }

  @Override
  public boolean isDontReturnIfHiddenColumn() {
    return dontReturnIfHiddenColumn;
  }

  public void setDontReturnIfHiddenColumn(boolean val) {
    dontReturnIfHiddenColumn = val;
  }

  public CustomPagePropertyDef dontReturnIfHiddenColumn(boolean val) {
    setDontReturnIfHiddenColumn(val);
    return this;
  }

  @Override
  public BeanTypeDef getTypeDef() {
    return beanPropertyDef.getTypeDef();
  }

  public void setTypeDef(BeanTypeDef val) {
    beanPropertyDef.setTypeDef(val);
  }

  public CustomPagePropertyDef typeDef(BeanTypeDef val) {
    setTypeDef(val);
    return this;
  }

  @Override
  public String getPropertyName() {
    return beanPropertyDef.getPropertyName();
  }

  public void setPropertyName(String val) {
    beanPropertyDef.setPropertyName(val);
  }

  public CustomPagePropertyDef propertyName(String val) {
    setPropertyName(val);
    return this;
  }

  @Override
  public String getFormPropertyName() {
    return beanPropertyDef.getFormPropertyName();
  }

  public void setFormPropertyName(String val) {
    beanPropertyDef.setFormPropertyName(val);
  }

  public CustomPagePropertyDef formPropertyName(String val) {
    setFormPropertyName(val);
    return this;
  }

  @Override
  public String getOnlinePropertyName() {
    return beanPropertyDef.getOnlinePropertyName();
  }

  public void setOnlinePropertyName(String val) {
    beanPropertyDef.setOnlinePropertyName(val);
  }

  public CustomPagePropertyDef onlinePropertyName(String val) {
    setOnlinePropertyName(val);
    return this;
  }

  @Override
  public String getOfflinePropertyName() {
    return beanPropertyDef.getOfflinePropertyName();
  }

  public void setOfflinePropertyName(String val) {
    beanPropertyDef.setOfflinePropertyName(val);
  }

  public CustomPagePropertyDef offlinePropertyName(String val) {
    setOfflinePropertyName(val);
    return this;
  }

  @Override
  public Path getParentPath() {
    return beanPropertyDef.getParentPath();
  }

  public void setParentPath(Path val) {
    beanPropertyDef.setParentPath(val);
  }

  public CustomPagePropertyDef parentPath(Path val) {
    setParentPath(val);
    return this;
  }

  @Override
  public boolean isOrdered() {
    return beanPropertyDef.isOrdered();
  }

  public void setOrdered(boolean val) {
    beanPropertyDef.setOrdered(val);
  }

  public CustomPagePropertyDef ordered(boolean val) {
    setOrdered(val);
    return this;
  }

  @Override
  public boolean isKey() {
    return beanPropertyDef.isKey();
  }

  public void setKey(boolean val) {
    beanPropertyDef.setKey(val);
  }

  public CustomPagePropertyDef key(boolean val) {
    setKey(val);
    return this;
  }

  @Override
  public boolean isCreateWritable() {
    return beanPropertyDef.isCreateWritable();
  }

  public void setCreateWritable(boolean val) {
    beanPropertyDef.setCreateWritable(val);
  }

  public CustomPagePropertyDef createWritable(boolean val) {
    setCreateWritable(val);
    return this;
  }

  @Override
  public boolean isUpdateWritable() {
    return beanPropertyDef.isUpdateWritable();
  }

  public void setUpdateWritable(boolean val) {
    beanPropertyDef.setUpdateWritable(val);
  }

  public CustomPagePropertyDef updateWritable(boolean val) {
    setUpdateWritable(val);
    return this;
  }

  public void setWritable(boolean val) {
    beanPropertyDef.setWritable(val);
  }

  public CustomPagePropertyDef writable(boolean val) {
    setWritable(val);
    return this;
  }

  @Override
  public boolean isRequired() {
    return beanPropertyDef.isRequired();
  }

  public void setRequired(boolean val) {
    beanPropertyDef.setRequired(val);
  }

  public CustomPagePropertyDef required(boolean val) {
    setRequired(val);
    return this;
  }

  @Override
  public GetPropertyValueCustomizerDef getGetValueCustomizerDef() {
    return beanPropertyDef.getGetValueCustomizerDef();
  }

  public void setGetValueCustomizerDef(GetPropertyValueCustomizerDef val) {
    beanPropertyDef.setGetValueCustomizerDef(val);
  }

  public CustomPagePropertyDef getValueCustomizerDef(GetPropertyValueCustomizerDef val) {
    setGetValueCustomizerDef(val);
    return this;
  }

  @Override
  public GetPropertyOptionsCustomizerDef getGetOptionsCustomizerDef() {
    return beanPropertyDef.getGetOptionsCustomizerDef();
  }

  public void setGetOptionsCustomizerDef(GetPropertyOptionsCustomizerDef val) {
    beanPropertyDef.setGetOptionsCustomizerDef(val);
  }

  public CustomPagePropertyDef getOptionsCustomizerDef(GetPropertyOptionsCustomizerDef val) {
    setGetOptionsCustomizerDef(val);
    return this;
  }

  @Override
  public boolean isRestartNeeded() {
    return beanPropertyDef.isRestartNeeded();
  }

  public void setRestartNeeded(boolean val) {
    beanPropertyDef.setRestartNeeded(val);
  }

  public CustomPagePropertyDef restartNeeded(boolean val) {
    setRestartNeeded(val);
    return this;
  }

  @Override
  public boolean isSupportsModelTokens() {
    return beanPropertyDef.isSupportsModelTokens();
  }

  public void setSupportsModelTokens(boolean val) {
    beanPropertyDef.setSupportsModelTokens(val);
  }

  public CustomPagePropertyDef supportsModelTokens(boolean val) {
    setSupportsModelTokens(val);
    return this;
  }

  @Override
  public boolean isSupportsUnresolvedReferences() {
    return beanPropertyDef.isSupportsUnresolvedReferences();
  }

  public void setSupportsUnresolvedReferences(boolean val) {
    beanPropertyDef.setSupportsUnresolvedReferences(val);
  }

  public CustomPagePropertyDef supportsUnresolvedReferences(boolean val) {
    setSupportsUnresolvedReferences(val);
    return this;
  }

  @Override
  public Value getSecureDefaultValue() {
    return beanPropertyDef.getSecureDefaultValue();
  }

  public void setSecureDefaultValue(Value val) {
    beanPropertyDef.setSecureDefaultValue(val);
  }

  public CustomPagePropertyDef secureDefaultValue(Value val) {
    setSecureDefaultValue(val);
    return this;
  }

  @Override
  public Value getProductionDefaultValue() {
    return beanPropertyDef.getProductionDefaultValue();
  }

  public void setProductionDefaultValue(Value val) {
    beanPropertyDef.setProductionDefaultValue(val);
  }

  public CustomPagePropertyDef productionDefaultValue(Value val) {
    setProductionDefaultValue(val);
    return this;
  }

  @Override
  public Value getStandardDefaultValue() {
    return beanPropertyDef.getStandardDefaultValue();
  }

  public void setStandardDefaultValue(Value val) {
    beanPropertyDef.setStandardDefaultValue(val);
  }

  public CustomPagePropertyDef standardDefaultValue(Value val) {
    setStandardDefaultValue(val);
    return this;
  }

  @Override
  public Set<String> getGetRoles() {
    return beanPropertyDef.getGetRoles();
  }

  public void setGetRoles(Set<String> val) {
    beanPropertyDef.setGetRoles(val);
  }

  public CustomPagePropertyDef getRoles(Set<String> val) {
    setGetRoles(val);
    return this;
  }

  @Override
  public Set<String> getSetRoles() {
    return beanPropertyDef.getSetRoles();
  }

  public void setSetRoles(Set<String> val) {
    beanPropertyDef.setSetRoles(val);
  }

  public CustomPagePropertyDef setRoles(Set<String> val) {
    setSetRoles(val);
    return this;
  }

  @Override
  public ValueKind getValueKind() {
    return beanPropertyDef.getValueKind();
  }

  public void setValueKind(ValueKind val) {
    beanPropertyDef.setValueKind(val);
  }

  public CustomPagePropertyDef valueKind(ValueKind val) {
    setValueKind(val);
    return this;
  }

  @Override
  public boolean isArray() {
    return beanPropertyDef.isArray();
  }

  public void setArray(boolean val) {
    beanPropertyDef.setArray(val);
  }

  public CustomPagePropertyDef array(boolean val) {
    setArray(val);
    return this;
  }

  @Override
  public BeanTypeDef getReferenceTypeDef() {
    return beanPropertyDef.getReferenceTypeDef();
  }

  public void setReferenceTypeDef(BeanTypeDef val) {
    beanPropertyDef.setReferenceTypeDef(val);
  }

  public CustomPagePropertyDef referenceTypeDef(BeanTypeDef val) {
    setReferenceTypeDef(val);
    return this;
  }

  @Override
  public boolean isReferenceAsReferences() {
    return beanPropertyDef.isReferenceAsReferences();
  }

  public void setReferenceAsReferences(boolean val) {
    beanPropertyDef.setReferenceAsReferences(val);
  }

  public CustomPagePropertyDef referenceAsReferences(boolean val) {
    setReferenceAsReferences(val);
    return this;
  }

  @Override
  public boolean isDateAsLong() {
    return beanPropertyDef.isDateAsLong();
  }

  public void setDateAsLong(boolean val) {
    beanPropertyDef.setDateAsLong(val);
  }

  public CustomPagePropertyDef dateAsLong(boolean val) {
    setDateAsLong(val);
    return this;
  }
}
