// Copyright (c) 2025, 2026, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.providers;

import java.util.Base64;
import java.util.logging.Logger;
import javax.json.Json;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;
import javax.ws.rs.core.Response;

import weblogic.remoteconsole.common.repodef.LocalizedConstants;
import weblogic.remoteconsole.server.ConsoleBackendRuntime;
import weblogic.remoteconsole.server.ConsoleBackendRuntimeConfig;
import weblogic.remoteconsole.server.EncryptDecrypt;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.webapp.FailedRequestException;
import weblogic.remoteconsole.server.webapp.project.ProjectUtils;

public class AdminServerResource extends PdjRdjUtils implements TypedResource {
  private static final Logger LOGGER = Logger.getLogger(AdminServerResource.class.getName());
  private ConfiguredProvider prov;

  // This is used for calling createForm
  public AdminServerResource() {
  }

  AdminServerResource(ConfiguredProvider prov) {
    this.prov = prov;
  }

  private void setStateInJSON(InvocationContext ic, JsonObjectBuilder builder) {
    // We should terminate providers that have lost connectivity elsewhere,
    // but this will do for now.
    if (prov.getLiveProvider() != null) {
      AdminServerDataProvider liveProv =
        (AdminServerDataProvider) prov.getLiveProvider();
      if (liveProv.isConnected()) {
        builder.add("state", valueObject(ic.getLocalizer().localizeString(LocalizedConstants.CONNECTED_STATUS_LABEL)));
      } else {
        prov.terminate();
      }
    }
  }

  @Override
  public String getDescription(InvocationContext ic) {
    if (prov.getJSON().containsKey("url")) {
      return ic.getLocalizer().localizeString(
        LocalizedConstants.ADMIN_SERVER_CONNECTION_DESCRIPTION_WITH_URL,
        prov.getJSON().getString("url")
      );
    } else {
      return ic.getLocalizer().localizeString(LocalizedConstants.ADMIN_SERVER_CONNECTION_DESCRIPTION);
    }
  }

  @Override
  public JsonObjectBuilder populateTableRowData(InvocationContext ic, JsonObjectBuilder builder) {
    JsonObject json = prov.getJSON();
    if (json.containsKey("url")) {
      builder.add("more", valueObject(json.getString("url")));
    }
    setStateInJSON(ic, builder);
    return builder;
  }

  @Override
  public JsonObjectBuilder populateFromFormData(
    InvocationContext ic, String operationType, JsonObject payload, JsonObjectBuilder builder) {
    builder.add("type", "adminserver");
    if (payload.containsKey("password")) {
      String password = payload.getJsonObject("password").getString("value");
      builder.add("password", password);
      builder.add("passwordEncrypted", "");
    }
    if (payload.containsKey("name")) {
      builder.add("name", payload.getJsonObject("name").getString("value"));
    } else {
      String proposedName = (String) ic.getFrontend().getData("proposed", "name");
      if (proposedName != null) {
        builder.add("name", proposedName);
      }
    }
    if (payload.containsKey("username")) {
      builder.add("username", payload.getJsonObject("username").getString("value"));
    }
    if (payload.containsKey("url")) {
      builder.add("url", payload.getJsonObject("url").getString("value"));
    }
    JsonObjectBuilder settingsBuilder = Json.createObjectBuilder();
    if (isSet(payload, "proxyOverride")) {
      String proxyValue = payload.getJsonObject("proxyOverride").getString("value");
      if (!proxyValue.isEmpty()) {
        settingsBuilder.add("proxyOverride", proxyValue);
      }
    }
    if (isSet(payload, "connectTimeoutOverride")) {
      String connectValue = payload.getJsonObject("connectTimeoutOverride").getString("value");
      if (!connectValue.isEmpty()) {
        try {
          long connectTimeout = Long.parseLong(connectValue);
          if (connectTimeout < 0) {
            throw new FailedRequestException(
              Response.Status.BAD_REQUEST.getStatusCode(),
              ic.getLocalizer().localizeString(
                LocalizedConstants.INVALID_TIMEOUT_VALUE_MESSAGE, "connectTimeoutOverride", connectValue)
            );
          }
          settingsBuilder.add("connectTimeoutOverride", connectValue);
        } catch (NumberFormatException e) {
          throw new FailedRequestException(
            Response.Status.BAD_REQUEST.getStatusCode(),
            ic.getLocalizer().localizeString(
              LocalizedConstants.INVALID_TIMEOUT_VALUE_MESSAGE, "connectTimeoutOverride", connectValue)
          );
        }
      }
    }
    if (isSet(payload, "readTimeoutOverride")) {
      String readValue = payload.getJsonObject("readTimeoutOverride").getString("value");
      if (!readValue.isEmpty()) {
        try {
          long readTimeout = Long.parseLong(readValue);
          if (readTimeout < 0) {
            throw new FailedRequestException(
              Response.Status.BAD_REQUEST.getStatusCode(),
              ic.getLocalizer().localizeString(
                LocalizedConstants.INVALID_TIMEOUT_VALUE_MESSAGE, "readTimeoutOverride", readValue)
            );
          }
          settingsBuilder.add("readTimeoutOverride", readValue);
        } catch (NumberFormatException e) {
          throw new FailedRequestException(
            Response.Status.BAD_REQUEST.getStatusCode(),
            ic.getLocalizer().localizeString(
              LocalizedConstants.INVALID_TIMEOUT_VALUE_MESSAGE, "readTimeoutOverride", readValue)
          );
        }
      }
    }
    if (payload.containsKey("webAuthentication")) {
      if (payload.getJsonObject("webAuthentication").getBoolean("value")) {
        settingsBuilder.add("sso", true);
      }
    }
    if (payload.containsKey("insecure")) {
      if (payload.getJsonObject("insecure").getBoolean("value")) {
        settingsBuilder.add("insecure", true);
      }
    }
    // We actually want to not have a settings object at all if it is empty,
    // but we'll let the ProviderInstance layer fix that.
    builder.add("settings", settingsBuilder.build());
    return builder;
  }

  private static boolean isSet(JsonObject obj, String key) {
    if (!obj.containsKey(key)) {
      return false;
    }
    if (!obj.getJsonObject(key).containsKey("set")) {
      return true;
    }
    return obj.getJsonObject(key).getBoolean("set");
  }

  @Override
  public JsonObjectBuilder populateCreateFormData(
    InvocationContext ic, String operationType, JsonObjectBuilder builder) {
    ProjectManager.Project proj = ic.getProjectManager().getCurrentProject();
    String proposedName =
      ProjectUtils.pickAName(proj.getNames(), "Admin-Server-Connection");
    ic.getFrontend().storeData("proposed", "name", proposedName);
    builder
      .add("url", Json.createObjectBuilder()
        .add("value", "http://localhost:7001"))
      .add("webAuthentication", Json.createObjectBuilder()
        .add("value", false))
      .add("insecure", Json.createObjectBuilder()
        .add("value", false))
      .add("name", Json.createObjectBuilder()
        .add("value", proposedName));
    return builder;
  }

  @Override
  public JsonObjectBuilder populateFormData(InvocationContext ic, JsonObjectBuilder builder) {
    ic.getFrontend().removeData("proposed", "name");
    JsonObject json = prov.getJSON();
    setStateInJSON(ic, builder);
    if (json.containsKey("url")) {
      builder.add("url", valueObject(json.getString("url")));
    }
    if (json.containsKey("username")) {
      builder.add("username", valueObject(json.getString("username")));
    } else {
      builder.add("username", valueObject(null));
    }
    if ((json.containsKey("password") && json.getString("password").length() > 0)
      || (json.containsKey("passwordEncrypted") && json.getString("passwordEncrypted").length() > 0)) {
      builder.add("password", Json.createObjectBuilder()
        .add("set", true)
        .add("value", "*********")
        .add("value-hidden", true));
    } else {
      builder.add("password", valueObject(null));
    }
    JsonObject settingsJSON = null;
    boolean local = false;
    if (json.containsKey("settings")) {
      settingsJSON = json.getJsonObject("settings");
      if (settingsJSON.containsKey("local")) {
        local = settingsJSON.getBoolean("local");
      }
    }
    if (!local) {
      builder.add("webAuthentication", valueObject(false, false));
      builder.add("proxyOverride", valueObject(null));
      builder.add("connectTimeoutOverride", valueObject(null));
      builder.add("readTimeoutOverride", valueObject(null));
      builder.add("insecure", valueObject(false, false));
      if (settingsJSON != null) {
        settingsJSON = json.getJsonObject("settings");
        if (settingsJSON.containsKey("sso")
          && settingsJSON.getBoolean("sso")) {
          builder.add("webAuthentication", valueObject("true"));
        }
        if (settingsJSON.containsKey("insecure")
          && settingsJSON.getBoolean("insecure")) {
          builder.add("insecure", valueObject("true"));
        }
        if (settingsJSON.containsKey("proxyOverride")) {
          String val = settingsJSON.getString("proxyOverride");
          if (!val.equals("")) {
            builder.add("proxyOverride", valueObject(val));
          }
        }
        if (settingsJSON.containsKey("connectTimeoutOverride")) {
          String val = settingsJSON.getString("connectTimeoutOverride");
          if (!val.equals("")) {
            builder.add("connectTimeoutOverride", valueObject(val));
          }
        }
        if (settingsJSON.containsKey("readTimeoutOverride")) {
          String val = settingsJSON.getString("readTimeoutOverride");
          if (!val.equals("")) {
            builder.add("readTimeoutOverride", valueObject(val));
          }
        }
      }
    }
    return builder;
  }

  private void addFormProperties(
    InvocationContext ic, JsonArrayBuilder propertiesBuilder) {
    propertiesBuilder.add(pdjObject("webAuthentication", ic.getLocalizer().localizeString(
        LocalizedConstants.USE_WEB_AUTHENTICATION_LABEL), "boolean")
      .add("helpSummaryHTML", ic.getLocalizer().localizeString(
        LocalizedConstants.ADMIN_SERVER_HELP_SSO_SUMMARY))
      .add("detailedHelpHTML", ic.getLocalizer().localizeString(
        LocalizedConstants.ADMIN_SERVER_HELP_SSO_DETAIL)));
    propertiesBuilder.add(pdjObject("url", ic.getLocalizer().localizeString(
        LocalizedConstants.URL_LABEL), "String", "required")
      .add("helpSummaryHTML", ic.getLocalizer().localizeString(
        LocalizedConstants.ADMIN_SERVER_HELP_URL_SUMMARY))
      .add("detailedHelpHTML", ic.getLocalizer().localizeString(
        LocalizedConstants.ADMIN_SERVER_HELP_URL_DETAIL)));
    propertiesBuilder.add(pdjObject("username", ic.getLocalizer().localizeString(
        LocalizedConstants.USER_NAME_LABEL), "String")
      .add("helpSummaryHTML", ic.getLocalizer().localizeString(
        LocalizedConstants.ADMIN_SERVER_HELP_USERNAME_SUMMARY))
      .add("detailedHelpHTML", ic.getLocalizer().localizeString(
        LocalizedConstants.ADMIN_SERVER_HELP_USERNAME_DETAIL)));
    propertiesBuilder.add(pdjObject("password", ic.getLocalizer().localizeString(
        LocalizedConstants.PASSWORD_LABEL), "secret")
      .add("helpSummaryHTML", ic.getLocalizer().localizeString(
        LocalizedConstants.ADMIN_SERVER_HELP_PASSWORD_SUMMARY))
      .add("detailedHelpHTML", ic.getLocalizer().localizeString(
        LocalizedConstants.ADMIN_SERVER_HELP_PASSWORD_DETAIL)));
    propertiesBuilder.add(pdjObject("proxyOverride", ic.getLocalizer().localizeString(
        LocalizedConstants.ADMIN_SERVER_LABEL_PROXY), "String")
      .add("helpSummaryHTML", ic.getLocalizer().localizeString(
        LocalizedConstants.ADMIN_SERVER_HELP_PROXY_SUMMARY))
      .add("detailedHelpHTML", ic.getLocalizer().localizeString(
        LocalizedConstants.ADMIN_SERVER_HELP_PROXY_DETAIL)));
    propertiesBuilder.add(pdjObject("connectTimeoutOverride", ic.getLocalizer().localizeString(
        LocalizedConstants.ADMIN_SERVER_LABEL_CONNECT_TIMEOUT_OVERRIDE_MILLIS), "String")
      .add("helpSummaryHTML", ic.getLocalizer().localizeString(
        LocalizedConstants.ADMIN_SERVER_HELP_CONNECT_TIMEOUT_OVERRIDE_MILLIS_SUMMARY))
      .add("detailedHelpHTML", ic.getLocalizer().localizeString(
        LocalizedConstants.ADMIN_SERVER_HELP_CONNECT_TIMEOUT_OVERRIDE_MILLIS_DETAIL,
        ConsoleBackendRuntimeConfig.getConnectTimeout())));
    propertiesBuilder.add(pdjObject("readTimeoutOverride", ic.getLocalizer().localizeString(
        LocalizedConstants.ADMIN_SERVER_LABEL_READ_TIMEOUT_OVERRIDE_MILLIS), "String")
      .add("helpSummaryHTML", ic.getLocalizer().localizeString(
        LocalizedConstants.ADMIN_SERVER_HELP_READ_TIMEOUT_OVERRIDE_MILLIS_SUMMARY))
      .add("detailedHelpHTML", ic.getLocalizer().localizeString(
        LocalizedConstants.ADMIN_SERVER_HELP_READ_TIMEOUT_OVERRIDE_MILLIS_DETAIL,
        ConsoleBackendRuntimeConfig.getReadTimeout())));
    propertiesBuilder.add(pdjObject("insecure", ic.getLocalizer().localizeString(
        LocalizedConstants.MAKE_INSECURE_CONNECTION_LABEL), "boolean")
      .add("helpSummaryHTML", ic.getLocalizer().localizeString(
        LocalizedConstants.ADMIN_SERVER_HELP_INSECURE_SUMMARY))
      .add("detailedHelpHTML", ic.getLocalizer().localizeString(
        LocalizedConstants.ADMIN_SERVER_HELP_INSECURE_DETAIL)));
  }

  @Override
  public JsonArrayBuilder addSpecialTableProperties(
      InvocationContext ic, JsonArrayBuilder propertiesBuilder) {
    propertiesBuilder.add(pdjObject("webAuthentication", ic.getLocalizer().localizeString(
        LocalizedConstants.USE_WEB_AUTHENTICATION_LABEL), "boolean")
      .add("helpSummaryHTML", ic.getLocalizer().localizeString(
        LocalizedConstants.ADMIN_SERVER_HELP_SSO_SUMMARY))
      .add("detailedHelpHTML", ic.getLocalizer().localizeString(
        LocalizedConstants.ADMIN_SERVER_HELP_SSO_DETAIL)));
    propertiesBuilder.add(pdjObject("url", ic.getLocalizer().localizeString(
        LocalizedConstants.URL_LABEL), "String", "required")
      .add("helpSummaryHTML", ic.getLocalizer().localizeString(
        LocalizedConstants.ADMIN_SERVER_HELP_URL_SUMMARY))
      .add("detailedHelpHTML", ic.getLocalizer().localizeString(
        LocalizedConstants.ADMIN_SERVER_HELP_URL_DETAIL)));
    propertiesBuilder.add(pdjObject("username", ic.getLocalizer().localizeString(
        LocalizedConstants.USER_NAME_LABEL), "String")
      .add("helpSummaryHTML", ic.getLocalizer().localizeString(
        LocalizedConstants.ADMIN_SERVER_HELP_USERNAME_SUMMARY))
      .add("detailedHelpHTML", ic.getLocalizer().localizeString(
        LocalizedConstants.ADMIN_SERVER_HELP_USERNAME_DETAIL)));
    propertiesBuilder.add(pdjObject("proxyOverride", ic.getLocalizer().localizeString(
        LocalizedConstants.ADMIN_SERVER_HELP_PROXY_SUMMARY), "String")
      .add("helpSummaryHTML", ic.getLocalizer().localizeString(
        LocalizedConstants.ADMIN_SERVER_HELP_PROXY_SUMMARY))
      .add("detailedHelpHTML", ic.getLocalizer().localizeString(
        LocalizedConstants.ADMIN_SERVER_HELP_PROXY_DETAIL)));
    propertiesBuilder.add(pdjObject("insecure", ic.getLocalizer().localizeString(
        LocalizedConstants.MAKE_INSECURE_CONNECTION_LABEL), "boolean")
      .add("helpSummaryHTML", ic.getLocalizer().localizeString(
        LocalizedConstants.ADMIN_SERVER_HELP_INSECURE_SUMMARY))
      .add("detailedHelpHTML", ic.getLocalizer().localizeString(
        LocalizedConstants.ADMIN_SERVER_HELP_INSECURE_DETAIL)));
    return propertiesBuilder;
  }

  @Override
  public JsonObjectBuilder populateCreateFormPDJ(
    InvocationContext ic,
    String operationType,
    JsonObjectBuilder builder
  ) {
    builder.add("introductionHTML",
      ic.getLocalizer().localizeString(LocalizedConstants.ADMIN_SERVER_CREATE_INTRODUCTION));
    builder.add("presentation", Json.createObjectBuilder()
      .add("singleColumn", true));
    JsonArrayBuilder propertiesBuilder = Json.createArrayBuilder();
    propertiesBuilder
      .add(pdjObject("name", "Name", "String")
        .add("helpSummaryHTML", ic.getLocalizer().localizeString(LocalizedConstants.DATA_PROVIDER_HELP_NAME_SUMMARY))
        .add("detailedHelpHTML", ic.getLocalizer().localizeString(LocalizedConstants.DATA_PROVIDER_HELP_NAME_DETAIL)));
    addFormProperties(ic, propertiesBuilder);
    builder.add("actionInputForm", Json.createObjectBuilder()
      .add("presentation", Json.createObjectBuilder()
        .add("singleColumn", true).build())
      .add("properties", propertiesBuilder));
    return builder;
  }

  @Override
  public String getHomeResourceDataLocation() {
    return "/api/-current-/group";
  }

  @Override
  public JsonObjectBuilder populateFormPDJ(
    InvocationContext ic, JsonObjectBuilder builder) {
    builder.add("introductionHTML", ic.getLocalizer().localizeString(
      LocalizedConstants.ADMIN_SERVER_PAGE_INTRODUCTION));
    JsonArrayBuilder actionsBuilder = Json.createArrayBuilder();
    // Notice that connect and select don't need a reload because they
    // will navigate the user elsewhere or, if they don't, they have failed
    // and there is nothing new to say.  But disconnect is different.  The user
    // is still sitting right here, yet the "State" field will be inaccurate
    // without a refresh.
    if (prov.getLiveProvider() == null) {
      actionsBuilder.add(Json.createObjectBuilder()
        .add("name", "select")
        .add("saveFirstLabel", ic.getLocalizer().localizeString(LocalizedConstants.SAVE_AND_CONNECT_LABEL))
        .add("label", ic.getLocalizer().localizeString(LocalizedConstants.PROVIDER_TABLE_CONNECT_ACTIVATE_LABEL)));
    } else {
      actionsBuilder.add(Json.createObjectBuilder()
        .add("name", "select")
        .add("label", ic.getLocalizer().localizeString(LocalizedConstants.PROVIDER_TABLE_CONNECT_ACTIVATE_LABEL)));
      actionsBuilder.add(Json.createObjectBuilder()
        .add("name", "disconnect")
        .add("label", ic.getLocalizer().localizeString(LocalizedConstants.DISCONNECT_LABEL))
        .add("polling", Json.createObjectBuilder()
          .add("maxAttempts", 1)
          .add("reloadSeconds", 1)));
    }
    boolean local = false;
    JsonObject settingsJSON = null;
    JsonObject json = prov.getJSON();
    if (json.containsKey("settings")) {
      settingsJSON = json.getJsonObject("settings");
      if (settingsJSON.containsKey("local")) {
        local = settingsJSON.getBoolean("local");
      }
    }
    JsonArrayBuilder propertiesBuilder = Json.createArrayBuilder();
    // Keep name read-only
    propertiesBuilder
      .add(pdjObject("name", "Name", "String", "readOnly")
        .add("helpSummaryHTML", ic.getLocalizer().localizeString(LocalizedConstants.DATA_PROVIDER_HELP_NAME_SUMMARY))
        .add("detailedHelpHTML", ic.getLocalizer().localizeString(LocalizedConstants.DATA_PROVIDER_HELP_NAME_DETAIL)));
    if (local) {
      propertiesBuilder
        .add(pdjObject("url", "URL", "String", "readOnly")
          .add("helpSummaryHTML", ic.getLocalizer().localizeString(LocalizedConstants.ADMIN_SERVER_HELP_URL_SUMMARY))
          .add("detailedHelpHTML", ic.getLocalizer().localizeString(LocalizedConstants.ADMIN_SERVER_HELP_URL_DETAIL)))
        .add(pdjObject("state", "State", "String", "readOnly"));
    } else {
      addFormProperties(ic, propertiesBuilder);
      propertiesBuilder.add(pdjObject("state", "State", "String", "readOnly"));
    }
    builder.add("sliceForm", Json.createObjectBuilder()
      .add("properties", propertiesBuilder)
      .add("presentation", Json.createObjectBuilder()
        .add("singleColumn", true).build())
      .add("actions", actionsBuilder));
    return builder;
  }

  @Override
  public Provider start(InvocationContext ic) {
    JsonObject json = prov.getJSON();
    JsonObject settingsJSON = null;
    if (json.containsKey("settings")) {
      settingsJSON = json.getJsonObject("settings");
    }
    boolean useSso = false;
    boolean local = false;
    boolean insecure = false;
    String connectTimeoutOverride = "";
    String readTimeoutOverride = "";
    if (settingsJSON != null) {
      if (settingsJSON.containsKey("sso")) {
        useSso = settingsJSON.getBoolean("sso");
      }
      if (settingsJSON.containsKey("local")) {
        local = settingsJSON.getBoolean("local");
      }
      if (settingsJSON.containsKey("insecure")) {
        insecure = settingsJSON.getBoolean("insecure");
      }
      if (settingsJSON.containsKey("connectTimeoutOverride")) {
        connectTimeoutOverride = settingsJSON.getString("connectTimeoutOverride");
      }
      if (settingsJSON.containsKey("readTimeoutOverride")) {
        readTimeoutOverride = settingsJSON.getString("readTimeoutOverride");
      }
    }
    String auth = null;
    if (!json.containsKey("url")) {
      throw new FailedRequestException(
        Response.Status.UNAUTHORIZED.getStatusCode(), ic.getLocalizer().localizeString(
          LocalizedConstants.NO_URL_SPECIFIED_MESSAGE));
    }
    if (!useSso && !local) {
      if (!json.containsKey("username")) {
        throw new FailedRequestException(
          Response.Status.UNAUTHORIZED.getStatusCode(), ic.getLocalizer().localizeString(
            LocalizedConstants.NO_USER_NAME_SPECIFIED_MESSAGE));
      }
      if (!json.containsKey("password")) {
        if (!json.containsKey("passwordEncrypted")
          || (json.getString("passwordEncrypted").length() == 0)
          || !EncryptDecrypt.isEnabled()) {
          throw new FailedRequestException(
            Response.Status.UNAUTHORIZED.getStatusCode(), ic.getLocalizer().localizeString(
              LocalizedConstants.NO_PASSWORD_SPECIFIED_MESSAGE));
        }
        String password =
          EncryptDecrypt.decrypt(json.getString("passwordEncrypted"));
        if (password == null) {
          LOGGER.warning("May be a problem during development: I was trying to decrypt "
            + json.getString("passwordEncrypted") + " and it failed!?");
        } else {
          json = Json.createObjectBuilder(json)
            .add("password", password).build();
          prov.setJSON(json);
        }
      }
      String username = json.getString("username");
      String full = username + ":" + json.getString("password");
      auth = "Basic " + Base64.getEncoder().encodeToString(full.getBytes());
    }
    AdminServerDataProvider ret = new AdminServerDataProviderImpl(
      json.getString("name"),
      json.getString("url"),
      auth,
      local,
      connectTimeoutOverride,
      readTimeoutOverride
    );
    if (useSso) {
      // Obtain an SSO token ID from the SSO token manager
      ret.setSsoTokenId(
        ConsoleBackendRuntime.INSTANCE.getSsoTokenManager().add(ret));
    }
    if (insecure) {
      ret.setInsecureConnection(true);
    }
    ret.start(ic);
    return ret;
  }
}
