// Copyright (c) 2021, 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.schema;

import java.util.List;

import weblogic.remoteconsole.common.utils.Path;

/**
 * This POJO mirrors the yaml source file format for customizing information about
 * a property on a type (i.e. scalar, reference, string), e.g. ServerTemplateMBean/type.yaml
 */
public class BeanPropertyDefCustomizerSource extends BeanValueDefCustomizerSource {

  public enum Writable {
    defer,
    never,
    always,
    createOnly
  }

  private StringValue name = new StringValue();
  private StringValue formName = new StringValue();
  private StringValue onlineName = new StringValue();
  private StringValue offlineName = new StringValue();
  private BooleanValue useUnlocalizedNameAsLabel = new BooleanValue();
  private BooleanValue useUnlocalizedLegalValuesAsLabels = new BooleanValue();
  private StringValue label = new StringValue();
  private StringValue helpSummaryHTML = new StringValue();
  private StringValue helpDetailsHTML = new StringValue();
  private StringValue helpHTML = new StringValue();
  private Value<UsedIfDefSource> usedIf = new Value<>(null);
  private BooleanValue required = new BooleanValue();
  private BooleanValue ordered = new BooleanValue();
  private ListValue<LegalValueDefCustomizerSource> legalValues = new ListValue<>();
  private ListValue<String> optionsSources = new ListValue<>();
  private BooleanValue allowNullReference = new BooleanValue();
  private Value<Writable> writable = new Value<>(Writable.defer);
  private StringValue getMethod = new StringValue();
  private StringValue optionsMethod = new StringValue();
  private Value<BeanPropertyPresentationDefSource> presentation = new Value<>(new BeanPropertyPresentationDefSource());
  private Value<MBeanAttributeDefSource> mbeanAttribute = new Value<>(new MBeanAttributeDefSource());
  private Value<BeanPropertyDefSource> definition = new Value<>(null);
  private BooleanValue supportsModelTokens = new BooleanValue(true);
  private BooleanValue dontReturnIfHiddenColumn = new BooleanValue();

  public void merge(BeanPropertyDefCustomizerSource from, Path fromContainedBeanPath) {
    // don't merge name - it's fixed by whoever created this instance
    super.merge(from, fromContainedBeanPath);
    formName.merge(from.formName, fromContainedBeanPath);
    onlineName.merge(from.onlineName, fromContainedBeanPath);
    offlineName.merge(from.offlineName, fromContainedBeanPath);
    useUnlocalizedNameAsLabel.merge(from.useUnlocalizedNameAsLabel, fromContainedBeanPath);
    useUnlocalizedLegalValuesAsLabels.merge(from.useUnlocalizedLegalValuesAsLabels, fromContainedBeanPath);
    label.merge(from.label, fromContainedBeanPath);
    required.merge(from.required, fromContainedBeanPath);
    ordered.merge(from.ordered, fromContainedBeanPath);
    legalValues.merge(from.legalValues, fromContainedBeanPath);
    optionsSources.merge(from.optionsSources, fromContainedBeanPath);
    allowNullReference.merge(from.allowNullReference, fromContainedBeanPath);
    writable.merge(from.writable, fromContainedBeanPath);
    getMethod.merge(from.getMethod, fromContainedBeanPath);
    optionsMethod.merge(from.optionsMethod, fromContainedBeanPath);
    presentation.merge(from.presentation, fromContainedBeanPath);
    mbeanAttribute.merge(from.mbeanAttribute, fromContainedBeanPath);
    definition.merge(from.definition, fromContainedBeanPath);
    supportsModelTokens.merge(from.supportsModelTokens, fromContainedBeanPath);
    dontReturnIfHiddenColumn.merge(from.dontReturnIfHiddenColumn, fromContainedBeanPath);
    mergeHelp(from, fromContainedBeanPath);
    mergeUsedIf(from, fromContainedBeanPath);
  }

  private void mergeHelp(BeanPropertyDefCustomizerSource from, Path fromContainedBeanPath) {
    // If helpSummaryHTML, helpDetailsHTMK or helpHTML are set on from, copy over
    // all of them since the overall help computation needs them all.
    // i.e. if a yaml file says anything about help, it's totally replacing
    // everything help related.
    if (from.helpHTML.isSpecifiedInYaml()
        || from.helpSummaryHTML.isSpecifiedInYaml()
        || from.helpDetailsHTML.isSpecifiedInYaml()
    ) {
      helpSummaryHTML.copyFrom(from.helpSummaryHTML, fromContainedBeanPath);
      helpDetailsHTML.copyFrom(from.helpDetailsHTML, fromContainedBeanPath);
      helpHTML.copyFrom(from.helpHTML, fromContainedBeanPath);
    }
  }

  private void mergeUsedIf(BeanPropertyDefCustomizerSource from, Path fromContainedBeanPath) {
    if (from.usedIf.isSpecifiedInYaml()) {
      setUsedIf(new UsedIfDefSource(from.getUsedIf(), fromContainedBeanPath));
    }
  }

  // The path from the page-relative bean type to this property,
  // e.g. if the top level bean is a ServerMBean and this is the ListenPort property on
  // the SSL mbean, then the 'name' is "SSL.ListenPort".
  public String getName() {
    return name.getValue();
  }

  public void setName(String value) {
    name.setValue(value);
  }

  // The name of this property in the form for the HTTP api for a page
  // Normally the property's name is used as the name in the form.
  // formName is used for the few cases where the name on the form needs
  // to be different than the name in the bean repo.
  public String getFormName() {
    return formName.getValue();
  }

  public void setFormName(String value) {
    formName.setValue(value);
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

  // The english name to display for this property.
  public String getLabel() {
    return label.getValue();
  }

  public void setLabel(String value) {
    label.setValue(value);
  }

  // The help summary for this property.
  // If not specified and HelpHTML isn't specified, then
  // the first sentence of the harvested javadoc is used.
  // If not specified and HelpHTML is specified, then
  // HelpHTML is used.
  // It is illegal to specify both HelpSummaryHTML and HelpHTML.

  public String getHelpSummaryHTML() {
    return helpSummaryHTML.getValue();
  }

  public void setHelpSummaryHTML(String value) {
    helpSummaryHTML.setValue(value);
  }

  // The help details for this property (minus the help summary).
  // The summary and details are concatenated in the PDJ so that
  // the CFE doesn't have have to combine them.
  // If not specified and HelpHTML isn't specified, then
  // the everything except for the first sentence of the harvested javadoc is used.
  // If not specified and HelpHTML is specified, then
  // HelpHTML is used.
  // It is illegal to specify both HelpDetailsHTML and HelpHTML.

  public String getHelpDetailsHTML() {
    return helpDetailsHTML.getValue();
  }

  public void setHelpDetailsHTML(String value) {
    helpDetailsHTML.setValue(value);
  }

  // This is used when the help summary and the help details
  // should have exactly the same text in the PDJ.
  // If not specified, then see HelpSummaryHTML and HelpDetailsHTML.
  // It is illegal to specify HelpHTML if either HelpSummaryHTML
  // or HelpDetailsHTML are specified.

  public String getHelpHTML() {
    return helpHTML.getValue();
  }

  public void setHelpHTML(String value) {
    helpHTML.setValue(value);
  }

  // When this property should be enabled.
  // If not specified, then this property should always be enabled.
  public UsedIfDefSource getUsedIf() {
    return usedIf.getValue();
  }

  public void setUsedIf(UsedIfDefSource value) {
    usedIf.setValue(value);
  }

  // Indicates that whether this property is required is specified in type.yaml
  public boolean isRequiredSpecifiedInYaml() {
    return required.isSpecifiedInYaml();
  }

  // Whether this property's value must be specified.
  public boolean isRequired() {
    return required.getValue();
  }

  public void setRequired(boolean value) {
    required.setValue(value);
  }

  // Whether an array property's values' order must be maintained.
  // Must not be specified for non-array properties.
  public boolean isOrdered() {
    return ordered.getValue();
  }

  public void setOrdered(boolean value) {
    ordered.setValue(value);
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

  // A list of templates specifying where to find the lists of options for this property.
  // The property must be a reference or an array of references.
  //
  // The templates are always relative to the root of the bean tree, e.g.
  //   Domain/Servers
  // They can also contain substitution parameters that will be filled in the
  // bean instance's path, e.g.
  //   Domain/JMSSystemResources/<JMSSystemResource>/JMSResource/UniformDistributedQueues
  public List<String> getOptionsSources() {
    return optionsSources.getValue();
  }

  public void setOptionsSources(List<String> value) {
    optionsSources.setValue(value);
  }

  public void addOptionsSource(String value) {
    optionsSources.add(value);
  }

  // Whether to allow the user to set a reference property to null.
  // The property must be a single reference.
  public boolean isAllowNullReference() {
    return allowNullReference.getValue();
  }

  public void setAllowNullReference(boolean value) {
    allowNullReference.setValue(value);
  }

  // When this property is writable (i.e. never, when the bean is created, or always)
  public Writable getWritable() {
    return writable.getValue();
  }

  public void setWritable(Writable value) {
    writable.setValue(value);
  }

  // Specifics a custom static method to call to get the value of this property.
  // The format is <package>.<class>.<method>
  public String getGetMethod() {
    return getMethod.getValue();
  }

  public void setGetMethod(String value) {
    getMethod.setValue(value);
  }

  // Since the method's @Source annotations are relative to the bean that specified the method:
  public Path getGetMethodContainedBeanPath() {
    return getMethod.getContainedBeanPath();
  }

  // Specifics a custom static method to call to get the list of options for
  // this reference or array of reference property.
  // The format is <package>.<class>.<method>
  //
  // Must not be specified on other types of properties.
  public String getOptionsMethod() {
    return optionsMethod.getValue();
  }

  public void setOptionsMethod(String value) {
    optionsMethod.setValue(value);
  }

  // Since the method's @Source annotations are relative to the bean that specified the method:
  public Path getOptionsMethodContainedBeanPath() {
    return optionsMethod.getContainedBeanPath();
  }

  // Info about how to present this property to the user.
  // (e.g. inline field help or whether to display a number as hex).
  // Returns null if there are no special presentation rules for this property.
  public BeanPropertyPresentationDefSource getPresentation() {
    return presentation.getValue();
  }

  public void setPresentation(BeanPropertyPresentationDefSource value) {
    presentation.setValue(value);
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

  public String toString() {
    return getName();
  }
}
