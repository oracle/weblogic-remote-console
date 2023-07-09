// Copyright (c) 2021, 2023, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.schema;

import java.util.List;

import weblogic.remoteconsole.common.utils.Path;

/**
 * This POJO mirrors the yaml source file format for customizing information about
 * a property on a type (i.e. scalar, reference, string), e.g. ServerTemplateMBean/type.yaml
 */
public class BeanPropertyDefCustomizerSource extends BeanFieldDefCustomizerSource {

  public enum Writable {
    defer,
    never,
    always,
    createOnly
  }

  private StringValue onlineName = new StringValue();
  private StringValue offlineName = new StringValue();
  private BooleanValue useUnlocalizedNameAsLabel = new BooleanValue();
  private BooleanValue useUnlocalizedLegalValuesAsLabels = new BooleanValue();
  private Value<UsedIfDefSource> usedIf = new Value<>(null);
  private ListValue<LegalValueDefCustomizerSource> legalValues = new ListValue<>();
  private Value<Writable> writable = new Value<>(Writable.defer);
  private Value<MBeanAttributeDefSource> mbeanAttribute = new Value<>(new MBeanAttributeDefSource());
  private Value<BeanPropertyDefSource> definition = new Value<>(null);
  private BooleanValue supportsModelTokens = new BooleanValue(true);
  private BooleanValue dontReturnIfHiddenColumn = new BooleanValue();

  public void merge(BeanPropertyDefCustomizerSource from, Path fromContainedBeanPath) {
    super.merge(from, fromContainedBeanPath);
    onlineName.merge(from.onlineName, fromContainedBeanPath);
    offlineName.merge(from.offlineName, fromContainedBeanPath);
    useUnlocalizedNameAsLabel.merge(from.useUnlocalizedNameAsLabel, fromContainedBeanPath);
    useUnlocalizedLegalValuesAsLabels.merge(from.useUnlocalizedLegalValuesAsLabels, fromContainedBeanPath);
    legalValues.merge(from.legalValues, fromContainedBeanPath);
    writable.merge(from.writable, fromContainedBeanPath);
    mbeanAttribute.merge(from.mbeanAttribute, fromContainedBeanPath);
    definition.merge(from.definition, fromContainedBeanPath);
    supportsModelTokens.merge(from.supportsModelTokens, fromContainedBeanPath);
    dontReturnIfHiddenColumn.merge(from.dontReturnIfHiddenColumn, fromContainedBeanPath);
    mergeUsedIf(from, fromContainedBeanPath);
  }

  private void mergeUsedIf(BeanPropertyDefCustomizerSource from, Path fromContainedBeanPath) {
    if (from.usedIf.isSpecifiedInYaml()) {
      setUsedIf(new UsedIfDefSource(from.getUsedIf(), fromContainedBeanPath));
    }
  }

  // The name of this property in online WebLogic admin server connections.
  // e.g. listenPort (instead of ListenPort)
  public String getOnlineName() {
    return onlineName.getValue();
  }

  public void setOnlineName(String value) {
    onlineName.setValue(value);
  }

  // The name of this property in offline WLST and in WDT models.
  // e.g. BufferSizeKb (instead of BufferSizeKB)
  public String getOfflineName() {
    return offlineName.getValue();
  }

  public void setOfflineName(String value) {
    offlineName.setValue(value);
  }

  // Whether to use the unlocalized name of the property as its label.
  // This is used on many of the Server debug pages to help the user
  // connect the name of the debug flag with the WebLogic command line args
  // that can be used to turn them on too.
  public boolean isUseUnlocalizedNameAsLabel() {
    return useUnlocalizedNameAsLabel.getValue();
  }

  public void setUseUnlocalizedNameAsLabel(boolean value) {
    useUnlocalizedNameAsLabel.setValue(value);
  }

  // Whether to use the unlocalized value of each legal value as its label.
  public boolean isUseUnlocalizedLegalValuesAsLabels() {
    return useUnlocalizedLegalValuesAsLabels.getValue();
  }

  public void setUseUnlocalizedLegalValuesAsLabels(boolean value) {
    useUnlocalizedLegalValuesAsLabels.setValue(value);
  }

  // When this property should be enabled.
  // If not specified, then this property should always be enabled.
  public UsedIfDefSource getUsedIf() {
    return usedIf.getValue();
  }

  public void setUsedIf(UsedIfDefSource value) {
    usedIf.setValue(value);
  }

  // Custom labels to display for this property's legal values.
  // The property must be a string, boolean, long, or integer.
  public List<LegalValueDefCustomizerSource> getLegalValues() {
    return legalValues.getValue();
  }

  public void setLegalValues(List<LegalValueDefCustomizerSource> value) {
    legalValues.setValue(value);
  }

  public void addLegalValue(LegalValueDefCustomizerSource value) {
    legalValues.add(value);
  }

  // When this property is writable (i.e. never, when the bean is created, or always)
  public Writable getWritable() {
    return writable.getValue();
  }

  public void setWritable(Writable value) {
    writable.setValue(value);
  }

  // Indicates which mbean attribute this property is related to.
  // Typically used for page-specific properties since normal
  // type-specific properties already know which mbean attribute they're related to.
  public MBeanAttributeDefSource getMbeanAttribute() {
    return mbeanAttribute.getValue();
  }

  public void setMbeanAttribute(MBeanAttributeDefSource value) {
    mbeanAttribute.setValue(value);
  }

  // If this property was not configured in type.yaml or extension.yaml,
  // i.e. only exists at the page level, not the bean level,
  // this returns the rest of the information about the property.
  public BeanPropertyDefSource getDefinition() {
    return definition.getValue();
  }

  public void setDefinition(BeanPropertyDefSource value) {
    definition.setValue(value);
  }

  // Whether this property can be set to a model token
  public boolean isSupportsModelTokens() {
    return supportsModelTokens.getValue();
  }

  public void setSupportsModelTokens(boolean val) {
    supportsModelTokens.setValue(val);
  }

  public boolean isSupportsModelTokensSpecifiedInYaml() {
    return supportsModelTokens.isSpecifiedInYaml();
  }

  // Whether this property shouldn't be returned if it's being displayed
  // in a hidden column on the page currently.
  public boolean isDontReturnIfHiddenColumn() {
    return dontReturnIfHiddenColumn.getValue();
  }

  public void setDontReturnIfHiddenColumn(boolean val) {
    dontReturnIfHiddenColumn.setValue(val);
  }
}
