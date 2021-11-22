// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.schema;

/**
 * This POJO mirrors the yaml source file format for configuring harvested
 * bean info information about a value (e.g. property's value,
 * action's return value, action param, action param's value)
 * e.g. ServerLifeCycleRuntimeMBean.yaml
 */
public class BeanValueDefSource {
  private StringValue type = new StringValue();
  private BooleanValue array = new BooleanValue();

  // java type of the value in the WebLogic bean tree,
  // e.g. java.lang.String, boolean, weblogic.management.configuration.ServerMBean
  public String getType() {
    return type.getValue();
  }

  public void setType(String value) {
    type.setValue(value);
  }

  // Whether this value is an array
  public boolean isArray() {
    return array.getValue();
  }

  public void setArray(boolean val) {
    array.setValue(val);
  }

  // Whether this value is a secret
  // (i.e. contains confidential information that must be protected)
  public boolean isSecret() {
    return false;
  }

  // Whether this value is a reference, or array of references, to other beans.
  public boolean isReference() {
    // By default, if the type ends with Bean (e.g. ServerMBean, WLDFBean),
    // then it's a reference.  We only have to worry about fancier rules for properties.
    return getType().endsWith("Bean");
  }
}
