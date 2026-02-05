// Copyright (c) 2021, 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.schema;

import java.util.List;

import weblogic.console.schema.BooleanValue;
import weblogic.console.schema.ListValue;
import weblogic.console.schema.StringValue;
import weblogic.console.schema.Value;
import weblogic.console.schema.beaninfo.BeanPropertyDefSource;
import weblogic.console.utils.Path;

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

  private StringValue onlineName = StringValue.create();
  private StringValue offlineName = StringValue.create();
  private BooleanValue useUnlocalizedNameAsLabel = BooleanValue.create();
  private Value<UsedIfDefSource> usedIf = Value.create();
  private Value<Writable> writable = Value.create(Writable.defer);
  private Value<MBeanAttributeDefSource> mbeanAttribute = Value.create(new MBeanAttributeDefSource());
  private Value<BeanPropertyDefSource> definition = Value.create();
  private BooleanValue supportsModelTokens = BooleanValue.create(true);
  private BooleanValue dontReturnIfHiddenColumn = BooleanValue.create();
  private BooleanValue disableMBeanJavadoc = BooleanValue.create();
  private ListValue<String> requiredCapabilities = ListValue.create();

  public void merge(BeanPropertyDefCustomizerSource from, Path fromContainedBeanPath) {
    super.merge(from, fromContainedBeanPath);
    onlineName = onlineName.merge(from.onlineName, fromContainedBeanPath);
    offlineName = offlineName.merge(from.offlineName, fromContainedBeanPath);
    useUnlocalizedNameAsLabel = useUnlocalizedNameAsLabel.merge(from.useUnlocalizedNameAsLabel, fromContainedBeanPath);
    writable = writable.merge(from.writable, fromContainedBeanPath);
    mbeanAttribute = mbeanAttribute.merge(from.mbeanAttribute, fromContainedBeanPath);
    definition = definition.merge(from.definition, fromContainedBeanPath);
    supportsModelTokens = supportsModelTokens.merge(from.supportsModelTokens, fromContainedBeanPath);
    dontReturnIfHiddenColumn = dontReturnIfHiddenColumn.merge(from.dontReturnIfHiddenColumn, fromContainedBeanPath);
    disableMBeanJavadoc = disableMBeanJavadoc.merge(from.disableMBeanJavadoc, fromContainedBeanPath);
    requiredCapabilities = requiredCapabilities.merge(from.requiredCapabilities, fromContainedBeanPath);
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
    onlineName = onlineName.setValue(value);
  }

  // The name of this property in offline WLST and in WDT models.
  // e.g. BufferSizeKb (instead of BufferSizeKB)
  public String getOfflineName() {
    return offlineName.getValue();
  }

  public void setOfflineName(String value) {
    offlineName = offlineName.setValue(value);
  }

  // Whether to use the unlocalized name of the property as its label.
  // This is used on many of the Server debug pages to help the user
  // connect the name of the debug flag with the WebLogic command line args
  // that can be used to turn them on too.
  public boolean isUseUnlocalizedNameAsLabel() {
    return useUnlocalizedNameAsLabel.getValue();
  }

  public void setUseUnlocalizedNameAsLabel(boolean value) {
    useUnlocalizedNameAsLabel = useUnlocalizedNameAsLabel.setValue(value);
  }

  // When this property should be enabled.
  // If not specified, then this property should always be enabled.
  public UsedIfDefSource getUsedIf() {
    return usedIf.getValue();
  }

  public void setUsedIf(UsedIfDefSource value) {
    usedIf = usedIf.setValue(value);
  }

  // When this property is writable (i.e. never, when the bean is created, or always)
  public Writable getWritable() {
    return writable.getValue();
  }

  public void setWritable(Writable value) {
    writable = writable.setValue(value);
  }

  // Indicates which mbean attribute this property is related to.
  // Typically used for page-specific properties since normal
  // type-specific properties already know which mbean attribute they're related to.
  public MBeanAttributeDefSource getMbeanAttribute() {
    return mbeanAttribute.getValue();
  }

  public void setMbeanAttribute(MBeanAttributeDefSource value) {
    mbeanAttribute = mbeanAttribute.setValue(value);
  }

  // If this property was not configured in type.yaml or extension.yaml,
  // i.e. only exists at the page level, not the bean level,
  // this returns the rest of the information about the property.
  public BeanPropertyDefSource getDefinition() {
    return definition.getValue();
  }

  public void setDefinition(BeanPropertyDefSource value) {
    definition = definition.setValue(value);
  }

  // Whether this property can be set to a model token
  public boolean isSupportsModelTokens() {
    return supportsModelTokens.getValue();
  }

  public void setSupportsModelTokens(boolean val) {
    supportsModelTokens = supportsModelTokens.setValue(val);
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
    dontReturnIfHiddenColumn = dontReturnIfHiddenColumn.setValue(val);
  }

  // Used to turn off this action's javadoc link.
  // Used for properties that are in the REST api but not in the mbean api.
  public boolean isDisableMBeanJavadoc() {
    return disableMBeanJavadoc.getValue();
  }

  public void setDisableMBeanJavadoc(boolean value) {
    disableMBeanJavadoc = disableMBeanJavadoc.setValue(value);
  }

  // The bean repo capabilities that are required for property to be present
  public List<String> getRequiredCapabilities() {
    return requiredCapabilities.getValue();
  }

  public void setRequiredCapabilities(List<String> val) {
    requiredCapabilities = requiredCapabilities.setValue(val);
  }

  @Override
  protected void validateExtension() {
    super.validateExtension();
    validateExtensionChild(getUsedIf(), "usedIf");
    validateExtensionChild(getMbeanAttribute(), "mbeanAttribute");
    validateExtensionChild(getDefinition(), "definition");
  }
}
