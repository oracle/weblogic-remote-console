// Copyright (c) 2020, 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.driver;

import java.util.Map;
import java.util.TreeMap;
import java.util.logging.Logger;
import javax.json.Json;
import javax.json.JsonArray;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;
import javax.json.JsonValue;

import weblogic.console.backend.pagedesc.Localizer;
import weblogic.console.backend.pagedesc.PerspectivePath;
import weblogic.console.backend.typedesc.WeblogicBeanProperty;
import weblogic.console.backend.typedesc.WeblogicBeanType;
import weblogic.console.backend.typedesc.WeblogicBeanTypes;
import weblogic.console.backend.utils.Path;

/** Utilities for converting between RDJ and Weblogic identities */
public class IdentityUtils {
  private static final Logger LOGGER = Logger.getLogger(IdentityUtils.class.getName());

  /**
   * Sort a list of RDJ references (by each reference's identity)
   * <p>
   * Optionally adds 'None' to the list of references.
   */
  public static JsonArray sortRDJReferences(JsonArray identities, boolean addNone) throws Exception {
    Map<String, JsonObject> sortedReferences = new TreeMap<>();
    for (int i = 0; i < identities.size(); i++) {
      JsonObject identity = identities.getJsonObject(i);
      sortedReferences.put(getIdentitySortingKey(identity), identity);
    }
    JsonArrayBuilder bldr = Json.createArrayBuilder();
    if (addNone) {
      bldr.add(JsonValue.NULL);
    }
    for (Map.Entry<String, JsonObject> entry : sortedReferences.entrySet()) {
      bldr.add(entry.getValue());
    }
    return bldr.build();
  }

  /** Converts a RDJ reference to a String that it can be sorted by. */
  public static String getIdentitySortingKey(JsonObject identity) {
    StringBuilder sb = new StringBuilder();
    JsonArray path = identity.getJsonArray("path");

    // add the root element's type to the sorting key
    JsonObject rootSegment = path.getJsonObject(0);
    sb.append(rootSegment.get("type"));

    // add the rest of the segments' property names and keys to the sorting key
    for (int i = 1; i < path.size(); i++) {
      JsonObject segment = path.getJsonObject(i);
      sb.append(segment.getString("property"));
      if (segment.containsKey("key")) {
        sb.append(segment.getString("key"));
      }
    }

    return sb.toString();
  }

  /**
   * Convert a list of weblogic identities into RDJ identities.
   *
   * Need to pass in the perspective since it's part of the RDJ identity
   * but not part of the weblogic identity.
   *
   * Need to pass in the Localizer so that the labels in the
   * RDJ identity can be localized.
   */
  public static JsonArray getRDJIdentitiesFromWeblogicIdentities(
    JsonArray weblogicItems,
    PerspectivePath perspectivePath,
    Localizer localizer
  ) throws Exception {
    JsonArrayBuilder bldr = Json.createArrayBuilder();
    for (int i = 0; i < weblogicItems.size(); i++) {
      bldr.add(
        weblogicIdentityToResponseIdentity(
          weblogicItems.getJsonObject(i).get("identity"),
          perspectivePath,
          localizer
        )
      );
    }
    return bldr.build();
  }

  /**
   * Convert a weblogic identity into an RDJ identity.
   *
   * Need to pass in the perspective since it's part of the RDJ identity
   * but not part of the weblogic identity.
   *
   * Need to pass in the Localizer so that the labels in the
   * RDJ identity can be localized.
   */
  public static JsonValue weblogicIdentityToResponseIdentity(
    JsonValue identity,
    PerspectivePath perspectivePath,
    Localizer localizer
  ) throws Exception {
    LOGGER.finest("weblogicIdentityToResponseIdentity " + identity);
    if (identity == JsonValue.NULL) {
      return JsonValue.NULL;
    }
    ResponseIdentityBuilder identityBldr =
      new ResponseIdentityBuilder(perspectivePath, localizer);
    WeblogicBeanType unfoldedBeanType = perspectivePath.getRootBeanType();
    WeblogicBeanType foldedBeanType = unfoldedBeanType;
    Path unfoldedPath = new Path();
    JsonArray weblogicIdentity = identity.asJsonArray();
    for (int i = 0; i < weblogicIdentity.size(); i++) {
      String propRestName = weblogicIdentity.getString(i);
      WeblogicBeanProperty prop = unfoldedBeanType.getPropertyFromRestName(propRestName);
      unfoldedBeanType = prop.getBeanType();
      boolean addPropertyToIdentity = false;
      boolean addInstanceNameToIdentity = false;
      if (prop.isContainedCollection()) {
        addPropertyToIdentity = true;
        // the next string in the identity is the identity of the instance in the collection
        // but check if this is an identity for the collection verus a member of the
        // collection, as there will not be an identity available for the last segment.
        i++;
        if (i < weblogicIdentity.size()) {
          addInstanceNameToIdentity = true;
        } else {
          // This identity is for a collection
          // There's no instance name for the last component.
          addInstanceNameToIdentity = false;
        }
      } else if (prop.isFoldableContainedSingleton()) {
        addPropertyToIdentity = false;
        addInstanceNameToIdentity = false;
      } else if (prop.isContainedOptionalSingleton()) {
        addPropertyToIdentity = true;
        addInstanceNameToIdentity = false;
      } else {
        throw new Exception(unfoldedBeanType.getName() + " " + prop + " is not a contained singleton.");
      }
      if (addPropertyToIdentity) {
        // Get the corresponding property from the top level folded type
        // so that we use its name for this property
        WeblogicBeanProperty foldedProp =
          foldedBeanType.getPropertyFromRestName(unfoldedPath, propRestName);
        // Start a new folded type
        foldedBeanType = unfoldedBeanType;
        unfoldedPath = new Path();
        if (addInstanceNameToIdentity) {
          identityBldr.addProperty(foldedProp, weblogicIdentity.getString(i));
        } else {
          identityBldr.addProperty(foldedProp);
        }
      } else {
        // add it to the unfolded path
        unfoldedPath.addComponent(prop.getBeanName());
      }
    }
    return identityBldr.build();
  }

  /**
   * Converts an RDJ property value (in expanded value format) that contains a list
   * of RDJ identities into a Weblogic property value (in expanded value format) that
   * contains a list of weblogic identities.
   */
  public static JsonObject rdjIdentitiesToWeblogicIdentities(
    WeblogicBeanTypes types,
    JsonObject rdjValue
  ) throws Exception {
    LOGGER.finest("rdjIdentitiesToWeblogicIdentities " + rdjValue);
    JsonArrayBuilder bldr = Json.createArrayBuilder();
    ExpandedValue rdjIdentities = ExpandedValue.wrap(rdjValue);
    if (rdjIdentities.getValue() != null) {
      JsonArray arr = rdjIdentities.getValue().asJsonArray();
      for (int i = 0; i < arr.size(); i++) {
        JsonObjectBuilder identityBldr = Json.createObjectBuilder();
        identityBldr.add("identity", convertRdjIdentityToWeblogicIdentity(types, arr.get(i)));
        bldr.add(identityBldr);
      }
    }
    return ExpandedValue.fromValue(bldr.build()).copySet(rdjIdentities).getJson().asJsonObject();
  }

  /**
   * Converts an RDJ property value (in expanded value format) that contains a single
   * RDJ identity into a Weblogic property value (in expanded value format) that
   * contains a corresponding weblogic identity.
   */
  public static JsonValue rdjIdentityToWeblogicIdentity(
    WeblogicBeanTypes types,
    JsonObject rdjValue
  ) throws Exception {
    LOGGER.finest("rdjIdentityToWeblogicIdentity " + rdjValue);
    ExpandedValue rdjIdentity = ExpandedValue.wrap(rdjValue);
    return
      ExpandedValue
        .fromValue(convertRdjIdentityToWeblogicIdentity(types, rdjIdentity.getValue()))
        .copySet(rdjIdentity)
        .getJson();
  }

  /**
   * Converts an RDJ property value (not in expanded value format) that contains a single
   * RDJ identity into a Weblogic property value (not in expanded value format) that
   * contains a corresponding weblogic identity.
   */
  private static JsonValue convertRdjIdentityToWeblogicIdentity(
    WeblogicBeanTypes types,
    JsonValue rdjValue
  ) throws Exception {
    if (rdjValue == JsonValue.NULL) {
      return JsonValue.NULL;
    }
    Path foldedBeanPathWithIdentities =
      rdjIdentityToFoldedBeanPathWithIdentities(rdjValue.asJsonObject());
    Path unfoldedBeanPathWithIdentities =
      types
        .getWeblogicConfigBeanIdentityFromFoldedBeanPathWithIdentities(
          foldedBeanPathWithIdentities
        )
        .getUnfoldedBeanPathWithIdentities();
    return pathToJsonArray(unfoldedBeanPathWithIdentities);
  }

  // TBD - should this method move to the Path class?
  private static JsonArray pathToJsonArray(Path path) {
    JsonArrayBuilder bldr = Json.createArrayBuilder();
    for (String component : path.getComponents()) {
      bldr.add(component);
    }
    return bldr.build();
  }

  private static Path rdjIdentityToFoldedBeanPathWithIdentities(JsonObject rdjIdentity) {
    JsonArray path = rdjIdentity.getJsonArray("path");
    Path fbp = new Path();
    // skip path[0] (the root element, e.g. Domain) since folded bean paths
    // are relative to the root bean of the tree.
    for (int i = 1; i < path.size(); i++) {
      JsonObject segment = path.getJsonObject(i);
      String property = segment.getString("property");
      fbp.addComponent(property);
      String key = segment.getString("key");
      if (key != null) {
        fbp.addComponent(key);
      }
    }
    return fbp;
  }
}
