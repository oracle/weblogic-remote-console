// Copyright (c) 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.providers;

import java.io.File;
import java.io.StringReader;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Properties;
import javax.json.Json;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;
import javax.ws.rs.core.Response;

import weblogic.remoteconsole.common.repodef.LocalizedConstants;
import weblogic.remoteconsole.server.ConsoleBackendRuntimeConfig;
import weblogic.remoteconsole.server.PersistenceManager;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.webapp.FailedRequestException;
import weblogic.remoteconsole.server.webapp.project.ProjectUtils;

public class PropertyListResource extends PdjRdjUtils implements TypedResource {
  private ConfiguredProvider prov;

  public PropertyListResource() {
  }

  PropertyListResource(ConfiguredProvider prov) {
    this.prov = prov;
  }

  @Override
  public String getDescription(InvocationContext ic) {
    if (ConsoleBackendRuntimeConfig.isFilesAreLocal() && prov.getJSON().containsKey("file")) {
      return ic.getLocalizer().localizeString(
        LocalizedConstants.PROPERTY_LIST_EDITOR_DESCRIPTION_WITH_FILE,
        prov.getJSON().getString("file")
      );
    } else {
      return ic.getLocalizer().localizeString(LocalizedConstants.PROPERTY_LIST_EDITOR_DESCRIPTION);
    }
  }

  @Override
  public JsonObjectBuilder populateFromFormData(
    InvocationContext ic,
    String operationType,
    JsonObject payload,
    JsonObjectBuilder builder) {
    builder.add("type", "properties");
    String name = null;
    if (operationType.startsWith("New")) {
      if (payload.containsKey("name")) {
        name = payload.getJsonObject("name").getString("value");
      } else {
        String proposedName = (String) ic.getFrontend().getData("proposed", "name");
        if (proposedName != null) {
          name = proposedName;
        }
      }
      if (name == null) {
        throw new FailedRequestException(
          Response.Status.BAD_REQUEST.getStatusCode(), ic.getLocalizer().localizeString(
            LocalizedConstants.NO_NAME_SPECIFIED_MESSAGE));
      }
      builder.add("name", name);
      ic.getFrontend().removeData("proposed", "name");
    } else {
      name = prov.getJSON().getString("name");
    }
    String contents = null;
    if (payload.containsKey("generatedContents")) {
      contents = payload.getString("generatedContents");
    }
    String fileName = null;
    if (payload.containsKey("file")) {
      fileName = payload.getJsonObject("file").getString("value");
      builder.add("file", fileName);
    } else if (!ConsoleBackendRuntimeConfig.isFilesAreLocal()) {
      fileName = fileNameFromName(ic, name);
    }
    if (contents != null) {
      Properties props = new Properties();
      try {
        props.load(new StringReader(contents));
      } catch (Exception e) {
        throw new FailedRequestException(
          Response.Status.BAD_REQUEST.getStatusCode(), ic.getLocalizer().localizeString(
            LocalizedConstants.BAD_CONTENT_MESSAGE));
      }
      PropertyListDataProviderImpl.save(ic, props, fileName, contents);
      if ((prov != null) && (prov.getLiveProvider() != null)) {
        prov.terminate();
      }
    } else if (operationType.startsWith("New")) {
      PropertyListDataProviderImpl.save(ic, new Properties(), fileName, name);
    }
    return builder;
  }

  @Override
  public JsonObjectBuilder populateTableRowData(InvocationContext ic, JsonObjectBuilder builder) {
    JsonObject json = prov.getJSON();
    if (ConsoleBackendRuntimeConfig.isFilesAreLocal() && json.containsKey("file")) {
      builder.add("more", valueObject(json.getString("file")));
    }
    return builder;
  }

  @Override
  public JsonObjectBuilder  populateCreateFormData(
    InvocationContext ic,
    String operationType,
    JsonObjectBuilder builder) {
    ic.getFrontend().removeData("proposed", "name");
    ProjectManager projectManager = ic.getProjectManager();
    ProjectManager.Project proj = projectManager.getCurrentProject();
    String proposedName =
      ProjectUtils.pickAName(proj.getNames(), "Property-List-Editor");
    ic.getFrontend().storeData("proposed", "name", proposedName);
    builder.add("name", Json.createObjectBuilder().add("value", proposedName));
    return builder;
  }

  @Override
  public JsonObjectBuilder populateFormData(InvocationContext ic, JsonObjectBuilder builder) {
    JsonObject json = prov.getJSON();
    String name = json.getString("name");
    builder.add("name", valueObject(name));
    if (ConsoleBackendRuntimeConfig.isFilesAreLocal() && json.containsKey("file")) {
      builder.add("file", valueObject(json.getString("file")));
    }
    return builder;
  }

  @Override
  public JsonArrayBuilder addSpecialTableProperties(
      InvocationContext ic, JsonArrayBuilder propertiesBuilder) {
    return propertiesBuilder;
  }

  @Override
  public JsonObjectBuilder populateCreateFormPDJ(
    InvocationContext ic,
    String operationType,
    JsonObjectBuilder builder
  ) {
    builder.add("introductionHTML", ic.getLocalizer().localizeString(
      LocalizedConstants.PROPERTY_LIST_BROWSE_INTRODUCTION));
    builder.add("presentation", Json.createObjectBuilder()
      .add("singleColumn", true));
    JsonArrayBuilder propertiesBuilder = Json.createArrayBuilder()
        .add(pdjObject("name", ic.getLocalizer().localizeString(
          LocalizedConstants.NAME_LABEL), "String", "required")
          .add("helpSummaryHTML", ic.getLocalizer().localizeString(
            LocalizedConstants.DATA_PROVIDER_HELP_NAME_SUMMARY))
          .add("detailedHelpHTML", ic.getLocalizer().localizeString(
            LocalizedConstants.DATA_PROVIDER_HELP_NAME_DETAIL)));
    if (ConsoleBackendRuntimeConfig.isFilesAreLocal()) {
      propertiesBuilder.add(pdjObject("file", ic.getLocalizer().localizeString(
        LocalizedConstants.PROPERTY_LIST_FILENAME_LABEL), "filename", "required")
        .add("helpSummaryHTML", ic.getLocalizer().localizeString(
          LocalizedConstants.PROPERTY_LIST_PROVIDER_HELP_FILE_SUMMARY))
        .add("detailedHelpHTML", ic.getLocalizer().localizeString(
          LocalizedConstants.PROPERTY_LIST_PROVIDER_HELP_FILE_DETAIL)));
    } else {
      propertiesBuilder.add(Json.createObjectBuilder()
        .add("name", "contents")
        .add("label", ic.getLocalizer().localizeString(
          LocalizedConstants.INITIAL_FILE_CONTENTS))
        .add("type", "fileContents"));
    }
    builder.add("actionInputForm", Json.createObjectBuilder()
      .add("properties", propertiesBuilder));
    return builder;
  }

  @Override
  public String getHomeResourceDataLocation() {
    return "/api/-current-/propertyList/data/properties";
  }

  @Override
  public JsonObjectBuilder populateFormPDJ(InvocationContext ic, JsonObjectBuilder builder) {
    builder.add("introductionHTML",
      ic.getLocalizer().localizeString(LocalizedConstants.PROPERTY_LIST_SETTINGS_INTRODUCTION));
    builder.add("presentation", Json.createObjectBuilder()
      .add("singleColumn", true));
    JsonArrayBuilder actionsBuilder = Json.createArrayBuilder();
    if (prov.getLiveProvider() == null) {
      actionsBuilder.add(Json.createObjectBuilder()
        .add("name", "select")
        .add("label", ic.getLocalizer().localizeString(LocalizedConstants.ACTIVATE_ACTION_LABEL)));
    } else {
      actionsBuilder.add(Json.createObjectBuilder()
        .add("name", "select")
        .add("label", ic.getLocalizer().localizeString(LocalizedConstants.PROVIDER_TABLE_CONNECT_ACTIVATE_LABEL)));
      actionsBuilder.add(Json.createObjectBuilder()
        .add("name", "disconnect")
        .add("label", ic.getLocalizer().localizeString(LocalizedConstants.UNLOAD_ACTION_LABEL))
        .add("polling", Json.createObjectBuilder()
          .add("maxAttempts", 1)
          .add("reloadSeconds", 1)));
    }
    JsonArrayBuilder propertiesBuilder = Json.createArrayBuilder()
      .add(pdjObject("name", ic.getLocalizer().localizeString(
        LocalizedConstants.PROPERTY_LIST_PROVIDER_NAME_LABEL), "String", "readOnly"));
    if (ConsoleBackendRuntimeConfig.isFilesAreLocal()) {
      propertiesBuilder.add(pdjObject("file", ic.getLocalizer().localizeString(
        LocalizedConstants.PROPERTY_LIST_FILENAME_LABEL), "filename"));
    } else {
      propertiesBuilder.add(Json.createObjectBuilder()
        .add("name", "contents")
        .add("label", ic.getLocalizer().localizeString(
          LocalizedConstants.RELOAD_FILE_CONTENTS))
        .add("type", "fileContents"));
    }
    builder.add("sliceForm", Json.createObjectBuilder()
      .add("properties", propertiesBuilder)
      .add("actions", actionsBuilder));
    return builder;
  }

  @Override
  public Provider start(InvocationContext ic) {
    JsonObject json = prov.getJSON();
    String fileName;
    if (!ConsoleBackendRuntimeConfig.isFilesAreLocal()) {
      fileName = PersistenceManager.getPersistenceFilePath(ic) + "/"
        + URLEncoder.encode(
        json.getString("name"), StandardCharsets.UTF_8).replaceAll("%20", " ");
    } else {
      if (!json.containsKey("file") || !(new File(json.getString("file")).exists())) {
        throw new FailedRequestException(
            Response.Status.BAD_REQUEST.getStatusCode(), ic.getLocalizer().localizeString(
              LocalizedConstants.NEED_PROPER_FILE_NAME_MESSAGE));
      }
      fileName = json.getString("file");
    }

    PropertyListDataProvider ret = new PropertyListDataProviderImpl(
      json.getString("name"), fileName);
    ret.start(ic);
    return ret;
  }

  private static String fileNameFromName(InvocationContext ic, String name) {
    return PersistenceManager.getPersistenceFilePath(ic) + "/"
      + URLEncoder.encode(name, StandardCharsets.UTF_8).replaceAll("%20", " ");
  }

}
