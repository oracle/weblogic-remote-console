// Copyright (c) 2023, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.schema;

import weblogic.remoteconsole.common.utils.Path;

/**
 * This POJO mirrors the yaml source file format for customizing information about
 * a paramter of an action
 */
public class BeanActionParamDefCustomizerSource extends BeanFieldDefCustomizerSource {

  private StringValue onlineName = new StringValue();
  private Value<BeanActionParamDefSource> definition = new Value<>(null);

  public void merge(BeanActionParamDefCustomizerSource from, Path fromContainedBeanPath) {
    super.merge(from, fromContainedBeanPath);
    onlineName.merge(from.onlineName, fromContainedBeanPath);
    definition.merge(from.definition, fromContainedBeanPath);
  }

  // The name of this parameter in online WebLogic admin server connections.
  public String getOnlineName() {
    return onlineName.getValue();
  }

  public void setOnlineName(String value) {
    onlineName.setValue(value);
  }

  // If this param was not configured in type.yaml or extension.yaml,
  // i.e. only exists at the page level, not the bean level,
  // this returns the rest of the information about the param.
  public BeanActionParamDefSource getDefinition() {
    return definition.getValue();
  }

  public void setDefinition(BeanActionParamDefSource value) {
    definition.setValue(value);
  }
}
