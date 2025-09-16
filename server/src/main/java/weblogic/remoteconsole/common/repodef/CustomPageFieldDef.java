// Copyright (c) 2022, 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef;

import java.util.ArrayList;
import java.util.List;

import weblogic.remoteconsole.common.repodef.LocalizableString;
import weblogic.remoteconsole.common.utils.ListUtils;

/**
 * POJO that implements PageFieldDef.
 * 
 * Used for building custom pages.
 */
public class CustomPageFieldDef implements PageFieldDef {
  private CustomBeanFieldDef beanFieldDef = new CustomBeanFieldDef();
  private LocalizableString helpSummaryHTML;
  private LocalizableString detailedHelpHTML;
  private boolean supportsOptions;
  private List<String> optionsSources = new ArrayList<>();
  private boolean allowNoneOption;
  private LocalizableString label;
  private boolean pageLevelField;
  private List<LegalValueDef> legalValueDefs = new ArrayList<>();
  private PageFieldPresentationDef presentationDef;

  public CustomPageFieldDef() {
  }

  public CustomPageFieldDef(BeanFieldDef toClone) {
    beanFieldDef = new CustomBeanFieldDef(toClone);
  }

  public CustomPageFieldDef(PageFieldDef toClone) {
    beanFieldDef = new CustomBeanFieldDef(toClone);
    setHelpSummaryHTML(toClone.getHelpSummaryHTML());
    setDetailedHelpHTML(toClone.getDetailedHelpHTML());
    getLegalValueDefs().addAll(ListUtils.nonNull(toClone.getLegalValueDefs()));
    setSupportsOptions(toClone.isSupportsOptions());
    getOptionsSources().addAll(ListUtils.nonNull(toClone.getOptionsSources()));
    setAllowNoneOption(toClone.isAllowNoneOption());
    setLabel(toClone.getLabel());
    setPresentationDef(toClone.getPresentationDef());
    setPageLevelField(toClone.isPageLevelField());
  }

  @Override
  public LocalizableString getHelpSummaryHTML() {
    return helpSummaryHTML;
  }

  public void setHelpSummaryHTML(LocalizableString val) {
    helpSummaryHTML = val;
  }

  public CustomPageFieldDef helpSummaryHTML(LocalizableString val) {
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

  public CustomPageFieldDef detailedHelpHTML(LocalizableString val) {
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

  public CustomPageFieldDef legalValueDefs(List<LegalValueDef> val) {
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

  public CustomPageFieldDef supportsOptions(boolean val) {
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

  public CustomPageFieldDef optionsSources(List<String> val) {
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

  public CustomPageFieldDef allowNoneOption(boolean val) {
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

  public CustomPageFieldDef label(LocalizableString val) {
    setLabel(val);
    return this;
  }

  @Override
  public PageFieldPresentationDef getPresentationDef() {
    return presentationDef;
  }

  public void setPresentationDef(PageFieldPresentationDef val) {
    presentationDef = val;
  }

  public CustomPageFieldDef presentationDef(PageFieldPresentationDef val) {
    setPresentationDef(val);
    return this;
  }

  @Override
  public boolean isPageLevelField() {
    return pageLevelField;
  }

  public void setPageLevelField(boolean val) {
    pageLevelField = val;
  }

  public CustomPageFieldDef pageLevelField(boolean val) {
    setPageLevelField(val);
    return this;
  }

  @Override
  public String getFormFieldName() {
    return beanFieldDef.getFormFieldName();
  }

  public void setFormFieldName(String val) {
    beanFieldDef.setFormFieldName(val);
  }

  public CustomPageFieldDef formFieldName(String val) {
    setFormFieldName(val);
    return this;
  }

  @Override
  public boolean isRequired() {
    return beanFieldDef.isRequired();
  }

  public void setRequired(boolean val) {
    beanFieldDef.setRequired(val);
  }

  public CustomPageFieldDef required(boolean val) {
    setRequired(val);
    return this;
  }

  @Override
  public ValueKind getValueKind() {
    return beanFieldDef.getValueKind();
  }

  public void setValueKind(ValueKind val) {
    beanFieldDef.setValueKind(val);
  }

  public CustomPageFieldDef valueKind(ValueKind val) {
    setValueKind(val);
    return this;
  }

  @Override
  public boolean isArray() {
    return beanFieldDef.isArray();
  }

  public void setArray(boolean val) {
    beanFieldDef.setArray(val);
  }

  public CustomPageFieldDef array(boolean val) {
    setArray(val);
    return this;
  }

  @Override
  public boolean isOrdered() {
    return beanFieldDef.isOrdered();
  }

  public void setOrdered(boolean val) {
    beanFieldDef.setOrdered(val);
  }

  public CustomPageFieldDef ordered(boolean val) {
    setOrdered(val);
    return this;
  }

  @Override
  public BeanTypeDef getReferenceTypeDef() {
    return beanFieldDef.getReferenceTypeDef();
  }

  public void setReferenceTypeDef(BeanTypeDef val) {
    beanFieldDef.setReferenceTypeDef(val);
  }

  public CustomPageFieldDef referenceTypeDef(BeanTypeDef val) {
    setReferenceTypeDef(val);
    return this;
  }

  @Override
  public boolean isReferenceAsReferences() {
    return beanFieldDef.isReferenceAsReferences();
  }

  public void setReferenceAsReferences(boolean val) {
    beanFieldDef.setReferenceAsReferences(val);
  }

  public CustomPageFieldDef referenceAsReferences(boolean val) {
    setReferenceAsReferences(val);
    return this;
  }

  @Override
  public boolean isDateAsLong() {
    return beanFieldDef.isDateAsLong();
  }

  public void setDateAsLong(boolean val) {
    beanFieldDef.setDateAsLong(val);
  }

  public CustomPageFieldDef dateAsLong(boolean val) {
    setDateAsLong(val);
    return this;
  }

  @Override
  public boolean isMultiLineString() {
    return beanFieldDef.isMultiLineString();
  }

  public void setMultiLineString(boolean val) {
    beanFieldDef.setMultiLineString(val);
  }

  public CustomPageFieldDef multiLineString(boolean val) {
    setMultiLineString(val);
    return this;
  }

  @Override
  public boolean isDynamicEnum() {
    return beanFieldDef.isDynamicEnum();
  }

  public void setDynamicEnum(boolean val) {
    beanFieldDef.setDynamicEnum(val);
  }

  public CustomPageFieldDef dynamicEnum(boolean val) {
    setDynamicEnum(val);
    return this;
  }
}
