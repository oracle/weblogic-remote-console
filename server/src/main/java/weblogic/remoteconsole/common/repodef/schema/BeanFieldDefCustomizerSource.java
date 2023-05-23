// Copyright (c) 2021, 2023, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.schema;

import java.util.List;

import weblogic.remoteconsole.common.utils.Path;

/**
 * This POJO mirrors the yaml source file format for customizing information
 * about a field that will be displayed on a page (i.e. a property of a type
 * or a parameter of an action)
 */
public class BeanFieldDefCustomizerSource extends BeanValueDefCustomizerSource {

  private StringValue name = new StringValue();
  private StringValue formName = new StringValue();
  private StringValue label = new StringValue();
  private StringValue helpSummaryHTML = new StringValue();
  private StringValue helpDetailsHTML = new StringValue();
  private StringValue helpHTML = new StringValue();
  private BooleanValue required = new BooleanValue();
  private ListValue<String> optionsSources = new ListValue<>();
  private BooleanValue allowNullReference = new BooleanValue();
  private StringValue getMethod = new StringValue();
  private StringValue optionsMethod = new StringValue();

  public void merge(BeanFieldDefCustomizerSource from, Path fromContainedBeanPath) {
    // don't merge name - it's fixed by whoever created this instance
    super.merge(from, fromContainedBeanPath);
    formName.merge(from.formName, fromContainedBeanPath);
    label.merge(from.label, fromContainedBeanPath);
    required.merge(from.required, fromContainedBeanPath);
    optionsSources.merge(from.optionsSources, fromContainedBeanPath);
    allowNullReference.merge(from.allowNullReference, fromContainedBeanPath);
    getMethod.merge(from.getMethod, fromContainedBeanPath);
    optionsMethod.merge(from.optionsMethod, fromContainedBeanPath);
    mergeHelp(from, fromContainedBeanPath);
  }

  private void mergeHelp(BeanFieldDefCustomizerSource from, Path fromContainedBeanPath) {
    // If helpSummaryHTML, helpDetailsHTML or helpHTML are set on from, copy over
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

  // The path to this field,
  // e.g. if the top level bean is a ServerMBean and this is the ListenPort property on
  // the SSL mbean, then the 'name' is "SSL.ListenPort".
  public String getName() {
    return name.getValue();
  }

  public void setName(String value) {
    name.setValue(value);
  }

  // The name of this field in the form for the HTTP api for a page
  // Normally the field's name is used as the name in the form.
  // formName is used for the few cases where the name on the form needs
  // to be different than the name in the bean repo.
  public String getFormName() {
    return formName.getValue();
  }

  public void setFormName(String value) {
    formName.setValue(value);
  }

  // The english name to display for this field.
  public String getLabel() {
    return label.getValue();
  }

  public void setLabel(String value) {
    label.setValue(value);
  }

  // The help summary for this field.
  // If not specified and HelpHTML isn't specified, then
  // the first sentence of the harvested javadoc is used.
  // If not specified and HelpHTML is specified, then HelpHTML is used.
  // It is illegal to specify both HelpSummaryHTML and HelpHTML.

  public String getHelpSummaryHTML() {
    return helpSummaryHTML.getValue();
  }

  public void setHelpSummaryHTML(String value) {
    helpSummaryHTML.setValue(value);
  }

  // The help details for this field (minus the help summary).
  // The summary and details are concatenated in the PDJ so that
  // the CFE doesn't have have to combine them.
  // If not specified and HelpHTML isn't specified, then
  // the everything except for the first sentence of the harvested javadoc is used.
  // If not specified and HelpHTML is specified, then HelpHTML is used.
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

  // Indicates that whether this field is required is specified in type.yaml
  public boolean isRequiredSpecifiedInYaml() {
    return required.isSpecifiedInYaml();
  }

  // Whether this field's value must be specified.
  public boolean isRequired() {
    return required.getValue();
  }

  public void setRequired(boolean value) {
    required.setValue(value);
  }

  // A list of templates specifying where to find the lists of options for this field.
  // The field must be a reference or an array of references.
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

  // Whether to allow the user to set a reference field to null.
  // The field must be a single reference.
  public boolean isAllowNullReference() {
    return allowNullReference.getValue();
  }

  public void setAllowNullReference(boolean value) {
    allowNullReference.setValue(value);
  }

  // Specifics a custom static method to call to get the value of this field.
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
  // this reference or array of reference field.
  // The format is <package>.<class>.<method>
  //
  // Must not be specified on other types of fields.
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

  public String toString() {
    return getName();
  }
}
