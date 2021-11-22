// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

import weblogic.remoteconsole.common.repodef.BeanPropertyDef;

/**
 * This class holds the value of a property of a bean.
 */
public class BeanPropertyValue {
  private BeanPropertyDef propertyDef;
  private SettableValue value;

  public BeanPropertyValue(BeanPropertyDef propertyDef, SettableValue value) {
    this.propertyDef = propertyDef;
    this.value = value;
  }

  public BeanPropertyDef getPropertyDef() {
    return propertyDef;
  }

  public SettableValue getValue() {
    return value;
  }

  @Override
  public String toString() {
    return "BeanProperty<" + getPropertyDef() + ", " + getValue() + ">";
  }
}
