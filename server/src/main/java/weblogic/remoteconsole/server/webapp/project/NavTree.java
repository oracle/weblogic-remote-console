// Copyright (c) 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.webapp.project;

import javax.json.Json;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObjectBuilder;
import javax.ws.rs.container.ResourceContext;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import weblogic.remoteconsole.common.repodef.LocalizedConstants;
import weblogic.remoteconsole.server.providers.ConfiguredProvider;
import weblogic.remoteconsole.server.providers.PdjRdjUtils;
import weblogic.remoteconsole.server.providers.ProjectManager;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.webapp.WebAppUtils;

public class NavTree extends PdjRdjUtils {
  public static Response postNavtreeRequest(ResourceContext resContext) {
    ProjectManager projectManager =
      ProjectManager.getFromContext(resContext);
    InvocationContext ic = WebAppUtils.getInvocationContextFromResourceContext(resContext);
    JsonObjectBuilder builder = Json.createObjectBuilder();
    String projectsLabel = ic.getLocalizer().localizeString(LocalizedConstants.PROJECTS_NAVIGATION_LABEL);
    builder.add("name", projectsLabel);
    builder.add("label", projectsLabel);
    builder.add("expanded", true);
    builder.add("selectable", true);

    JsonArrayBuilder projectsBuilder = Json.createArrayBuilder();
    for (ProjectManager.Project proj : projectManager.getProjects()) {
      JsonArrayBuilder providersBuilder = Json.createArrayBuilder();
      for (ConfiguredProvider prov : proj.getProviders()) {
        providersBuilder.add(Json.createObjectBuilder()
          .add("name", prov.getName())
          .add("label", prov.getName())
          .add("resourceData",
            resourceDataMaker(proj.getName(),
              "/api/project/data/" + proj.getName() + "/" + prov.getName()))
          .add("selectable", true)
          .add("expandable", false)
          .add("type", "singleton"));
      }
      projectsBuilder.add(Json.createObjectBuilder()
        .add("resourceData",
          resourceDataMaker(proj.getName(), "/api/project/data/" + proj.getName()))
        .add("name", proj.getName())
        .add("label", proj.getName())
        .add("expanded", true)
        .add("selectable", true)
        .add("type", "collection")
        .add("contents", providersBuilder.build()));
    }
    // JsonArrayBuilder projectsSingletonCollectionBuilder = Json.createArrayBuilder();
    // projectsSingletonCollectionBuilder.add(Json.createObjectBuilder()
    //   .add("name", "Projects")
    //   .add("resourceData",
    //     resourceDataMaker("Projects", "/api/project/data"))
    //   .add("label", "Projects")
    //   .add("selectable", true)
    //   .add("expandable", true)
    //   .add("type", "collection")
    //   .add("contents", projectsBuilder.build()));
    // builder.add("contents", projectsSingletonCollectionBuilder.build());
    builder.add("resourceData",
      resourceDataMaker("Projects", "/api/project/data"));
    builder.add("contents", projectsBuilder.build());
    return
      WebAppUtils.addCookieFromContext(resContext,
        Response.ok(builder.build(), MediaType.APPLICATION_JSON)
      ).build();
  }
}
