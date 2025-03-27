// Copyright (c) 2023, 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.webapp;

import java.util.List;
import java.util.Map;
import javax.json.Json;
import javax.json.JsonObject;

import weblogic.console.utils.StringUtils;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.Response;

/**
 * Utility code called by the JMSMessageManagementRuntimeMBeanCollectionChildResource
 * JAXRS resource to invoke actions.
 */
public class JMSMessageManagementRuntimeMBeanInvokeActionHelper extends InvokeActionHelper {

  private static Map<String,String> SELECTED_MESSAGES_ACTIONS =
    Map.of(
      "deleteSelectedMessages", "deleteMessages",
      "exportSelectedMessages", "exportMessages",
      "moveSelectedMessages", "moveMessages"
    );

  private JMSMessageManagementRuntimeMBeanInvokeActionHelper(
    InvocationContext ic,
    String action,
    JsonObject requestBody
  ) {
    super(ic, action, requestBody);
  }

  public static javax.ws.rs.core.Response invokeMessagesAction(
    InvocationContext ic,
    String action,
    JsonObject requestBody
  ) {
    return new JMSMessageManagementRuntimeMBeanInvokeActionHelper(ic, action, requestBody).invokeAction();
  }

  @Override
  protected Response<Void> invokeSliceTableRowsAction() {
    if (SELECTED_MESSAGES_ACTIONS.containsKey(getPageActionDef().getActionName())) {
      return invokeSelectedMessagesAction();
    }
    return super.invokeSliceTableRowsAction();
  }

  private Response<Void> invokeSelectedMessagesAction() {
    Response<Void> response = new Response<>();
    String selectorActionName =
      SELECTED_MESSAGES_ACTIONS.get(getPageActionDef().getActionName());
    Response<String> r = createSelectorForRows();
    if (r == null) {
      // No rows were selected. Do nothing and return success.
      return response.setSuccess(null);
    }
    if (!r.isSuccess()) {
      return response.copyUnsuccessfulResponse(r);
    }
    String selector = r.getResults();
    JsonObject selectorActionRequestBody =
      createSelectorActionRequestBody(selector);
    JMSMessageManagementRuntimeMBeanInvokeActionHelper selectorActionHelper =
      new JMSMessageManagementRuntimeMBeanInvokeActionHelper(
        getInvocationContext(),
        selectorActionName,
        createSelectorActionRequestBody(selector)
      );
    return selectorActionHelper.invokeActionReturnResponse();
  }

  private Response<String> createSelectorForRows() {
    Response<String> response = new Response<>();
    Response<List<String>> r =
      SliceTableActionRequestBodyMapper.fromRequestBody(getInvocationContext(), getRequestBody());
    if (!r.isSuccess()) {
      return response.copyUnsuccessfulResponse(r);
    }
    List<String> identities = r.getResults();
    if (identities.isEmpty()) {
      return null;
    }
    boolean first = true;
    StringBuilder sb = new StringBuilder();
    for (String identity : identities) {
      if (!first) {
        sb.append(" OR ");
      }
      first = false;
      String selectorValue = StringUtils.nonNull(identity).replaceAll("'", "''");
      sb.append("( JMSMessageID = '" + selectorValue + "' )");
    }
    return response.setSuccess(sb.toString());
  }

  private JsonObject createSelectorActionRequestBody(String selector) {
    return
      Json.createObjectBuilder()
        .add(
          "data",
          // Create a copy of the original request body's "data"
          Json.createObjectBuilder(
            getRequestBody().getJsonObject("data")
          )
          // Add the selector to it.
          .add(
            "selector",
            Json.createObjectBuilder().add("value", selector)
          )
        )
        .build();
  }
}
