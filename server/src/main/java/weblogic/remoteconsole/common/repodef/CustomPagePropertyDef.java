// Copyright (c) 2022, 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import weblogic.console.schema.beaninfo.BeanPropertyDefSource;
import weblogic.console.utils.Path;
import weblogic.console.utils.StringUtils;
import weblogic.remoteconsole.common.repodef.LocalizableString;
import weblogic.remoteconsole.common.repodef.yaml.BeanPropertyDefImpl;
import weblogic.remoteconsole.common.repodef.yaml.HelpHTMLUtils;
import weblogic.remoteconsole.common.repodef.yaml.ValueUtils;
import weblogic.remoteconsole.server.repo.Value;

/**
 * POJO that implements PagePropertyDef.
 * 
 * Used for building custom pages.
 */
public class CustomPagePropertyDef implements PagePropertyDef {
  // Note: CustomPageFieldDef and CustomBeanPropertyDef both include all the
  // fields from BeanFieldDef.  Just uses the ones from CustomPageFieldDef.
  private CustomPageFieldDef pageFieldDef = new CustomPageFieldDef();
  private CustomBeanPropertyDef beanPropertyDef = new CustomBeanPropertyDef();
  private PageDef pageDef;
  private PagePropertyUsedIfDef usedIfDef;
  private PagePropertyExternalHelpDef externalHelpDef;
  private boolean dontReturnIfHiddenColumn;

  public CustomPagePropertyDef() {
  }

  public CustomPagePropertyDef(BeanPropertyDef toClone) {
    pageFieldDef = new CustomPageFieldDef(toClone);
    beanPropertyDef = new CustomBeanPropertyDef(toClone);
    setLabel(
      new LocalizableString(
        StringUtils.camelCaseToUpperCaseWords(toClone.getPropertyName())
      )
    );
    if (toClone instanceof BeanPropertyDefImpl) {
      BeanPropertyDefSource source = ((BeanPropertyDefImpl)toClone).getSource();
      setHelpSummaryHTML(
        new LocalizableString(
          HelpHTMLUtils.getEnglishHelpSummaryHTML(source.getDescriptionHTML(), null, null, null)
        )
      );
      setDetailedHelpHTML(
        new LocalizableString(
          HelpHTMLUtils.getEnglishDetailedHelpHTML(source.getDescriptionHTML(), null, null, null)
        )
      );
      List<LegalValueDef> legalValueDefs = new ArrayList<>();
      for (Object legalValue : source.getLegalValues()) {
        CustomLegalValueDef customLegalValueDef = new CustomLegalValueDef();
        customLegalValueDef.setFieldDef(this);
        Value value = ValueUtils.createValue(legalValue);
        customLegalValueDef.setValue(value);
        customLegalValueDef.setLabel(
          new LocalizableString(
            StringUtils.camelCaseToUpperCaseWords(ValueUtils.getValueAsString(value))
          )
        );
        legalValueDefs.add(customLegalValueDef);
      }
      setLegalValueDefs(legalValueDefs);
    }
  }

  public CustomPagePropertyDef(PagePropertyDef toClone) {
    pageFieldDef = new CustomPageFieldDef(toClone);
    beanPropertyDef = new CustomBeanPropertyDef(toClone);
    setPageDef(toClone.getPageDef());
    setUsedIfDef(toClone.getUsedIfDef());
    setExternalHelpDef(toClone.getExternalHelpDef());
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
  public LocalizableString getHelpSummaryHTML() {
    return pageFieldDef.getHelpSummaryHTML();
  }

  public void setHelpSummaryHTML(LocalizableString val) {
    pageFieldDef.setHelpSummaryHTML(val);
  }

  public CustomPagePropertyDef helpSummaryHTML(LocalizableString val) {
    setHelpSummaryHTML(val);
    return this;
  }

  @Override
  public LocalizableString getDetailedHelpHTML() {
    return pageFieldDef.getDetailedHelpHTML();
  }

  public void setDetailedHelpHTML(LocalizableString val) {
    pageFieldDef.setDetailedHelpHTML(val);
  }

  public CustomPagePropertyDef detailedHelpHTML(LocalizableString val) {
    setDetailedHelpHTML(val);
    return this;
  }

  @Override
  public boolean isSupportsOptions() {
    return pageFieldDef.isSupportsOptions();
  }

  public void setSupportsOptions(boolean val) {
    pageFieldDef.setSupportsOptions(val);
  }

  public CustomPagePropertyDef supportsOptions(boolean val) {
    setSupportsOptions(val);
    return this;
  }

  @Override
  public List<String> getOptionsSources() {
    return pageFieldDef.getOptionsSources();
  }

  public void setOptionsSources(List<String> val) {
    pageFieldDef.setOptionsSources(val);
  }

  public CustomPagePropertyDef optionsSources(List<String> val) {
    setOptionsSources(val);
    return this;
  }

  @Override
  public boolean isAllowNoneOption() {
    return pageFieldDef.isAllowNoneOption();
  }

  public void setAllowNoneOption(boolean val) {
    pageFieldDef.setAllowNoneOption(val);
  }

  public CustomPagePropertyDef allowNoneOption(boolean val) {
    setAllowNoneOption(val);
    return this;
  }

  @Override
  public LocalizableString getLabel() {
    return pageFieldDef.getLabel();
  }

  public void setLabel(LocalizableString val) {
    pageFieldDef.setLabel(val);
  }

  public CustomPagePropertyDef label(LocalizableString val) {
    setLabel(val);
    return this;
  }

  @Override
  public boolean isPageLevelField() {
    return pageFieldDef.isPageLevelField();
  }

  public void setPageLevelField(boolean val) {
    pageFieldDef.setPageLevelField(val);
  }

  public CustomPagePropertyDef pageLevelField(boolean val) {
    setPageLevelField(val);
    return this;
  }

  @Override
  public List<LegalValueDef> getLegalValueDefs() {
    return pageFieldDef.getLegalValueDefs();
  }

  public void setLegalValueDefs(List<LegalValueDef> val) {
    pageFieldDef.setLegalValueDefs(val);
  }

  public CustomPagePropertyDef legalValueDefs(List<LegalValueDef> val) {
    setLegalValueDefs(val);
    return this;
  }

  @Override
  public PageFieldPresentationDef getPresentationDef() {
    return pageFieldDef.getPresentationDef();
  }

  public void setPresentationDef(PageFieldPresentationDef val) {
    pageFieldDef.setPresentationDef(val);
  }

  public CustomPagePropertyDef presentationDef(PageFieldPresentationDef val) {
    setPresentationDef(val);
    return this;
  }

  @Override
  public String getFormFieldName() {
    return pageFieldDef.getFormFieldName();
  }

  public void setFormFieldName(String val) {
    pageFieldDef.setFormFieldName(val);
  }

  public CustomPagePropertyDef formFieldName(String val) {
    setFormFieldName(val);
    return this;
  }

  @Override
  public boolean isRequired() {
    return pageFieldDef.isRequired();
  }

  public void setRequired(boolean val) {
    pageFieldDef.setRequired(val);
  }

  public CustomPagePropertyDef required(boolean val) {
    setRequired(val);
    return this;
  }

  @Override
  public ValueKind getValueKind() {
    return pageFieldDef.getValueKind();
  }

  public void setValueKind(ValueKind val) {
    pageFieldDef.setValueKind(val);
  }

  public CustomPagePropertyDef valueKind(ValueKind val) {
    setValueKind(val);
    return this;
  }

  @Override
  public boolean isArray() {
    return pageFieldDef.isArray();
  }

  public void setArray(boolean val) {
    pageFieldDef.setArray(val);
  }

  public CustomPagePropertyDef array(boolean val) {
    setArray(val);
    return this;
  }

  @Override
  public boolean isOrdered() {
    return pageFieldDef.isOrdered();
  }

  public void setOrdered(boolean val) {
    pageFieldDef.setOrdered(val);
  }

  public CustomPagePropertyDef ordered(boolean val) {
    setOrdered(val);
    return this;
  }

  @Override
  public BeanTypeDef getReferenceTypeDef() {
    return pageFieldDef.getReferenceTypeDef();
  }

  public void setReferenceTypeDef(BeanTypeDef val) {
    pageFieldDef.setReferenceTypeDef(val);
  }

  public CustomPagePropertyDef referenceTypeDef(BeanTypeDef val) {
    setReferenceTypeDef(val);
    return this;
  }

  @Override
  public boolean isReferenceAsReferences() {
    return pageFieldDef.isReferenceAsReferences();
  }

  public void setReferenceAsReferences(boolean val) {
    pageFieldDef.setReferenceAsReferences(val);
  }

  public CustomPagePropertyDef referenceAsReferences(boolean val) {
    setReferenceAsReferences(val);
    return this;
  }

  @Override
  public boolean isDateAsLong() {
    return pageFieldDef.isDateAsLong();
  }

  public void setDateAsLong(boolean val) {
    pageFieldDef.setDateAsLong(val);
  }

  public CustomPagePropertyDef dateAsLong(boolean val) {
    setDateAsLong(val);
    return this;
  }

  @Override
  public boolean isMultiLineString() {
    return pageFieldDef.isMultiLineString();
  }

  public void setMultiLineString(boolean val) {
    pageFieldDef.setMultiLineString(val);
  }

  public CustomPagePropertyDef multiLineString(boolean val) {
    setMultiLineString(val);
    return this;
  }

  @Override
  public boolean isDynamicEnum() {
    return pageFieldDef.isDynamicEnum();
  }

  public void setDynamicEnum(boolean val) {
    pageFieldDef.setDynamicEnum(val);
  }

  public CustomPagePropertyDef dynamicEnum(boolean val) {
    setDynamicEnum(val);
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
}
