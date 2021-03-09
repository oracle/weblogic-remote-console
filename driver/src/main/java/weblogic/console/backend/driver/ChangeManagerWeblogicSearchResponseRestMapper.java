// Copyright (c) 2020, 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.driver;

import java.util.logging.Logger;
import javax.json.Json;
import javax.json.JsonArray;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;
import javax.json.JsonValue;

import weblogic.console.backend.typedesc.WeblogicBeanProperty;
import weblogic.console.backend.typedesc.WeblogicBeanType;

/**
 * Transforms a change manager related WebLogic REST search query response
 * into an RDJ json response.
 */
public class ChangeManagerWeblogicSearchResponseRestMapper extends BaseWeblogicSearchResponseRestMapper {

  private static final Logger LOGGER =
    Logger.getLogger(ChangeManagerWeblogicSearchResponseRestMapper.class.getName());

  private ChangeManagerWeblogicSearchResponseRestMapper(
    InvocationContext invocationContext,
    JsonObject weblogicSearchResponse
  ) throws Exception {
    super(invocationContext, weblogicSearchResponse);
  }

  public static JsonObject createChangeManagerResponse(
    InvocationContext invocationContext,
    JsonObject weblogicSearchResponse
  ) throws Exception {
    LOGGER.fine("createChangeManagerResponse searchResponse=" + weblogicSearchResponse);
    JsonObject cm =
      new ChangeManagerWeblogicSearchResponseRestMapper(
        invocationContext,
        weblogicSearchResponse
      ).createChangeManagerResponse();
    LOGGER.finest("createChangeManageResponse cm=" + cm);
    return cm;
  }

  private JsonObject createChangeManagerResponse() throws Exception {
    addChangeManagerToResponse();
    addMessagesToResponse();
    return getResponseBuilder().build();
  }

  public static JsonObject createChangesResponse(
    InvocationContext invocationContext,
    JsonObject weblogicSearchResponse
  ) throws Exception {
    LOGGER.fine("createChangesResponse searchResponse=" + weblogicSearchResponse);
    JsonObject cm =
      new ChangeManagerWeblogicSearchResponseRestMapper(
        invocationContext,
        weblogicSearchResponse
      ).createChangesResponse();
    LOGGER.finest("createChangesResponse cm=" + cm);
    return cm;
  }

  private JsonObject createChangesResponse() throws Exception {
    addChangeManagerToResponse();
    addMessagesToResponse();
    addChangesToResponse();
    return getResponseBuilder().build();
  }

  private void addChangesToResponse() throws Exception {
    JsonObject cm = getWeblogicSearchResponse().getJsonObject("consoleChangeManager");
    if (cm != null) {
      JsonObject weblogicChanges = cm.getJsonObject("changes");
      if (weblogicChanges != null) {
        getResponseBuilder().add("data", formatChanges(weblogicChanges));
        return;
      }
    }
    throw
      new NoDataFoundException(
        "The console WLS REST extension which adds support for listing configuration changes has"
        + " not been installed in this WLS domain."
      );
  }

  private JsonObject formatChanges(JsonObject weblogicChanges) throws Exception {
    JsonObjectBuilder bldr = Json.createObjectBuilder();
    addModificationsToChanges(bldr, weblogicChanges);
    addAdditionsToChanges(bldr, weblogicChanges);
    addRemovalsToChanges(bldr, weblogicChanges);
    addRestartsToChanges(bldr, weblogicChanges);
    return bldr.build();
  }

  private void addModificationsToChanges(
    JsonObjectBuilder bldr,
    JsonObject weblogicChanges
  ) throws Exception {
    JsonArray weblogicVals = weblogicChanges.getJsonArray("modifications");
    if (weblogicVals == null) {
      return;
    }
    JsonArrayBuilder cbeVals = Json.createArrayBuilder();
    for (int i = 0; i < weblogicVals.size(); i++) {
      cbeVals.add(formatModification(weblogicVals.getJsonObject(i)));
    }
    bldr.add("modifications", cbeVals);
  }

  private void addAdditionsToChanges(
    JsonObjectBuilder bldr,
    JsonObject weblogicChanges
  ) throws Exception {
    JsonArray weblogicVals = weblogicChanges.getJsonArray("additions");
    if (weblogicVals == null) {
      return;
    }
    JsonArrayBuilder cbeVals = Json.createArrayBuilder();
    for (int i = 0; i < weblogicVals.size(); i++) {
      cbeVals.add(formatAddition(weblogicVals.getJsonObject(i)));
    }
    bldr.add("additions", cbeVals);
  }

  private void addRemovalsToChanges(
    JsonObjectBuilder bldr,
    JsonObject weblogicChanges
  ) throws Exception {
    JsonArray weblogicVals = weblogicChanges.getJsonArray("removals");
    if (weblogicVals == null) {
      return;
    }
    JsonArrayBuilder cbeVals = Json.createArrayBuilder();
    for (int i = 0; i < weblogicVals.size(); i++) {
      cbeVals.add(formatRemoval(weblogicVals.getJsonObject(i)));
    }
    bldr.add("removals", cbeVals);
  }

  private void addRestartsToChanges(
    JsonObjectBuilder bldr,
    JsonObject weblogicChanges
  ) throws Exception {
    JsonArray weblogicVals = weblogicChanges.getJsonArray("restarts");
    if (weblogicVals == null) {
      return;
    }
    JsonArrayBuilder cbeVals = Json.createArrayBuilder();
    for (int i = 0; i < weblogicVals.size(); i++) {
      cbeVals.add(formatRestart(weblogicVals.getJsonObject(i)));
    }
    bldr.add("restart", cbeVals);
  }

  private JsonObjectBuilder formatModification(JsonObject weblogicVal) throws Exception {

    JsonArray weblogicIdentity = weblogicVal.getJsonArray("identity");
    WeblogicBeanType beanType = getBeanTypeFromWeblogicIdentity(weblogicIdentity);
    WeblogicBeanProperty beanProp =
        beanType.getPropertyFromRestName(weblogicVal.getString("property"));

    // Always add the identity, restart required and property name
    JsonObjectBuilder bldr =
      Json.createObjectBuilder()
        .add("identity", weblogicIdentityToResponseIdentity(weblogicIdentity))
        .add("restartRequired", weblogicVal.getBoolean("restartRequired"))
        .add(
          "property",
          beanProp.getName()
      );

    // Add the old value if present
    if (weblogicVal.containsKey("oldValue")) {
      bldr.add(
        "oldValue",
        modificationWeblogicPropertyValueToResponsePropertyValue(
          beanProp,
          weblogicVal.getJsonObject("oldValue")
        )
      );
    }

    // Add the new value if present
    if (weblogicVal.containsKey("newValue")) {
      bldr.add(
        "newValue",
        modificationWeblogicPropertyValueToResponsePropertyValue(
          beanProp,
          weblogicVal.getJsonObject("newValue")
        )
      );
    }
    return bldr;
  }

  private JsonObjectBuilder formatAddition(JsonObject weblogicVal) throws Exception {
    return
      Json.createObjectBuilder()
        .add("identity", weblogicIdentityToResponseIdentity(weblogicVal.get("identity")))
        .add("restartRequired", weblogicVal.getBoolean("restartRequired"));
  }

  private JsonObjectBuilder formatRemoval(JsonObject weblogicVal) throws Exception {
    return
      Json.createObjectBuilder()
        .add("identity", weblogicIdentityToResponseIdentity(weblogicVal.get("identity")))
        .add("restartRequired", weblogicVal.getBoolean("restartRequired"));
  }

  private JsonObjectBuilder formatRestart(JsonObject weblogicVal) throws Exception {
    return Json.createObjectBuilder(weblogicVal);
  }

  // Converts a Weblogic REST property value from a modification change
  // to its corresponding RDJ value.
  // Same as weblogicPropertyValueToResponsePropertyValue except
  // that we don't need to handle identity and we don't include
  // available options.
  private JsonValue modificationWeblogicPropertyValueToResponsePropertyValue(
    WeblogicBeanProperty beanProp,
    JsonObject wrappedWeblogicValue
  ) throws Exception {
    LOGGER.finest(
        "modificationWeblogicPropertyValueToResponsePropertyValue "
        + beanProp
        + " "
        + wrappedWeblogicValue
    );
    if (beanProp.isContainmentRelationship()) {
      throw new Exception("Unexpected containment property " + beanProp);
    }
    ExpandedValue weblogicEV = ExpandedValue.wrap(wrappedWeblogicValue);
    JsonValue weblogicValue = weblogicEV.getValue();
    JsonValue responseValue = null;
    if (beanProp.isReferenceAsReferences()) {
      JsonArray weblogicIdentities = weblogicValue.asJsonArray();
      JsonValue weblogicIdentity =
        getWeblogicIdentityFromWeblogicIdentities(weblogicIdentities, beanProp);
      responseValue = getWeblogicIdentityDisplayName(weblogicIdentity);
    } else if (beanProp.isReference()) {
      responseValue = getWeblogicIdentityDisplayName(weblogicValue);
    } else if (beanProp.isReferences()) {
      responseValue = getWeblogicIdentitiesDisplayNames(weblogicValue.asJsonArray());
    } else if (beanProp.isDate()) {
      responseValue = beanProp.isDateAsLong() ? formatDateAsLong(weblogicValue) : formatDate(weblogicValue);
    } else {
      responseValue = weblogicValue;
    }
    return ExpandedValue.fromValue(responseValue).copySet(weblogicEV).getJson();
  }

  private WeblogicBeanType getBeanTypeFromWeblogicIdentity(JsonValue identity) throws Exception {
    LOGGER.finest("getBeanTypePropertyFromWeblogicIdentity " + identity);
    if (identity == JsonValue.NULL) {
      return null;
    }
    WeblogicBeanProperty prop = null;
    WeblogicBeanType beanType = getRootBeanType();
    JsonArray weblogicIdentity = identity.asJsonArray();
    for (int i = 0; i < weblogicIdentity.size(); i++) {
      String propRestName = weblogicIdentity.getString(i);
      prop = beanType.getPropertyFromRestName(propRestName);
      if (prop.isContainedCollection()) {
        beanType = prop.getBeanType();
        i++; // the next string in the identity is the identity of the instance in the collection
      } else if (prop.isFoldableContainedSingleton() || prop.isContainedOptionalSingleton()) {
        beanType = prop.getBeanType();
      } else {
        throw
          new Exception(
            beanType.getName()
            + " " + prop
            + " is not a contained collection or singleton."
          );
      }
    }
    return beanType;
  }

  // Convert a list of weblogic identities in a property value (e.g. a list of references)
  // into a list of names that can be displayed in the shopping cart.
  private JsonArray getWeblogicIdentitiesDisplayNames(JsonArray weblogicIdentities) {
    JsonArrayBuilder bldr = Json.createArrayBuilder();
    for (int i = 0; i < weblogicIdentities.size(); i++) {
      JsonValue weblogicIdentity = weblogicIdentities.getJsonObject(i).get("identity");
      bldr.add(getWeblogicIdentityDisplayName(weblogicIdentity));
    }
    return bldr.build();
  }

  // Convert a weblogic identity in a property value (i.e. a reference)
  // into a name that can be displayed in the shopping cart.
  //
  // If the identity is null, then return 'None'.
  //
  // If the identity is for a collection child, return the child's
  // key relative to its parent collection
  // (e.g. servers/Server1/networkAccessPoints/Channel1 -> Channel1)
  //
  // If the identity is for an optional singleton, return the
  // singleton's property name
  // (e.g. realms/myrealm/adjudicator -> adjudicator)
  private JsonValue getWeblogicIdentityDisplayName(JsonValue weblogicIdentity) {
    if (weblogicIdentity == JsonValue.NULL) {
      return weblogicIdentity;
    }
    JsonArray segments = weblogicIdentity.asJsonArray();
    return segments.get(segments.size() - 1);
  }
}
