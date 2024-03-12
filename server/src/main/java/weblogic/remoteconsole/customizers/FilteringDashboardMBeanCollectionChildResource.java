// Copyright (c) 2022, 2023, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.customizers;

import javax.json.JsonObject;
import javax.ws.rs.core.Response;

import weblogic.remoteconsole.common.repodef.BeanTypeDef;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.webapp.DeletableCollectionChildBeanResource;
import weblogic.remoteconsole.server.webapp.FilteringDashboardInvokeActionHelper;
import weblogic.remoteconsole.server.webapp.VoidResponseMapper;

/**
 * Base custom JAXRS resource for the FilteringDashboardMBean collection children
 */
public abstract class FilteringDashboardMBeanCollectionChildResource extends DeletableCollectionChildBeanResource {

  @Override
  protected Response deleteCollectionChild() {
    InvocationContext ic = getInvocationContext();
    String dashboardName = ic.getBeanTreePath().getLastSegment().getKey();
    return
      VoidResponseMapper.toResponse(
        ic,
        ic.getPageRepo().asPageReaderRepo().getDashboardManager(ic).deleteDashboard(ic, dashboardName)
      );
  }

  @Override
  protected Response getActionInputForm(String action, JsonObject requestBody) {
    return (new FilteringDashboardInvokeActionHelper(getInvocationContext(), action, requestBody)).getActionInputForm();
  }

  @Override
  protected Response invokeAction(String action, JsonObject requestBody) {
    return (new FilteringDashboardInvokeActionHelper(getInvocationContext(), action, requestBody)).invokeAction();
  }

  protected abstract String getTypeName();

  // Override this so that we use FilteringDashboardMBean pages
  // (v.s. the base DashboardMBean pages)
  @Override
  protected BeanTypeDef getTypeDef() {
    return
      getInvocationContext()
        .getPageRepo()
        .getBeanRepo()
        .getBeanRepoDef()
        .getTypeDef(getTypeName());
  }
}
