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
  private boolean unset;
  private Value oldValue;
  private Value newValue;

  public ModifiedBeanProperty(
    BeanTreePath beanPath,
    BeanPropertyDef propertyDef,
    boolean unset,
    Value oldValue,
    Value newValue
  ) {
    super(beanPath);
    this.propertyDef = propertyDef;
    this.unset = unset;
    this.oldValue = oldValue;
    this.newValue = newValue;
  }

  // Returns the definition of the property
  public BeanPropertyDef getPropertyDef() {
    return propertyDef;
  }

  // Returns whether this modification has unset the property
  public boolean isUnset() {
    return unset;
  }

  // Returns the old (previously commited) value of the property
  public Value getOldValue() {
    return oldValue;
  }

  // Returns the new (pending) value of the property
  public Value getNewValue() {
    return newValue;
  }
}
