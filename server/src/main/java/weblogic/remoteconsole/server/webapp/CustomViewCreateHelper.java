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
 * Utility code called by the CustomViewCollectionResource
 * JAXRS resource to create a custom view.
 */
public class CustomViewCreateHelper extends CreateHelper {

  public static javax.ws.rs.core.Response create(InvocationContext ic, JsonObject requestBody) {
    return (new CustomViewCreateHelper()).createBean(ic, requestBody);
  }

  private CustomViewCreateHelper() {
  }

  @Override
  protected Response<Void> createBean(InvocationContext ic, List<FormProperty> properties) {
    Response<Void> response = new Response<>();
    Response<CustomViewQuery> queryResponse =
      CustomViewQueryManager.createQuery(ic, properties);
    if (!queryResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(queryResponse);
    }
    Response<String> createResponse =
      ic.getPageRepo().asPageReaderRepo().getCustomViewManager().createView(
        ic,
        queryResponse.getResults()
      );
    if (!createResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(createResponse);
    }
    return response.setSuccess(null);
  }
}
