// Copyright (c) 2022, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.webapp;

import javax.json.JsonObject;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import weblogic.remoteconsole.server.repo.Response;
import weblogic.remoteconsole.server.repo.SimpleSearchCriteria;

/**
 * Perform a simple search that finds beans whose nav tree node label contains a
 * string that the user provided (whitespace insensitive and case insensitive)
 */
public class SimpleSearchResource extends BaseResource {

  @POST
  @Consumes(MediaType.APPLICATION_JSON)
  @Produces(MediaType.APPLICATION_JSON)
  public javax.ws.rs.core.Response search(JsonObject requestBody) {
    return SimpleSearchResponseMapper.toResponse(getInvocationContext(), getResponse(requestBody));
  }

  private Response<String> getResponse(JsonObject requestBody) {
    Response<String> response = new Response<>();
    // Convert the request body into a SimpleSearchCriteria
    Response<SimpleSearchCriteria> criteriaResponse =
      SimpleSearchRequestBodyMapper.fromRequestBody(getInvocationContext(), requestBody);
    if (!criteriaResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(criteriaResponse);
    }
    SimpleSearchCriteria criteria = criteriaResponse.getResults();
    Response<String> createResponse =
      getInvocationContext().getPageRepo().asPageReaderRepo().getSimpleSearchManager().createSearch(
        getInvocationContext(),
        criteria
      );
    if (!createResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(createResponse);
    }
    return response.setSuccess(createResponse.getResults());
  }
}
