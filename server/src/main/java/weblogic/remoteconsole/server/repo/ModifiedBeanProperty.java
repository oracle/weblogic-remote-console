// Copyright (c) 2021, 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

import weblogic.console.utils.Path;

/**
 * This class information about a bean property or ordered collection that
 * was modified in the current configuration transaction.
 */
public class ModifiedBeanProperty extends BaseBeanChange {
  private Path path;
  private boolean unset;
  private Value oldValue;
  private Value newValue;

  public ModifiedBeanProperty(
    BeanTreePath beanPath,
    Path path,
    boolean unset,
    Value oldValue,
    Value newValue
  ) {
    super(beanPath);
    this.path = path;
    this.unset = unset;
    this.oldValue = oldValue;
    this.newValue = newValue;
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

  public Path getPath() {
    return path;
  }
}
