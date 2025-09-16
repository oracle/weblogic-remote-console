// Copyright (c) 2021, 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.schema;

import java.util.List;

import weblogic.console.schema.BooleanValue;
import weblogic.console.schema.ListValue;
import weblogic.console.schema.StringValue;
import weblogic.console.schema.Value;
import weblogic.console.schema.beaninfo.BeanActionDefSource;
import weblogic.console.utils.Path;
import weblogic.console.utils.StringUtils;
import weblogic.remoteconsole.common.utils.CustomizerInvocationUtils;

/**
 * This POJO mirrors the yaml source file format for customizing information about an action on
 * type, e.g. ServerLifeCycleRuntimeMBean/type.yaml
 */
public class BeanActionDefCustomizerSource extends BeanValueDefCustomizerSource {
  private StringValue name = StringValue.create();
  private StringValue label = StringValue.create();
  private StringValue helpLabel = StringValue.create();
  private StringValue successMessage = StringValue.create();
  private StringValue failureMessage = StringValue.create();
  private StringValue helpSummaryHTML = StringValue.create();
  private StringValue helpDetailsHTML = StringValue.create();
  private StringValue helpHTML = StringValue.create();
  private StringValue actionMethod = StringValue.create();
  private Value<BeanActionDefSource> definition = Value.create();
  private Value<MBeanOperationDefSource> mbeanOperation = Value.create(new MBeanOperationDefSource());
  private Value<ActionInputFormDefSource> inputForm = Value.create();
  private ListValue<BeanActionParamDefCustomizerSource> parameters = ListValue.create();
  private Value<BeanActionPollingDefSource> polling = Value.create();
  private BooleanValue disableMBeanJavadoc = BooleanValue.create();

  public void merge(BeanActionDefCustomizerSource from, Path fromContainedBeanPath) {
    // don't merge name - it's fixed by whoever created this instance
    super.merge(from, fromContainedBeanPath);
    label = label.merge(from.label, fromContainedBeanPath);
    successMessage = successMessage.merge(from.successMessage, fromContainedBeanPath);
    failureMessage = failureMessage.merge(from.failureMessage, fromContainedBeanPath);
    helpLabel = helpLabel.merge(from.helpLabel, fromContainedBeanPath);
    actionMethod = actionMethod.merge(from.actionMethod, fromContainedBeanPath);
    definition = definition.merge(from.definition, fromContainedBeanPath);
    mbeanOperation = mbeanOperation.merge(from.mbeanOperation, fromContainedBeanPath);
    inputForm = inputForm.merge(from.inputForm, fromContainedBeanPath);
    polling = polling.merge(from.polling, fromContainedBeanPath);
    disableMBeanJavadoc = disableMBeanJavadoc.merge(from.disableMBeanJavadoc, fromContainedBeanPath);
    mergeHelp(from, fromContainedBeanPath);
    mergeParameters(from, fromContainedBeanPath);
  }

  private void mergeHelp(BeanActionDefCustomizerSource from, Path fromContainedBeanPath) {
    // If helpSummaryHTML, helpDetailsHTML or helpHTML are set on from, copy over
    // all of them since the overall help computation needs them all.
    // i.e. if a yaml file says anything about help, it's totally replacing
    // everything help related.
    if (from.helpHTML.isSpecifiedInYaml()
        || from.helpSummaryHTML.isSpecifiedInYaml()
        || from.helpDetailsHTML.isSpecifiedInYaml()
    ) {
      helpSummaryHTML = helpSummaryHTML.copyFrom(from.helpSummaryHTML, fromContainedBeanPath);
      helpDetailsHTML = helpDetailsHTML.copyFrom(from.helpDetailsHTML, fromContainedBeanPath);
      helpHTML = helpHTML.copyFrom(from.helpHTML, fromContainedBeanPath);
    }
  }

  private void mergeParameters(BeanActionDefCustomizerSource from, Path fromContainedBeanPath) {
    for (BeanActionParamDefCustomizerSource fromParam : from.getParameters()) {
      BeanActionParamDefCustomizerSource toParam = findOrCreateActionParamDef(fromParam.getName());
      toParam.merge(fromParam, fromContainedBeanPath);
    }
  }

  private BeanActionParamDefCustomizerSource findOrCreateActionParamDef(String name) {
    for (BeanActionParamDefCustomizerSource param : getParameters()) {
      if (name.equals(param.getName())) {
        return param;
      }
    }
    BeanActionParamDefCustomizerSource newParam = new BeanActionParamDefCustomizerSource();
    newParam.setName(name);
    addParameter(newParam);
    return newParam;
  }

  // The name of the action (i.e. in the urls, PDJs and RDJs)
  public String getName() {
    return name.getValue();
  }

  public void setName(String value) {
    name = name.setValue(value);
  }

  // The english label to display for this action.
  public String getLabel() {
    return label.getValue();
  }

  public void setLabel(String value) {
    label = label.setValue(value);
  }

  // The english label to display for this action on the help page
  public String getHelpLabel() {
    return helpLabel.getValue();
  }

  public void setHelpLabel(String value) {
    helpLabel = helpLabel.setValue(value);
  }

  // The english label to display when this action succeeds.
  // {0} contains the name of the bean.
  public String getSuccessMessage() {
    return successMessage.getValue();
  }

  public void setSuccessMessage(String value) {
    successMessage = successMessage.setValue(value);
  }

  // The english label to display when this action fails.
  // {0} contains the name of the bean.
  public String getFailureMessage() {
    return failureMessage.getValue();
  }

  public void setFailureMessage(String value) {
    failureMessage = failureMessage.setValue(value);
  }

  // The help summary for this attribute.
  // If not specified and HelpHTML isn't specified, then
  // the first sentence of the harvested javadoc is used.
  // If not specified and HelpHTML is specified, then HelpHTML is used.
  // It is illegal to specify both HelpSummaryHTML and HelpHTML.

  public String getHelpSummaryHTML() {
    return helpSummaryHTML.getValue();
  }

  public void setHelpSummaryHTML(String value) {
    helpSummaryHTML = helpSummaryHTML.setValue(value);
  }

  // The help details for this attribute (minus the help summary).
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
    helpDetailsHTML = helpDetailsHTML.setValue(value);
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
    helpHTML = helpHTML.setValue(value);
  }

  // Customizes the implementation of this action.  Optional.
  // The format is <package>.<class>.<method>
  //
  // required signature:
  //  public static Response<Value> <method>(InvocationContext ic)
  //
  // The CBE ensures that the bean referenced by ic exists
  // before calling this method.
  public String getActionMethod() {
    return actionMethod.getValue();
  }

  public void setActionMethod(String value) {
    if (StringUtils.isEmpty(value) || CustomizerInvocationUtils.methodExists(value)) {
      actionMethod = actionMethod.setValue(value);
    }
  }

  // If this action was not configured in type.yaml or extension.yaml,
  // i.e. only exists at the page level, not the bean level,
  // this returns the rest of the information about the action.
  public BeanActionDefSource getDefinition() {
    return definition.getValue();
  }

  public void setDefinition(BeanActionDefSource value) {
    definition = definition.setValue(value);
  }

  // Indicates which mbean operation this actions is related to.
  // Typically used for page-specific actions since normal
  // type-specific actions already know which mbean operation they're related to.
  public MBeanOperationDefSource getMbeanOperation() {
    return mbeanOperation.getValue();
  }

  public void setMbeanOperation(MBeanOperationDefSource value) {
    mbeanOperation = mbeanOperation.setValue(value);
  }

  // This returns the action's input form if one was configured.
  // Otherwise it returns null
  public ActionInputFormDefSource getInputForm() {
    return inputForm.getValue();
  }

  public void setInputForm(ActionInputFormDefSource value) {
    inputForm = inputForm.setValue(value);
  }

  // The list of params on this action that have been customized.
  public List<BeanActionParamDefCustomizerSource> getParameters() {
    return parameters.getValue();
  }

  public void setParameters(List<BeanActionParamDefCustomizerSource> value) {
    parameters = parameters.setValue(value);
  }

  public void addParameter(BeanActionParamDefCustomizerSource value) {
    parameters = parameters.add(value);
  }


  // Info about how how the CFE should poll after invoking this action.
  // Returns null if there the CFE should not poll.
  public BeanActionPollingDefSource getPolling() {
    return polling.getValue();
  }

  public void setPolling(BeanActionPollingDefSource value) {
    polling = polling.setValue(value);
  }

  // Used to turn off this action's javadoc link.
  // Used for actions that are in the REST api but not in the mbean api.
  public boolean isDisableMBeanJavadoc() {
    return disableMBeanJavadoc.getValue();
  }

  public void setDisableMBeanJavadoc(boolean value) {
    disableMBeanJavadoc = disableMBeanJavadoc.setValue(value);
  }

  public String toString() {
    return getName();
  }

  @Override
  protected void validateExtension() {
    super.validateExtension();
    validateExtensionChild(getDefinition(), "definition");
    validateExtensionChild(getMbeanOperation(), "mbeanOperation");
    validateExtensionChild(getInputForm(), "inputForm");
    validateExtensionChild(getPolling(), "polling");
    validateExtensionChildren(getParameters(), "parameters");
    validateExtensionStringPropertyNotSpecified(getActionMethod(), "actionMethod");
  }
}
