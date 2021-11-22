// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

import weblogic.remoteconsole.common.repodef.BeanRepoDef;
import weblogic.remoteconsole.common.repodef.Localizer;
import weblogic.remoteconsole.common.repodef.PagePath;
import weblogic.remoteconsole.common.repodef.PageRepoDef;
import weblogic.remoteconsole.common.repodef.PagesPath;

/**
 * This is the base class for the classes that manage pages.
 * It is an internal detail of a PageRepo.
 */
abstract class PageManager {

  private InvocationContext invocationContext;

  protected PageManager(InvocationContext invocationContext) {
    this.invocationContext = invocationContext;
  }

  protected InvocationContext getInvocationContext() {
    return invocationContext;
  }

  protected PageRepo getPageRepo() {
    return getInvocationContext().getPageRepo();
  }

  protected BeanRepo getBeanRepo() {
    return getPageRepo().getBeanRepo();
  }

  protected BeanRepoDef getBeanRepoDef() {
    return getBeanRepo().getBeanRepoDef();
  }

  protected PageRepoDef getPageRepoDef() {
    return getPageRepo().getPageRepoDef();
  }

  protected BeanTreePath getBeanTreePath() {
    return getInvocationContext().getBeanTreePath();
  }

  protected PagePath getPagePath() {
    return getInvocationContext().getPagePath();
  }

  protected PagesPath getPagesPath() {
    return getPagePath().getPagesPath();
  }

  protected Localizer getLocalizer() {
    return getInvocationContext().getLocalizer();
  }
}
