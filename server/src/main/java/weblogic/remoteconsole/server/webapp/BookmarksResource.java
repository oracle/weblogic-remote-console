// Copyright (c) 2025, 2026, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.webapp;

import java.util.Map;
import javax.json.Json;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.container.ResourceContext;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import weblogic.remoteconsole.common.repodef.LocalizedConstants;
import weblogic.remoteconsole.server.providers.PdjRdjUtils;
import weblogic.remoteconsole.server.repo.InvocationContext;

public class BookmarksResource extends PdjRdjUtils {

  private static JsonObject pdj(InvocationContext ic) {
    JsonObjectBuilder pdjBuilder = Json.createObjectBuilder();
    pdjBuilder.add("introductionHTML",
      ic.getLocalizer().localizeString(LocalizedConstants.BOOKMARKS_INTRODUCTION));

    JsonObjectBuilder tableDescBuilder = Json.createObjectBuilder()
      .add("defaultSortProperty", "page")
      .add("requiresRowSelection", true)
      .add("rowSelectionProperty", "identity")
      .add("navigationProperty", "identity")
      .add("displayedColumns", Json.createArrayBuilder()
        .add(pdjObject("page", "Page", "String")));

    pdjBuilder.add("table", tableDescBuilder);

    return pdjBuilder.build();
  }

  @POST
  @Produces(MediaType.APPLICATION_JSON)
  @Path("add")
  public Response add(@Context ResourceContext resContext, JsonObject payload) {
    InvocationContext ic =
      WebAppUtils.getInvocationContextFromResourceContext(resContext);
    String resourceData = payload.getString("resourceData");
    String label = payload.getString("label");
    if ((resourceData == null) || (label == null)) {
      throw new WebApplicationException(Response.status(
        Status.BAD_REQUEST.getStatusCode(),
          "Bad payload, need label and resourceData"
      ).build());
    }
    ic.getFrontend().getBookmarkManager().add(ic, resourceData, label);
    return WebAppUtils.addCookieFromContext(resContext,
      Response.ok(Json.createObjectBuilder()
      .build(), MediaType.APPLICATION_JSON)
    ).build();
  }

  @POST
  @Produces(MediaType.APPLICATION_JSON)
  @Path("delete")
  public Response delete(@Context ResourceContext resContext, JsonObject payload) {
    InvocationContext ic =
      WebAppUtils.getInvocationContextFromResourceContext(resContext);
    String resourceData = payload.getString("resourceData");
    if (resourceData == null) {
      throw new WebApplicationException(Response.status(
        Status.BAD_REQUEST.getStatusCode(),
          "Bad payload, need label and resourceData"
      ).build());
    }
    ic.getFrontend().getBookmarkManager().delete(ic, resourceData);
    return WebAppUtils.addCookieFromContext(resContext,
      Response.ok(Json.createObjectBuilder()
      .build(), MediaType.APPLICATION_JSON)
    ).build();
  }

  @GET
  @Produces(MediaType.APPLICATION_JSON)
  public Response get(@Context ResourceContext resContext) {
    InvocationContext ic =
      WebAppUtils.getInvocationContextFromResourceContext(resContext);
    JsonObjectBuilder builder = Json.createObjectBuilder();
    JsonArrayBuilder tableBuilder = Json.createArrayBuilder();
    for (Map.Entry<String, String> entry : ic.getFrontend().getBookmarkManager().getAll(ic)) {
      JsonObjectBuilder entryBuilder = Json.createObjectBuilder();
      entryBuilder.add("page", valueObject(entry.getValue()));
      entryBuilder.add("identity", Json.createObjectBuilder()
        .add("value",
          resourceDataMaker(entry.getValue(), "/api/-current-/" + entry.getKey())));
      tableBuilder.add(entryBuilder);
    }

    builder.add("data", tableBuilder);

    builder.add("breadCrumbs", Json.createArrayBuilder());

    builder.add("links", Json.createArrayBuilder());

    builder.add("navigation", "Bookmarks");

    builder.add("inlinePageDescription", pdj(ic));

    return
      WebAppUtils.addCookieFromContext(resContext,
        Response.ok(builder.build(), MediaType.APPLICATION_JSON)
      ).build();
  }
}
