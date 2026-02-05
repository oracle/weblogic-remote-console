// Copyright (c) 2025, 2026, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.webapp;

import javax.json.Json;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;
import javax.ws.rs.GET;
import javax.ws.rs.Produces;
import javax.ws.rs.container.ResourceContext;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import weblogic.remoteconsole.common.repodef.LocalizedConstants;
import weblogic.remoteconsole.server.HistoryManager;
import weblogic.remoteconsole.server.providers.PdjRdjUtils;
import weblogic.remoteconsole.server.repo.InvocationContext;

public class HistoryResource extends PdjRdjUtils {

  private static JsonObject pdj(InvocationContext ic) {
    JsonObjectBuilder pdjBuilder = Json.createObjectBuilder();
    pdjBuilder.add("introductionHTML",
      ic.getLocalizer().localizeString(LocalizedConstants.HISTORY_INTRODUCTION));

    JsonObjectBuilder tableDescBuilder = Json.createObjectBuilder()
      .add("defaultSortProperty", "recency")
      .add("requiresRowSelection", false)
      // .add("rowSelectionProperty", "identity")
      .add("navigationProperty", "identity")
      .add("displayedColumns", Json.createArrayBuilder()
        .add(pdjObject("page", "Page", "String")))
      .add("hiddenColumns", Json.createArrayBuilder()
        .add(pdjObject("recency", "Recency", "int")));
    pdjBuilder.add("table", tableDescBuilder);

    return pdjBuilder.build();
  }

  @GET
  @Produces(MediaType.APPLICATION_JSON)
  public Response get(@Context ResourceContext resContext) {
    InvocationContext ic =
      WebAppUtils.getInvocationContextFromResourceContext(resContext);
    JsonObjectBuilder builder = Json.createObjectBuilder();
    JsonArrayBuilder tableBuilder = Json.createArrayBuilder();
    int recency = ic.getFrontend().getHistoryManager().getAll().size();
    for (HistoryManager.Entry entry : ic.getFrontend().getHistoryManager().getAll()) {
      JsonObjectBuilder entryBuilder = Json.createObjectBuilder();
      entryBuilder.add("page", valueObject(entry.getLabel()));
      entryBuilder.add("recency", valueObject("" + recency--));
      entryBuilder.add("identity", Json.createObjectBuilder()
        .add("value", Json.createObjectBuilder()
          .add("name", entry.getLabel())
          .add("label", entry.getLabel())
          .add("resourceData", entry.getResourceData())));
      tableBuilder.add(entryBuilder);
    }

    builder.add("data", tableBuilder);

    builder.add("breadCrumbs", Json.createArrayBuilder());

    builder.add("links", Json.createArrayBuilder());

    builder.add("navigation", "History");

    builder.add("inlinePageDescription", pdj(ic));

    return
      WebAppUtils.addCookieFromContext(resContext,
        Response.ok(builder.build(), MediaType.APPLICATION_JSON)
      ).build();
  }
}
