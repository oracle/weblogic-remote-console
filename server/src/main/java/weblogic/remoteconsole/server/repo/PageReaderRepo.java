// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

import java.util.List;
import java.util.logging.Logger;

import weblogic.remoteconsole.common.repodef.PageRepoDef;
import weblogic.remoteconsole.common.repodef.SliceFormPagePath;
import weblogic.remoteconsole.common.repodef.TableActionDef;

/**
 * This class manages reading a bean tree's pages (invoking actions too)
 */
public abstract class PageReaderRepo extends PageRepo {

  private static final Logger LOGGER = Logger.getLogger(PageReaderRepo.class.getName());

  protected PageReaderRepo(PageRepoDef pageRepoDef, BeanRepo beanRepo) {
    super(pageRepoDef, beanRepo);
  }

  // Get the contents of the page referred to by the invocation context.
  public Response<Page> getPage(InvocationContext ic) {
    LOGGER.finest("PageReaderRepo.getPage " + ic.getPagePath() + " " + ic.getBeanTreePath());
    if (ic.getPagePath().isSliceFormPagePath()) {
      return (new SliceFormReader(ic)).getSliceForm();
    } else if (ic.getPagePath().isCreateFormPagePath()) {
      return (new CreateFormReader(ic)).getCreateForm();
    } else if (ic.getPagePath().isTablePagePath()) {
      return (new TableReader(ic)).getTable();
    } else {
      throw new AssertionError("Unknown PagePath type : " + ic.getPagePath());
    }
  }

  // Returns the slice form page path for the bean and slice referenced by the invocation context.
  //
  // If the bean's type is heterogeneous, the invocation context doesn't include
  // the actual type of the bean.
  //
  // For example, the RealmMBean's AuthenticationProviders collection is heterogenous.
  // The base type is AuthenticationProviderMBean, and there are a bunch of different
  // derived types, like DefaultAuthenticatorMBean and DefaultIdentityAsserterMBean.
  // Each has its own set of pages since each type has a different set of properties.
  //
  // The invocation context's bean tree path identifies the provider bean but only
  // says that it's the base type, e.g. AuthenticationProviderMBean.  To find out the
  // correct set of pages, the CBE needs to make a call to the bean repo to find
  // out what kind of provider it is first.
  //
  // This method does this and returns the actual page to use.
  public Response<SliceFormPagePath> getActualSliceFormPagePath(InvocationContext ic) {
    if (ic.getPagePath().isSliceFormPagePath()) {
      return (new SliceFormReader(ic)).getActualSliceFormPagePath();
    } else {
      throw new AssertionError("Not a slice form : " + ic.getPagePath());
    }
  }

  // Expand a list of nav tree nodes.
  public Response<List<NavTreeNode>> expandNavTreeNodes(InvocationContext ic, List<NavTreeNode> nodes) {
    return (new NavTreeReader(ic)).expandNavTreeNodes(nodes);
  }

  // Verify that a bean exists.
  public Response<Void> verifyExists(InvocationContext ic, BeanTreePath beanPath) {
    return getBeanRepo().asBeanReaderRepo().verifyExists(ic, beanPath);
  }

  // Verify that a bean doesn't exist.
  public Response<Void> verifyDoesntExist(InvocationContext ic, BeanTreePath beanPath) {
    return getBeanRepo().asBeanReaderRepo().verifyDoesntExist(ic, beanPath);
  }

  // Invoke an action on the collection child bean that a row of a table refers to.
  // For example, on the Servers table page, invoke the 'start' action on the row for 'AdminServer'.
  //
  // The invocation content identifies the bean to invoke the action on.
  //
  // The action must not take any input arguments and must not return a value
  // that should be displayed to the user.
  public Response<Void> invokeTableRowAction(InvocationContext ic, TableActionDef tableActionDef) {
    return (new TableRowActionInvoker(ic, tableActionDef)).invokeAction();
  }
}
