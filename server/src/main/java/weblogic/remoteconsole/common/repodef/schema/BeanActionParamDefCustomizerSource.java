// Copyright (c) 2023, 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.schema;

import weblogic.console.schema.BooleanValue;
import weblogic.console.schema.StringValue;
import weblogic.console.schema.Value;
import weblogic.console.schema.beaninfo.BeanActionParamDefSource;
import weblogic.console.utils.Path;

/**
 * This POJO mirrors the yaml source file format for customizing information about
 * a paramter of an action
 */
public class BeanActionParamDefCustomizerSource extends BeanFieldDefCustomizerSource {

  private StringValue onlineName = StringValue.create();
  private BooleanValue readOnly = BooleanValue.create();
  private BooleanValue secret = BooleanValue.create();
  private Value<BeanActionParamDefSource> definition = Value.create();

  public void merge(BeanActionParamDefCustomizerSource from, Path fromContainedBeanPath) {
    super.merge(from, fromContainedBeanPath);
    onlineName = onlineName.merge(from.onlineName, fromContainedBeanPath);
    readOnly = readOnly.merge(from.readOnly, fromContainedBeanPath);
    secret = secret.merge(from.secret, fromContainedBeanPath);
    definition = definition.merge(from.definition, fromContainedBeanPath);
  }

  // The name of this parameter in online WebLogic admin server connections.
  public String getOnlineName() {
    return onlineName.getValue();
  }

  public void setOnlineName(String value) {
    onlineName = onlineName.setValue(value);
  }

  // Whether this parameter is a read-only field on the action input form
  // that is never used to invoke the action.
  public boolean isReadOnly() {
    return readOnly.getValue();
  }

  public void setReadOnly(boolean value) {
    readOnly = readOnly.setValue(value);
  }

  // Whether this parameter is a secret.
  // Only makes sense for string parameters.
  public boolean isSecret() {
    return secret.getValue();
  }

  public void setSecret(boolean value) {
    secret = secret.setValue(value);
  }

  // If this param was not configured in type.yaml or extension.yaml,
  // i.e. only exists at the page level, not the bean level,
  // this returns the rest of the information about the param.
  public BeanActionParamDefSource getDefinition() {
    return definition.getValue();
  }

  public void setDefinition(BeanActionParamDefSource value) {
    definition = definition.setValue(value);
  }

  @Override
  protected void validateExtension() {
    super.validateExtension();
    validateExtensionChild(getDefinition(), "definition");
  }
}
