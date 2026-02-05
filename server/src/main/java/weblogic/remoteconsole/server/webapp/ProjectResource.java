// Copyright (c) 2026, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.webapp;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.List;
import javax.json.Json;
import javax.json.JsonObject;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.container.ResourceContext;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.PathSegment;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import org.glassfish.jersey.media.multipart.FormDataParam;
import weblogic.remoteconsole.server.providers.PdjRdjUtils;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.webapp.project.NavTree;
import weblogic.remoteconsole.server.webapp.project.ProjectTable;
import weblogic.remoteconsole.server.webapp.project.ProviderInstance;
import weblogic.remoteconsole.server.webapp.project.ProviderMenu;
import weblogic.remoteconsole.server.webapp.project.ProviderTable;

// Note that there are no endpoints for PDJs.  While the rest of the CBE puts
// RDJs and operations under /data, here we put different types of endpoints
// under a different top-level.
//
// Every endpoint, except navtree which has to conform to its own rules, follows
// the rule that it is /<top>/<project>/<provider>, where project and provider
// are optional.  In the case of create, "top" is createForm/type and
// create/type.
public class ProjectResource extends PdjRdjUtils {
  @GET
  @Produces(MediaType.APPLICATION_JSON)
  @Path("/menu")
  public Response providerMenu(@Context ResourceContext resContext) {
    return ProviderMenu.processGet(resContext);
  }

  @GET
  @Produces(MediaType.APPLICATION_JSON)
  @Path("/data")
  public Response getRoot(
    @QueryParam("param") String param,
    @Context ResourceContext resContext) {
    if (param == null) {
      param = "";
    }
    setProjectManagerIsCurrent(resContext);
    return ProjectTable.processGet(resContext, param);
  }

  @GET
  @Produces(MediaType.APPLICATION_JSON)
  @Path("/data/{pathSegments: .*}")
  public Response get(
    @PathParam("pathSegments") List<PathSegment> pathSegments,
    @QueryParam("param") String param,
    @QueryParam("path") String path,
    @Context ResourceContext resContext) {
    if (param == null) {
      param = "";
    }
    if (pathSegments.size() == 1) {
      return ProviderTable.processGet(
        resContext, pathSegments.get(0).getPath(), param);
    }
    if (pathSegments.size() == 2) {
      return ProviderInstance.processGet(
        resContext,
        pathSegments.get(0).getPath(),
        pathSegments.get(1).getPath(),
        param,
        path);
    }
    return WebAppUtils.addCookieFromContext(resContext,
      Response.status(
        Status.BAD_REQUEST.getStatusCode(), "This request is poorly formed")
    ).build();
  }

  @POST
  @Produces(MediaType.APPLICATION_JSON)
  @Consumes(MediaType.APPLICATION_JSON)
  @Path("/data")
  public Response postRoot(
    @QueryParam("param") String param,
    @Context ResourceContext resContext,
    JsonObject payload) {
    if (param == null) {
      param = "";
    }
    return ProjectTable.processPost(resContext, param, payload);
  }

  @POST
  @Consumes(MediaType.MULTIPART_FORM_DATA)
  @Produces(MediaType.APPLICATION_JSON)
  @Path("/data")
  public Response postRootMultipart(
    @QueryParam("param") String param,
    @Context ResourceContext resContext,
    @FormDataParam("requestBody") InputStream dataStream,
    @FormDataParam("contents") InputStream modelStream) {
    StringBuffer contents = new StringBuffer();
    try (BufferedReader reader = new BufferedReader(new InputStreamReader(modelStream))) {
      String line;
      // FortifyIssueSuppression Denial of Service
      // There is a length check
      // FortifyIssueSuppression Denial of Service: StringBuilder
      // There is a length check
      while ((line = reader.readLine()) != null) {
        if (contents.length() != 0) {
          contents.append('\n');
        }
        // FortifyIssueSuppression Denial of Service: StringBuilder
        // There is a length check
        contents.append(line);
      }
      if (contents.length() > 10 * 1024 * 1024) {
        throw new Exception("Too big");
      }
    } catch (Exception e) {
      throw new WebApplicationException(Response.status(
        Status.BAD_REQUEST.getStatusCode(),
          "Problem reading data"
      ).build());
    }
    JsonObject payload;
    try {
      JsonObject requestBody = Json.createReader(dataStream).readObject();
      payload = Json.createObjectBuilder()
        .add("data", Json.createObjectBuilder(requestBody.getJsonObject("data"))
            .add("generatedContents", contents.toString())).build();
    } catch (Exception e) {
      throw new WebApplicationException(Response.status(
        Status.BAD_REQUEST.getStatusCode(),
          "Problem reading data"
      ).build());
    }
    if (param == null) {
      param = "";
    }
    return ProjectTable.processPost(resContext, param, payload);
  }

  @POST
  @Consumes(MediaType.MULTIPART_FORM_DATA)
  @Produces(MediaType.APPLICATION_JSON)
  @Path("/data/{pathSegments: .*}")
  public Response postMultipart(
    @QueryParam("param") String param,
    @PathParam("pathSegments") List<PathSegment> pathSegments,
    @Context ResourceContext resContext,
    @FormDataParam("requestBody") InputStream dataStream,
    @FormDataParam("contents") InputStream modelStream) {
    StringBuffer contents = new StringBuffer();
    try (BufferedReader reader = new BufferedReader(new InputStreamReader(modelStream))) {
      String line;
      // FortifyIssueSuppression Denial of Service
      // There is a length check
      // FortifyIssueSuppression Denial of Service: StringBuilder
      // There is a length check
      while ((line = reader.readLine()) != null) {
        if (contents.length() != 0) {
          contents.append('\n');
        }
        // FortifyIssueSuppression Denial of Service: StringBuilder
        // There is a length check
        contents.append(line);
      }
      if (contents.length() > 10 * 1024 * 1024) {
        throw new Exception("Too big");
      }
    } catch (Exception e) {
      throw new WebApplicationException(Response.status(
        Status.BAD_REQUEST.getStatusCode(),
          "Problem reading data"
      ).build());
    }
    JsonObject payload;
    try {
      JsonObject requestBody = Json.createReader(dataStream).readObject();
      payload = Json.createObjectBuilder()
        .add("data", Json.createObjectBuilder(requestBody.getJsonObject("data"))
            .add("generatedContents", contents.toString())).build();
    } catch (Exception e) {
      throw new WebApplicationException(Response.status(
        Status.BAD_REQUEST.getStatusCode(),
          "Problem reading data"
      ).build());
    }
    return post(param, pathSegments, resContext, payload);
  }

  private void setProjectManagerIsCurrent(ResourceContext resContext) {
    InvocationContext ic =
      WebAppUtils.getInvocationContextFromResourceContext(resContext);
    ic.getProjectManager().unsetCurrentLiveProvider();
  }

  @POST
  @Produces(MediaType.APPLICATION_JSON)
  @Consumes(MediaType.APPLICATION_JSON)
  @Path("/data/{pathSegments: .*}")
  public Response post(
    @QueryParam("param") String param,
    @PathParam("pathSegments") List<PathSegment> pathSegments,
    @Context ResourceContext resContext,
    JsonObject payload) {
    if (param == null) {
      param = "";
    }
    if (pathSegments.size() == 1) {
      return ProviderTable.processPost(resContext,
        pathSegments.get(0).getPath(),
        param,
        payload);
    }
    if (pathSegments.size() == 2) {
      return ProviderInstance.processPost(resContext,
        pathSegments.get(0).getPath(),
        pathSegments.get(1).getPath(),
        param,
        payload);
    }
    throw new WebApplicationException(Response.status(
      Status.BAD_REQUEST.getStatusCode(),
        "Moves only take one argument, the project name"
    ).build());
  }

  @POST
  @Produces(MediaType.APPLICATION_JSON)
  @Path("/navtree")
  public Response postNavtreeRequest(
    @Context ResourceContext resContext) {
    return NavTree.postNavtreeRequest(resContext);
  }
}
