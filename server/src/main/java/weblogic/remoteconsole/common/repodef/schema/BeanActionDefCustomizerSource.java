// Copyright (c) 2021, 2024, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.schema;

import java.util.List;

import weblogic.remoteconsole.common.utils.CustomizerInvocationUtils;
import weblogic.remoteconsole.common.utils.Path;
import weblogic.remoteconsole.common.utils.StringUtils;

/**
 * This POJO mirrors the yaml source file format for customizing information about an action on
 * type, e.g. ServerLifeCycleRuntimeMBean/type.yaml
 */
public class BeanActionDefCustomizerSource extends BeanValueDefCustomizerSource {
  private StringValue name = new StringValue();
  private StringValue label = new StringValue();
  private StringValue helpLabel = new StringValue();
  private StringValue successMessage = new StringValue();
  private StringValue failureMessage = new StringValue();
  private StringValue helpSummaryHTML = new StringValue();
  private StringValue helpDetailsHTML = new StringValue();
  private StringValue helpHTML = new StringValue();
  private StringValue actionMethod = new StringValue();
  private Value<BeanActionDefSource> definition = new Value<>(null);
  private Value<MBeanOperationDefSource> mbeanOperation = new Value<>(new MBeanOperationDefSource());
  private Value<ActionInputFormDefSource> inputForm = new Value<>(null);
  private ListValue<BeanActionParamDefCustomizerSource> parameters = new ListValue<>();
  private Value<BeanActionPollingDefSource> polling = new Value<>(null);
  private BooleanValue disableMBeanJavadoc = new BooleanValue();

  public void merge(BeanActionDefCustomizerSource from, Path fromContainedBeanPath) {
    // don't merge name - it's fixed by whoever created this instance
    super.merge(from, fromContainedBeanPath);
    label.merge(from.label, fromContainedBeanPath);
    successMessage.merge(from.successMessage, fromContainedBeanPath);
    failureMessage.merge(from.failureMessage, fromContainedBeanPath);
    helpLabel.merge(from.helpLabel, fromContainedBeanPath);
    actionMethod.merge(from.actionMethod, fromContainedBeanPath);
    definition.merge(from.definition, fromContainedBeanPath);
    mbeanOperation.merge(from.mbeanOperation, fromContainedBeanPath);
    inputForm.merge(from.inputForm, fromContainedBeanPath);
    polling.merge(from.polling, fromContainedBeanPath);
    disableMBeanJavadoc.merge(from.disableMBeanJavadoc, fromContainedBeanPath);
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
      helpSummaryHTML.copyFrom(from.helpSummaryHTML, fromContainedBeanPath);
      helpDetailsHTML.copyFrom(from.helpDetailsHTML, fromContainedBeanPath);
      helpHTML.copyFrom(from.helpHTML, fromContainedBeanPath);
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
    name.setValue(value);
  }

  // The english label to display for this action.
  public String getLabel() {
    return label.getValue();
  }

  public void setLabel(String value) {
    this.label.setValue(value);
  }

  // The english label to display for this action on the help page
  public String getHelpLabel() {
    return helpLabel.getValue();
  }

  public void setHelpLabel(String value) {
    this.helpLabel.setValue(value);
  }

  // The english label to display when this action succeeds.
  // {0} contains the name of the bean.
  public String getSuccessMessage() {
    return successMessage.getValue();
  }

  public void setSuccessMessage(String value) {
    this.successMessage.setValue(value);
  }

  // The english label to display when this action fails.
  // {0} contains the name of the bean.
  public String getFailureMessage() {
    return failureMessage.getValue();
  }

  public void setFailureMessage(String value) {
    this.failureMessage.setValue(value);
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
    helpSummaryHTML.setValue(value);
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
      actionMethod.setValue(value);
    }
  }

  // If this action was not configured in type.yaml or extension.yaml,
  // i.e. only exists at the page level, not the bean level,
  // this returns the rest of the information about the action.
  public BeanActionDefSource getDefinition() {
    return definition.getValue();
  }

  public void setDefinition(BeanActionDefSource value) {
    definition.setValue(value);
  }

  // Indicates which mbean operation this actions is related to.
  // Typically used for page-specific actions since normal
  // type-specific actions already know which mbean operation they're related to.
  public MBeanOperationDefSource getMbeanOperation() {
    return mbeanOperation.getValue();
  }

  public void setMbeanOperation(MBeanOperationDefSource value) {
    mbeanOperation.setValue(value);
  }

  // This returns the action's input form if one was configured.
  // Otherwise it returns null
  public ActionInputFormDefSource getInputForm() {
    return inputForm.getValue();
  }

  public void setInputForm(ActionInputFormDefSource value) {
    inputForm.setValue(value);
  }

  // The list of params on this action that have been customized.
  public List<BeanActionParamDefCustomizerSource> getParameters() {
    return parameters.getValue();
  }

  public void setParameters(List<BeanActionParamDefCustomizerSource> value) {
    parameters.setValue(value);
  }

  public void addParameter(BeanActionParamDefCustomizerSource value) {
    parameters.add(value);
  }


  // Info about how how the CFE should poll after invoking this action.
  // Returns null if there the CFE should not poll.
  public BeanActionPollingDefSource getPolling() {
    return polling.getValue();
  }

  public void setPolling(BeanActionPollingDefSource value) {
    polling.setValue(value);
  }

  // Used to turn off this action's javadoc link.
  // Used for actions that are in the REST api but not in the mbean api.
  public boolean isDisableMBeanJavadoc() {
    return disableMBeanJavadoc.getValue();
  }

  public void setDisableMBeanJavadoc(boolean value) {
    disableMBeanJavadoc.setValue(value);
  }

  public String toString() {
    return getName();
  }
}
