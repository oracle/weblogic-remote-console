// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

import weblogic.remoteconsole.common.repodef.BeanPropertyDef;

/**
 * This class information about a bean property that was modified
 * in the current configuration transaction.
 */
public class ModifiedBeanProperty extends BaseBeanChange {
  private BeanPropertyDef propertyDef;
  private SettableValue oldValue;
  private SettableValue newValue;

  public ModifiedBeanProperty(
    BeanTreePath beanPath,
    BeanPropertyDef propertyDef,
    SettableValue oldValue,
    SettableValue newValue
  ) {
    super(beanPath);
    this.propertyDef = propertyDef;
    this.oldValue = oldValue;
    this.newValue = newValue;
  }

  // Returns the definition of the property
  public BeanPropertyDef getPropertyDef() {
    return propertyDef;
  }

  // Returns the old (previously commited) value of the property
  public SettableValue getOldValue() {
    return oldValue;
  }

  // Returns the new (pending) value of the property
  public SettableValue getNewValue() {
    return newValue;
  }
}
