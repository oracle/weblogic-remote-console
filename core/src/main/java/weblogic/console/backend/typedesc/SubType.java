// Copyright (c) 2020, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.typedesc;

import weblogic.console.backend.utils.StringUtils;

/**
 * This POJO mirrors the yaml file format for configuring console-specific information about one of
 * a heterogeneous weblogic bean type's instantiable subtypes.
 */
public class SubType {
  // The value of the subTypeDiscrimintorProperty on the bean instance that
  // indicates that the instance is of this sub type.
  private String value;

  public String getValue() {
    return StringUtils.isEmpty(this.value) ? getType() : this.value;
  }

  public void setValue(String value) {
    this.value = value;
  }

  // The name of sub type
  private String type;

  public String getType() {
    return type;
  }

  public void setType(String type) {
    this.type = type;
  }
}
