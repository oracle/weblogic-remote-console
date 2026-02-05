// Copyright (c) 2021, 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.schema.beaninfo;

import java.util.List;

import weblogic.console.schema.BooleanValue;
import weblogic.console.schema.ListValue;
import weblogic.console.schema.ScalarUtils;
import weblogic.console.schema.StringValue;
import weblogic.console.schema.YamlSource;

/**
 * This POJO mirrors the yaml source file format for configuring harvested
 * bean info information about a value (e.g. property's value,
 * action's return value, action param, action param's value)
 * e.g. ServerLifeCycleRuntimeMBean.yaml
 */
public class BeanValueDefSource extends YamlSource {
  private StringValue type = StringValue.create();
  private BooleanValue array = BooleanValue.create();
  private ListValue<Object> legalValues = ListValue.create();

  // java type of the value in the WebLogic bean tree,
  // e.g. java.lang.String, boolean, weblogic.management.configuration.ServerMBean
  public String getType() {
    return type.getValue();
  }

  public void setType(String value) {
    type = type.setValue(value);
  }

  // Whether this value is an array
  public boolean isArray() {
    return array.getValue();
  }

  public void setArray(boolean val) {
    array = array.setValue(val);
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


  // The list of legal values for this value.
  // The values must match its type.
  public List<Object> getLegalValues() {
    return legalValues.getValue();
  }

  public void setLegalValues(List<Object> val) {
    ScalarUtils.validateScalars(val);
    legalValues = legalValues.setValue(val);
  }

  public void addLegalValue(Object val) {
    legalValues = legalValues.add(val);
  }
}
