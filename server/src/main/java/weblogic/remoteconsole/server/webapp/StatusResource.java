// Copyright (c) 2020, 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.webapp;

import java.util.LinkedHashMap;
import javax.json.Json;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.container.ResourceContext;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import weblogic.remoteconsole.server.providers.Provider;
import weblogic.remoteconsole.server.repo.InvocationContext;

// getStatus returns a report on the status to be used for checking health and
// the like.
// getStatusForm returns an actual page (RDJ) to display to the user.
public class StatusResource {
  @GET
  @Produces(MediaType.APPLICATION_JSON)
  public Response status(@Context ResourceContext resContext) {
    InvocationContext ic =
      WebAppUtils.getInvocationContextFromResourceContext(resContext);
    Provider prov = ic.getProjectManager().getCurrentLiveProvider();
    prov.updateStatus(ic);
    return
      WebAppUtils.addCookieFromContext(resContext,
        Response.ok(Json.createObjectBuilder().build(), MediaType.APPLICATION_JSON)
      ).build();
  }

  // At this point, this is only used for testing.  For example, when we are
  // running the JMS tests, we want to make sure that we have the JMS
  // extension features that exist only in later releases.
  @GET
  @Produces(MediaType.APPLICATION_JSON)
  @Path("capabilities")
  public Response getCapabilities(@Context ResourceContext resContext) {
    InvocationContext ic =
      WebAppUtils.getInvocationContextFromResourceContext(resContext);
    Provider prov = ic.getProjectManager().getCurrentLiveProvider();
    prov.updateStatus(ic);
    JsonObjectBuilder builder = Json.createObjectBuilder();
    JsonObject json = prov.toJSON(ic);
    if (json.containsKey("capabilities")) {
      builder.add("capabilities", json.getJsonArray("capabilities"));
    }
    return
      WebAppUtils.addCookieFromContext(resContext,
        Response.ok(builder.build(), MediaType.APPLICATION_JSON)
      ).build();
  }

  @GET
  @Produces(MediaType.APPLICATION_JSON)
  @Path("form")
  public Response statusForm(@Context ResourceContext resContext) {
    InvocationContext ic =
      WebAppUtils.getInvocationContextFromResourceContext(resContext);
    Provider prov = ic.getProvider();
    LinkedHashMap<String, String> result = prov.getStatusMap(ic);
    JsonObjectBuilder pdjBuilder = Json.createObjectBuilder();
    JsonObjectBuilder rdjBuilder = Json.createObjectBuilder();
    if (result.containsKey("introductionHTML")) {
      pdjBuilder.add("introductionHTML", result.get("introductionHTML"));
      result.remove("introductionHTML");
    }
    pdjBuilder.add("presentation", Json.createObjectBuilder()
      .add("singleColumn", true));
    JsonArrayBuilder pdjProperties = Json.createArrayBuilder();
    JsonObjectBuilder rdjProperties = Json.createObjectBuilder();
    for (String fieldLabel : result.keySet()) {
      if (fieldLabel.startsWith("INDIRECT-")) {
        String useLabel = fieldLabel.replaceAll("^INDIRECT-", "");
        pdjProperties.add(Json.createObjectBuilder()
          .add("name", useLabel)
          .add("label", useLabel)
          .add("type", "multiLineString")
          .add("width", "xxl")
          .add("readOnly", true));
        rdjProperties.add(useLabel, Json.createObjectBuilder()
          .add("value", result.get(fieldLabel))
          .add("indirect", true)
          .add("set", false));
      } else {
        pdjProperties.add(Json.createObjectBuilder()
          .add("name", fieldLabel)
          .add("label", fieldLabel)
          .add("type", "String")
          .add("readOnly", true));
        rdjProperties.add(fieldLabel, Json.createObjectBuilder()
          .add("value", result.get(fieldLabel))
          .add("set", false));
      }
    }
    pdjBuilder.add("sliceForm", Json.createObjectBuilder()
      .add("readOnly", true)
      .add("properties", pdjProperties));
    rdjBuilder.add("data", rdjProperties);
    rdjBuilder.add("inlinePageDescription", pdjBuilder);
    rdjBuilder.add("breadCrumbs", Json.createArrayBuilder());
    rdjBuilder.add("links", Json.createArrayBuilder().build());
    rdjBuilder.add("navigation", "");

    rdjBuilder.add("self", Json.createObjectBuilder()
      .add("kind", "form")
      .add("label", "Status")
      .add("resourceData",
        "/api/-current-/status/form"));

    return
      WebAppUtils.addCookieFromContext(resContext,
        Response.ok(rdjBuilder.build(), MediaType.APPLICATION_JSON)
      ).build();
  }
}
