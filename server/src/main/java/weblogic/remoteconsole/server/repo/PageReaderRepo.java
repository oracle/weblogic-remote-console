// Copyright (c) 2021, 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

import java.lang.reflect.Method;
import java.lang.reflect.Type;
import java.util.List;
import java.util.logging.Logger;

import weblogic.console.utils.StringUtils;
import weblogic.remoteconsole.common.repodef.PageActionDef;
import weblogic.remoteconsole.common.repodef.PageDef;
import weblogic.remoteconsole.common.repodef.PageRepoDef;
import weblogic.remoteconsole.common.repodef.SlicePagePath;
import weblogic.remoteconsole.common.utils.CustomizerInvocationUtils;

/**
 * This class manages reading a bean tree's pages (invoking actions too)
 */
public abstract class PageReaderRepo extends PageRepo {
  private static final Logger LOGGER = Logger.getLogger(PageReaderRepo.class.getName());

  private static final Type CUSTOMIZE_PAGE_RETURN_TYPE = Void.TYPE;

  protected PageReaderRepo(PageRepoDef pageRepoDef, BeanRepo beanRepo) {
    super(pageRepoDef, beanRepo);
  }

  @Override
  public void prepareForRemoval(InvocationContext ic) {
    ic.removeSessionData("SimpleSearchManager", this);
    ic.removeSessionData("DashboardManager", this);
    ic.removeSessionData("TableCustomizationsManager", this);
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
    } else if (ic.getPagePath().isActionInputFormPagePath()) {
      reader = new ActionInputFormReader(ic);
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
    } else if (ic.getPagePath().isActionInputFormPagePath()) {
      return customizePage(ic, (new ActionInputFormReader(ic)).getInputForm());
    } else {
      throw new AssertionError("Unknown PagePath type : " + ic.getPagePath());
    }
  }

  @SuppressWarnings("unchecked")
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
    try {
      CustomizerInvocationUtils.invokeMethod(method, List.of(ic, page));
      // Since pageResponse is already successful and already refers to the page that
      // the customizer successfully modified, just return it (v.s. making a new response).
      return pageResponse;
    } catch (ResponseException re) {
      return pageResponse.copyUnsuccessfulResponse(re.getResponse());
    }
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

  // Invoke an action a bean.
  //
  // The invocation content identifies the bean to invoke the action on.
  //
  // The action must not return a value that should be displayed to the user.
  public Response<Void> invokeAction(
    InvocationContext ic,
    PageActionDef pageActionDef,
    List<FormProperty> formProperties
  ) {
    return (new ActionInvoker(ic, pageActionDef, formProperties)).invokeAction();
  }

  public synchronized SimpleSearchManager getSimpleSearchManager(InvocationContext ic) {
    SimpleSearchManager ret;
    ret = (SimpleSearchManager) ic.getSessionData("SimpleSearchManager", this);
    if (ret == null) {
      ret = new SimpleSearchManager();
      ic.storeSessionData("SimpleSearchManager", this, ret);
    }
    return ret;
  }

  public DashboardManager getDashboardManager(InvocationContext ic) {
    if (!getPageRepoDef().isSupportsDashboards()) {
      return null;
    }
    DashboardManager ret;
    ret = (DashboardManager) ic.getSessionData("DashboardManager", this);
    if (ret == null) {
      ret = new DashboardManager();
      ic.storeSessionData("DashboardManager", this, ret);
    }
    return ret;
  }

  public TableCustomizationsManager getTableCustomizationsManager(InvocationContext ic) {
    TableCustomizationsManager ret;
    ret = (TableCustomizationsManager) ic.getSessionData("TableCustomizationsManager", this);
    if (ret == null) {
      ret = new TableCustomizationsManager();
      ic.storeSessionData("TableCustomizationsManager", this, ret);
    }
    return ret;
  }
}
