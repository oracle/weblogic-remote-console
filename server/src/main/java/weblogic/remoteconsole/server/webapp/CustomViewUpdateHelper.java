// Copyright (c) 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.webapp;

import java.util.List;
import javax.json.JsonObject;

import weblogic.remoteconsole.server.repo.CustomViewQuery;
import weblogic.remoteconsole.server.repo.CustomViewQueryManager;
import weblogic.remoteconsole.server.repo.FormProperty;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.Response;

/**
 * Utility code called by the CustomViewMBeanCollectionChildResource
 * JAXRS resource to update a view's query.
 */
public class CustomViewUpdateHelper {

  private CustomViewUpdateHelper() {
  }

  public static javax.ws.rs.core.Response update(InvocationContext ic, JsonObject requestBody) {
    Response<Void> response = new Response<>();
    // If this page is read-only, return MethodNotAllowed
    Response<Boolean> readOnlyResponse = UpdateHelper.isReadOnly(ic);
    if (!readOnlyResponse.isSuccess()) {
      response.copyUnsuccessfulResponse(readOnlyResponse);
    } else {
      if (readOnlyResponse.getResults()) {
        return javax.ws.rs.core.Response.status(javax.ws.rs.core.Response.Status.METHOD_NOT_ALLOWED).build();
      } else {
        response = doUpdate(ic, requestBody);
      }
    }
    return VoidResponseMapper.toResponse(ic, response);
  }

  private static Response<Void> doUpdate(InvocationContext ic, JsonObject requestBody) {
    Response<Void> response = new Response<>();
    // Unmarshal the request body
    Response<List<FormProperty>> unmarshalResponse = FormRequestBodyMapper.fromRequestBody(ic, requestBody);
    if (!unmarshalResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(unmarshalResponse);
    }
    // Convert it to a new custom view query
    Response<CustomViewQuery> queryResponse =
      CustomViewQueryManager.updateQuery(ic, unmarshalResponse.getResults());
    if (!queryResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(queryResponse);
    }
    // Update the custom view to use the query
    return ic.getPageRepo().asPageReaderRepo().getCustomViewManager().updateView(ic, queryResponse.getResults());
  }
}
