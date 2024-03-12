// Copyright (c) 2020, 2023, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.webapp;

import javax.json.Json;
import javax.json.JsonObjectBuilder;
import javax.ws.rs.GET;
import javax.ws.rs.Produces;
import javax.ws.rs.container.ResourceContext;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import weblogic.remoteconsole.server.ConsoleBackendRuntimeConfig;

public class AboutResource {
  @GET
  @Produces(MediaType.APPLICATION_JSON)
  public Response about(@Context ResourceContext context) {
    JsonObjectBuilder builder =
      Json.createObjectBuilder().add("about",
        Json.createObjectBuilder()
          .add("name", ConsoleBackendRuntimeConfig.getName())
          .add("version", ConsoleBackendRuntimeConfig.getVersion())
        .build()
      );

    return
      WebAppUtils.addCookieFromContext(context,
        Response.ok(builder.build(), MediaType.APPLICATION_JSON)
      ).build();
  }
}
