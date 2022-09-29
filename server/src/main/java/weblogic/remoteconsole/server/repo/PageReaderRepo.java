// Copyright (c) 2021, 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

import java.lang.reflect.Method;
import java.lang.reflect.Type;
import java.util.List;
import java.util.logging.Logger;

import com.fasterxml.jackson.core.type.TypeReference;
import weblogic.remoteconsole.common.repodef.PageDef;
import weblogic.remoteconsole.common.repodef.PageRepoDef;
import weblogic.remoteconsole.common.repodef.SlicePagePath;
import weblogic.remoteconsole.common.repodef.TableActionDef;
import weblogic.remoteconsole.common.utils.CustomizerInvocationUtils;
import weblogic.remoteconsole.common.utils.StringUtils;

/**
 * This class manages reading a bean tree's pages (invoking actions too)
 */
public abstract class PageReaderRepo extends PageRepo {

  private SimpleSearchManager simpleSearchManager = new SimpleSearchManager();
  private DashboardManager dashboardManager = null;
  private TableCustomizationsManager tableCustomizationsManager = new TableCustomizationsManager();
  
  private static final Logger LOGGER = Logger.getLogger(PageReaderRepo.class.getName());

  private static final Type CUSTOMIZE_PAGE_RETURN_TYPE = (new TypeReference<Response<Void>>() {}).getType();

  protected PageReaderRepo(PageRepoDef pageRepoDef, BeanRepo beanRepo) {
    super(pageRepoDef, beanRepo);
    if (pageRepoDef.isSupportsDashboards()) {
      dashboardManager = new DashboardManager();
    }
  }

  // Get the definition of the page referred to by the invocation context.
  public Response<PageDef> getPageDef(InvocationContext ic) {
    LOGGER.finest("PageReaderRepo.getPageDef " + ic.getPagePath());
    PageReader reader = null;
    if (ic.getPagePath().isSlicePagePath()) {
      reader = new SliceReader(ic);
    } else if (ic.getPagePath().isCreateFormPagePath()) {
      reader = new CreateFormReader(ic);
    } else if (ic.getPagePath().isTablePagePath()) {
      reader = new TableReader(ic);
    } else {
      throw new AssertionError("Unknown PagePath type : " + ic.getPagePath());
    }
    return reader.getPageDef();
  }

  // Get the contents of the page referred to by the invocation context.
  public Response<Page> getPage(InvocationContext ic) {
    LOGGER.finest("PageReaderRepo.getPage " + ic.getPagePath() + " " + ic.getBeanTreePath());
    if (ic.getPagePath().isSlicePagePath()) {
      return customizePage(ic, (new SliceReader(ic)).getSlice());
    } else if (ic.getPagePath().isCreateFormPagePath()) {
      return customizePage(ic, (new CreateFormReader(ic)).getCreateForm());
    } else if (ic.getPagePath().isTablePagePath()) {
      return customizePage(ic, (new TableReader(ic)).getTable());
    } else {
      throw new AssertionError("Unknown PagePath type : " + ic.getPagePath());
    }
  }

  private Response<Page> customizePage(InvocationContext ic, Response<Page> pageResponse) {
    if (!pageResponse.isSuccess()) {
      // Something went wrong getting the standard contents of the page.
      // Return that error.
      return pageResponse;
    }
    Page page = pageResponse.getResults();
    String methodName = page.getPageDef().getCustomizePageMethod();
    if (StringUtils.isEmpty(methodName)) {
      // There isn't a customizer for this page.
      // Just return the standard response (which is already successful and refers to the standard contents).
      return pageResponse;
    }
    // Call the customizer, passing in the page so that the customizer can modify it.
    Method method = CustomizerInvocationUtils.getMethod(methodName);
    CustomizerInvocationUtils.checkSignature(
      method,
      CUSTOMIZE_PAGE_RETURN_TYPE,
      InvocationContext.class,
      Page.class
    );
    List<Object> args = List.of(ic, page);
    Object responseAsObject = CustomizerInvocationUtils.invokeMethod(method, args);
    @SuppressWarnings("unchecked")
    Response<Void> customizerResponse = (Response<Void>)responseAsObject;
    if (!customizerResponse.isSuccess()) {
      // The customizer had a problem.  Return it.
      return pageResponse.copyUnsuccessfulResponse(customizerResponse);
    }
    // Since pageResponse is already successful and already refers to the page that
    // the customizer successfully modified, just return it (v.s. making a new response).
    return pageResponse;
  }

  // Returns the slice page path for the bean and slice referenced by the invocation context.
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
  public Response<SlicePagePath> getActualSlicePagePath(InvocationContext ic) {
    if (ic.getPagePath().isSlicePagePath()) {
      return (new SliceReader(ic)).getActualSlicePagePath();
    } else {
      throw new AssertionError("Not a slice : " + ic.getPagePath());
    }
  }

  public Response<InvocationContext> getActualSliceInvocationContext(InvocationContext ic) {
    Response<InvocationContext> response = new Response<>();
    Response<SlicePagePath> sliceResponse = getActualSlicePagePath(ic);
    if (!sliceResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(sliceResponse);
    }
    InvocationContext actualIc = new InvocationContext(ic);
    actualIc.setPagePath(sliceResponse.getResults());
    return response.setSuccess(actualIc);
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

  public SimpleSearchManager getSimpleSearchManager() {
    return simpleSearchManager;
  }

  public DashboardManager getDashboardManager() {
    return dashboardManager;
  }

  public TableCustomizationsManager getTableCustomizationsManager() {
    return tableCustomizationsManager;
  }
}
