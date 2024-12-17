// Copyright (c) 2023, 2024, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.schema;

import java.util.List;

/**
 * This POJO mirrors the yaml source file format for configuring information about an action input form.
 */
public class ActionInputFormDefSource extends PageDefSource {
  // Note: currently unused inherited stuff:
  //   customizePageDefSourceMethod
  //   customizePageDefMethod
  //   customizePageMethod
  //   actions

  private ListValue<BeanActionParamDefCustomizerSource> parameters = new ListValue<>();

  // The list of parameters to display on this form.
  public List<BeanActionParamDefCustomizerSource> getParameters() {
    return parameters.getValue();
  }

  public void setParameters(List<BeanActionParamDefCustomizerSource> value) {
    parameters.setValue(value);
  }

  public void addParameter(BeanActionParamDefCustomizerSource value) {
    parameters.add(value);
  }

  @Override
  protected void validateExtension() {
    super.validateExtension();
    validateExtensionChildren(getParameters(), "parameters");
  }
}
