// Copyright (c) 2025, 2026, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.webapp.project;

import java.io.File;
import java.util.Collection;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import javax.json.Json;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;
import javax.json.JsonString;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.container.ResourceContext;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import weblogic.remoteconsole.common.repodef.LocalizedConstants;
import weblogic.remoteconsole.server.ConsoleBackendRuntimeConfig;
import weblogic.remoteconsole.server.providers.AdminServerResource;
import weblogic.remoteconsole.server.providers.ConfiguredProvider;
import weblogic.remoteconsole.server.providers.PdjRdjUtils;
import weblogic.remoteconsole.server.providers.ProjectManager;
import weblogic.remoteconsole.server.providers.ProjectManager.Project;
import weblogic.remoteconsole.server.providers.PropertyListResource;
import weblogic.remoteconsole.server.providers.TypedResource;
import weblogic.remoteconsole.server.providers.WDTCompositeResource;
import weblogic.remoteconsole.server.providers.WDTResource;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.PersistedTableCustomizations;
import weblogic.remoteconsole.server.repo.TableCustomizationsManager;
import weblogic.remoteconsole.server.webapp.WebAppUtils;

public class ProviderTable extends PdjRdjUtils {
  private static String[] createTypes = new String[] {
    "AS",
    "WDT",
    "WDTComposite",
    "ExistingPropertyList",
    "NewWDT",
    "NewPropertyList"
  };

  private static TableCustomizationsManager getTableCustomizationsManager(InvocationContext ic) {
    return new TableCustomizationsManager();
  }

  // If there are customizations, build up fresh "displayed" and "hidden"
  // ObjectBuilders.  The things that go in "displayed" are the configured
  // things.  The things that go in hidden are those not mentioned.
  private static void customizedAdd(
    InvocationContext ic,
    JsonObjectBuilder tableDescBuilder,
    JsonArrayBuilder displayed,
    JsonArrayBuilder hidden
  ) {
    TableCustomizationsManager manager = getTableCustomizationsManager(ic);
    if (manager.getTableIdToCustomizations().get("ProviderTable") != null) {
      List<JsonObject> ref = new LinkedList<>();
      ref.addAll(displayed.build().getValuesAs(JsonObject.class));
      ref.addAll(hidden.build().getValuesAs(JsonObject.class));
      displayed = Json.createArrayBuilder();
      hidden = Json.createArrayBuilder();
      for (String displayMe : manager.getTableIdToCustomizations().get("ProviderTable") 
        .getDisplayedColumns()) {
        for (JsonObject walk : ref) {
          if (walk.getString("name").equals(displayMe)) {
            ref.remove(walk);
            displayed.add(walk);
            break;
          }
        }
      }
      for (JsonObject walk : ref) {
        hidden.add(walk);
      }
    }
    tableDescBuilder.add("displayedColumns", displayed);
    tableDescBuilder.add("hiddenColumns", hidden);
  }

  private static JsonObject pdj(InvocationContext ic, boolean isEmpty) {
    JsonObjectBuilder pdjBuilder = Json.createObjectBuilder();
    pdjBuilder.add("introductionHTML", ic.getLocalizer().localizeString(
      isEmpty ? LocalizedConstants.EMPTY_PROVIDER_TABLE_INTRODUCTION
              : LocalizedConstants.PROVIDER_TABLE_INTRODUCTION));

    JsonObjectBuilder tableDescBuilder = Json.createObjectBuilder();
    tableDescBuilder.add("defaultSortProperty", "ordering");
    tableDescBuilder.add("requiresRowSelection", true);
    tableDescBuilder.add("rowSelectionProperty", "identity");
    tableDescBuilder.add("navigationProperty", "identity");

    JsonArrayBuilder displayed = Json.createArrayBuilder()
      .add(pdjObject("name", ic.getLocalizer().localizeString(
        LocalizedConstants.NAME_LABEL), "String"))
      .add(pdjObject("type", ic.getLocalizer().localizeString(
        LocalizedConstants.PROVIDER_TABLE_TYPE_LABEL), "String"))
      .add(pdjObject("state", ic.getLocalizer().localizeString(
        LocalizedConstants.PROVIDER_TABLE_STATE_LABEL), "String"))
      .add(pdjObject("more", ic.getLocalizer().localizeString(
        LocalizedConstants.PROVIDER_TABLE_INFORMATION_LABEL), "String"));

    // We add each type's "special" columns as hidden
    JsonArrayBuilder hidden = Json.createArrayBuilder();
    new AdminServerResource().addSpecialTableProperties(ic, hidden);
    new WDTResource().addSpecialTableProperties(ic, hidden);
    new WDTCompositeResource().addSpecialTableProperties(ic, hidden);
    new PropertyListResource().addSpecialTableProperties(ic, hidden);
    hidden.add(pdjObject("ordering", ic.getLocalizer().localizeString(
      LocalizedConstants.PROVIDER_TABLE_USER_ORDERING_LABEL), "String"));

    customizedAdd(ic, tableDescBuilder, displayed, hidden);

    JsonArrayBuilder actionsBuilder = Json.createArrayBuilder();

    JsonArrayBuilder createListBuilder = Json.createArrayBuilder();

    createListBuilder.add(Json.createObjectBuilder()
      .add("name", "createAS")
      .add("label", ic.getLocalizer().localizeString(
        LocalizedConstants.PROVIDER_TABLE_CREATE_ADMIN_SERVER_LABEL))
      .add("rows", "none"));

    if (ConsoleBackendRuntimeConfig.isFilesAreLocal()) {
      createListBuilder.add(Json.createObjectBuilder()
        .add("name", "createWDT")
        .add("label", ic.getLocalizer().localizeString(
          LocalizedConstants.PROVIDER_TABLE_CREATE_EXISTING_WDT_LABEL))
        .add("rows", "none"));
    }

    createListBuilder.add(Json.createObjectBuilder()
      .add("name", "createWDTComposite")
      .add("label", ic.getLocalizer().localizeString(
        LocalizedConstants.PROVIDER_TABLE_CREATE_WDT_COMPOSITE_LABEL))
      .add("rows", "none"));

    if (ConsoleBackendRuntimeConfig.isFilesAreLocal()) {
      createListBuilder.add(Json.createObjectBuilder()
        .add("name", "createExistingPropertyList")
        .add("label", ic.getLocalizer().localizeString(
          LocalizedConstants.PROVIDER_TABLE_CREATE_EXISTING_PROPERTY_LIST_LABEL))
        .add("rows", "none"));
    }

    createListBuilder.add(Json.createObjectBuilder()
      .add("name", "createNewWDT")
      .add("label", ic.getLocalizer().localizeString(
        LocalizedConstants.PROVIDER_TABLE_CREATE_NEW_WDT_LABEL))
      .add("rows", "none"));

    createListBuilder.add(Json.createObjectBuilder()
      .add("name", "createNewPropertyList")
      .add("label", ic.getLocalizer().localizeString(
        LocalizedConstants.PROVIDER_TABLE_CREATE_NEW_PROPERTY_LIST_LABEL))
      .add("rows", "none"));

    actionsBuilder.add(Json.createObjectBuilder()
      .add("name", "createActions")
      .add("label", ic.getLocalizer().localizeString(
        LocalizedConstants.PROVIDER_TABLE_CREATE_ACTION_LABEL))
      .add("rows", "none")
      .add("actions", createListBuilder));
    actionsBuilder
      .add(pdjActionMaker("select", ic.getLocalizer().localizeString(
        LocalizedConstants.PROVIDER_TABLE_CONNECT_ACTIVATE_LABEL), "one"))
      .add(pdjActionMaker("del", ic.getLocalizer().localizeString(
        LocalizedConstants.PROVIDER_TABLE_DELETE_LABEL), "multiple"))
      .add(pdjActionMaker("moveUp", ic.getLocalizer().localizeString(
        LocalizedConstants.PROVIDER_TABLE_MOVE_UP_LABEL), "one")
        .add("criteria", "notfirst"))
      .add(pdjActionMaker("moveDown", ic.getLocalizer().localizeString(
        LocalizedConstants.PROVIDER_TABLE_MOVE_DOWN_LABEL), "one")
        .add("criteria", "notlast"));

    tableDescBuilder.add("actions", actionsBuilder);
    pdjBuilder.add("table", tableDescBuilder);

    return pdjBuilder.build();
  }

  public static JsonObject getDefaultTableRDJ(InvocationContext ic) {
    return getTableRDJ(ic, ic.getProjectManager().getCurrentProject().getName());
  }

  private static JsonObject getTableRDJ(InvocationContext ic, String projectName) {
    ProjectManager projectManager = ic.getProjectManager();
    JsonObjectBuilder builder = Json.createObjectBuilder();
    JsonArrayBuilder providerTableBuilder = Json.createArrayBuilder();
    ProjectManager.Project proj = projectManager.getProject(projectName);
    if (proj == null) {
      throw new WebApplicationException(Response.status(
        Status.NOT_FOUND.getStatusCode(), ic.getLocalizer().localizeString(
          LocalizedConstants.PROJECT_NOT_FOUND_MESSAGE)
      ).build());
    }
    // If somebody clicks on this project, that becomes the "current"
    projectManager.setCurrentProjectByUser(ic, proj);
    int i = 0;
    for (ConfiguredProvider prov : proj.getProviders()) {
      JsonObjectBuilder provBuilder = Json.createObjectBuilder();
      provBuilder.add("name", valueObject(prov.getName()));
      provBuilder.add("type", valueObject(prov.getJSON().getString("type")));
      provBuilder.add("state", valueObject("Inactive"));
      // Put in an empty value for "more" in case the specific provider doesn't
      provBuilder.add("more", valueObject(""));
      provBuilder.add("ordering", valueObject(Integer.toString(++i)));
      prov.populateTableRowData(ic, provBuilder);
      JsonObjectBuilder identityBuilder = Json.createObjectBuilder();
      identityBuilder.add("value",
        resourceDataMaker(prov.getName(),
          "/api/project/data/" + projectName + "/" + prov.getName()));
      provBuilder.add("identity", identityBuilder);

      providerTableBuilder.add(provBuilder);
    }

    if (proj.getCurrent() != null) {
      builder.add("selected", Json.createArrayBuilder()
        .add("/api/project/data/" + projectName + "/" + proj.getCurrent()));
    }
    builder.add("data", providerTableBuilder);

    JsonArrayBuilder breadCrumbsBuilder = Json.createArrayBuilder();
    breadCrumbsBuilder.add(resourceDataMaker("Projects", "/api/project/data"));
    builder.add("breadCrumbs", breadCrumbsBuilder);

    builder.add("links", Json.createArrayBuilder());

    builder.add("navigation", projectName);

    JsonObjectBuilder actionsBuilder = Json.createObjectBuilder()
      .add("del", makeInvoker("del", projectName))
      .add("select", makeInvoker("select", projectName))
      .add("moveUp", makeInvoker("moveUp", projectName))
      .add("moveDown", makeInvoker("moveDown", projectName));

    for (String createType : createTypes) {
      actionsBuilder.add("create" + createType, Json.createObjectBuilder()
        .add("inputForm",
          resourceDataMaker(
            "/api/project/data"
            + "/" + projectName
            + "?param=showCreateForm" + createType)));
    }
    builder.add("actions", actionsBuilder);

    builder.add("self", Json.createObjectBuilder()
      .add("kind", "nonCreatableCollection")
      .add("label", "Providers")
      .add("resourceData", "/api/project/data/" + projectName));

    builder.add("tableCustomizer", 
        "/api/project/data/" + projectName + "?param=customizeTable");

    builder.add("inlinePageDescription", pdj(ic, proj.getProviders().size() == 0));

    return builder.build();
  }

  private static Response getTableRDJResponse(
    ResourceContext resContext,
    String projectName) {
    InvocationContext ic =
      WebAppUtils.getInvocationContextFromResourceContext(resContext);
    return
      WebAppUtils.addCookieFromContext(resContext,
        Response.ok(getTableRDJ(ic, projectName), MediaType.APPLICATION_JSON)
      ).build();
  }

  private static Response performCreate(
    ResourceContext resContext,
    String operationType,
    String projectName,
    JsonObject payload) {
    InvocationContext ic =
      WebAppUtils.getInvocationContextFromResourceContext(resContext);
    TypedResource typedResource = typedResourceFromType(operationType);
    if (typedResource == null) {
      throw new WebApplicationException(Response.status(
        Status.BAD_REQUEST.getStatusCode(), ic.getLocalizer().localizeString(
          LocalizedConstants.BAD_TYPE_MESSAGE)
      ).build());
    }
    ProjectManager projectManager = ProjectManager.getFromContext(resContext);
    Project proj = projectManager.getProject(projectName);
    if (proj == null) {
      throw new WebApplicationException(Response.status(
        Status.NOT_FOUND.getStatusCode(), ic.getLocalizer().localizeString(
          LocalizedConstants.PROJECT_NOT_FOUND_MESSAGE)
      ).build());
    }
    if (!payload.containsKey("data")) {
      throw new WebApplicationException(Response.status(
        Status.BAD_REQUEST.getStatusCode(),
          ic.getLocalizer().localizeString(
            LocalizedConstants.CREATE_FORM_MISSING_DATA_MESSAGE)).build());
    }
    JsonObject data = payload.getJsonObject("data");
    JsonObject result = typedResource.populateFromFormData(
        ic,
        operationType,
        data,
        Json.createObjectBuilder()).build();
    proj.addProvider(result);
    if (operationType.startsWith("New") && data.containsKey("file")) {
      File newFile = new File(data.getJsonObject("file").getString("value"));
      try {
        newFile.getParentFile().mkdirs();
        newFile.createNewFile();
      } catch (Exception e) {
        e.printStackTrace();
        throw new WebApplicationException(Response.status(
          Status.BAD_REQUEST.getStatusCode(), ic.getLocalizer().localizeString(
            LocalizedConstants.CANNOT_CREATE_FILE_MESSAGE, newFile.getName())
        ).build());
      }
    }
    projectManager.save(ic);
    JsonObjectBuilder builder = Json.createObjectBuilder();
    builder.add("resourceData", Json.createObjectBuilder().add("resourceData",
      "/api/project/data/" + projectName + "/" + result.getString("name")));
    return
      WebAppUtils.addCookieFromContext(resContext,
        Response.ok(builder.build(),
        MediaType.APPLICATION_JSON)
    ).build();
  }

  private static Response performMoveDown(
    ResourceContext resContext,
    String projectName,
    Collection<String> doList) {
    InvocationContext ic =
      WebAppUtils.getInvocationContextFromResourceContext(resContext);
    if (doList.size() != 1) {
      throw new WebApplicationException(Response.status(
        Status.BAD_REQUEST.getStatusCode(), ic.getLocalizer().localizeString(
          LocalizedConstants.MOVES_ONLY_ONE_ROW_MESSAGE)
      ).build());
    }
    ProjectManager projectManager = ProjectManager.getFromContext(resContext);
    Project proj = projectManager.getProject(projectName);
    if (proj == null) {
      throw new WebApplicationException(Response.status(
        Status.NOT_FOUND.getStatusCode(), ic.getLocalizer().localizeString(
          LocalizedConstants.PROJECT_NOT_FOUND_MESSAGE)
      ).build());
    }
    for (String provName : doList) {
      if (provName.indexOf('/') != -1) {
        provName = provName.substring(provName.lastIndexOf('/') + 1);
      }
      if (proj.getProvider(provName) == null) {
        return WebAppUtils.addCookieFromContext(resContext,
          Response.status(
            Status.BAD_REQUEST.getStatusCode(), ic.getLocalizer().localizeString(
              LocalizedConstants.NO_SUCH_PROVIDER_MESSAGE, provName))
        ).build();
      }
      proj.moveDownProvider(provName);
      projectManager.save(resContext);
    }
    return WebAppUtils.addCookieFromContext(
      resContext,
      Response.status(Status.OK)
        .entity(Json.createObjectBuilder().build())
        .type(MediaType.APPLICATION_JSON)
    ).build();
  }

  private static Response performCustomizeTable(
    ResourceContext resContext,
    JsonObject payload) {
    InvocationContext ic =
      WebAppUtils.getInvocationContextFromResourceContext(resContext);
    TableCustomizationsManager manager = getTableCustomizationsManager(ic);
    if (!payload.containsKey("displayedColumns")) {
      // if ((manager.getTableIdToCustomizations() != null)
      if (manager.getTableIdToCustomizations().containsKey("ProviderTable")) {
        manager.getTableIdToCustomizations().remove("ProviderTable");
      }
    } else {
      List<String> newDisplayedColumns = new LinkedList<>();
      for (JsonString walk :
        payload.getJsonArray("displayedColumns").getValuesAs(JsonString.class)) {
        newDisplayedColumns.add(walk.getString());
      }
      Map<String,PersistedTableCustomizations> tableCustomizations =
        manager.getTableIdToCustomizations();
      PersistedTableCustomizations mine =
        tableCustomizations.get("ProviderTable");
      if (mine == null) {
        mine = new PersistedTableCustomizations();
        tableCustomizations.put("ProviderTable", mine);
      }
      mine.setDisplayedColumns(newDisplayedColumns);
    }
    manager.update(ic);
    return WebAppUtils.addCookieFromContext(
      resContext,
      Response.status(Status.OK)
        .entity(Json.createObjectBuilder().build())
        .type(MediaType.APPLICATION_JSON)
    ).build();
  }

  private static Response performSelect(
    ResourceContext resContext,
    String projectName,
    List<String> doList) {
    return ProviderInstance.performSelect(
      resContext, projectName, doList.get(0).replaceAll("^.*/", ""));
  }

  private static Response performMoveUp(
    ResourceContext resContext,
    String projectName,
    Collection<String> doList) {
    InvocationContext ic =
      WebAppUtils.getInvocationContextFromResourceContext(resContext);
    if (doList.size() != 1) {
      throw new WebApplicationException(Response.status(
        Status.BAD_REQUEST.getStatusCode(), ic.getLocalizer().localizeString(
          LocalizedConstants.MOVES_ONLY_ONE_ROW_MESSAGE)
      ).build());
    }
    ProjectManager projectManager = ProjectManager.getFromContext(resContext);
    Project proj = projectManager.getProject(projectName);
    if (proj == null) {
      throw new WebApplicationException(Response.status(
        Status.NOT_FOUND.getStatusCode(), ic.getLocalizer().localizeString(
          LocalizedConstants.PROJECT_NOT_FOUND_MESSAGE)
      ).build());
    }
    for (String provName : doList) {
      if (provName.indexOf('/') != -1) {
        provName = provName.substring(provName.lastIndexOf('/') + 1);
      }
      if (proj.getProvider(provName) == null) {
        return WebAppUtils.addCookieFromContext(resContext,
          Response.status(
            Status.BAD_REQUEST.getStatusCode(), ic.getLocalizer().localizeString(
              LocalizedConstants.NO_SUCH_PROVIDER_MESSAGE, provName))
        ).build();
      }
      proj.moveUpProvider(provName);
      projectManager.save(resContext);
    }
    return WebAppUtils.addCookieFromContext(
      resContext,
      Response.status(Status.OK)
        .entity(Json.createObjectBuilder().build())
        .type(MediaType.APPLICATION_JSON)
    ).build();
  }

  private static Response performDelete(
    ResourceContext resContext,
    String projectName,
    Collection<String> doList) {
    InvocationContext ic =
      WebAppUtils.getInvocationContextFromResourceContext(resContext);
    ProjectManager projectManager = ProjectManager.getFromContext(resContext);
    Project proj = projectManager.getProject(projectName);
    if (proj == null) {
      throw new WebApplicationException(Response.status(
        Status.NOT_FOUND.getStatusCode(), ic.getLocalizer().localizeString(
          LocalizedConstants.PROJECT_NOT_FOUND_MESSAGE)
      ).build());
    }
    for (String provName : doList) {
      if (provName.indexOf('/') != -1) {
        provName = provName.substring(provName.lastIndexOf('/') + 1);
      }
      if (proj.getProvider(provName) == null) {
        return WebAppUtils.addCookieFromContext(resContext,
          Response.status(
            Status.BAD_REQUEST.getStatusCode(), ic.getLocalizer().localizeString(
              LocalizedConstants.NO_SUCH_PROVIDER_MESSAGE, provName))
        ).build();
      }
      proj.deleteProvider(provName);
      projectManager.save(resContext);
    }
    return WebAppUtils.addCookieFromContext(
      resContext,
      Response.status(Status.OK)
        .entity(Json.createObjectBuilder().build())
        .type(MediaType.APPLICATION_JSON)
    ).build();
  }

  // This should be moved somewhere else
  public static TypedResource typedResourceFromType(String type) {
    TypedResource typedResource = null;
    if (type.equals("AS")) {
      typedResource = new AdminServerResource();
    } else if (type.equals("WDT")) {
      typedResource = new WDTResource();
    } else if (type.equals("WDTComposite")) {
      typedResource = new WDTCompositeResource();
    } else if (type.equals("ExistingPropertyList")) {
      typedResource = new PropertyListResource();
    } else if (type.equals("NewWDT")) {
      typedResource = new WDTResource();
    } else if (type.equals("NewPropertyList")) {
      typedResource = new PropertyListResource();
    }
    return typedResource;
  }

  private static Response populateCreateFormRDJ(
    ResourceContext resContext,
    String type,
    String projectName) {
    InvocationContext ic =
      WebAppUtils.getInvocationContextFromResourceContext(resContext);
    JsonObjectBuilder builder = Json.createObjectBuilder();
    builder.add("breadCrumbs", Json.createArrayBuilder());
    builder.add("links", Json.createArrayBuilder());
    builder.add("navigation", projectName);

    builder.add("invoker", Json.createObjectBuilder()
      .add("resourceData", "/api/project/data/" + projectName + "?param=create" + type));

    builder.add("self", Json.createObjectBuilder()
      .add("kind", "sliceForm")
      .add("label", projectName)
      .add("resourceData",
        "/api/project/data/" + projectName));

    TypedResource typedResource = typedResourceFromType(type);
    if (typedResource != null) {
      builder.add("data",
        typedResource.populateCreateFormData(
          ic, type, Json.createObjectBuilder()));
      JsonObjectBuilder pdjBuilder = Json.createObjectBuilder();
      typedResource.populateCreateFormPDJ(ic, type, pdjBuilder);
      builder.add("inlinePageDescription", pdjBuilder);
      return WebAppUtils.addCookieFromContext(resContext,
        Response.ok(builder.build(), MediaType.APPLICATION_JSON)
      ).build();
    }
    return WebAppUtils.addCookieFromContext(resContext,
      Response.status(
        Status.BAD_REQUEST.getStatusCode(), ic.getLocalizer().localizeString(
          LocalizedConstants.REQUEST_POORLY_FORMED_MESSAGE))
    ).build();
  }

  public static Response processGet(
    ResourceContext resContext,
    String projectName,
    String param) {
    if (param.equals("")) {
      return getTableRDJResponse(resContext, projectName);
    }
    InvocationContext ic =
      WebAppUtils.getInvocationContextFromResourceContext(resContext);
    throw new WebApplicationException(Response.status(
      Status.BAD_REQUEST.getStatusCode(),
        ic.getLocalizer().localizeString(
          LocalizedConstants.UNSUPPORTED_PARAM_MESSAGE, param)).build());
  }

  public static Response processPost(
    ResourceContext resContext,
    String projectName,
    String param,
    JsonObject payload) {
    if (param.equals("customizeTable")) {
      return performCustomizeTable(resContext, payload);
    }
    if (param.startsWith("showCreateForm")) {
      return populateCreateFormRDJ(
        resContext, param.substring("showCreateForm".length()), projectName);
    }
    if (param.startsWith("create")) {
      return performCreate(
        resContext, param.substring("create".length()), projectName, payload);
    }
    List<String> doList = ProjectUtils.rowsToList(resContext, payload);
    if (param.equals("select")) {
      return performSelect(resContext, projectName, doList);
    }
    if (param.equals("moveUp")) {
      return performMoveUp(resContext, projectName, doList);
    }
    if (param.equals("moveDown")) {
      return performMoveDown(resContext, projectName, doList);
    }
    if (param.equals("del")) {
      return performDelete(resContext, projectName, doList);
    }
    InvocationContext ic =
      WebAppUtils.getInvocationContextFromResourceContext(resContext);
    throw new WebApplicationException(Response.status(
      Status.BAD_REQUEST.getStatusCode(),
        ic.getLocalizer().localizeString(
          LocalizedConstants.UNSUPPORTED_PARAM_MESSAGE, param)).build());
  }
}
