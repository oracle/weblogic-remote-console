// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.webapp;

import javax.json.Json;
import javax.json.JsonObject;

import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.Response;

/**
 * Converts a Response<PageDesc> to a JAXRS Response.
 */
public class GetPageDescResponseMapper extends ResponseMapper<JsonObject> {

  public static javax.ws.rs.core.Response toResponse(
    InvocationContext invocationContext,
    Response<JsonObject> response
  ) {
    return new GetPageDescResponseMapper(invocationContext, response).toResponse();
  }

  private GetPageDescResponseMapper(InvocationContext invocationContext, Response<JsonObject> response) {
    super(invocationContext, response);
  }

  @Override
  protected void addResults() {
    getEntityBuilder().addAll(Json.createObjectBuilder(getResponse().getResults()));
  }
}
