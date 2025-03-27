// Copyright (c) 2021, 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.schema;

import java.util.List;

import weblogic.console.schema.ListValue;
import weblogic.console.schema.StringValue;
import weblogic.console.schema.YamlSource;

/**
 * This POJO mirrors the yaml source file format for information about
 * an instantiable derived (sub) type of a type.
 * e.g. AuthenticationProviderMBean/type.yaml.
 */
public class SubTypeDefSource extends YamlSource {
  private StringValue value = new StringValue();
  private StringValue type = new StringValue();
  private ListValue<String> requiredCapabilities = new ListValue<>();

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

  // The bean repo capabilities that are required for this sub type to be present
  public List<String> getRequiredCapabilities() {
    return requiredCapabilities.getValue();
  }
  
  public void setRequiredCapabilities(List<String> val) {
    requiredCapabilities.setValue(val);
  }
}
