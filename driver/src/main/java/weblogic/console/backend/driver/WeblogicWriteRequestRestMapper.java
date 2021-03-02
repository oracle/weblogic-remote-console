// Copyright (c) 2020, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.driver;

import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;
import javax.json.Json;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;
import javax.json.JsonValue;

import weblogic.console.backend.typedesc.WeblogicBeanProperty;
import weblogic.console.backend.typedesc.WeblogicBeanTypes;
import weblogic.console.backend.utils.Path;

/**
 * Converts a RDS write request into an ordered list of corresponding
 * Weblogic REST write requests.
 * <p>
 * For example, for Server General for Server1:
 * <p>
 * Converts following the RDS request body:
 * <pre>
 * {
 *   "ListenPort": 7003,
 *   "SSLListenPort": 7004,
 *     "Machine": [
 *      {
 *        type: "Machine",
 *        property: "Machines",
 *        key: "Machine1",
 *        typeLabel: "Machine",
 *        propertyLabel: "Machines"
 *      }
 *    ]
 * }
 * </pre>
 * <p>
 * into the following WLS write requests:
 * <p>
 * request1:
 * <pre>
 *   weblogicBeanPath: []
 *   weblogicWriteRequestBody { "listenPort": 7003, "machine": [ "machines", "Machine2"] }
 * </pre>
 * <p>
 * request2:
 * <pre>
 *   weblogicBeanPath: [ "SSL" ]
 *   weblogicWriteRequestBody { "listenPort": 7004, }
 * </pre>
 */
public class WeblogicWriteRequestRestMapper {

  // if true, always return a request body for the top level bean since some
  // optional singletons have no-arg creators
  public static List<WeblogicWriteRequest> createWeblogicWriteRequests(
    boolean isCreate,
    PageRestMapping pageRestMapping,
    JsonObject rdjWriteRequestBody
  ) throws Exception {
    LOGGER.finest("createWeblogicWriteRequests isCreate=" + isCreate);
    LOGGER.finest("createWeblogicWriteRequests pageRestMapping=" + pageRestMapping);
    LOGGER.finest("createWeblogicWriteRequests rdjWriteRequestBody=" + rdjWriteRequestBody);
    List<WeblogicWriteRequest> writeRequests =
      (new WeblogicWriteRequestRestMapper(isCreate, pageRestMapping, rdjWriteRequestBody))
        .createWeblogicWriteRequests();
    LOGGER.finest("createWeblogicWriteRequests writeRequests=" + writeRequests);
    return writeRequests;
  }

  private static final Logger LOGGER =
      Logger.getLogger(WeblogicWriteRequestRestMapper.class.getName());

  private boolean isCreate;
  private PageRestMapping pageRestMapping;
  private JsonObject rdjWriteRequestBody;
  private List<WeblogicWriteRequest> weblogicWriteRequests = new ArrayList<>();

  private WeblogicWriteRequestRestMapper(
    boolean isCreate,
    PageRestMapping pageRestMapping,
    JsonObject rdjWriteRequestBody
  ) throws Exception {
    this.isCreate = isCreate;
    this.pageRestMapping = pageRestMapping;
    this.rdjWriteRequestBody = rdjWriteRequestBody;
  }

  private List<WeblogicWriteRequest> createWeblogicWriteRequests() throws Exception {
    createWeblogicWriteRequest(
      this.isCreate,
      new Path(),
      this.pageRestMapping.getPagePathSegment()
    );
    return this.weblogicWriteRequests;
  }

  private void createWeblogicWriteRequest(
    boolean isCreate,
    Path path,
    PathSegmentRestMapping segmentMapping
  ) throws Exception {
    JsonObject writeRequestBody = getWriteRequestBody(isCreate, segmentMapping);
    if (writeRequestBody != null) {
      this.weblogicWriteRequests.add(
        new WeblogicWriteRequest(segmentMapping, path, writeRequestBody)
      );
    }
    for (PathSegmentRestMapping childMapping : segmentMapping.getChildren()) {
      createWeblogicWriteRequest(
        false /* automatically created */,
        path.childPath(childMapping.getBeanProperty().getRestName()),
        childMapping
      );
    }
  }

  private JsonObject getWriteRequestBody(
    boolean isCreate,
    PathSegmentRestMapping segmentMapping
  ) throws Exception {
    // always create a request body for the top level bean since some mbeans support no-arg creators
    JsonObjectBuilder bldr = isCreate ? Json.createObjectBuilder() : null;
    for (PropertyRestMapping propMapping : segmentMapping.getProperties()) {
      // TBD - what about keyProp & identity?
      String rdjPropName = propMapping.getBeanProperty().getName();
      if (this.rdjWriteRequestBody.containsKey(rdjPropName)) {
        if (bldr == null) {
          bldr = Json.createObjectBuilder();
        }
        bldr.add(
          propMapping.getBeanProperty().getRestName(),
          rdjValueToWeblogicValue(
            propMapping,
            this.rdjWriteRequestBody.getJsonObject(rdjPropName)
          )
        );
      }
    }
    return (bldr != null) ? bldr.build() : null;
  }

  private JsonValue rdjValueToWeblogicValue(
    PropertyRestMapping propMapping,
    JsonObject rdjValue
  ) throws Exception {
    WeblogicBeanProperty beanProp = propMapping.getBeanProperty();
    if (beanProp.isReferenceAsReferences()) {
      return
        weblogicReferenceToWeblogicReferences(
          IdentityUtils.rdjIdentityToWeblogicIdentity(getTypes(), rdjValue)
        );
    }
    // Uncomment when we add support for string properties that hold mbean references
    /*
    if (beanProp.isReferenceAsBeanKeyString()) {
      return
        weblogicReferenceToBeanKeyString(
          IdentityUtils.rdjIdentityToWeblogicIdentity(getTypes(), rdjValue)
        );
    }
    */
    if (beanProp.isReference()) {
      return IdentityUtils.rdjIdentityToWeblogicIdentity(getTypes(), rdjValue);
    }
    if (beanProp.isReferences()) {
      return IdentityUtils.rdjIdentitiesToWeblogicIdentities(getTypes(), rdjValue);
    }
    return rdjValue;
  }

  private JsonValue weblogicReferenceToWeblogicReferences(JsonValue weblogicReference) {
    JsonValue weblogicIdentity = ExpandedValue.getReferenceValue(weblogicReference);
    JsonArrayBuilder weblogicReferences = Json.createArrayBuilder();
    if (weblogicIdentity != null) {
      weblogicReferences.add(Json.createObjectBuilder().add("identity", weblogicIdentity));
    } else {
      // return an empty array
    }
    return
      ExpandedValue
        .fromValue(weblogicReferences.build())
        .copySet(ExpandedValue.wrap(weblogicReference))
        .getJson();
  }

  // Uncomment when we add support for string properties that hold mbean references
  /*
    private JsonValue weblogicReferenceToBeanKeyString(JsonValue weblogicReference) {
      JsonValue weblogicIdentity = ExpandedValue.getReferenceValue(weblogicReference);
      JsonValue beanKey = null;
      if (weblogicIdentity == JsonValue.NULL) {
        beanKey = JsonValue.NULL;
      } else {
        JsonArray components = weblogicIdentity.asJsonArray();
        // The last element in the identity should be the bean's key property (typically its name):
        beanKey = components.get(components.size()-1);
      }
      return
        ExpandedValue
          .fromValue(beanKey)
          .copySet(ExpandedValue.wrap(weblogicReference))
          .getJson();
    }
  */

  private WeblogicBeanTypes getTypes() {
    return this.pageRestMapping.getPageSource().getType().getTypes();
  }
}
