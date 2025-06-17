// Copyright (c) 2021, 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.schema.beaninfo;

import weblogic.console.schema.StringValue;

/**
 * This POJO mirrors the yaml source file format for configuring information about a
 * parameter of an action on weblogic bean's type, e.g. ServerLifeCycleRuntimeMBean/type.yaml
 */
public class BeanActionParamDefSource extends BeanValueDefSource {
  private StringValue name = StringValue.create();
  private StringValue descriptionHTML = StringValue.create();

  // The name of parameter.
  public String getName() {
    return name.getValue();
  }

  public void setName(String value) {
    name = name.setValue(value);
  }

  // The parameter's description
  public String getDescriptionHTML() {
    return descriptionHTML.getValue();
  }

  public void setDescriptionHTML(String val) {
    descriptionHTML = descriptionHTML.setValue(val);
  }
}
