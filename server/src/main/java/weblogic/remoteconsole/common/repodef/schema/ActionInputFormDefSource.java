// Copyright (c) 2023, 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.schema;

import java.util.List;

import weblogic.console.schema.ListValue;
import weblogic.console.schema.Value;

/**
 * This POJO mirrors the yaml source file format for configuring information about an action input form.
 */
public class ActionInputFormDefSource extends PageDefSource {
  // Note: currently unused inherited stuff:
  //   customizePageDefSourceMethod
  //   customizePageDefMethod
  //   customizePageMethod
  //   actions

  private ListValue<BeanActionParamDefCustomizerSource> parameters = ListValue.create();
  private Value<ActionInputFormPresentationDefSource> presentation =
    Value.create(new ActionInputFormPresentationDefSource());

  // The list of parameters to display on this form.
  public List<BeanActionParamDefCustomizerSource> getParameters() {
    return parameters.getValue();
  }

  public void setParameters(List<BeanActionParamDefCustomizerSource> value) {
    parameters = parameters.setValue(value);
  }

  public void addParameter(BeanActionParamDefCustomizerSource value) {
    parameters = parameters.add(value);
  }

  // Returns presentation info about this action input form
  // (e.g. whether the properties should be displayed in a single column).
  //
  // Returns null if the default presentation should be used.
  public ActionInputFormPresentationDefSource getPresentation() {
    return presentation.getValue();
  }

  public void setPresentation(ActionInputFormPresentationDefSource value) {
    presentation = presentation.setValue(value);
  }

  @Override
  protected void validateExtension() {
    super.validateExtension();
    validateExtensionChildren(getParameters(), "parameters");
  }
}
