// Copyright (c) 2021, 2026, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.webapp;

import javax.json.Json;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.container.ResourceContext;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import weblogic.remoteconsole.common.repodef.LocalizedConstants;
import weblogic.remoteconsole.server.providers.PdjRdjUtils;
import weblogic.remoteconsole.server.repo.AddedBean;
import weblogic.remoteconsole.server.repo.Changes;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.ModifiedBeanProperty;
import weblogic.remoteconsole.server.repo.RemovedBean;
import weblogic.remoteconsole.server.repo.Value;

/**
 * JAXRS resource for mananging the change manager
 */
public class ChangeManagerResource extends BaseResource {
  private static JsonObject makeAValue(
    InvocationContext ic,
    ChangesResponseMapper mapper,
    Value value) {
    if (value == null) {
      return PdjRdjUtils.valueObject("");
    }
    String work = mapper.valueToJson(value).toString();
    if ((work.indexOf('<') != -1) && work.endsWith(">")) {
      work = work.substring(work.indexOf('<') + 1, work.length() - 1);
    }
    work.replace("\\\"", "");
    if (work.startsWith("\"") && work.endsWith("\"")) {
      work = work.substring(1, work.length() - 1);
    }
    return PdjRdjUtils.valueObject(work);
  }

  private static JsonObject pdj(InvocationContext ic) {
    JsonObjectBuilder pdjBuilder = Json.createObjectBuilder();
    pdjBuilder.add("introductionHTML",
      ic.getLocalizer().localizeString(LocalizedConstants.CHANGE_MANAGER_INTRODUCTION));

    JsonObjectBuilder tableDescBuilder = Json.createObjectBuilder()
      .add("actions", Json.createArrayBuilder()
        .add(Json.createObjectBuilder()
          .add("name", "view")
          .add("label",
            ic.getLocalizer().localizeString(LocalizedConstants.VIEW_CHANGE_MANAGER_STATE_ACTION_LABEL)))
        .add(Json.createObjectBuilder()
          .add("name", "commit")
          .add("label",
            ic.getLocalizer().localizeString(LocalizedConstants.COMMIT_ACTION_LABEL)))
        .add(Json.createObjectBuilder()
          .add("name", "discard")
          .add("label",
            ic.getLocalizer().localizeString(LocalizedConstants.DISCARD_ACTION_LABEL))))
      .add("defaultSortProperty", "bean")
      .add("displayedColumns", Json.createArrayBuilder()
        .add(PdjRdjUtils.pdjObject("bean", "Bean", "String"))
        .add(PdjRdjUtils.pdjObject("operation", "Operation", "String"))
        .add(PdjRdjUtils.pdjObject("field", "Field", "String"))
        .add(PdjRdjUtils.pdjObject("old-value", "Old Value", "String"))
        .add(PdjRdjUtils.pdjObject("new-value", "New Value", "String"))
    );
    pdjBuilder.add("table", tableDescBuilder);

    return pdjBuilder.build();
  }

  // Get the current status of the change manager
  @GET
  @Produces(MediaType.APPLICATION_JSON)
  public Response getChangeManagerStatus() {
    return ChangeManagerStatusResponseMapper.toResponse(
      getInvocationContext(),
      getInvocationContext().getPageRepo().asChangeManagerPageRepo().getChangeManagerStatus(
        getInvocationContext()
      )
    );
  }

  public static void setHasChanges(InvocationContext ic) {
    Response response = ChangeManagerStatusResponseMapper.toResponse(
      ic, ic.getPageRepo().asChangeManagerPageRepo().getChangeManagerStatus(ic));
    if (response.getEntity() != null) {
      JsonObject changeManagerInfo =
        ((JsonObject) response.getEntity()).getJsonObject("changeManager");
      if (changeManagerInfo != null) {
        if (changeManagerInfo.containsKey("hasChanges")) {
          if (changeManagerInfo.getBoolean("hasChanges")) {
            ic.getProvider().setIsShoppingCartEmpty(false);
          }
        }
      }
    }
  }

  // Get the list of mbean changes (i.e. shopping cart contents)
  @Path("changes")
  @GET
  @Produces(MediaType.APPLICATION_JSON)
  public Response getChanges() {
    return
      ChangesResponseMapper.toResponse(
        getInvocationContext(),
        getInvocationContext().getPageRepo().asChangeManagerPageRepo().getChanges(
          getInvocationContext()
        )
      );
  }

  // Get the list of mbean changes in RDJ form
  @Path("changingTable")
  @GET
  @Produces(MediaType.APPLICATION_JSON)
  public Response getChangingTable(@Context ResourceContext resContext) {
    InvocationContext ic = getInvocationContext();
    Changes changes = ic.getPageRepo()
      .asChangeManagerPageRepo().getChanges(getInvocationContext()).getResults();
    JsonArrayBuilder tableBuilder = Json.createArrayBuilder();
    ChangesResponseMapper mapper = new ChangesResponseMapper(ic);
    for (AddedBean addition : changes.getAdditions()) {
      JsonObjectBuilder entryBuilder = Json.createObjectBuilder();
      entryBuilder.add("bean", PdjRdjUtils.valueObject(
        mapper.getBreadCrumbs(addition.getBeanTreePath())));
      entryBuilder.add("operation", PdjRdjUtils.valueObject("Add"));
      tableBuilder.add(entryBuilder);
    }
    for (RemovedBean removal : changes.getRemovals()) {
      JsonObjectBuilder entryBuilder = Json.createObjectBuilder();
      entryBuilder.add("bean", PdjRdjUtils.valueObject(
        mapper.getBeanTreePathLabel(removal.getBeanTreePath())));
      entryBuilder.add("operation", PdjRdjUtils.valueObject("Delete"));
      tableBuilder.add(entryBuilder);
    }
    int i = 0;
    for (ModifiedBeanProperty mod : changes.getModifications()) {
      JsonObjectBuilder entryBuilder = Json.createObjectBuilder();
      entryBuilder.add("bean", PdjRdjUtils.valueObject(
        mapper.getBeanTreePathLabel(mod.getBeanTreePath())));
      entryBuilder.add("operation", PdjRdjUtils.valueObject("Change"));
      entryBuilder.add("field", PdjRdjUtils.valueObject(mod.getPath().toString()));
      entryBuilder.add("old-value", makeAValue(ic, mapper, mod.getOldValue()));
      entryBuilder.add("new-value", makeAValue(ic, mapper, mod.getNewValue()));
      // The rows have no identity, but the CFE needs one and needs it to
      // be unique
      entryBuilder.add("identity", Json.createObjectBuilder()
        .add("value",
          PdjRdjUtils.resourceDataMaker("hello-" + i,
            "/api/project/data/what-" + i)));
      i++;
      tableBuilder.add(entryBuilder);
    }

    JsonObjectBuilder builder = Json.createObjectBuilder()
      .add("actions", Json.createObjectBuilder()
        .add("view", Json.createObjectBuilder()
          .add("invoker", Json.createObjectBuilder()
            .add("resourceData", "/api/-current-/edit/changeManager/redirect")))
        .add("commit", Json.createObjectBuilder()
          .add("invoker", Json.createObjectBuilder()
            .add("resourceData", "/api/-current-/edit/changeManager/commitChanges")))
        .add("discard", Json.createObjectBuilder()
          .add("invoker", Json.createObjectBuilder()
            .add("resourceData", "/api/-current-/edit/changeManager/discardChanges"))))
      .add("data", tableBuilder)
      .add("breadCrumbs", Json.createArrayBuilder())
      .add("navigation", "History")
      .add("links", Json.createArrayBuilder())
      .add("inlinePageDescription", pdj(ic));

    return
      WebAppUtils.addCookieFromContext(resContext,
        Response.ok(builder.build(), MediaType.APPLICATION_JSON)
      ).build();
  }

  // Commit the mbean changes (i.e. checkout the shopping cart contents)
  @Path("commitChanges")
  @POST
  @Produces(MediaType.APPLICATION_JSON)
  public Response commitChanges() {
    return
      VoidResponseMapper.toResponse(
        getInvocationContext(),
        getInvocationContext().getPageRepo().asChangeManagerPageRepo().commitChanges(
          getInvocationContext()
        )
      );
  }

  // Discard the mbean changes (i.e. discard the shopping cart contents)
  @Path("discardChanges")
  @POST
  @Produces(MediaType.APPLICATION_JSON)
  public Response discardChanges() {
    return
      VoidResponseMapper.toResponse(
        getInvocationContext(),
        getInvocationContext().getPageRepo().asChangeManagerPageRepo().discardChanges(
          getInvocationContext()
        )
      );
  }

  // Don't do anything except tell the CFE where to go next
  @Path("redirect")
  @POST
  @Produces(MediaType.APPLICATION_JSON)
  public Response redirectToMonitoringTree(@Context ResourceContext resContext) {
    JsonObjectBuilder goodResult = Json.createObjectBuilder()
      .add("resourceData", Json.createObjectBuilder()
        .add("label", "Root-ish")
        .add("resourceData",
          "/api/-current-/domainRuntime/data/DomainRuntime?slice=ChangeManager"));
    return WebAppUtils.addCookieFromContext(
      resContext,
      Response.status(Status.OK)
        .entity(goodResult.build())
        .type(MediaType.APPLICATION_JSON)
    ).build();
  }
}
