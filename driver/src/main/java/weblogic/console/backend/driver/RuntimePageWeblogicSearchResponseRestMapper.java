// Copyright (c) 2020, 2021, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.driver;

import java.util.logging.Logger;
import javax.json.JsonArray;
import javax.json.JsonObject;
import javax.json.JsonString;
import javax.json.JsonValue;

/**
 * Transforms a WebLogic REST domain runtime search query response into an RDJ json response.
 * <p>
 * For example, for the Server Runtime General page for Server1:
 * <p>
 * WLS search response
 * <pre>
 * {
 *   "serverRuntimes": {
 *     "items": [
 *       {
 *         "name": "Server1",
 *         "identity": [ "serverRuntimes", "Server1" ],
 *         "activationTime": 123456,
 *         "JVMRuntime": {
 *           "upTime": 654321
 *         }
 *       }
 *     ]
 *   }
 * }
 * </pre>
 * <p>
 * gets transformed to this RDJ response:
 * <pre>
 * {
 *   "data": {
 *     "Name": "Server1",
 *     "ActivationTime": 123456,
 *     "UpTime": 654321
 *   },
 *   "weblogicVersion": "...",
 *   "pageDefinition": "ServerRuntimeMBean?view=General"
 * }
 * </pre>
 */
public class RuntimePageWeblogicSearchResponseRestMapper extends BasePageWeblogicSearchResponseRestMapper {

  private static final Logger LOGGER =
    Logger.getLogger(RuntimePageWeblogicSearchResponseRestMapper.class.getName());

  private WeblogicRuntime weblogicRuntime;

  private WeblogicRuntime getWeblogicRuntime() {
    return this.weblogicRuntime;
  }

  /** Get the PDJ for a page */
  public static JsonObject createRDJ(
    WeblogicRuntime weblogicRuntime,
    PageRestMapping pageRestMapping,
    InvocationContext invocationContext,
    JsonObject weblogicSearchResponse
  ) throws Exception {
    LOGGER.finest("createRDJ weblogicRuntime=" + weblogicRuntime);
    LOGGER.finest("createRDJ pageRestMapping=" + pageRestMapping);
    LOGGER.finest("createRDJ invocationContext=" + invocationContext);
    LOGGER.finest("createRDJ searchResponse=" + weblogicSearchResponse);
    JsonObject rdj =
      new RuntimePageWeblogicSearchResponseRestMapper(
        weblogicRuntime,
        pageRestMapping,
        invocationContext,
        weblogicSearchResponse
      ).createRDJ();
    LOGGER.finest("createRDJ rdj=" + rdj);
    return rdj;
  }

  /** Get the PDJ for a page */
  private JsonObject createRDJ() throws Exception {
    addDataToResponse();
    addMessagesToResponse();
    addPageDefinitionToResponse();
    return getResponseBuilder().build();
  }

  /** Get the sub type discriminator for a bean instance */
  public static String getSubTypeDiscriminator(
    WeblogicRuntime weblogicRuntime,
    PageRestMapping pageRestMapping,
    InvocationContext invocationContext,
    JsonObject weblogicSearchResponse
  ) throws Exception {
    LOGGER.finest("getSubTypeDiscriminator weblogicRuntime=" + weblogicRuntime);
    LOGGER.finest("getSubTypeDiscriminator pageRestMapping=" + pageRestMapping);
    LOGGER.finest("getSubTypeDiscriminator invocationContext=" + invocationContext);
    LOGGER.finest("getSubTypeDiscriminator searchResponse=" + weblogicSearchResponse);
    String discriminator =
      new RuntimePageWeblogicSearchResponseRestMapper(
        weblogicRuntime,
        pageRestMapping,
        invocationContext,
        weblogicSearchResponse
      ).getSubTypeDiscriminator();
    LOGGER.finest("getSubTypeDiscriminator=" + discriminator);
    return discriminator;
  }

  /** Get the sub type discriminator for the bean instance */
  @Override
  protected String getSubTypeDiscriminator(
    SegmentWeblogicData instanceWeblogicData
  ) throws Exception {
    // sub type discriminators are always supposed to be Strings
    return getStringFromJsonValue(getSubTypeDiscriminatorValue(instanceWeblogicData));
  }

  private RuntimePageWeblogicSearchResponseRestMapper(
    WeblogicRuntime weblogicRuntime,
    PageRestMapping pageRestMapping,
    InvocationContext invocationContext,
    JsonObject weblogicSearchResponse
  ) throws Exception {
    super(pageRestMapping, invocationContext, weblogicSearchResponse);
    this.weblogicRuntime = weblogicRuntime;
  }

  /**
   * Returns a plugin argument whose value comes from an object in the mapper,
   * e.g. the WeblogicBeanIdentity or WeblogicRuntime.
   */
  @Override
  protected Object getBuiltinPluginArgument(
    SegmentWeblogicData instanceWeblogicData,
    BuiltinPluginParameterRestMapping parameterMapping
  ) throws Exception {
    Class<?> javaClass = parameterMapping.getJavaClass();
    if (javaClass.equals(WeblogicRuntime.class)) {
      return getWeblogicRuntime();
    } else {
      return super.getBuiltinPluginArgument(instanceWeblogicData, parameterMapping);
    }
  }

  /**
   * Convert a list of weblogic references in the WLS REST response (or from a plugin)
   * into a list of references in the RDJ.
   */
  @Override
  protected JsonValue weblogicReferencesToResponseReferences(
    JsonValue weblogicReferences,
    SegmentWeblogicData instanceWeblogicData,
    PropertyRestMapping propertyMapping
  ) throws Exception {
    JsonArray rdjReferences =
      getRDJIdentitiesFromWeblogicIdentities(weblogicReferences.asJsonArray());
    if (!propertyMapping.getBeanProperty().isOrdered()) {
      // sort the references since they're not ordered
      rdjReferences = sortRDJReferences(rdjReferences, false); // don't add 'None'
    } else {
      // don't sort them since they're ordered
    }
    return rdjReferences;
  }

  /**
   * Convert a weblogic reference in the WLS REST response (or from a plugin) into
   * a reference in the RDJ.
   */
  @Override
  protected JsonValue weblogicReferenceToResponseReference(
    JsonValue weblogicReference,
    SegmentWeblogicData instanceWeblogicData,
    PropertyRestMapping propertyMapping
  ) throws Exception {
    return weblogicIdentityToResponseIdentity(weblogicReference);
  }

  /**
   * Convert list of weblogic references that can only have zero or one references in it
   * into a single reference in the RDJ.
   */
  @Override
  protected JsonValue getWeblogicReferenceFromWeblogicReferences(
    JsonValue weblogicValue,
    PropertyRestMapping propertyMapping
  ) throws Exception {
    return
      getWeblogicIdentityFromWeblogicIdentities(
        weblogicValue.asJsonArray(),
        propertyMapping.getBeanProperty()
      );
  }

  /**
   * Get the string value of the key property for a bean from the WLS REST response's value
   * (or from the value returned from a plugin).
   */
  @Override
  protected String getKey(JsonObject weblogicBeanData, String keyProp) {
    return getStringFromJsonValue(weblogicBeanData.get(keyProp));
  }

  /** Converts an optional JsonValue for a string to a String. */
  private String getStringFromJsonValue(JsonValue value) {
    if (value == null || value == JsonValue.NULL) {
      return null;
    }
    return ((JsonString) value).getString();
  }
}
