// Copyright (c) 2020, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package com.oracle.weblogic.console.backend.services.about;

import javax.json.Json;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;
import javax.ws.rs.GET;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import io.helidon.config.Config;
import weblogic.console.backend.ConsoleBackendRuntime;

public class AboutResource {

  @GET
  @Produces(MediaType.APPLICATION_JSON)
  public JsonObject about() {
    Config config = ConsoleBackendRuntime.INSTANCE.getConfig();
    JsonObjectBuilder jsonObjectBuilder =
      Json.createObjectBuilder()
        .add("name", config.get("name").asString().orElse(""))
        .add("version", config.get("version").asString().orElse(""));
    return
      Json.createObjectBuilder()
        .add("about", jsonObjectBuilder).build();
  }
}
