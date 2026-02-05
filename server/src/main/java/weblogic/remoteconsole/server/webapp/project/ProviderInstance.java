// Copyright (c) 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.webapp.project;

import javax.json.Json;
import javax.json.JsonArray;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.container.ResourceContext;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.ResponseBuilder;
import javax.ws.rs.core.Response.Status;

import weblogic.remoteconsole.server.providers.ConfiguredProvider;
import weblogic.remoteconsole.server.providers.PdjRdjUtils;
import weblogic.remoteconsole.server.providers.ProjectManager;
import weblogic.remoteconsole.server.providers.ProjectManager.Project;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.webapp.FailedRequestException;
import weblogic.remoteconsole.server.webapp.WebAppUtils;

public class ProviderInstance extends PdjRdjUtils {
  private static Response performDisconnect(
    ResourceContext resContext,
    String projectName,
    String providerName) {
    ProjectManager projectManager = ProjectManager.getFromContext(resContext);
    Project proj = projectManager.getProject(projectName);
    if (proj == null) {
      throw new WebApplicationException(Response.status(
        Status.NOT_FOUND.getStatusCode(), "Project not found"
      ).build());
    }
    ConfiguredProvider prov = proj.getProvider(providerName);
    if (prov == null) {
      throw new WebApplicationException(Response.status(
        Status.NOT_FOUND.getStatusCode(), "Provider not found"
      ).build());
    }
    prov.terminate();
    return WebAppUtils.addCookieFromContext(
      resContext,
      Response.status(Status.OK)
        .entity(Json.createObjectBuilder().build())
        .type(MediaType.APPLICATION_JSON)
    ).build();
  }

  private static Response performSave(
    ResourceContext resContext,
    String projectName,
    String providerName,
    JsonObject payload) {
    if (!payload.containsKey("data")) {
      throw new WebApplicationException(Response.status(
        Status.BAD_REQUEST.getStatusCode(),
          "A save form must have a 'data' object").build());
    }
    InvocationContext ic =
      WebAppUtils.getInvocationContextFromResourceContext(resContext);
    ProjectManager projectManager = ProjectManager.getFromContext(resContext);
    Project proj = projectManager.getProject(projectName);
    if (proj == null) {
      throw new WebApplicationException(Response.status(
        Status.NOT_FOUND.getStatusCode(), "Project not found"
      ).build());
    }
    ConfiguredProvider prov = proj.getProvider(providerName);
    if (prov == null) {
      throw new WebApplicationException(Response.status(
        Status.NOT_FOUND.getStatusCode(), "Provider not found"
      ).build());
    }
    JsonObjectBuilder newBuilder = Json.createObjectBuilder(prov.getJSON());
    JsonObject newData = prov.populateFromFormData(
      ic, "Existing", payload.getJsonObject("data"), Json.createObjectBuilder()).build();
    newBuilder.add("name", prov.getName());
    for (String key : newData.keySet()) {
      newBuilder.add(key, newData.get(key));
    }
    prov.setJSON(newBuilder.build());
    projectManager.save(ic);
    return WebAppUtils.addCookieFromContext(
      resContext,
      Response.status(Status.OK)
        .entity(Json.createObjectBuilder().build())
        .type(MediaType.APPLICATION_JSON)
    ).build();
  }

  public static Response performSelect(
    ResourceContext resContext,
    String projectName,
    String providerName) {
    ProjectManager projectManager = ProjectManager.getFromContext(resContext);
    Project proj = projectManager.getProject(projectName);
    if (proj == null) {
      throw new WebApplicationException(Response.status(
        Status.NOT_FOUND.getStatusCode(), "Project not found"
      ).build());
    }
    ConfiguredProvider prov = proj.getProvider(providerName);
    if (prov == null) {
      throw new WebApplicationException(Response.status(
        Status.NOT_FOUND.getStatusCode(), "Provider not found"
      ).build());
    }
    try {
      prov.start(WebAppUtils.getInvocationContextFromResourceContext(resContext));
      prov.getLiveProvider().updateLastRootUsed(null);
    } catch (FailedRequestException e) {
      Response failedResponse = e.getResponse();
      JsonArray messages = null;
      int status = Status.BAD_REQUEST.getStatusCode();
      if (failedResponse != null) {
        status = failedResponse.getStatus();
        if ((failedResponse.getEntity() != null)
          && (failedResponse.getEntity() instanceof JsonObject)) {
          JsonObject entity = (JsonObject) failedResponse.getEntity();
          if (entity.containsKey("messages")) {
            messages = entity.getJsonArray("messages");
          }
        }
      }
      if (messages == null) {
        messages = Json.createArrayBuilder() 
          .add(Json.createObjectBuilder()
            .add("message", "Failed to connect")).build();
      }
      throw new WebApplicationException(
        Response.status(status)
          .entity(Json.createObjectBuilder().add("messages", messages).build())
          .type(MediaType.APPLICATION_JSON)
      .build());
    }
    InvocationContext ic =
      WebAppUtils.getInvocationContextFromResourceContext(resContext);
    projectManager.setCurrentProvider(ic, proj, prov);
    JsonObject goodResult = Json.createObjectBuilder()
      .add("resourceData", Json.createObjectBuilder()
        .add("label", "Root-ish")
        .add("resourceData", prov.getTypedResource().getHomeResourceDataLocation())).build();
    return WebAppUtils.addCookieFromContext(
      resContext,
      Response.status(Status.OK)
        .entity(goodResult)
        .type(MediaType.APPLICATION_JSON)
    ).build();
  }

  // The difference between "switch" and "select" is that "select" is performed
  // in the ProjectManagementTree and the "switch" is a menu item clicked while
  // the user is anywhere.  That means slightly different behavior in the
  // failure case. In the failure case, "select" can simply return a message to
  // display, but "switch" needs to go somewhere, so it goes to the
  // ProjectManagement table and returns an error message.
  public static Response performSwitch(
    ResourceContext resContext,
    String projectName,
    String providerName) {
    try {
      return performSelect(resContext, projectName, providerName);
    } catch (WebApplicationException e) {
      Response newResp = getEditViewRDJ(resContext, projectName, providerName);
      ResponseBuilder ret = Response.fromResponse(newResp);
      InvocationContext ic =
        WebAppUtils.getInvocationContextFromResourceContext(resContext);
      ic.getProjectManager().unsetCurrentLiveProvider();
      if (e.getResponse().getEntity() instanceof JsonObject) {
        JsonObject entity = (JsonObject) e.getResponse().getEntity();
        if (entity.containsKey("messages")) {
          JsonObjectBuilder builder =
            Json.createObjectBuilder((JsonObject) newResp.getEntity());
          builder.add("messages",
            Json.createArrayBuilder(entity.getJsonArray("messages")));
          ret.entity(builder.build());
        }
      }
      return ret.build();
    }
  }

  private static Response getEditViewRDJ(
    ResourceContext resContext,
    String projectName,
    String providerName) {
    ProjectManager projectManager = ProjectManager.getFromContext(resContext);
    ProjectManager.Project proj = projectManager.getProject(projectName);
    if (proj == null) {
      throw new WebApplicationException(Response.status(
        Status.NOT_FOUND.getStatusCode(), "Project not found"
      ).build());
    }
    ConfiguredProvider prov = proj.getProvider(providerName);
    if (prov == null) {
      throw new WebApplicationException(Response.status(
        Status.NOT_FOUND.getStatusCode(), "Provider not found"
      ).build());
    }
    JsonObjectBuilder builder = Json.createObjectBuilder();
    InvocationContext ic =
      WebAppUtils.getInvocationContextFromResourceContext(resContext);

    JsonObjectBuilder provBuilder = Json.createObjectBuilder();
    provBuilder.add("name", valueObject(prov.getName()));
    provBuilder.add("state", valueObject("Inactive"));
    prov.populateFormData(ic, provBuilder);
    builder.add("data", provBuilder.build());

    builder.add("breadCrumbs", Json.createArrayBuilder()
      .add(resourceDataMaker("Projects", "/api/project/data"))
      .add(
        resourceDataMaker(projectName, "/api/project/data/" + projectName)));

    // No links
    builder.add("links", Json.createArrayBuilder().build());

    builder.add("navigation", projectName + "/" + prov.getName());

    builder.add("actions", Json.createObjectBuilder()
      .add("select", Json.createObjectBuilder()
        .add("invoker", Json.createObjectBuilder()
          .add("resourceData", "/api/project/data"
            + "/" + projectName
            + "/" + providerName
            + "?param=select")))
      .add("disconnect", Json.createObjectBuilder()
        .add("invoker", Json.createObjectBuilder()
          .add("resourceData", "/api/project/data"
            + "/" + projectName
            + "/" + providerName
            + "?param=disconnect"))));

    builder.add("self", Json.createObjectBuilder()
      .add("kind", "sliceForm")
      .add("label", prov.getName())
      .add("resourceData",
        "/api/project/data/" + projectName + "/" + prov.getName()));

    JsonObjectBuilder pdjBuilder = Json.createObjectBuilder();
    prov.populateFormPDJ(ic, pdjBuilder);
    builder.add("inlinePageDescription", pdjBuilder.build());

    return WebAppUtils.addCookieFromContext(resContext,
      Response.ok(builder.build(), MediaType.APPLICATION_JSON)
    ).build();
  }

  public static Response processGet(
    ResourceContext resContext,
    String projectName,
    String providerName,
    String param,
    String path
  ) {
    if (param.equals("")) {
      return getEditViewRDJ(resContext, projectName, providerName);
    }
    if (param.equals("switch")) {
      return performSwitch(resContext, projectName, providerName);
    }
    if (param.equals("select")) {
      return performSelect(resContext, projectName, providerName);
    }
    throw new WebApplicationException(Response.status(
      Status.BAD_REQUEST.getStatusCode(),
        param + " is not supported on a provider instance").build());
  }

  public static Response processPost(
    ResourceContext resContext,
    String projectName,
    String providerName,
    String param,
    JsonObject payload) {
    if (param.equals("switch")) {
      return performSwitch(resContext, projectName, providerName);
    }
    if (param.equals("select")) {
      return performSelect(resContext, projectName, providerName);
    }
    if (param.equals("disconnect")) {
      return performDisconnect(resContext, projectName, providerName);
    }
    if (param.equals("")) {
      return performSave(resContext, projectName, providerName, payload);
    }
    throw new WebApplicationException(Response.status(
      Status.BAD_REQUEST.getStatusCode(),
        param + " is not supported on a provider instance").build());
  }
}
