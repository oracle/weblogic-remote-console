// Copyright (c) 2025, 2026, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.webapp.project;

import java.io.File;
import java.util.Collection;
import java.util.List;
import javax.json.Json;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;
import javax.ws.rs.container.ResourceContext;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import weblogic.remoteconsole.common.repodef.LocalizedConstants;
import weblogic.remoteconsole.server.providers.PdjRdjUtils;
import weblogic.remoteconsole.server.providers.ProjectManager;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.webapp.FailedRequestException;
import weblogic.remoteconsole.server.webapp.WebAppUtils;

public class ProjectTable extends PdjRdjUtils {
  private static JsonArrayBuilder makeActionsPDJ(InvocationContext ic) {
    return Json.createArrayBuilder()
      .add(pdjActionMaker("createProject", 
        ic.getLocalizer().localizeString(LocalizedConstants.CREATE_PROJECT_ACTION_LABEL), 
        "none"))
      .add(pdjActionMaker("import", 
        ic.getLocalizer().localizeString(LocalizedConstants.IMPORT_ACTION_LABEL), 
        "none"))
      .add(pdjActionMaker("export", 
        ic.getLocalizer().localizeString(LocalizedConstants.EXPORT_ACTION_LABEL), 
        "multiple"))
      .add(pdjActionMaker("moveUp", 
        ic.getLocalizer().localizeString(LocalizedConstants.PROJECT_ACTION_MOVE_UP_LABEL), 
        "one"))
      .add(pdjActionMaker("moveDown", 
        ic.getLocalizer().localizeString(LocalizedConstants.PROJECT_ACTION_MOVE_DOWN_LABEL), 
        "one"))
      .add(pdjActionMaker("rename", 
        ic.getLocalizer().localizeString(LocalizedConstants.PROJECT_ACTION_RENAME_LABEL), 
        "one"))
      .add(pdjActionMaker("del", 
        ic.getLocalizer().localizeString(LocalizedConstants.PROJECT_ACTION_DELETE_LABEL), 
        "multiple"));
  }
  
  private static JsonObjectBuilder makeActionsRDJ() {
    return Json.createObjectBuilder()
      .add("createProject", Json.createObjectBuilder()
        .add("inputForm",
          resourceDataMaker(
            "/api/project/data"
            + "?param=showCreateForm")))
      .add("moveUp", makeInvoker("moveUp"))
      .add("moveDown", makeInvoker("moveDown"))
      .add("import", Json.createObjectBuilder()
        .add("inputForm",
          resourceDataMaker(
            "/api/project/data"
            + "?param=showImportForm")))
      .add("export", Json.createObjectBuilder()
        .add("inputForm",
          resourceDataMaker(
            "/api/project/data"
            + "?param=showExportForm")))
      .add("rename", Json.createObjectBuilder()
        .add("inputForm",
          resourceDataMaker(
            "/api/project/data"
            + "?param=showRenameForm")))
      .add("del", makeInvoker("del"));
  }

  private static Response populateRenameFormRDJ(
    ResourceContext resContext,
    Collection<String> doList) {
    if (doList == null || doList.size() != 1) {
      throw new FailedRequestException("Rename only takes one row");
    }

    InvocationContext ic =
      WebAppUtils.getInvocationContextFromResourceContext(resContext);

    String selected = doList.iterator().next();
    if (selected.indexOf('/') != -1) {
      selected = selected.substring(selected.lastIndexOf('/') + 1);
    }
    String currentName = selected;

    JsonObjectBuilder builder = Json.createObjectBuilder();
    builder.add("breadCrumbs", Json.createArrayBuilder());
    builder.add("links", Json.createArrayBuilder());
    builder.add("navigation", "");

    builder.add("invoker", Json.createObjectBuilder()
      .add("resourceData", "/api/project/data?param=rename"));

    builder.add("self", Json.createObjectBuilder()
      .add("kind", "sliceForm")
      .add("label", ic.getLocalizer().localizeString(LocalizedConstants.PROJECTS_TABLE_LABEL))
      .add("resourceData", "/api/project/data"));

    JsonObjectBuilder pdjBuilder = Json.createObjectBuilder();
    pdjBuilder.add("introductionHTML",
      ic.getLocalizer().localizeString(LocalizedConstants.PROJECT_CREATE_INTRODUCTION));

    JsonArrayBuilder propertiesBuilder = Json.createArrayBuilder()
      .add(Json.createObjectBuilder()
        .add("name", "name")
        .add("label", localized(ic, "Name"))
        .add("required", true)
        .add("value", currentName));

    pdjBuilder.add("actionInputForm", Json.createObjectBuilder()
      .add("properties", propertiesBuilder));

    builder.add("inlinePageDescription", pdjBuilder);

    return WebAppUtils.addCookieFromContext(
      resContext,
      Response.ok(builder.build(), MediaType.APPLICATION_JSON)
    ).build();
  }
  
  private static Response performMoveDown(
    ResourceContext resContext,
    Collection<String> doList) {
    if (doList.size() != 1) {
      throw new FailedRequestException("Moves only take one row");
    }
    ProjectManager projectManager = ProjectManager.getFromContext(resContext);
    for (String projName : doList) {
      if (projName.indexOf('/') != -1) {
        projName = projName.substring(projName.lastIndexOf('/') + 1);
      }
      projectManager.moveDown(projName);
      projectManager.save(resContext);
    }
    return WebAppUtils.addCookieFromContext(resContext,
      Response.ok(Json.createObjectBuilder().build(),
      MediaType.APPLICATION_JSON)
    ).build();
  }

  private static Response performMoveUp(
    ResourceContext resContext,
    Collection<String> doList) {
    if (doList.size() != 1) {
      throw new FailedRequestException("Moves only take one row");
    }
    ProjectManager projectManager = ProjectManager.getFromContext(resContext);
    for (String projName : doList) {
      if (projName.indexOf('/') != -1) {
        projName = projName.substring(projName.lastIndexOf('/') + 1);
      }
      projectManager.moveUp(projName);
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
    Collection<String> doList) {
    InvocationContext ic =
      WebAppUtils.getInvocationContextFromResourceContext(resContext);
    ProjectManager projectManager = ProjectManager.getFromContext(resContext);
    for (String projName : doList) {
      if (projName.indexOf('/') != -1) {
        projName = projName.substring(projName.lastIndexOf('/') + 1);
      }
      if (projectManager.getProject(projName) == null) {
        return WebAppUtils.addCookieFromContext(
          resContext,
          Response.status(
            Status.NOT_FOUND.getStatusCode(), ic.getLocalizer().localizeString(
              LocalizedConstants.PROJECT_NOT_FOUND_MESSAGE))
        ).build();
      }
      projectManager.deleteProject(projName);
      projectManager.save(resContext);
    }
    return WebAppUtils.addCookieFromContext(
      resContext,
      Response.status(Status.OK)
        .entity(Json.createObjectBuilder().build())
        .type(MediaType.APPLICATION_JSON)
    ).build();
  }

  private static Response performCreateProject(
    ResourceContext resContext,
    String projectName) {
    ProjectManager.getFromContext(resContext)
      .createProject(projectName);
    return WebAppUtils.addCookieFromContext(resContext,
      Response.ok(Json.createObjectBuilder()
         .add("resourceData", Json.createObjectBuilder()
           .add("label", projectName)
           .add("resourceData", "/api/project/data/" + projectName))
      .build(), MediaType.APPLICATION_JSON)
    ).build();
  }

  private static Response populateCreateFormRDJ(ResourceContext resContext) {
    ProjectManager projectManager = ProjectManager.getFromContext(resContext);
    InvocationContext ic =
      WebAppUtils.getInvocationContextFromResourceContext(resContext);
    JsonObjectBuilder builder = Json.createObjectBuilder();
    String proposedName =
      ProjectUtils.pickAName(projectManager.getNames(), "Project");
    builder.add("data", Json.createObjectBuilder()
      .add("name", Json.createObjectBuilder()
        .add("value", proposedName)));
    builder.add("breadCrumbs", Json.createArrayBuilder());
    builder.add("links", Json.createArrayBuilder());
    builder.add("navigation", "");
    builder.add("invoker", Json.createObjectBuilder()
      .add("resourceData", "/api/project/data?param=createProject"));

    builder.add("self", Json.createObjectBuilder()
      .add("kind", "sliceForm")
      .add("label", ic.getLocalizer().localizeString(LocalizedConstants.PROJECTS_TABLE_LABEL))
      .add("resourceData", "/api/project/data"));

    builder.add("inlinePageDescription", Json.createObjectBuilder()
      .add("introductionHTML", ic.getLocalizer().localizeString(LocalizedConstants.PROJECT_CREATE_INTRODUCTION))
      .add("createForm", Json.createObjectBuilder()
        .add("properties", Json.createArrayBuilder()
          .add(Json.createObjectBuilder()
            .add("name", "name")
            .add("label", localized(ic, "Name"))
            .add("required", true)))));
    return WebAppUtils.addCookieFromContext(resContext,
      Response.ok(builder.build(), MediaType.APPLICATION_JSON)
    ).build();
  }

  private static Response getTableRDJ(ResourceContext resContext) {
    InvocationContext ic =
      WebAppUtils.getInvocationContextFromResourceContext(resContext);
    ProjectManager projectManager = ProjectManager.getFromContext(resContext);
    JsonObjectBuilder builder = Json.createObjectBuilder();
    JsonArrayBuilder projectTableBuilder = Json.createArrayBuilder();
    int i = 0;
    for (ProjectManager.Project proj : projectManager.getProjects()) {
      JsonObjectBuilder projBuilder = Json.createObjectBuilder();
      projBuilder.add("name", valueObject(proj.getName()));
      if (projectManager.isCurrent(proj)) {
        projBuilder.add("current",
          valueObject(ic.getLocalizer().localizeString(LocalizedConstants.CURRENT_TABLE_COLUMN_LABEL)));
      } else {
        projBuilder.add("current", valueObject(""));
      }
      projBuilder.add("ordering", valueObject(Integer.toString(++i)));

      projBuilder.add("identity", Json.createObjectBuilder()
        .add("value", resourceDataMaker(
          proj.getName(), "/api/project/data/" + proj.getName())).build());

      projectTableBuilder.add(projBuilder.build());
    }
    builder.add("data", projectTableBuilder.build());

    builder.add("breadCrumbs", Json.createArrayBuilder().build());

    builder.add("links", Json.createArrayBuilder().build());

    builder.add("navigation", "NOTREALLYBUTDOESITHELP");

    builder.add("self", Json.createObjectBuilder()
      .add("kind", "nonCreatableCollection")
      .add("label", ic.getLocalizer().localizeString(LocalizedConstants.PROJECTS_TABLE_LABEL))
      .add("resourceData", "/api/project/data"));

    builder.add("actions", makeActionsRDJ());

    JsonObjectBuilder pdjBuilder = Json.createObjectBuilder();
    pdjBuilder.add("introductionHTML", "This page is used to create, "
      + "name and delete projects.\n<p>Projects are groups of providers");

    JsonObjectBuilder tableDescBuilder = Json.createObjectBuilder();
    tableDescBuilder.add("defaultSortProperty", "ordering");
    tableDescBuilder.add("requiresRowSelection", true);
    tableDescBuilder.add("rowSelectionProperty", "identity");
    tableDescBuilder.add("navigationProperty", "identity");
    tableDescBuilder.add("actions", makeActionsPDJ(ic));

    tableDescBuilder.add("displayedColumns", Json.createArrayBuilder()
      .add(Json.createObjectBuilder()
        .add("name", "name")
        .add("label", "Name")
        .add("key", "true"))

      .add(Json.createObjectBuilder()
        .add("name", "current")
        .add("label", ic.getLocalizer().localizeString(LocalizedConstants.CURRENT_TABLE_COLUMN_LABEL))
        .add("key", "true")));

    tableDescBuilder.add("hiddenColumns", Json.createArrayBuilder()
      .add(Json.createObjectBuilder()
        .add("name", "ordering")
        .add("label", ic.getLocalizer().localizeString(LocalizedConstants.USER_ORDERING_COLUMN_LABEL))
        .add("key", "true")));

    pdjBuilder.add("table", tableDescBuilder.build());

    builder.add("inlinePageDescription", pdjBuilder.build());
    return
      WebAppUtils.addCookieFromContext(resContext,
        Response.ok(builder.build(), MediaType.APPLICATION_JSON)
      ).build();
  }

  private static Response performRename(
    ResourceContext resContext,
    Collection<String> doList,
    String newName) {
    InvocationContext ic =
      WebAppUtils.getInvocationContextFromResourceContext(resContext);

    if (doList == null || doList.size() != 1) {
      throw new FailedRequestException("Rename only takes one row");
    }

    String selected = doList.iterator().next();
    if (selected.indexOf('/') != -1) {
      selected = selected.substring(selected.lastIndexOf('/') + 1);
    }
    String oldName = selected;

    ProjectManager projectManager = ProjectManager.getFromContext(resContext);

    ProjectManager.Project oldProj = projectManager.getProject(oldName);
    if (oldProj == null) {
      return WebAppUtils.addCookieFromContext(
        resContext,
        Response.status(
          Status.NOT_FOUND.getStatusCode(),
          ic.getLocalizer().localizeString(
            LocalizedConstants.PROJECT_NOT_FOUND_MESSAGE))
      ).build();
    }

    if (!oldName.equals(newName) && projectManager.getProject(newName) != null) {
      throw new FailedRequestException(LocalizedConstants.PROJECT_NAME_MUST_BE_UNIQUE, ic);
    }

    // Serialize old project providers before delete
    JsonObjectBuilder oldBuilder = Json.createObjectBuilder();
    oldProj.getJSONForPersistence(projectManager, ic, oldBuilder, false);
    JsonObject oldJson = oldBuilder.build();

    // Delete old and create new
    projectManager.deleteProject(oldName);
    ProjectManager.Project newProj = projectManager.createProject(newName);

    // Copy providers to new project
    if (oldJson.containsKey("dataProviders")) {
      javax.json.JsonArray providersArray = oldJson.getJsonArray("dataProviders");
      for (JsonObject provJson : providersArray.getValuesAs(JsonObject.class)) {
        String provName = provJson.getString("name");
        if (provName != null) {
          newProj.addProvider(provName, provJson);
        }
      }
    }

    projectManager.save(resContext);

    return WebAppUtils.addCookieFromContext(
      resContext,
      Response.ok(Json.createObjectBuilder()
         .add("resourceData", Json.createObjectBuilder()
           .add("label", newName)
           .add("resourceData", "/api/project/data/" + newName))
      .build(), MediaType.APPLICATION_JSON)
    ).build();
  }

  private static Response populateExportFormRDJ(
    ResourceContext resContext, Collection<String> doList) {
    InvocationContext ic =
      WebAppUtils.getInvocationContextFromResourceContext(resContext);
    JsonObjectBuilder builder = Json.createObjectBuilder();
    JsonObjectBuilder contents = Json.createObjectBuilder();
    JsonArrayBuilder projectsBuilder = Json.createArrayBuilder();
    ProjectManager projectManager = ProjectManager.getFromContext(resContext);
    for (String projectName : doList) {
      projectName = new File(projectName).getName();
      JsonObjectBuilder projBuilder = Json.createObjectBuilder();
      projectManager.getProject(projectName)
        .getJSONForPersistence(projectManager, ic, projBuilder, false);
      projectsBuilder.add(projBuilder);
    }
    contents.add("projects", projectsBuilder);
    builder.add("fileSaver", Json.createObjectBuilder()
      .add("mimeType", "application/json")
      .add("contents", contents.build()));
    return WebAppUtils.addCookieFromContext(resContext,
      Response.ok(builder.build(), MediaType.APPLICATION_JSON)
    ).build();
  }

  private static Response populateImportFormRDJ(ResourceContext resContext) {
    InvocationContext ic =
      WebAppUtils.getInvocationContextFromResourceContext(resContext);
    JsonObjectBuilder builder = Json.createObjectBuilder();
    builder.add("breadCrumbs", Json.createArrayBuilder());
    builder.add("links", Json.createArrayBuilder());
    builder.add("navigation", "");
    builder.add("invoker", Json.createObjectBuilder()
      .add("resourceData", "/api/project/data?param=import"));

    builder.add("self", Json.createObjectBuilder()
      .add("kind", "sliceForm")
      .add("label", ic.getLocalizer().localizeString(LocalizedConstants.PROJECTS_TABLE_LABEL))
      .add("resourceData", "/api/project/data"));

    JsonObjectBuilder pdjBuilder = Json.createObjectBuilder();
    pdjBuilder.add("introductionHTML",
      ic.getLocalizer().localizeString(LocalizedConstants.PROJECT_IMPORT_INTRODUCTION));
    JsonArrayBuilder propertiesBuilder = Json.createArrayBuilder()
      .add(Json.createObjectBuilder()
        .add("name", "contents")
        .add("required", true)
        .add("label", ic.getLocalizer().localizeString(
          LocalizedConstants.PROJECT_FILE_NAME_TO_IMPORT))
        .add("type", "fileContents"));
    pdjBuilder.add("actionInputForm", Json.createObjectBuilder()
      .add("properties", propertiesBuilder));
    builder.add("inlinePageDescription", pdjBuilder);
    return WebAppUtils.addCookieFromContext(resContext,
      Response.ok(builder.build(), MediaType.APPLICATION_JSON)
    ).build();
  }

  public static Response processGet(ResourceContext resContext, String param) {
    // if (param.equals("showTable")) {
    if (param.equals("")) {
      return getTableRDJ(resContext);
    }
    throw new FailedRequestException(param + " is not supported on a project table");
  }

  public static Response processPost(
    ResourceContext resContext,
    String param,
    JsonObject payload) {
    if (param.equals("createProject")) {
      try {
        return performCreateProject(resContext,
          payload.getJsonObject("data").getJsonObject("name").getString("value"));
      } catch (Exception e) {
        throw new FailedRequestException("The post payload for creating a project is bad");
      }
    }
    if (param.equals("showCreateForm")) {
      return populateCreateFormRDJ(resContext);
    }
    if (param.equals("showImportForm")) {
      return populateImportFormRDJ(resContext);
    }
    if (param.equals("import")) {
      return performImport(resContext, payload);
    }
    List<String> doList = ProjectUtils.rowsToList(resContext, payload);
    if (param.equals("moveUp")) {
      return performMoveUp(resContext, doList);
    }
    if (param.equals("showExportForm")) {
      return populateExportFormRDJ(resContext, doList);
    }
    if (param.equals("moveDown")) {
      return performMoveDown(resContext, doList);
    }
    if (param.equals("del")) {
      return performDelete(resContext, doList);
    }
    if (param.equals("showRenameForm")) {
      return populateRenameFormRDJ(resContext, doList);
    }
    if (param.equals("rename")) {
      String newName = null;
      try {
        if (payload.containsKey("data")
          && payload.getJsonObject("data").containsKey("name")) {
          newName = payload.getJsonObject("data")
            .getJsonObject("name").getString("value", null);
        }
      } catch (Exception e) {
        // fall through to error below
      }
      if (newName == null) {
        throw new FailedRequestException("The post payload for renaming a project is bad");
      }
      return performRename(resContext, doList, newName);
    }
    throw new FailedRequestException(param + " is not supported on a project table");
  }

  private static Response performImport(
    ResourceContext resContext,
    JsonObject payload) {
    InvocationContext ic =
      WebAppUtils.getInvocationContextFromResourceContext(resContext);
    String contents = null;
    try {
      if (payload.containsKey("data")
        && payload.getJsonObject("data").containsKey("generatedContents")) {
        contents = payload.getJsonObject("data").getString("generatedContents");
      }
    } catch (Exception e) {
      // fall through to error below
    }
    if (contents == null) {
      throw new FailedRequestException(LocalizedConstants.MISSING_IMPORT_CONTENTS, ic);
    }
    JsonObject in;
    try {
      in = Json.createReader(new java.io.StringReader(contents)).readObject();
    } catch (Exception e) {
      throw new FailedRequestException(LocalizedConstants.UNABLE_TO_PARSE_PROJECT_FILE, ic);
    }
    if (!in.containsKey("projects")) {
      throw new FailedRequestException(LocalizedConstants.PROJECT_FILE_MISSING_PROJECTS, ic);
    }
    ProjectManager projectManager = ProjectManager.getFromContext(resContext);
    javax.json.JsonArray projectsJSON = in.getJsonArray("projects");
    for (JsonObject projJSON : projectsJSON.getValuesAs(JsonObject.class)) {
      String name = projJSON.getString("name", null);
      if (name == null) {
        // skip nameless projects
        continue;
      }
      String finalName = name;
      if (projectManager.getProject(finalName) != null) {
        finalName = ProjectUtils.pickAName(projectManager.getNames(), name);
      }
      ProjectManager.Project proj = projectManager.createProject(finalName);
      if (projJSON.containsKey("dataProviders")) {
        for (JsonObject provJSON : projJSON.getJsonArray("dataProviders").getValuesAs(JsonObject.class)) {
          String provName = provJSON.getString("name", null);
          if (provName != null) {
            proj.addProvider(provName, provJSON, ic);
          }
        }
      }
    }
    projectManager.save(ic);
    return WebAppUtils.addCookieFromContext(resContext,
      Response.ok(Json.createObjectBuilder().build(), MediaType.APPLICATION_JSON)
    ).build();
  }
}
