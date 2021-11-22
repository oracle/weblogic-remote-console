// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo.weblogic;

import weblogic.remoteconsole.common.repodef.BeanRepoDef;
import weblogic.remoteconsole.server.repo.BeanRepo;

/**
 * Base implementation for the various WebLogic BeanTreeManagers
 */
public class WebLogicBeanRepo implements BeanRepo {
  private BeanRepoDef beanRepoDef;

  protected WebLogicBeanRepo(BeanRepoDef beanRepoDef) {
    this.beanRepoDef = beanRepoDef;
  }

  @Override
  public BeanRepoDef getBeanRepoDef() {
    return this.beanRepoDef;
  }
}
