// Copyright (c) 2020, 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.webapp;

import java.util.ArrayList;
import java.util.List;
import javax.json.Json;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObjectBuilder;
import javax.ws.rs.GET;
import javax.ws.rs.Produces;
import javax.ws.rs.container.ResourceContext;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import weblogic.remoteconsole.server.ConsoleBackendRuntimeConfig;

public class AboutResource {
  private static List<CapabilityProvider> provs = new ArrayList<>();

  @GET
  @Produces(MediaType.APPLICATION_JSON)

  public Response about(@Context ResourceContext context) {
    List<String> caps = new ArrayList<>();
    for (CapabilityProvider prov : provs) {
      caps.addAll(prov.getCapabilities());
    }
    JsonArrayBuilder capArray = Json.createArrayBuilder();
    for (String cap : caps) {
      capArray.add(cap);
    }
    JsonObjectBuilder builder =
      Json.createObjectBuilder().add("about",
        Json.createObjectBuilder()
          .add("name", ConsoleBackendRuntimeConfig.getName())
          .add("version", ConsoleBackendRuntimeConfig.getVersion())
          .add("capabilities", capArray.build())
        .build()
      );

    return
      WebAppUtils.addCookieFromContext(context,
        Response.ok(builder.build(), MediaType.APPLICATION_JSON)
      ).build();
  }

  public static void addCapabilityProvider(CapabilityProvider prov) {
    provs.add(prov);
  }

  public interface CapabilityProvider {
    public List<String> getCapabilities();
  }
}
