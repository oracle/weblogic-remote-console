// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

import weblogic.remoteconsole.common.repodef.PageRepoDef;

/**
 * This class manages the pages for a bean tree.
 */
public abstract class PageRepo {
  private PageRepoDef pageRepoDef;
  private BeanRepo beanRepo;

  protected PageRepo(PageRepoDef pageRepoDef, BeanRepo beanRepo) {
    this.pageRepoDef = pageRepoDef;
    this.beanRepo = beanRepo;
  }

  // Get the corresponding repo that returns information describing the pages.
  public PageRepoDef getPageRepoDef() {
    return this.pageRepoDef;
  }

  // Get the correponsing bean repo that holds the beans that this repo manages via its pages.
  public BeanRepo getBeanRepo() {
    return this.beanRepo;
  }

  // Returns whether this repo is a page reader repo.
  public boolean isPageReaderRepo() {
    return this instanceof PageReaderRepo;
  }

  // Converts this repo into a page reader repo.
  // Throws a ClassCastException if this repo isn't a PageReaderRepo.
  public PageReaderRepo asPageReaderRepo() {
    return (PageReaderRepo)this;
  }

  // Returns whether this repo is a page editor repo.
  public boolean isPageEditorRepo() {
    return this instanceof PageEditorRepo;
  }

  // Converts this repo into a page editor repo.
  // Throws a ClassCastException if this repo isn't a PageEditorRepo.
  public PageEditorRepo asPageEditorRepo() {
    return (PageEditorRepo)this;
  }

  // Returns whether this repo is a change manager page repo.
  public boolean isChangeManagerPageRepo() {
    return this instanceof ChangeManagerPageRepo;
  }

  // Converts this repo into a change manager page repo.
  // Throws a ClassCastException if this repo isn't a ChangeManagerPageRepo.
  public ChangeManagerPageRepo asChangeManagerPageRepo() {
    return (ChangeManagerPageRepo)this;
  }

  // Returns whether this repo supports change manager functionality
  public boolean supportsChangeManager() {
    return isChangeManagerPageRepo();
  }
}
