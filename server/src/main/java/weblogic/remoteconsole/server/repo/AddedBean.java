// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

/**
 * This class returns information about a bean that was added
 * in the current configuration transaction.
 */
public class AddedBean extends BaseBeanChange {

  public AddedBean(BeanTreePath beanTreePath) {
    super(beanTreePath);
  }
}
