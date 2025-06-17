// Copyright (c) 2022, 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef;

import java.util.ArrayList;
import java.util.List;

import weblogic.console.schema.beaninfo.BeanActionParamDefSource;
import weblogic.console.utils.StringUtils;
import weblogic.remoteconsole.common.repodef.LocalizableString;
import weblogic.remoteconsole.common.repodef.yaml.BeanActionParamDefImpl;
import weblogic.remoteconsole.common.repodef.yaml.HelpHTMLUtils;
import weblogic.remoteconsole.common.repodef.yaml.ValueUtils;
import weblogic.remoteconsole.server.repo.Value;

/**
 * POJO that implements PageActionParamDef.
 * 
 * Used for building custom pages.
 */
public class CustomPageActionParamDef implements PageActionParamDef {
  // Note: CustomPageFieldDef and CustomBeanActionParamDef both include all the
  // fields from BeanFieldDef.  Just uses the ones from CustomPageFieldDef
  // (except for FormFieldName - CustomBeanActionParamDef has the correct defaulting)
  private CustomPageFieldDef pageFieldDef = new CustomPageFieldDef();
  private CustomBeanActionParamDef beanActionParamDef = new CustomBeanActionParamDef();
  private ActionInputFormDef inputFormDef = new CustomActionInputFormDef();
  private boolean readOnly = false;

  public CustomPageActionParamDef() {
  }

  public CustomPageActionParamDef(BeanActionParamDef toClone) {
    pageFieldDef = new CustomPageFieldDef(toClone);
    beanActionParamDef = new CustomBeanActionParamDef(toClone);
    setLabel(
      new LocalizableString(
        StringUtils.camelCaseToUpperCaseWords(toClone.getParamName())
      )
    );
    if (toClone instanceof PageActionParamDef) {
      setReadOnly(((PageActionParamDef)toClone).isReadOnly());
    }
    if (toClone instanceof BeanActionParamDefImpl) {
      BeanActionParamDefSource source = ((BeanActionParamDefImpl)toClone).getSource();
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

  public CustomPageActionParamDef(PageActionParamDef toClone) {
    pageFieldDef = new CustomPageFieldDef(toClone);
    beanActionParamDef = new CustomBeanActionParamDef(toClone);
    setInputFormDef(toClone.getInputFormDef());
  }

  @Override
  public boolean isReadOnly() {
    return readOnly;
  }

  public void setReadOnly(boolean val) {
    readOnly = val;
  }

  public CustomPageActionParamDef readOnly(boolean val) {
    setReadOnly(val);
    return this;
  }

  @Override
  public ActionInputFormDef getInputFormDef() {
    return inputFormDef;
  }

  public void setInputFormDef(ActionInputFormDef val) {
    inputFormDef = val;
  }

  public CustomPageActionParamDef inputFormDef(ActionInputFormDef val) {
    setInputFormDef(val);
    return this;
  }

  @Override
  public LocalizableString getHelpSummaryHTML() {
    return pageFieldDef.getHelpSummaryHTML();
  }

  public void setHelpSummaryHTML(LocalizableString val) {
    pageFieldDef.setHelpSummaryHTML(val);
  }

  public CustomPageActionParamDef helpSummaryHTML(LocalizableString val) {
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

  public CustomPageActionParamDef detailedHelpHTML(LocalizableString val) {
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

  public CustomPageActionParamDef supportsOptions(boolean val) {
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

  public CustomPageActionParamDef optionsSources(List<String> val) {
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

  public CustomPageActionParamDef allowNoneOption(boolean val) {
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

  public CustomPageActionParamDef label(LocalizableString val) {
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

  public CustomPageActionParamDef pageLevelField(boolean val) {
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

  public CustomPageActionParamDef legalValueDefs(List<LegalValueDef> val) {
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

  public CustomPageActionParamDef presentationDef(PageFieldPresentationDef val) {
    setPresentationDef(val);
    return this;
  }

  public CustomPageActionParamDef formFieldName(String val) {
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

  public CustomPageActionParamDef required(boolean val) {
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

  public CustomPageActionParamDef valueKind(ValueKind val) {
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

  public CustomPageActionParamDef array(boolean val) {
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

  public CustomPageActionParamDef ordered(boolean val) {
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

  public CustomPageActionParamDef referenceTypeDef(BeanTypeDef val) {
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

  public CustomPageActionParamDef referenceAsReferences(boolean val) {
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

  public CustomPageActionParamDef dateAsLong(boolean val) {
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

  public CustomPageActionParamDef multiLineString(boolean val) {
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

  public CustomPageActionParamDef dynamicEnum(boolean val) {
    setDynamicEnum(val);
    return this;
  }






  @Override
  public BeanActionDef getActionDef() {
    return beanActionParamDef.getActionDef();
  }

  public void setActionDef(BeanActionDef val) {
    beanActionParamDef.setActionDef(val);
  }

  public CustomPageActionParamDef actionDef(BeanActionDef val) {
    setActionDef(val);
    return this;
  }

  @Override
  public String getParamName() {
    return beanActionParamDef.getParamName();
  }

  public void setParamName(String val) {
    beanActionParamDef.setParamName(val);
  }

  public CustomPageActionParamDef paramName(String val) {
    setParamName(val);
    return this;
  }

  @Override
  public String getOnlineParamName() {
    return beanActionParamDef.getOnlineParamName();
  }

  public void setOnlineParamName(String val) {
    beanActionParamDef.setOnlineParamName(val);
  }

  public CustomPageActionParamDef onlineParamName(String val) {
    setOnlineParamName(val);
    return this;
  }

  @Override
  public String getFormFieldName() {
    return beanActionParamDef.getFormFieldName();
  }

  public void setFormFieldName(String val) {
    beanActionParamDef.setFormFieldName(val);
  }

  @Override
  public Value getDefaultValue() {
    return beanActionParamDef.getDefaultValue();
  }

  public void setDefaultValue(Value val) {
    beanActionParamDef.setDefaultValue(val);
  }

  public CustomPageActionParamDef defaultValue(Value val) {
    setDefaultValue(val);
    return this;
  }
}
