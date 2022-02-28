// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

import java.util.List;

import weblogic.remoteconsole.common.repodef.PageRepoDef;

/**
 * This class manages the pages that create, modify and delete beans in a bean tree.
 * It also manages the pages for reading them and invoking operations on them.
 */
public abstract class PageEditorRepo extends PageReaderRepo {

  protected PageEditorRepo(PageRepoDef pageRepoDef, BeanRepo beanRepo) {
    super(pageRepoDef, beanRepo);
  }

  // Update a new bean and its mandatory singleton child beans with the values
  // that the user entered on one of its slice form pages.
  public Response<Void> update(InvocationContext ic, List<FormProperty> properties) {
    if (ic.getPagePath().isSlicePagePath()) {
      return (new SliceFormUpdater(ic, properties)).update();
    } else {
      throw new AssertionError("Unsupported PagePath type : " + ic.getPagePath());
    }
  }

  // Create a new bean, setting properties on it and on its mandatory singleton child beans
  // to the values the user entered on its create form page.
  public Response<Void> create(InvocationContext ic, List<FormProperty> properties) {
    if (ic.getPagePath().isCreateFormPagePath()) {
      return (new CreateFormCreator(ic, properties)).create();
    } else {
      throw new AssertionError("Unsupported PagePath type : " + ic.getPagePath());
    }
  }

  // Delete a bean.
  public Response<Void> delete(InvocationContext ic) {
    return (new BeanDeleter(ic)).delete();
  }
}
