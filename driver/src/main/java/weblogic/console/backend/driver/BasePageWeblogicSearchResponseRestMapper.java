// Copyright (c) 2020, 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.driver;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import java.util.logging.Logger;
import javax.json.Json;
import javax.json.JsonArray;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;
import javax.json.JsonValue;

import weblogic.console.backend.pagedesc.WeblogicActionSource;
import weblogic.console.backend.pagedesc.WeblogicPageSource;
import weblogic.console.backend.typedesc.ConsoleWeblogicBeanUsedIf;
import weblogic.console.backend.typedesc.WeblogicBeanIdentity;
import weblogic.console.backend.typedesc.WeblogicBeanProperty;
import weblogic.console.backend.utils.Path;
import weblogic.console.backend.utils.PluginInvocationUtils;

/**
 * Shared code for transforming a WebLogic REST search query response into an
 * RDJ json response given the page's path and REST mapping.
 */
public abstract class BasePageWeblogicSearchResponseRestMapper extends BaseWeblogicSearchResponseRestMapper {

  private static final Logger LOGGER =
    Logger.getLogger(BasePageWeblogicSearchResponseRestMapper.class.getName());

  private PageRestMapping pageRestMapping;

  protected PageRestMapping getPageRestMapping() {
    return this.pageRestMapping;
  }

  private WeblogicPageSource getPageSource() {
    return getPageRestMapping().getPageSource();
  }

  protected BasePageWeblogicSearchResponseRestMapper(
    PageRestMapping pageRestMapping,
    InvocationContext invocationContext,
    JsonObject weblogicSearchResponse
  ) throws Exception {
    super(
      invocationContext,
      weblogicSearchResponse
    );
    this.pageRestMapping = pageRestMapping;
  }

  /**
   * Get the sub type discriminator's WLS REST value as a string value from the WLS REST response.
   * <p>
   * This is abstract since configuration beans use expanded values and runtime mbeans
   * use string alues.
   */
  protected abstract String getSubTypeDiscriminator(
    SegmentWeblogicData instanceWeblogicData
  ) throws Exception;

  /**
   * Get the sub type discriminator for the bean instance.
   * <p>
   * This is used for processing heterogeneous types where you need to figure
   * get the instance's type so that you can figure out which pages are appropriate
   * for the type.
   */
  protected String getSubTypeDiscriminator() throws Exception {
    SegmentWeblogicData lastSegmentWeblogicData =
      findSegmentWeblogicData(getPageRestMapping().getPagePathSegment());
    return getSubTypeDiscriminator(lastSegmentWeblogicData);
  }

  /**
   * The RDJ just contains the values for the page, not the structure of the page.
   * <p>
   * This method adds a partial PDJ url to the RDJ.
   * Clients can use it to fetch the PDJ.
   */
  protected void addPageDefinitionToResponse() throws Exception {
    getResponseBuilder().add("pageDefinition", getPageSource().getPagePath().getURI());
  }

  /** Adds the table or form to the RDJ - i.e. the bean(s)' data/properties. */
  protected void addDataToResponse() throws Exception {
    SegmentWeblogicData lastSegmentWeblogicData =
      findSegmentWeblogicData(getPageRestMapping().getPagePathSegment());
    addLinksContentsToResponse(lastSegmentWeblogicData.identity);
    if (getPageSource().isTable()) {
      getResponseBuilder().add("data", createTableRDJData(lastSegmentWeblogicData));
    } else if (getPageSource().isSliceForm()) {
      JsonObject data = createSliceFromRDJData(lastSegmentWeblogicData);
      if (data != null) {
        getResponseBuilder().add("data", data);
        addNavigationContentsToResponse(data);
      }
    }
  }

  private void addLinksContentsToResponse(WeblogicBeanIdentity identity) throws Exception {
    new ResponseLinksContentsBuilder(
      getResponseBuilder(),
      getPageSource(),
      identity,
      getLocalizer()
    ).addContentsToResponse();
  }

  /**
   * Gets the rows for the beans in a table page.
   * <p>
   * If the underlying collection isn't ordered, then the rows are sorted.
   */
  private JsonArrayBuilder createTableRDJData(
    SegmentWeblogicData collectionWeblogicData
  ) throws Exception {
    List<WeblogicActionSource> actions =
      getPageSource().asTable().getTableSource().getActions();
    JsonArray weblogicItems = findItems(collectionWeblogicData.getWeblogicData());
    WeblogicBeanProperty collectionProp =
        collectionWeblogicData.getSegmentMapping().getBeanProperty();
    String keyProp = collectionProp.getBeanType().getKeyProperty().getRestName();
    boolean sortItems = !collectionProp.isOrdered();
    Map<String, JsonObject> sortedRDJItems = (sortItems) ? new TreeMap<>() : null;
    JsonArrayBuilder bldr = Json.createArrayBuilder();
    for (int i = 0; i < weblogicItems.size(); i++) {
      JsonObject weblogicItem = weblogicItems.getJsonObject(i);
      JsonObject rdjItem =
        createInstanceRDJData(
          childSegmentWeblogicData(
            collectionWeblogicData,
            collectionWeblogicData.getSegmentMapping(),
            getKey(weblogicItem, keyProp),
            weblogicItem
          )
        ).build();
      rdjItem = addActions(rdjItem, actions);
      if (sortItems) {
        JsonObject identity = rdjItem.getJsonObject("identity");
        sortedRDJItems.put(getIdentitySortingKey(identity), rdjItem);
      } else {
        bldr.add(rdjItem);
      }
    }
    if (sortItems) {
      for (Map.Entry<String, JsonObject> entry : sortedRDJItems.entrySet()) {
        bldr.add(entry.getValue());
      }
    }
    return bldr;
  }

  // Adds applicable actions to a bean's RDJ representation
  // If there are no actions for the bean, then nothing is added
  // (v.s. an empty actions object)
  private JsonObject addActions(JsonObject rdjItem, List<WeblogicActionSource> actionSources) throws Exception {
    JsonArrayBuilder actions = null;
    for (WeblogicActionSource actionSource : actionSources) {
      JsonObjectBuilder action = createAction(rdjItem, actionSource);
      if (action != null) {
        if (actions == null) {
          actions = Json.createArrayBuilder();
        }
        actions.add(action);
      }
    }
    if (actions == null) {
      // no actions
      return rdjItem;
    } else {
      // one or more actions - add them
      return Json.createObjectBuilder(rdjItem).add("actions", actions).build();
    }
  }

  // Creates the RDJ for an action group or stand alone action
  private JsonObjectBuilder createAction(JsonObject rdjItem, WeblogicActionSource actionSource) throws Exception {
    JsonObjectBuilder action = Json.createObjectBuilder();
    action.add("name", actionSource.getName());
    if (actionSource.getActions().isEmpty()) {
      // stand alone action
      if (!actionUsed(rdjItem, actionSource.getUsedIf())) {
        // This stand alone action doesn't apply to this table row
        return null;
      }
      action.add("resourceData", actionUri(rdjItem, actionSource));
    } else {
      // action group
      JsonArrayBuilder subActions = null;
      for (WeblogicActionSource subActionSource : actionSource.getActions()) {
        if (actionUsed(rdjItem, subActionSource.getUsedIf())) {
          if (subActions == null) {
            subActions = Json.createArrayBuilder();
          }
          JsonObjectBuilder subAction = Json.createObjectBuilder();
          subAction.add("name", subActionSource.getName());
          subAction.add("resourceData", actionUri(rdjItem, subActionSource));
          subActions.add(subAction);
        }
      }
      if (subActions == null) {
        // None of this action group's nested actions apply to this table row
        return null;
      }
      action.add("actions", subActions);
    }
    return action;
  }

  // Gets the uri of an action on a bean if the action
  // applies to that bean, based on the action's usedIf,
  // e.g. monitoring/data/Domain/ServerStatuses/myserver/start
  // Returns null if the action doesn't apply.
  String actionUri(JsonObject rdjItem, WeblogicActionSource actionSource) throws Exception {
    return getResourceDataUri(rdjItem) + "?action=" + actionSource.getName();
  }

  // Gets the resource data uri of a bean
  private String getResourceDataUri(JsonObject rdjItem) throws Exception {
    Path path = new Path();
    path.addComponent(getPerspectivePath().getPerspective());
    path.addComponent("data");
    JsonObject identity = rdjItem.getJsonObject("identity");
    JsonArray segments = identity.getJsonArray("path");
    for (int i = 0; i < segments.size(); i++) {
      JsonObject segment = segments.getJsonObject(i);
      if (segment.containsKey("property")) {
        // not root-segments have a property
        path.addComponent(segment.getString("property"));
        if (segment.containsKey("key")) {
          // collection child segments have a key too
          path.addComponent(segment.getString("key"));
        }
      } else {
        // root segment only has a type
        path.addComponent(segment.getString("type"));
      }
    }
    return path.getRelativeUri();
  }

  // Determines if a bean supports an action, based on the action's usedIfs
  private boolean actionUsed(JsonObject rdjItem, ConsoleWeblogicBeanUsedIf usedIf) throws Exception {
    if (usedIf == null) {
      return true;
    }
    String property = usedIf.getProperty();
    JsonValue have = rdjItem.get(property);
    for (Object want : usedIf.getValues()) {
      if (valueMatches(have, want)) {
        return true;
      }
    }
    return false;
  }

  // Determines if a bean's property's json value matches a usedIf's java value
  private boolean valueMatches(JsonValue have, Object want) {
    if (want == null) {
      return have == JsonValue.NULL;
    }
    if (have == null) {
      return false;
    }
    String haveStr = have.toString();
    String wantStr = want.toString();
    if (want instanceof String) {
      wantStr = "\"" + wantStr + "\""; // JSON quotes strings, but not bools and numbers
    }
    return wantStr.equals(haveStr);
  }

  /**
   * Get the navigation contents for this form page.
   * <p>
   * It adds nodes that correspond to this page's type's navigation.yaml.
   * <p>
   * Each node includes static info (type, label, description) and dynamic info
   * (identity of the bean or collection).
   */
  private void addNavigationContentsToResponse(JsonObject rdjData) throws Exception {
    if (getRootBeanType().getName().equals(getPageSource().getType().getName())) {
      // This is the root type. Don't add its nav tree contents here
      // since they're returned from the top level api/<perspective>/data
      // RDJ instead.
      return;
    }
    new ResponseNavigationContentsBuilder(
      getResponseBuilder(),
      getPageSource(),
      rdjData.getJsonObject("identity"),
      getLocalizer()
    ).addNavigationContentsToResponse();
  }

  /** Gets the fields for a bean on a form page. */
  private JsonObject createSliceFromRDJData(
    SegmentWeblogicData instanceWeblogicData
  ) throws Exception {
    JsonObject data = createInstanceRDJData(instanceWeblogicData).build();
    if (data.isEmpty()) {
      if (instanceWeblogicData.getIdentity().isOptionalUnfoldedSingleton()) {
        // the instance doesn't exist
        // just return null so we don't add a "data" property to response body
        return null;
      }
    }
    return data;
  }

  /**
   * Convert the properties for a bean, and its folded child beans,
   * from WLS REST terms to RDJ terms.
   */
  private JsonObjectBuilder createInstanceRDJData(
    SegmentWeblogicData instanceWeblogicData
  ) throws Exception {
    JsonObjectBuilder instanceBldr = Json.createObjectBuilder();
    addPropertiesToInstanceRDJData(
      instanceBldr,
      instanceWeblogicData,
      getSubTypeDiscriminator(instanceWeblogicData)
    );
    return instanceBldr;
  }

  /**
   * Convert the properties for an unfolded bean from WLS REST terms to RDJ terms
   * and add them to the list of properties for its folded bean.
   */
  private void addPropertiesToInstanceRDJData(
    JsonObjectBuilder instanceBldr,
    SegmentWeblogicData instanceWeblogicData,
    String subTypeDiscriminator
  ) throws Exception {
    List<PropertyRestMapping> propertyMappings = null;
    PathSegmentRestMapping segmentMapping = instanceWeblogicData.getSegmentMapping();
    if (subTypeDiscriminator != null) {
      propertyMappings = segmentMapping.getSubTypeProperties(subTypeDiscriminator);
    }
    if (propertyMappings == null) {
      propertyMappings = segmentMapping.getProperties();
    }
    for (PropertyRestMapping propMapping : propertyMappings) {
      addPropertyToInstanceRDJData(instanceBldr, instanceWeblogicData, propMapping);
    }
    for (PathSegmentRestMapping childSegmentMapping : segmentMapping.getChildren()) {
      addChildPropertiesToInstanceRDJData(
        instanceBldr,
        instanceWeblogicData,
        childSegmentMapping,
        subTypeDiscriminator
      );
    }
  }

  /**
   * Get the raw WLS REST value for the sub type discriminator from the WLS REST response.
   * <p>
   * If this is a configuration bean, then it will be an expanded value.
   * If this is a runtime bean, then it will be a string value.
   */
  protected JsonValue getSubTypeDiscriminatorValue(
    SegmentWeblogicData instanceWeblogicData
  ) throws Exception {
    PropertyRestMapping discriminatorMapping =
      this.pageRestMapping.getSubTypeDiscriminatorProperty();
    if (discriminatorMapping == null) {
      return null; // root or homogeneous
    }
    LOGGER.finest("getSubTypeDiscriminator wl=" + instanceWeblogicData);
    SegmentWeblogicData discriminatorSegmentWeblogicData =
      getSubTypeSegmentWeblogicData(
        instanceWeblogicData,
        discriminatorMapping.getParent()
      );
    JsonValue weblogicDiscriminator =
      getPropertyValue(
        discriminatorMapping,
        discriminatorSegmentWeblogicData
      );
    if (weblogicDiscriminator == null) {
      return null;
    }
    return
      weblogicPropertyValueToResponsePropertyValue(
        instanceWeblogicData,
        discriminatorMapping,
        weblogicDiscriminator
      );
  }

  /**
   * Get the JSON object of the bean that has the sub type discriminator
   * from the overall WLS REST response.
   */
  private SegmentWeblogicData getSubTypeSegmentWeblogicData(
    SegmentWeblogicData instanceWeblogicData,
    PathSegmentRestMapping discriminatorSegmentMapping
  ) throws Exception {
    LOGGER.finest("getSubTypeSegmentWeblogicData wl=" + instanceWeblogicData);
    LOGGER.finest("getSubTypeSegmentWeblogicData dseg=" + discriminatorSegmentMapping);
    // segmentMapping and instanceWeblogicData are for the folded bean
    // discriminatorSegmentMapping is for the unfolded bean inside the folded bean that holds the
    // sub type discriminator
    // a segment's pathSegments are the segments from the root (e.g. domain) to the segment.
    // since instanceWeblogicData has already walked from the domain to the folded bean,
    // we need to walk from there to the sub type's unfolded bean.
    // so, walk from discriminatorSegmentMapping.getPathSegments()[
    // segmentMapping.getPathSegments().size() ->
    // discriminatorSegmentMapping.getPathSegments().size() ]
    int segmentSize = instanceWeblogicData.getSegmentMapping().getPathSegments().size();
    SegmentWeblogicData discriminatorSegmentWeblogicData = instanceWeblogicData;
    List<PathSegmentRestMapping> discriminatorSegmentMappings =
      discriminatorSegmentMapping.getPathSegments();
    for (int i = segmentSize; i < discriminatorSegmentMappings.size(); i++) {
      discriminatorSegmentWeblogicData =
        findSegmentWeblogicData(
          discriminatorSegmentWeblogicData,
          discriminatorSegmentMappings.get(i)
        );
    }
    return discriminatorSegmentWeblogicData;
  }

  /**
   * Get the properties for an unfolded bean in the WLS REST response,
   * convert them to RDJ property values, then add them to the list of
   * folded bean properties that the unfolded bean belongs to.
   */
  private void addChildPropertiesToInstanceRDJData(
    JsonObjectBuilder instanceBldr,
    SegmentWeblogicData parentInstanceWeblogicData,
    PathSegmentRestMapping childSegmentMapping,
    String subTypeDiscriminator
  ) throws Exception {
    SegmentWeblogicData childInstanceWeblogicData =
      findSegmentWeblogicData(
        parentInstanceWeblogicData,
        childSegmentMapping
      );
    addPropertiesToInstanceRDJData(
      instanceBldr,
      childInstanceWeblogicData,
      subTypeDiscriminator
    );
  }

  /**
   * Get a property of an unfolded bean in the WLS REST response,
   * convert it to an RDJ property value, then add it to the list of
   * folded bean properties that the unfolded bean belongs to.
   */
  private void addPropertyToInstanceRDJData(
    JsonObjectBuilder instanceBldr,
    SegmentWeblogicData instanceWeblogicData,
    PropertyRestMapping propertyMapping
  ) throws Exception {
    JsonValue value = getPropertyValue(propertyMapping, instanceWeblogicData);
    if (value == null) {
      return;
    }
    instanceBldr.add(
      propertyMapping.getBeanProperty().getName(),
      weblogicPropertyValueToResponsePropertyValue(
        instanceWeblogicData,
        propertyMapping,
        value
      )
    );
  }

  /**
   * Get a bean's property's WLS REST value.
   * <p>
   * It either gets it from the WLS REST response or calls a plugin to compute the value.
   */
  private JsonValue getPropertyValue(
    PropertyRestMapping propertyMapping,
    SegmentWeblogicData instanceWeblogicData
  ) throws Exception {
    if (!includeProperty(propertyMapping)) {
      return null;
    }
    PluginRestMapping getMethod = propertyMapping.getGetMethod();
    if (getMethod != null) {
      return usePluginToComputePropertyValue(instanceWeblogicData, getMethod);
    } else {
      return
        instanceWeblogicData
          .getWeblogicData()
          .get(propertyMapping.getBeanProperty().getRestName());
    }
  }

  // Determines whether the property should be included.
  private boolean includeProperty(PropertyRestMapping propertyMapping) {
    WeblogicBeanProperty beanProp = propertyMapping.getBeanProperty();
    if ("identity".equals(beanProp.getName())) {
      // always return the identity
      return true;
    }
    PropertyRestMapping discriminatorMapping =
      getPageRestMapping().getSubTypeDiscriminatorProperty();
    if (discriminatorMapping != null && discriminatorMapping.getBeanProperty() == beanProp) {
      // This is the subtype discriminator.  Get it anyway since the CBE needs it later.
      return true;
    }
    // See if the client excluded the property
    return getInvocationContext().includeProperty(beanProp.getName());
  }

  /** Calls a plugin method to get a property's WLS REST value. */
  private JsonValue usePluginToComputePropertyValue(
    SegmentWeblogicData instanceWeblogicData,
    PluginRestMapping getMethod
  ) throws Exception {
    LOGGER.finer("usePluginToComputePropertyValue " + getMethod + " " + instanceWeblogicData);
    JsonValue value =
      (JsonValue)PluginInvocationUtils.invokeMethod(
        getMethod.getMethod(),
        getPluginArguments(instanceWeblogicData, getMethod)
      );
    LOGGER.finer("getMethod returned " + value);
    return value;
  }

  /**
   * Get the arg list that needs to be passed into a plugin method.
   * i.e. the data that the plugin said it needs to be able to do its job.
   */
  protected List<Object> getPluginArguments(
    SegmentWeblogicData instanceWeblogicData,
    PluginRestMapping getMethod
  ) throws Exception {
    List<Object> rtn = new ArrayList<>();
    for (PluginParameterRestMapping parameter : getMethod.getParameters()) {
      rtn.add(getPluginArgument(instanceWeblogicData, parameter));
    }
    return rtn;
  }

  /**
   * Get an argument that needs to be passed into a plugin method.
   * i.e. the data that the plugin said it needs to be able to do its job.
   */
  private Object getPluginArgument(
    SegmentWeblogicData instanceWeblogicData,
    PluginParameterRestMapping parameterMapping
  ) throws Exception {
    if (parameterMapping.isBuiltinParameter()) {
      return
        getBuiltinPluginArgument(
          instanceWeblogicData,
          parameterMapping.asBuiltinParameter()
        );
    } else if (parameterMapping.isCollectionParameter()) {
      return
        getCollectionPluginArgument(
          instanceWeblogicData,
          parameterMapping.asCollectionParameter()
        );
    } else if (parameterMapping.isBeanParameter()) {
      return
        getBeanPluginArgument(
          instanceWeblogicData,
          parameterMapping.asBeanParameter()
        );
    } else if (parameterMapping.isPropertyParameter()) {
      return
        getPropertyPluginArgument(
          instanceWeblogicData,
          parameterMapping.asPropertyParameter()
        );
    } else {
      throw new AssertionError("Unknown parameter type: " + parameterMapping);
    }
  }

  /**
   * Returns a plugin argument whose value comes from an object in the mapper,
   * e.g. the WeblogicBeanIdentity
   * (v.s. an argument that comes from the WLS REST response).
   * <p>
   * This method is protected so that derived classes can support extra builtin args,
   * e.g. a plugin for a configuration page may need to access the WeblogicConfiguration.
   */
  protected Object getBuiltinPluginArgument(
    SegmentWeblogicData instanceWeblogicData,
    BuiltinPluginParameterRestMapping parameterMapping
  ) throws Exception {
    Class<?> javaClass = parameterMapping.getJavaClass();
    if (javaClass.equals(InvocationContext.class)) {
      return getInvocationContext();
    } else {
      throw new AssertionError("Unknown builtin parameter java class: " + parameterMapping);
    }
  }

  /** Returns a plugin argument that comes from a collection of beans in the WLS REST response. */
  private Object getCollectionPluginArgument(
    SegmentWeblogicData instanceWeblogicData,
    CollectionPluginParameterRestMapping parameterMapping
  ) throws Exception {
    // Get the collection's parent bean's data from the overall search results
    PathSegmentRestMapping collectionParentSegment = parameterMapping.getParent().getParent();
    JsonObject collectionParentWeblogicData =
      findSegmentWeblogicData(
        collectionParentSegment,
        instanceWeblogicData.getIdentity().getFoldedBeanPathWithIdentities()
      ).getWeblogicData();
    // Get the collection's search result from its parent's search results
    JsonObject collectionWeblogicData =
      collectionParentWeblogicData.getJsonObject(
        parameterMapping.getParent().getBeanProperty().getRestName()
      );
    return collectionWeblogicData;
  }

  /** Returns a plugin argument that comes from a bean in the WLS REST response. */
  private Object getBeanPluginArgument(
    SegmentWeblogicData instanceWeblogicData,
    BeanPluginParameterRestMapping parameterMapping
  ) throws Exception {
    return
      findSegmentWeblogicData(
        parameterMapping.getParent(),
        instanceWeblogicData.getIdentity().getFoldedBeanPathWithIdentities()
      ).getWeblogicData();
  }

  /** Returns a plugin argument that comes from a property of a bean in the WLS REST response. */
  private Object getPropertyPluginArgument(
    SegmentWeblogicData instanceWeblogicData,
    PropertyPluginParameterRestMapping parameterMapping
  ) throws Exception {
    // passes in null if we can't find the property.
    return
      findSegmentWeblogicData(
        parameterMapping.getPluginBeanProperty().getParent(),
        instanceWeblogicData.getIdentity().getFoldedBeanPathWithIdentities()
      )
        .getWeblogicData()
        .get(
          parameterMapping.getPluginBeanProperty().getBeanProperty().getRestName()
        );
  }

  /**
   * Convert a property value from the WLS REST response (or from a plugin)
   * to a property value in the RDJ.
   */
  private JsonValue weblogicPropertyValueToResponsePropertyValue(
    SegmentWeblogicData instanceWeblogicData,
    PropertyRestMapping propertyMapping,
    JsonValue weblogicValue
  ) throws Exception {
    LOGGER.finest(
      "weblogicPropertyValueToResponsePropertyValue "
      + instanceWeblogicData
      + " "
      + propertyMapping
      + " "
      + weblogicValue
    );
    WeblogicBeanProperty beanProp = propertyMapping.getBeanProperty();
    if (beanProp.isContainmentRelationship()) {
      throw new Exception("Unexpected containment property " + beanProp);
    }
    if ("identity".equals(beanProp.getRestName())) {
      return weblogicIdentityToResponseIdentity(weblogicValue);
    }
    if (beanProp.isReferenceAsReferences()) {
      return
        weblogicReferenceToResponseReference(
          getWeblogicReferenceFromWeblogicReferences(weblogicValue, propertyMapping),
          instanceWeblogicData,
          propertyMapping
        );
    }
    // Uncomment when we add support for string properties that hold mbean references
    /*
    if (beanProp.isReferenceAsBeanKeyString()) {
      return
        weblogicReferenceToResponseReference(
          getWeblogicReferenceFromBeanKeyString(
            weblogicValue,
            instanceWeblogicData,
            propertyMapping
          ),
          instanceWeblogicData,
          propertyMapping
      );
    }
    */
    if (beanProp.isReference()) {
      return
        weblogicReferenceToResponseReference(
          weblogicValue,
          instanceWeblogicData,
          propertyMapping
        );
    }
    if (beanProp.isReferences()) {
      return
        weblogicReferencesToResponseReferences(
          weblogicValue,
          instanceWeblogicData,
          propertyMapping
        );
    }
    if (beanProp.isDate()) {
      return beanProp.isDateAsLong() ? formatDateAsLong(weblogicValue) : formatDate(weblogicValue);
    }
    if (WeblogicBeanProperty.PROPERTY_TYPE_HEALTH_STATE.equals(beanProp.getPropertyType())) {
      if (weblogicValue != JsonValue.NULL) {
        return weblogicValue.asJsonObject().get("state");
      }
    }
    return weblogicValue;
  }

  /**
   * Convert a list of weblogic references in the WLS REST response (or from a plugin)
   * into a list of references in the RDJ.
   * <p>
   * This method is abstract since configuration pages require expanded values and
   * runtime pages equire inline values.
   */
  protected abstract JsonValue weblogicReferencesToResponseReferences(
    JsonValue weblogicReferences,
    SegmentWeblogicData instanceWeblogicData,
    PropertyRestMapping propertyMapping
  ) throws Exception;

  /**
   * Convert a weblogic reference in the WLS REST response (or from a plugin) into
   * a reference in the RDJ.
   * <p>
   * This method is abstract since configuration pages require expanded values
   * and runtime pages require inline values.
   */
  protected abstract JsonValue weblogicReferenceToResponseReference(
    JsonValue weblogicReference,
    SegmentWeblogicData instanceWeblogicData,
    PropertyRestMapping propertyMapping
  ) throws Exception;

  /**
   * Convert list of weblogic references that can only have zero or one references
   * in it to a single reference in the RDJ.
   * <p>
   * This method is abstract since configuration pages require expanded values
   * and runtime pages require inline values.
   */
  protected abstract JsonValue getWeblogicReferenceFromWeblogicReferences(
    JsonValue weblogicValue,
    PropertyRestMapping propertyMapping
  ) throws Exception;

  // Uncomment when we add support for string properties that hold mbean references
  /*
  protected abstract JsonValue getWeblogicReferenceFromBeanKeyString(
    JsonValue weblogicValue,
    SegmentWeblogicData instanceWeblogicData,
    PropertyRestMapping propertyMapping
  ) throws Exception;
  */

  /**
   * Sort a list of RDJ references (by each reference's identity)
   * <p>
   * Optionally adds 'None' to the list of references.
   */
  protected JsonArray sortRDJReferences(JsonArray identities, boolean addNone) throws Exception {
    return IdentityUtils.sortRDJReferences(identities, addNone);
  }

  /** Converts a RDJ reference to a String that it can be sorted by. */
  public static String getIdentitySortingKey(JsonObject identity) {
    return IdentityUtils.getIdentitySortingKey(identity);
  }

  /**
   * Finds the json object in the overall WLS REST response that correspondings
   * to a segment in the REST mapping.
   * <p>
   * Protected since the configuration mapper needs it when dealing with options.
   */
  protected SegmentWeblogicData findSegmentWeblogicData(
    PathSegmentRestMapping segmentMapping
  ) throws Exception {
    return findSegmentWeblogicData(segmentMapping, getIdentity().getFoldedBeanPathWithIdentities());
  }

  /**
   * Finds the json object in the overall WLS REST response that correspondings
   * to a folded bean path with identities.
   */
  private SegmentWeblogicData findSegmentWeblogicData(
    PathSegmentRestMapping segmentMapping,
    Path foldedBeanPathWithIdentities
  ) throws Exception {
    SegmentWeblogicData rtn =
        new SegmentWeblogicData(
          segmentMapping.getRoot(),
          getTypes().newRootIdentity(getRootBeanType()),
          getWeblogicSearchResponse()
        );
    for (PathSegmentRestMapping segMapping : segmentMapping.getPathSegments()) {
      rtn = findSegmentWeblogicData(rtn, segMapping);
      if (
        !segMapping.isRoot()
          && segMapping.getBeanProperty().isContainedCollection()
          && segMapping.getIdentityIndex() < foldedBeanPathWithIdentities.length()
      ) {
        rtn = findCollectionChildWeblogicData(rtn, foldedBeanPathWithIdentities);
      }
    }
    return rtn;
  }

  /**
   * Finds the json object for a bean in the json object in the WLS REST response
   * that parents this bean.
   */
  private SegmentWeblogicData findSegmentWeblogicData(
    SegmentWeblogicData parentWeblogicData,
    PathSegmentRestMapping segmentMapping
  ) throws Exception {
    if (segmentMapping.isRoot()) {
      return parentWeblogicData; // parentWeblogicData already points to the root
    }
    return
      childSegmentWeblogicData(
        parentWeblogicData,
        segmentMapping,
        segmentMapping.getBeanProperty().getRestName(),
        findChildWeblogicData(parentWeblogicData, segmentMapping)
      );
  }

  /**
   * Finds the json object in the overall WLS REST response that correspondings to a bean that's a
   * child of a collection.
   */
  private SegmentWeblogicData findCollectionChildWeblogicData(
    SegmentWeblogicData collectionWeblogicData,
    Path foldedBeanPathWithIdentities
  ) throws Exception {
    PathSegmentRestMapping segmentMapping = collectionWeblogicData.getSegmentMapping();
    JsonArray items = findItems(collectionWeblogicData.getWeblogicData());
    String keyProp = segmentMapping.getBeanProperty().getBeanType().getKeyProperty().getRestName();
    String key =
      foldedBeanPathWithIdentities.getComponents().get(segmentMapping.getIdentityIndex());
    for (int i = 0; i < items.size(); i++) {
      JsonObject item = items.getJsonObject(i);
      if (item.containsKey(keyProp)) {
        if (key.equals(getKey(item, keyProp))) {
          return childSegmentWeblogicData(collectionWeblogicData, segmentMapping, key, item);
        }
      }
    }
    throw newNoDataFoundException();
  }

  /**
   * Find the weblogic data for a bean in its parent's weblogic data. If it doesn't exist,
   * and it's allowed to not exist, create an empty one to use instead.
   */
  private JsonObject findChildWeblogicData(
    SegmentWeblogicData parentWeblogicData,
    PathSegmentRestMapping segmentMapping
  ) throws Exception {
    WeblogicBeanProperty beanProp = segmentMapping.getBeanProperty();
    String key = beanProp.getRestName();
    JsonValue value = parentWeblogicData.getWeblogicData().get(key);
    if (value == JsonValue.NULL) {
      // optional singleton currently doesn't exist.  That's OK.
      return createEmptyWeblogicData(beanProp);
    }
    if (value != null) {
      return value.asJsonObject();
    }
    PathSegmentRestMapping parentSegmentMapping = parentWeblogicData.getSegmentMapping();
    if (parentSegmentMapping != null) {
      WeblogicBeanProperty parentBeanProp = parentSegmentMapping.getBeanProperty();
      if (parentBeanProp != null && parentBeanProp.isContainedOptionalSingleton()) {
        // This property is a child of an optional singleton that doesn't exist. That's OK.
        return createEmptyWeblogicData(beanProp);
      }
    }
    if (getInvocationContext().filtersProperties()) {
      // The client specified which properties to return.
      // Most likely, the client didn't include any properties
      // from this bean or any of its children.
      // That's ok.
      return createEmptyWeblogicData(beanProp);
    }
    // Some types are recursive, e.g.
    //   ConnectorServiceRuntime ->
    //     getActiveRAs(ConnectorComponentRuntimeMBean) ->
    //       getConnectorServiceRuntime
    //
    // The query generator for the mock runtime data detects this recursion and stops.
    // This means that the returned nested ConnectorServiceRuntime won't have an
    // ActiveRAs property since it wasn't in the query.
    //
    // The everypage nav tree walker walks to every bean it can find
    // (i.e. doesn't know that the query broke the recursion), so it tries
    // to get the nested ConnectorServiceRuntime's ActiveRAs collection.
    //
    // And that gets us here.  We'd never get in this state when running
    // against a live server since the CBE would make a query that's as
    // deep as the RDJ url.
    //
    // For expedience (and defensive programming), catch this case and turn
    // it into an appropriate json structure (instead of treating it as bogus
    // data coming back from WLS REST)
    String problem =
      "segment not found: key="
      + key
      + " parentWeblogicData="
      + parentWeblogicData
      + " segment="
      + segmentMapping;
    if (beanProp.isContainedCollection() || beanProp.isContainedOptionalSingleton()) {
      LOGGER.warning(problem);
      return createEmptyWeblogicData(beanProp);
    }
    throw new AssertionError(problem);
  }

  /**
   * A contained collection or singleton doesn't currently exist and
   * we've verified that it's OK.  Create an empty one to use instead.
   */
  private JsonObject createEmptyWeblogicData(WeblogicBeanProperty beanProp) throws Exception {
    if (beanProp.isContainedCollection()) {
      return Json.createObjectBuilder().add("items", Json.createArrayBuilder()).build();
    }
    if (beanProp.isContainedSingleton()) {
      return Json.createObjectBuilder().build();
    }
    throw
      new AssertionError(
        "beanProp is not a contained collection or contained singleton: "
        + beanProp
      );
  }

  /**
   * Creates a segment that for a child bean.
   * <p>
   * It ties together the unfolded bean path with identities, the bean's REST mapping
   * and the json object for the bean in the WLS REST response.
   */
  private SegmentWeblogicData childSegmentWeblogicData(
    SegmentWeblogicData parentWeblogicData,
    PathSegmentRestMapping childSegmentMapping,
    String childRestName,
    JsonObject childWeblogicData
  ) throws Exception {
    return new SegmentWeblogicData(
      childSegmentMapping,
      getTypes()
        .getWeblogicBeanIdentityFromUnfoldedBeanPathWithIdentities(
          getRootBeanType(),
          parentWeblogicData
            .getIdentity()
            .getUnfoldedBeanPathWithIdentities()
            .childPath(childRestName)
        ),
        childWeblogicData
      );
  }

  /** Create a NoDataFoundException */
  protected NoDataFoundException newNoDataFoundException() throws Exception {
    return new NoDataFoundException(getIdentity().getFoldedBeanPathWithIdentities().getRelativeUri() + " not found");
  }

  /**
   * Helper class that holds information about an unfolded bean in the WLS REST response
   * <ul>
   *   <li>its REST mapping</li>
   *   <li>its identity</li>
   *   <li>the json object for this bean in the overall WLS REST response</li>
   * </ul>
   */
  protected class SegmentWeblogicData {
    private PathSegmentRestMapping segmentMapping;

    protected PathSegmentRestMapping getSegmentMapping() {
      return this.segmentMapping;
    }

    private WeblogicBeanIdentity identity;

    protected WeblogicBeanIdentity getIdentity() {
      return this.identity;
    }

    private JsonObject weblogicData;

    protected JsonObject getWeblogicData() {
      return this.weblogicData;
    }

    protected SegmentWeblogicData(
      PathSegmentRestMapping segmentMapping,
      WeblogicBeanIdentity identity,
      JsonObject weblogicData
    ) {
      this.segmentMapping = segmentMapping;
      this.identity = identity;
      this.weblogicData = weblogicData;
    }

    @Override
    public String toString() {
      return
        "<segmentMapping="
        + segmentMapping
        + ">,identity=<"
        + identity
        + ">,weblogicData=<"
        + weblogicData
        + ">";
    }
  }

  /**
   * Get the string value of the key property for a bean from the WLS REST response's value
   * (or from the value returned from a plugin).
   * <p>
   * This method is abstract since configuration pages require expanded values and
   * runtime pages require inline values.
   */
  protected abstract String getKey(JsonObject weblogicBeanData, String keyProp);

  /**
   * The WLS REST mapping for a list of beans looks like:
   * <pre> { items: [ ... ] }</pre>
   * <p>
   * This method returns the array of items from this structure.
   * <p>
   * It is protected since the configuration mapper uses it for options.
   */
  protected JsonArray findItems(JsonValue collectionSegmentWeblogicData) {
    JsonArray items = collectionSegmentWeblogicData.asJsonObject().getJsonArray("items");
    if (items == null) {
      throw new AssertionError("items not found in collection " + collectionSegmentWeblogicData);
    }
    return items;
  }
}
