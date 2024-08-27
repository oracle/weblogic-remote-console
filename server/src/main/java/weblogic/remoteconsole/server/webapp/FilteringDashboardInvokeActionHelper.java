// Copyright (c) 2023, 2024, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.webapp;

import java.util.List;
import javax.json.JsonObject;

import weblogic.remoteconsole.common.repodef.PagePath;
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
      rowIC.getPageRepo().getPageRepoDef().newTablePagePath(
        rowIC.getBeanTreePath().getTypeDef()
      )
    );
    return rowIC;
  }

  @Override
  protected Response<InvocationContext> getActionInputFormIC() {
    // Return the invocation context for the first row's action input form
    // TBD - what if the rows are heterogeneous?
    Response<InvocationContext> response = new Response<>();
    Response<List<BeanTreePath>> rbResponse =
      TableActionRequestBodyMapper.fromRequestBody(getInvocationContext(), getRequestBody());
    if (!rbResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(rbResponse);
    }
    BeanTreePath firstRowBTP = rbResponse.getResults().get(0);
    BeanTreePath collectionBTP = BeanTreePath.create(firstRowBTP.getBeanRepo(), firstRowBTP.getPath().getParent());
    InvocationContext aifIC = getTableRowIC(collectionBTP);
    aifIC.setPagePath(
      PagePath.newActionInputFormPagePath(aifIC.getPagePath(), getAction())
    );
    return response.setSuccess(aifIC);
  }
}
