// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

/**
 * This class returns information about a bean change (add, delete, modify) 
 * in the current configuration transaction (i.e. an item in the shopping cart)
 */
public class BaseBeanChange {
  private BeanTreePath beanTreePath;

  protected BaseBeanChange(BeanTreePath beanTreePath) {
    this.beanTreePath = beanTreePath;
  }

  public BeanTreePath getBeanTreePath() {
    return beanTreePath;
  }
}
