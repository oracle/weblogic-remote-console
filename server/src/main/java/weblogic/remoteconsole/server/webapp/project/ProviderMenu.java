// Copyright (c) 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.webapp.project;

import javax.json.Json;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObjectBuilder;
import javax.ws.rs.container.ResourceContext;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import weblogic.remoteconsole.server.providers.ConfiguredProvider;
import weblogic.remoteconsole.server.providers.PdjRdjUtils;
import weblogic.remoteconsole.server.providers.ProjectManager.Project;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.webapp.WebAppUtils;

public class ProviderMenu extends PdjRdjUtils {
  public static Response processGet(@Context ResourceContext resContext) {
    JsonObjectBuilder builder = Json.createObjectBuilder();
    InvocationContext ic =
      WebAppUtils.getInvocationContextFromResourceContext(resContext);
    JsonArrayBuilder dataBuilder = Json.createArrayBuilder();
    dataBuilder.add(Json.createObjectBuilder()
      .add("label", "Provider Information")
      .add("description", "Status and data about the active provider")
      .add("resourceData", "/api/-current-/status/form"));
    dataBuilder.add(Json.createObjectBuilder()
      .add("label", "Go To Project/Provider Table")
      .add("description", "Edit and view full list of projects and providers")
      .add("resourceData", "/api/project/data"));
    Project proj = ic.getProjectManager().getCurrentProject();
    if (proj != null) {
      for (ConfiguredProvider prov : proj.getProviders()) {
        dataBuilder.add(Json.createObjectBuilder()
          .add("label", prov.getName())
          .add("description", "Activate provider")
          .add("resourceData", "/api/project/data"
            + '/' + proj.getName()
            + '/' + prov.getName()
            + "?param=select"));
      }
    }
    builder.add("data", dataBuilder);

    // No self
    // No navigation
    // No breadcrumbs
    builder.add("inlinePageDescription", Json.createObjectBuilder()
      .add("presentationHint", "menu"));
    return
      WebAppUtils.addCookieFromContext(resContext,
        Response.ok(builder.build(), MediaType.APPLICATION_JSON)
      ).build();
  }
}
