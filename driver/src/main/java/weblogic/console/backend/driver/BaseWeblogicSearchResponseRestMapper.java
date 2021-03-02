// Copyright (c) 2020, 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.driver;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.logging.Logger;
import javax.json.Json;
import javax.json.JsonArray;
import javax.json.JsonArrayBuilder;
import javax.json.JsonNumber;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;
import javax.json.JsonValue;

import weblogic.console.backend.typedesc.WeblogicBeanProperty;
import weblogic.console.backend.typedesc.WeblogicBeanType;
import weblogic.console.backend.typedesc.WeblogicBeanTypes;

/**
 * Base class for transforming WebLogic REST search query responses
 * into RDJ json responses.
 */
public class BaseWeblogicSearchResponseRestMapper extends BaseRestMapper {

  private static final Logger LOGGER =
    Logger.getLogger(BaseWeblogicSearchResponseRestMapper.class.getName());

  // 3 digit tz, e.g. ...+05:00
  private static final String ISO_8601_DATE_TIME_FORMAT = "yyyy-MM-dd'T'HH:mm:ss.SSSXXX";

  private JsonObjectBuilder respBldr = Json.createObjectBuilder();

  protected JsonObjectBuilder getResponseBuilder() {
    return this.respBldr;
  }

  private JsonObject weblogicSearchResponse;

  protected JsonObject getWeblogicSearchResponse() {
    return this.weblogicSearchResponse;
  }

  protected BaseWeblogicSearchResponseRestMapper(
    InvocationContext invocationContext,
    JsonObject weblogicSearchResponse
  ) throws Exception {
    super(invocationContext);
    this.weblogicSearchResponse = weblogicSearchResponse;
  }

  protected void addChangeManagerToResponse() throws Exception {
    JsonObject wlsChangeManager = getWeblogicSearchResponse().getJsonObject("changeManager");
    if (wlsChangeManager != null) {
      boolean supportsChanges = false; // the WLS REST api doesn't support listing the changes
      // start off with the change manager's fields
      JsonObjectBuilder bldr = Json.createObjectBuilder(wlsChangeManager);
      // see if the console REST extension is available in the domain
      JsonObject wlsConsoleChangeManager =
        getWeblogicSearchResponse().getJsonObject("consoleChangeManager");
      if (wlsConsoleChangeManager != null) {
        // the console REST extension is installed, therefore we can list changes
        supportsChanges = true;
        // Uncomment when we enforce that the client sent in the current weblogic version
        /*
        JsonObject configurationVersion = wlsConsoleChangeManager.getJsonObject("configurationVersion");
        if (configurationVersion != null) {
          bldr.addAll(Json.createObjectBuilder(configurationVersion));
        }
        */
      }
      bldr.add("supportsChanges", supportsChanges);
      getResponseBuilder().add("changeManager", bldr);
    } else {
      // if the change manager isn't present, don't add any change manager info to the response
      // (including anything from the console REST extension)
    }
  }

  protected void addMessagesToResponse() {
    if (getWeblogicSearchResponse().containsKey("messages")) {
      getResponseBuilder().add("messages", getWeblogicSearchResponse().get("messages"));
    }
  }

  protected JsonValue getWeblogicIdentityFromWeblogicIdentities(
    JsonArray weblogicIdentities,
    WeblogicBeanProperty beanProp
  ) throws Exception {
    if (weblogicIdentities.isEmpty()) {
      return JsonValue.NULL;
    } else if (weblogicIdentities.size() == 1) {
      return weblogicIdentities.getJsonObject(0).get("identity");
    } else {
      // This should never happen.  Weblogic is supposed to enforce that this
      // array of references property only ever contains zero or one reference.
      throw new AssertionError("Multiple references for " + beanProp + " : " + weblogicIdentities);
    }
  }

  protected JsonArray getWeblogicIdentitiesFromWeblogicItems(
    JsonArray weblogicItems
  ) throws Exception {
    JsonArrayBuilder bldr = Json.createArrayBuilder();
    for (int i = 0; i < weblogicItems.size(); i++) {
      bldr.add(
        Json.createObjectBuilder()
          .add("identity", weblogicItems.getJsonObject(i).get("identity"))
      );
    }
    return bldr.build();
  }

  protected JsonArray getRDJIdentitiesFromWeblogicIdentities(
    JsonArray weblogicItems
  ) throws Exception {
    return
      IdentityUtils.getRDJIdentitiesFromWeblogicIdentities(
        weblogicItems,
        getPerspectivePath(),
        getLocalizer()
      );
  }

  protected JsonValue weblogicIdentityToResponseIdentity(JsonValue identity) throws Exception {
    LOGGER.finest("weblogicIdentityToResponseIdentity " + identity);
    return
      IdentityUtils.weblogicIdentityToResponseIdentity(
        identity,
        getPerspectivePath(),
        getLocalizer()
      );
  }

  // The WLS property is a java.util.Date.
  // Return its value as an ISO 8601 string
  protected JsonValue formatDate(JsonValue weblogicValue) {
    return weblogicValue; // already ISO 8610
  }

  // The WLS property is a long that really holds a date.
  // Returns its value an ISO 8601 string if the date is non-zero,
  // return an empty string otherwise.
  protected JsonValue formatDateAsLong(JsonValue weblogicValue) {
    if (weblogicValue instanceof JsonNumber) {
      long value = ((JsonNumber)weblogicValue).longValue();
      String dateString = "";
      if (value != 0) {
        Date date = new Date(value);
        dateString = new SimpleDateFormat(ISO_8601_DATE_TIME_FORMAT).format(date);
      }
      return Json.createValue(dateString);
    } else {
      throw new AssertionError("formatDateAsLong - value is not a JsonNumber: " + weblogicValue);
    }
  }

  protected WeblogicBeanType getRootBeanType() {
    return getPerspectivePath().getRootBeanType();
  }

  protected WeblogicBeanTypes getTypes() throws Exception {
    return getRootBeanType().getTypes();
  }

  protected String localizeString(String key) throws Exception {
    return getLocalizer().localizeString(key);
  }
}
