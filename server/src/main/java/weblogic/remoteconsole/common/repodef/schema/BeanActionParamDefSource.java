// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.schema;

/**
 * This POJO mirrors the yaml source file format for configuring information about a
 * parameter of an action on weblogic bean's type, e.g. ServerLifeCycleRuntimeMBean/type.yaml
 */
public class BeanActionParamDefSource extends BeanValueDefSource {
  private StringValue name = new StringValue();
  private StringValue label = new StringValue();

  // The name of parameter.
  public String getName() {
    return name.getValue();
  }

  public void setName(String value) {
    name.setValue(value);
  }

  // The english label to display for this parameter.
  public String getLabel() {
    return label.getValue();
  }

  public void setLabel(String value) {
    this.label.setValue(value);
  }
}
