// Copyright (c) 2020, 2021, Oracle and/or its affiliates.
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

import io.helidon.config.Config;
import weblogic.remoteconsole.server.ConsoleBackendRuntime;

public class AboutResource {
  @GET
  @Produces(MediaType.APPLICATION_JSON)
  public Response about(@Context ResourceContext context) {
    Config config = ConsoleBackendRuntime.INSTANCE.getConfig();
    JsonObjectBuilder builder =
      Json.createObjectBuilder().add("about",
        Json.createObjectBuilder()
          .add("name", config.get("name").asString().orElse(""))
          .add("version", config.get("version").asString().orElse("")
        ).build()
      );

    return
      WebAppUtils.addCookieFromContext(context,
        Response.ok(builder.build(), MediaType.APPLICATION_JSON)
      ).build();
  }
}
