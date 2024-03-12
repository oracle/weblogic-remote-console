// Copyright (c) 2023, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.webapp;

import javax.json.JsonObject;

import weblogic.remoteconsole.server.repo.BeanTreePath;
import weblogic.remoteconsole.server.repo.Dashboard;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.Response;

/**
 * Utility code called by the FilteringDashboardMBeanCollectionChildResource
 * JAXRS resource to invoke an action on a dashboard.
 */
public class FilteringDashboardInvokeActionHelper extends InvokeActionHelper {

  public FilteringDashboardInvokeActionHelper(InvocationContext ic, String action, JsonObject requestBody) {
    super(ic, action, requestBody);
  }

  @Override
  protected Response<Void> verifyExists() {
    Response<Void> response = new Response<>();
    InvocationContext ic = getInvocationContext();
    Response<Dashboard> getResponse =
      ic.getPageRepo()
        .asPageReaderRepo()
        .getDashboardManager(ic)
        .getDashboard(ic);
    if (!getResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(getResponse);
    }
    return response.setSuccess(null);
  }

  // Normally the invocation context for a table row uses the
  // same pagepath as the bean in the original ic.
  // Dashboards need to switch them to use the pagepath
  // for the row's type's table.
  // This will need to be improved if dashboards are
  // ever improved to invoke actions from slice forms.
  @Override
  protected InvocationContext getTableRowIC(BeanTreePath rowBTP) {
    InvocationContext rowIC = super.getTableRowIC(rowBTP);
    rowIC.setPagePath(
      getInvocationContext().getPageRepo().getPageRepoDef().newTablePagePath(
        getInvocationContext().getBeanTreePath().getTypeDef()
      )
    );
    return rowIC;
  }
}
