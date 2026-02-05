// Copyright (c) 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.providers;

import java.io.File;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.LinkedList;
import java.util.List;
import javax.json.Json;
import javax.json.JsonArray;
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

public class WDTResource extends PdjRdjUtils implements TypedResource {
  private ConfiguredProvider prov;

  public WDTResource() {
  }

  WDTResource(ConfiguredProvider prov) {
    this.prov = prov;
  }

  @Override
  public JsonObjectBuilder populateFromFormData(
    InvocationContext ic,
    String operationType,
    JsonObject payload,
    JsonObjectBuilder builder) {
    builder.add("type", "model");
    String name = null;
    if ((prov != null) && (prov.getJSON() != null)) {
      name = prov.getJSON().getString("name");
    }
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
      WDTModelDataProviderImpl.save(ic, fileName, contents);
      if ((prov != null) && (prov.getLiveProvider() != null)) {
        prov.terminate();
      }
    } else if (operationType.startsWith("New")) {
      WDTModelDataProviderImpl.saveNew(ic, fileName);
    }
    if (payload.containsKey("properties")) {
      JsonArray payloadArray =
        payload.getJsonObject("properties").getJsonArray("value");
      JsonArrayBuilder propertyLists = Json.createArrayBuilder();
      for (int i = 0; i < payloadArray.size(); i++) {
        propertyLists.add(payloadArray.getJsonObject(i).getJsonObject("value").getString("resourceData"));
      }
      builder.add("properties", propertyLists);
    }
    return builder;
  }

  @Override
  public String getDescription(InvocationContext ic) {
    if (prov.getJSON().containsKey("file")) {
      return ic.getLocalizer().localizeString(
        LocalizedConstants.WDT_MODEL_EDITOR_DESCRIPTION,
        prov.getJSON().getString("file")
      );
    } else {
      return ic.getLocalizer().localizeString(LocalizedConstants.WDT_MODEL_EDITOR_FALLBACK_DESCRIPTION);
    }
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
  public JsonObjectBuilder populateCreateFormData(
    InvocationContext ic,
    String operationType,
    JsonObjectBuilder builder) {
    ic.getFrontend().removeData("proposed", "name");
    ProjectManager projectManager = ic.getProjectManager();
    ProjectManager.Project proj = projectManager.getCurrentProject();
    String proposedName =
      ProjectUtils.pickAName(proj.getNames(), "WDT-Model-Editor");
    ic.getFrontend().storeData("proposed", "name", proposedName);
    builder.add("name", Json.createObjectBuilder().add("value", proposedName));
    builder.add("contents", Json.createObjectBuilder().add("value", ""));
    return builder;
  }

  @Override
  public JsonObjectBuilder populateFormData(InvocationContext ic, JsonObjectBuilder builder) {
    JsonObject json = prov.getJSON();
    String name = json.getString("name");
    builder.add("name", valueObject(name));
    if (prov.getLiveProvider() != null) {
      builder.add("state", "Active");
    }
    if (ConsoleBackendRuntimeConfig.isFilesAreLocal() && json.containsKey("file")) {
      builder.add("file", valueObject(json.getString("file")));
    }
    List<String> propertyListProviders = new LinkedList<>();
    for (ConfiguredProvider prov : ic.getProjectManager().getCurrentProject().getProviders()) {
      if ("properties".equals(prov.getJSON().getString("type"))) {
        propertyListProviders.add(prov.getName());
      }
    }
    JsonObjectBuilder propertyListsBuilder = Json.createObjectBuilder();
    JsonArrayBuilder valuesBuilder = Json.createArrayBuilder();
    if (json.containsKey("properties")) {
      propertyListsBuilder.add("set", true);
      for (int i = 0; i < json.getJsonArray("properties").size(); i++) {
        valuesBuilder.add(Json.createObjectBuilder()
          .add("value", Json.createObjectBuilder()
            .add("label", json.getJsonArray("properties").getString(i))
            .add("resourceData", json.getJsonArray("properties").getString(i))));
      }
    } else {
      propertyListsBuilder.add("set", false);
    }
    propertyListsBuilder.add("value", valuesBuilder);
    JsonArrayBuilder optionsArray = Json.createArrayBuilder();
    for (String option : propertyListProviders) {
      optionsArray.add(Json.createObjectBuilder()
        .add("label", option)
        .add("set", false)
        .add("value", Json.createObjectBuilder()
          .add("label", option)
          .add("resourceData", option)));
    }
    propertyListsBuilder.add("options", optionsArray);
    builder.add("properties", propertyListsBuilder);
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
    if (operationType.equals("NewWDT")) {
      return populateCreateFormPDJNew(ic, builder);
    } else {
      return populateCreateFormPDJExisting(ic, builder);
    }
  }

  public JsonObjectBuilder populateCreateFormPDJNew(
    InvocationContext ic,
    JsonObjectBuilder builder
  ) {
    builder.add("introductionHTML",
      ic.getLocalizer().localizeString(LocalizedConstants.WDT_NEW_MODEL_INTRODUCTION));
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
          LocalizedConstants.WDT_NEW_MODEL_FILENAME_LABEL), "newFilename", "required")
        .add("helpSummaryHTML", ic.getLocalizer().localizeString(
          LocalizedConstants.WDT_PROVIDER_HELP_FILE_SUMMARY))
        .add("detailedHelpHTML", ic.getLocalizer().localizeString(
          LocalizedConstants.WDT_PROVIDER_HELP_FILE_DETAIL)));
    } else {
      propertiesBuilder.add(Json.createObjectBuilder()
        .add("name", "contents")
        .add("label", ic.getLocalizer().localizeString(
          LocalizedConstants.INITIAL_FILE_CONTENTS))
        .add("type", "fileContents"));
    }
    builder.add("actionInputForm", Json.createObjectBuilder()
      .add("presentation", Json.createObjectBuilder()
        .add("singleColumn", true).build())
      .add("properties", propertiesBuilder));
    return builder;
  }

  public JsonObjectBuilder populateCreateFormPDJExisting(
    InvocationContext ic,
    JsonObjectBuilder builder
  ) {
    builder.add("introductionHTML",
      ic.getLocalizer().localizeString(LocalizedConstants.WDT_EXISTING_MODEL_INTRODUCTION));
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
          LocalizedConstants.WDT_MODEL_FILENAME_LABEL), "filename", "required")
        .add("helpSummaryHTML", ic.getLocalizer().localizeString(
          LocalizedConstants.WDT_PROVIDER_HELP_FILE_SUMMARY))
        .add("detailedHelpHTML", ic.getLocalizer().localizeString(
          LocalizedConstants.WDT_PROVIDER_HELP_FILE_DETAIL)));
    }
    builder.add("actionInputForm", Json.createObjectBuilder()
      .add("presentation", Json.createObjectBuilder()
        .add("singleColumn", true))
      .add("properties", propertiesBuilder));
    return builder;
  }

  @Override
  public JsonObjectBuilder populateFormPDJ(InvocationContext ic, JsonObjectBuilder builder) {
    JsonArrayBuilder actionsBuilder = Json.createArrayBuilder();
    builder.add("introductionHTML", ic.getLocalizer().localizeString(
        LocalizedConstants.WDT_EXISTING_MODEL_FORM_INTRODUCTION));
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
          LocalizedConstants.WDT_MODEL_PROVIDER_NAME_LABEL), "String", "readOnly")
        .add("helpSummaryHTML", ic.getLocalizer().localizeString(
          LocalizedConstants.DATA_PROVIDER_HELP_NAME_SUMMARY))
        .add("detailedHelpHTML", ic.getLocalizer().localizeString(
          LocalizedConstants.DATA_PROVIDER_HELP_NAME_DETAIL)))
      .add(pdjObject("state", ic.getLocalizer().localizeString(
        LocalizedConstants.STATE_LABEL), "String", "readOnly"))
      .add(Json.createObjectBuilder()
        .add("name", "properties")
        .add("value", Json.createArrayBuilder())
        .add("label", ic.getLocalizer().localizeString(
          LocalizedConstants.PROPERTY_LIST_PROVIDERS_LABEL))
        .add("type", "reference-dynamic-enum")
        .add("array", true));
    if (ConsoleBackendRuntimeConfig.isFilesAreLocal()) {
      propertiesBuilder.add(pdjObject("file", ic.getLocalizer().localizeString(
        LocalizedConstants.WDT_MODEL_FILENAME_LABEL), "filename")
        .add("helpSummaryHTML", ic.getLocalizer().localizeString(
          LocalizedConstants.WDT_PROVIDER_HELP_FILE_SUMMARY))
        .add("detailedHelpHTML", ic.getLocalizer().localizeString(
          LocalizedConstants.WDT_PROVIDER_HELP_FILE_DETAIL)));
    } else {
      propertiesBuilder.add(Json.createObjectBuilder()
        .add("name", "contents")
        .add("label", ic.getLocalizer().localizeString(
          LocalizedConstants.RELOAD_FILE_CONTENTS))
        .add("type", "fileContents"));
    }
    builder.add("sliceForm", Json.createObjectBuilder()
      .add("presentation", Json.createObjectBuilder()
        .add("singleColumn", true).build())
      .add("actions", actionsBuilder)
      .add("properties", propertiesBuilder));
    return builder;
  }

  private static String fileNameFromName(InvocationContext ic, String name) {
    return PersistenceManager.getPersistenceFilePath(ic) + "/"
      + URLEncoder.encode(name, StandardCharsets.UTF_8).replaceAll("%20", " ");
  }

  @Override
  public Provider start(InvocationContext ic) {
    JsonObject json = prov.getJSON();
    String fileName;
    String name = json.getString("name");
    if (!ConsoleBackendRuntimeConfig.isFilesAreLocal()) {
      fileName = fileNameFromName(ic, name);
    } else {
      if (!json.containsKey("file") || !(new File(json.getString("file")).exists())) {
        throw new FailedRequestException(
          Response.Status.BAD_REQUEST.getStatusCode(), ic.getLocalizer().localizeString(
              LocalizedConstants.NEED_PROPER_FILE_NAME_MESSAGE));
      }
      fileName = json.getString("file");
    }

    Provider ret = new WDTModelDataProviderImpl(name, fileName);
    ret.start(ic);
    return ret;
  }
}
