// Copyright (c) 2023, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.webapp;

import javax.json.JsonObject;
import javax.ws.rs.GET;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import weblogic.remoteconsole.server.providers.AdminServerDataProvider;

/**
 * This resource is used to get the status of the WLS domain of an admin server data provider.
 * Currently it's used to return whether the domain has security warnings.
 */
public class DomainStatusResource extends BaseResource {
  @GET
  @Produces(MediaType.APPLICATION_JSON)
  public Response getStatus() {
    AdminServerDataProvider provider = (AdminServerDataProvider)getInvocationContext().getProvider();
    JsonObject status = provider.getStatus(getInvocationContext());
    return Response.ok(status).build();
  }
}