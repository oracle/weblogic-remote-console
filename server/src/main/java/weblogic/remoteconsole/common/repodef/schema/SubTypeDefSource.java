// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.schema;

/**
 * This POJO mirrors the yaml source file format for information about
 * an instantiable derived (sub) type of a type.
 * e.g. AuthenticationProviderMBean/type.yaml.
 */
public class SubTypeDefSource {
  private StringValue value = new StringValue();
  private StringValue type = new StringValue();

  // The value of the subTypeDiscrimintorProperty on the bean instance that
  // indicates that the instance is of this sub type.
  public String getValue() {
    return value.getValue();
  }

  public void setValue(String val) {
    value.setValue(val);
  }

  // The name of sub type
  public String getType() {
    return type.getValue();
  }

  public void setType(String val) {
    type.setValue(val);
  }
}
