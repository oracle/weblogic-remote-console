// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

/**
 * This class information about a bean that was removed in the current configuration transaction.
 */
public class RemovedBean extends BaseBeanChange {
  public RemovedBean(BeanTreePath beanTreePath) {
    super(beanTreePath);
  }
}
