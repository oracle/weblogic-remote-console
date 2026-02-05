// Copyright (c) 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.providers;

import java.util.LinkedList;
import java.util.List;
import javax.json.Json;
import javax.json.JsonArray;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;
import javax.json.JsonString;
import javax.ws.rs.core.Response;

import weblogic.remoteconsole.common.repodef.LocalizedConstants;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.webapp.FailedRequestException;
import weblogic.remoteconsole.server.webapp.project.ProjectUtils;

public class WDTCompositeResource extends PdjRdjUtils implements TypedResource {
  private ConfiguredProvider prov;

  public WDTCompositeResource() {
  }

  WDTCompositeResource(ConfiguredProvider prov) {
    this.prov = prov;
  }

  @Override
  public JsonObjectBuilder populateFromFormData(
    InvocationContext ic,
    String operationType,
    JsonObject payload,
    JsonObjectBuilder builder) {
    builder.add("type", "composite");
    String name = null;
    if (payload.containsKey("name")) {
      name = payload.getJsonObject("name").getString("value");
    } else {
      String proposedName = (String) ic.getFrontend().getData("proposed", "name");
      if (proposedName != null) {
        name = proposedName;
      }
    }
    if (name != null) {
      builder.add("name", name);
    }
    ic.getFrontend().removeData("proposed", "name");
    if (payload.containsKey("models")) {
      JsonArray payloadArray =
        payload.getJsonObject("models").getJsonArray("value");
      JsonArrayBuilder models = Json.createArrayBuilder();
      for (int i = 0; i < payloadArray.size(); i++) {
        models.add(payloadArray.getJsonObject(i).getJsonObject("value").getJsonString("label"));
      }
      builder.add("models", models);
    }
    return builder;
  }

  @Override
  public String getDescription(InvocationContext ic) {
    return ic.getLocalizer().localizeString(LocalizedConstants.WDT_COMPOSITE_EDITOR_DESCRIPTION);
  }

  @Override
  public JsonObjectBuilder populateTableRowData(InvocationContext ic, JsonObjectBuilder builder) {
    JsonObject json = prov.getJSON();
    if (json.containsKey("file")) {
      builder.add("more", valueObject(json.getString("file")));
    }
    return builder;
  }

  @Override
  public JsonObjectBuilder populateCreateFormData(
    InvocationContext ic,
    String operationType,
    JsonObjectBuilder builder) {
    return populateFormDataShared(ic, null, builder);
  }

  private JsonObjectBuilder populateFormDataShared(
    InvocationContext ic,
    JsonObject json,
    JsonObjectBuilder builder) {
    ic.getFrontend().removeData("proposed", "name");
    ProjectManager projectManager = ic.getProjectManager();
    ProjectManager.Project proj = projectManager.getCurrentProject();
    String proposedName =
      ProjectUtils.pickAName(proj.getNames(), "WDT-Composite");
    ic.getFrontend().storeData("proposed", "name", proposedName);
    builder.add("name", Json.createObjectBuilder().add("value", proposedName));
    JsonArrayBuilder options = Json.createArrayBuilder();
    for (ConfiguredProvider prov : proj.getProviders()) {
      if (!prov.getJSON().containsKey("type")) {
        continue;
      }
      if (!prov.getJSON().getString("type").equals("model")) {
        continue;
      }
      String name = prov.getName();
      options.add(Json.createObjectBuilder()
        .add("label", name)
        .add("value", Json.createObjectBuilder()
          .add("name", name)
          .add("label", name)
          .add("resourceData", "/api/project/" + proj.getName() + "/" + name)));
    }
    boolean set = false;
    JsonArrayBuilder valuesBuilder = Json.createArrayBuilder();
    if ((json != null) && json.containsKey("models")) {
      set = true;
      for (JsonString jstring : json.getJsonArray("models").getValuesAs(JsonString.class)) {
        String string = jstring.getString();
        valuesBuilder.add(Json.createObjectBuilder()
          .add("name", string)
          .add("value", Json.createObjectBuilder()
            .add("label", string)
            .add("resourceData", string)));
      }
    }

    builder.add("models", Json.createObjectBuilder()
      .add("set", set)
      .add("value", valuesBuilder)
      .add("options", options));
    return builder;
  }

  @Override
  public JsonObjectBuilder populateFormData(InvocationContext ic, JsonObjectBuilder builder) {
    populateFormDataShared(ic, prov.getJSON(), builder);
    if (prov.getLiveProvider() != null) {
      builder.add("state", ic.getLocalizer().localizeString(
        LocalizedConstants.WDT_COMPOSITE_LOADED_STATUS));
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
    return populateFormPDJShared(ic, builder, true);
  }

  @Override
  public JsonObjectBuilder populateFormPDJ(
    InvocationContext ic,
    JsonObjectBuilder builder) {
    return populateFormPDJShared(ic, builder, false);
  }

  // At create time, the name is editable
  public JsonObjectBuilder populateFormPDJShared(
    InvocationContext ic,
    JsonObjectBuilder builder,
    boolean isCreate
  ) {
    String readOnlyOrNot = isCreate ? "" : "readOnly";
    builder.add("introductionHTML", ic.getLocalizer().localizeString(
      LocalizedConstants.WDT_COMPOSITE_SETTINGS_INTRODUCTION));
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
    builder.add("presentation", Json.createObjectBuilder()
      .add("singleColumn", true));
    builder.add("sliceForm", Json.createObjectBuilder()
      .add("presentation", Json.createObjectBuilder()
        .add("singleColumn", true).build())
      .add("actions", actionsBuilder)
      .add("properties", Json.createArrayBuilder()
        .add(pdjObject("name", ic.getLocalizer().localizeString(
            LocalizedConstants.WDT_COMPOSITE_PROVIDER_NAME_LABEL), "String", readOnlyOrNot)
          .add("helpSummaryHTML", ic.getLocalizer().localizeString(
            LocalizedConstants.DATA_PROVIDER_HELP_NAME_SUMMARY))
          .add("detailedHelpHTML", ic.getLocalizer().localizeString(
            LocalizedConstants.DATA_PROVIDER_HELP_NAME_DETAIL)))
        .add(Json.createObjectBuilder()
          .add("name", "models")
          .add("label", ic.getLocalizer().localizeString(
            LocalizedConstants.WDT_COMPOSITE_MODELS_LABEL))
          .add("type", "reference-dynamic-enum")
          .add("array", true))));
    return builder;
  }

  @Override
  public Provider start(InvocationContext ic) {
    JsonObject json = prov.getJSON();
    if (!json.containsKey("models") || (json.getJsonArray("models").size() == 0)) {
      throw new FailedRequestException(
          Response.Status.BAD_REQUEST.getStatusCode(), ic.getLocalizer().localizeString(
              LocalizedConstants.NEED_MODELS));
    }
    List<String> models = new LinkedList<>();
    for (int i = 0; i < json.getJsonArray("models").size(); i++) {
      models.add(json.getJsonArray("models").getString(i));
    }
    Provider ret = new WDTCompositeDataProviderImpl(
      json.getString("name"),
      models);

    ret.start(ic);
    return ret;
  }
}
