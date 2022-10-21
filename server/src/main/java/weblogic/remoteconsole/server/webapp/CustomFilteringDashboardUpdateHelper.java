// Copyright (c) 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.webapp;

import java.util.List;
import javax.json.JsonObject;

import weblogic.remoteconsole.server.repo.CustomFilteringDashboardConfig;
import weblogic.remoteconsole.server.repo.CustomFilteringDashboardConfigManager;
import weblogic.remoteconsole.server.repo.FormProperty;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.Response;

/**
 * Utility code called by the CustomFilteringDashboardMBeanCollectionChildResource
 * JAXRS resource to update a dashboard's config.
 */
public class CustomFilteringDashboardUpdateHelper {

  private CustomFilteringDashboardUpdateHelper() {
  }

  public static javax.ws.rs.core.Response update(InvocationContext ic, JsonObject requestBody) {
    Response<Void> response = new Response<>();
    Response<InvocationContext> icResponse =
      ic.getPageRepo().asPageReaderRepo().getActualSliceInvocationContext(ic);
    if (!icResponse.isSuccess()) {
      response.copyUnsuccessfulResponse(icResponse);
      return VoidResponseMapper.toResponse(ic, response);
    }
    InvocationContext actualIc = icResponse.getResults();
    // If this page is read-only, return MethodNotAllowed
    Response<Boolean> readOnlyResponse = UpdateHelper.isReadOnly(actualIc);
    if (!readOnlyResponse.isSuccess()) {
      response.copyUnsuccessfulResponse(readOnlyResponse);
    } else {
      if (readOnlyResponse.getResults()) {
        return javax.ws.rs.core.Response.status(javax.ws.rs.core.Response.Status.METHOD_NOT_ALLOWED).build();
      } else {
        response = doUpdate(actualIc, requestBody);
      }
    }
    return VoidResponseMapper.toResponse(actualIc, response);
  }

  private static Response<Void> doUpdate(InvocationContext ic, JsonObject requestBody) {
    Response<Void> response = new Response<>();
    // Unmarshal the request body
    Response<List<FormProperty>> unmarshalResponse = FormRequestBodyMapper.fromRequestBody(ic, requestBody);
    if (!unmarshalResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(unmarshalResponse);
    }
    // Convert it to a new config
    Response<CustomFilteringDashboardConfig> configResponse =
      CustomFilteringDashboardConfigManager.updateConfig(ic, unmarshalResponse.getResults());
    if (!configResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(configResponse);
    }
    // Update the dashboard to use the new config
    return
      ic
      .getPageRepo().asPageReaderRepo().getDashboardManager()
      .updateCustomFilteringDashboard(ic, configResponse.getResults());
  }
}
