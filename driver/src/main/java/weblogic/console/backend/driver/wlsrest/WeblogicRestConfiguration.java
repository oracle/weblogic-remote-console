// Copyright (c) 2020, 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.driver.wlsrest;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;
import javax.json.Json;
import javax.json.JsonArray;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;
import javax.json.JsonValue;
import javax.ws.rs.core.Response;

import org.glassfish.jersey.media.multipart.FormDataMultiPart;
import org.glassfish.jersey.media.sse.EventSource;
import org.glassfish.jersey.media.sse.InboundEvent;
import weblogic.console.backend.driver.AbstractWeblogicConfiguration;
import weblogic.console.backend.driver.BadRequestException;
import weblogic.console.backend.driver.ExpandedValue;
import weblogic.console.backend.driver.InvocationContext;
import weblogic.console.backend.driver.NoDataFoundException;
import weblogic.console.backend.integration.WebLogicRestClient;
import weblogic.console.backend.integration.WebLogicRestRequest;
import weblogic.console.backend.typedesc.WeblogicBeanProperty;
import weblogic.console.backend.typedesc.WeblogicBeanType;
import weblogic.console.backend.typedesc.WeblogicBeanTypes;
import weblogic.console.backend.utils.Path;

/**
 * WLS REST based Implementation of the WeblogicConfigurationSPI interface.
 * <p>
 * It calls the WLS REST api (and a corresponding console REST extension) to get the job done.
 * <p>
 * It isolates the console back end from interacting with the mbeans directly so that we can swap
 * in different implementations (e.g. online WLS REST, offline WDT, testing mock mbeans).
 * <p>
 * Note!!!
 * <p>
 * There are two bugs in WLS that this class has to work around since the new console needs to
 * work with old unpatched WLS domains.
 * <p>
 * First, the WLDF descriptor beans don't extend SettableBean (they should - it looks like it was
 * an oversite). This means that they can't tell you whether a value is set or not, and don't let
 * you unset a value.
 * <p>
 * Second, the WLS REST api assumes that all configuration mbeans extend SettableBean (instead of
 * checking) and always tries to call is/unSet when the expandedValues query param is true. This
 * causes the entire request to fail.
 * <p>
 * So, if any of the mbeans in the WLS REST request don't support isSettable, then we can't set
 * expandedValues to true on the WLS REST request - instead, we have to use inline values.
 * <p>
 * This class uses walks the search query or the bean path, lining it up with the corresponding
 * WeblogicBeanTypes/Properties, to see whether anything in the request doesn't support expanded
 * values.
 * <p>
 * If everything supports expanded values, then it does a normal WLS REST request, passing in
 * expandedValues = true, and returns the result as-is
 * e.g. <pre>listenPort: { value: 7003, set: true }</pre>
 * <p>
 * However, if anything doesn't support expanded values, then it doesn't pass expandedValues =
 * true to the WLS REST request, so it gets back inline values instead of expanded ones. Then it
 * walks through the response, and wraps the inline values so that they look like expanded values,
 * just without a 'set' property.
 * e.g. it converts <pre>listenPort: 7003</pre> to <pre>listenPort: { value : 7003 }</pre>
 */
public class WeblogicRestConfiguration extends AbstractWeblogicConfiguration {

  private static final Logger LOGGER = Logger.getLogger(WeblogicRestConfiguration.class.getName());

  private EventSource weblogicConfigEventSource = null;

  public WeblogicRestConfiguration(WeblogicBeanTypes weblogicBeanTypes) {
    super(weblogicBeanTypes);
  }

  @Override
  public JsonObject getBeanTreeSlice(InvocationContext invocationContext, JsonObject query) throws Exception {
    LOGGER.fine("getBeanTreeSlice query=" + query);
    boolean expandedValues = allPropertiesSettable(query);
    JsonObject response =
      invokeWeblogicRestPost(
        invocationContext,
        new Path("search"),
        query,
        expandedValues,
        false, // save changes
        false // asynchronous
      );
    if (isOK(response)) {
      if (response.containsKey("messages")) {
        throw asUnexpectedResponse(response);
      }
      return expandReturnedValues(response.getJsonObject("body"), expandedValues);
    }
    throw asUnexpectedResponse(response);
  }

  @Override
  public JsonObject getBeanProperties(
    InvocationContext invocationContext,
    Path beanOrCollection,
    String... properties
  ) throws NoDataFoundException, Exception {
    LOGGER.fine(
      "getBeanProperties beanOrCollection="
      + beanOrCollection
      + " properties="
      + Arrays.toString(properties)
    );
    boolean expandedValues = allPropertiesSettable(beanOrCollection);
    JsonObject response =
      invokeWeblogicRestGet(invocationContext, beanOrCollection, expandedValues, properties);
    if (isOK(response)) {
      if (response.containsKey("messages")) {
        throw asUnexpectedResponse(response);
      }
      return expandReturnedValues(response.getJsonObject("body"), expandedValues);
    }
    throwIfNotFound(response);
    throw asUnexpectedResponse(response);
  }

  @Override
  public JsonArray createBean(
    InvocationContext invocationContext,
    Path containingProperty,
    JsonObject properties,
    boolean asynchronous
  ) throws NoDataFoundException, BadRequestException, Exception {
    LOGGER.fine(
      "createBean containingProperty=" + containingProperty + " properties=" + properties);
    checkThatOptionalSingletonDoesntExist(invocationContext, containingProperty);
    // The WLS REST create api's request body contains the properties needed
    // to call the bean's create method, and extra properties that are set
    // on the mbean after it's created.
    //
    // When using ?expandedValues=true, the create api requires that the properties
    // for the create method be inlined, and all the other properties be expanded.
    // For example, to create a server:
    //   { name: "MyServer", listenPort: { value: 7003 }}
    //
    // Otherwise, it expects all the properties to be inlined, e.g:
    //   { name: "MyServer", listenPort: 7003 }
    //
    // Currently the CBE doesn't know which properties are passed to the create
    // method and which ones are set later.
    //
    // Also, there's not much point is using expanded values during create.
    // i.e. why would you want to unset a property on a newly created bean?
    // This only makes sense for a bean that already exists.
    //
    // So, convert the expanded values from the CBE to inlined values
    // and use ?expandedValues=false.  This way, we can treat all the
    // properties the same way.
    JsonObject response =
      invokeWeblogicRestPost(
        invocationContext,
        containingProperty,
        inlineExpandedValues(properties),
        false, // expanded values
        false, // save changes
        asynchronous
      );
    if (isCreated(response) || (asynchronous && isAccepted(response))) {
      return workAroundWLSRestCreateIssues(invocationContext, containingProperty, properties, response);
    }
    throwIfNotFound(response);
    throwIfBadRequest(response);
    throw asUnexpectedResponse(response);
  }

  @Override
  public JsonArray createBean(
    InvocationContext invocationContext,
    Path containingProperty,
    FormDataMultiPart parts,
    boolean asynchronous
  ) throws NoDataFoundException, BadRequestException, Exception {
    // TBD - log more info about each part?
    LOGGER.fine(
      "createBean containingProperty=" + containingProperty + " parts=" + parts.getFields().keySet()
    );
    checkThatOptionalSingletonDoesntExist(invocationContext, containingProperty);
    JsonObject response =
      invokeWeblogicRestPost(
        invocationContext,
        containingProperty,
        parts,
        false, // expanded values
        false, // save changes
        asynchronous
      );
    if (isCreated(response) || (asynchronous && isAccepted(response))) {
      return response.getJsonArray("messages");
    }
    throwIfNotFound(response);
    throwIfBadRequest(response);
    throw asUnexpectedResponse(response);
  }

  private void checkThatOptionalSingletonDoesntExist(
    InvocationContext invocationContext,
    Path containingProperty
  ) throws NoDataFoundException, Exception {
    if (getIdentity(containingProperty).isOptionalSingleton()) {
      // In the WLS REST api, POSTing to a non-existent optional singleton
      // creates it, and POSTing to an existing optional singleton updates it.
      // The createBean method is required to throw BadRequest
      // if the optional singleton exists.
      // This means that we have to do the check
      // v.s. relying on the WLS REST POST doing it for us.
      try {
        getBeanProperties(invocationContext, containingProperty, "identity");
        // this is bad - the optional singleton exists
        throw
          new BadRequestException(
            "Cannot create the optional singleton "
            + containingProperty
            + " because it already exists"
          );
      } catch (NoDataFoundException e) {
        // this is good - the optional singleton doesn't exist
        // therefore we're allowed to create it
      }
    }
  }

  @Override
  public JsonArray setBeanProperties(
    InvocationContext invocationContext,
    Path bean,
    JsonObject properties
  ) throws NoDataFoundException, BadRequestException, Exception {
    LOGGER.fine("setBeanProperties bean=" + bean + " properties=" + properties);
    if (getIdentity(bean).isOptionalSingleton()) {
      // In the WLS REST api, POSTing to a non-existent optional singleton
      // creates it, and POSTing to an existing optional singleton updates it.
      // The setBeanBean method is required to throw NoDataFoundException
      // if the optional singleton doesn't exist.
      // This means that we have to do the check
      // v.s. relying on the WLS REST POST doing it for us.
      getBeanProperties(invocationContext, bean, "identity");
    }
    boolean expandedValues = allPropertiesSettable(bean);
    if (!expandedValues) {
      properties = inlineExpandedValues(properties);
    }
    JsonObject response =
      invokeWeblogicRestPost(
        invocationContext,
        bean,
        properties,
        expandedValues,
        false, // save changes
        false // synchronous
      );
    if (isOK(response)) {
      return response.getJsonArray("messages");
    }
    throwIfNotFound(response);
    throwIfBadRequest(response);
    throw asUnexpectedResponse(response);
  }

  @Override
  public void deleteBean(
    InvocationContext invocationContext,
    Path bean,
    boolean asynchronous
  ) throws NoDataFoundException, BadRequestException, Exception {
    LOGGER.fine("deleteBean bean=" + bean);
    JsonObject response =
      invokeWeblogicRestDelete(
        invocationContext,
        bean,
        false, // save changes
        asynchronous
      );
    if (isOK(response) || (asynchronous && isAccepted(response))) {
      throwAsUnexpectedResponseIfHaveMessages(response);
      return;
    }
    throwIfNotFound(response);
    throwIfBadRequest(response);
    throw asUnexpectedResponse(response);
  }

  @Override
  public void startEdit(InvocationContext invocationContext) throws Exception {
    invokeChangeManagerActionNoBadRequest(invocationContext, "startEdit");
  }

  @Override
  public void saveChanges(InvocationContext invocationContext) throws BadRequestException, Exception {
    // The WLS REST api doesn't include a saveChanges operation.
    // However, if you POST to a bean, without making any changes to it,
    // then the WLS REST api saves the changes.
    LOGGER.fine("saveChanges");
    JsonObject response =
      invokeWeblogicRestPost(
        invocationContext,
        new Path(), // domain mbean path
        Json.createObjectBuilder().build(), // no properties
        false, // expanded values
        true, // save changes
        false // synchronous
      );
    if (isOK(response)) {
      return;
    }
    throwIfBadRequest(response);
    throw asUnexpectedResponse(response);
  }

  @Override
  public void activate(InvocationContext invocationContext) throws BadRequestException, Exception {
    invokeChangeManagerActionExpectBadRequest(invocationContext, "activate");
  }

  @Override
  public void cancelEdit(InvocationContext invocationContext) throws Exception {
    invokeChangeManagerActionNoBadRequest(invocationContext, "cancelEdit");
  }

  @Override
  public void safeResolve(InvocationContext invocationContext) throws BadRequestException, Exception {
    invokeChangeManagerActionExpectBadRequest(invocationContext, "safeResolve");
  }

  @Override
  public void forceResolve(InvocationContext invocationContext) throws BadRequestException, Exception {
    invokeChangeManagerActionExpectBadRequest(invocationContext, "forceResolve");
  }

  private void invokeChangeManagerActionNoBadRequest(
    InvocationContext invocationContext,
    String action
  ) throws Exception {
    JsonObject response = invokeChangeManagerAction(invocationContext, action);
    if (isOK(response)) {
      throwAsUnexpectedResponseIfHaveMessages(response);
      return;
    }
    throw asUnexpectedResponse(response);
  }

  private void invokeChangeManagerActionExpectBadRequest(
    InvocationContext invocationContext,
    String action
  ) throws BadRequestException, Exception {
    JsonObject response = invokeChangeManagerAction(invocationContext, action);
    if (isOK(response)) {
      throwAsUnexpectedResponseIfHaveMessages(response);
      return;
    }
    throwIfBadRequest(response);
    throw asUnexpectedResponse(response);
  }

  private JsonObject invokeChangeManagerAction(
    InvocationContext invocationContext,
    String action
  ) throws Exception {
    LOGGER.fine(action);
    return
     invokeWeblogicRestPost(
        invocationContext,
        changeManagerChildPath(action),
        Json.createObjectBuilder().build(),
        true, // expanded values
        false, // save changes
        false // synchronous
      );
  }

  private JsonObject invokeWeblogicRestGet(
    InvocationContext invocationContext,
    Path path,
    boolean expandedValues,
    String... properties
  ) throws Exception {
    String fields = getFields(properties);
    WebLogicRestRequest.Builder bldr =
      WebLogicRestRequest.builder()
        .connection(invocationContext.getConnection())
        .path(getEditTreePath(path))
        .expandedValues(expandedValues);
    if (fields != null) {
      bldr = bldr.queryParam("fields", fields);
    }
    return createWeblogicRestResponse(WebLogicRestClient.get(bldr.build()));
  }

  private JsonObject invokeWeblogicRestPost(
    InvocationContext invocationContext,
    Path path,
    JsonObject weblogicRestRequestBody,
    boolean expandedValues,
    boolean saveChanges,
    boolean asynchronous
  ) throws Exception {
    if (weblogicRestRequestBody == null) {
      throw new Exception("Weblogic REST request body is null");
    }
    return
      createWeblogicRestResponse(
        WebLogicRestClient.post(
          WebLogicRestRequest.builder()
            .connection(invocationContext.getConnection())
            .path(getEditTreePath(path))
            .saveChanges(saveChanges)
            .expandedValues(expandedValues)
            .asynchronous(asynchronous)
            .build(),
          weblogicRestRequestBody
       )
      );
  }

  private JsonObject invokeWeblogicRestPost(
    InvocationContext invocationContext,
    Path path,
    FormDataMultiPart parts,
    boolean expandedValues,
    boolean saveChanges,
    boolean asynchronous
  ) throws Exception {
    if (parts == null) {
      throw new Exception("parts is null");
    }
    return
      createWeblogicRestResponse(
        WebLogicRestClient.post(
          WebLogicRestRequest.builder()
            .connection(invocationContext.getConnection())
            .path(getEditTreePath(path))
            .saveChanges(saveChanges)
            .expandedValues(expandedValues)
            .asynchronous(asynchronous)
            .build(),
          parts
       )
      );
  }

  private JsonObject invokeWeblogicRestDelete(
    InvocationContext invocationContext,
    Path path,
    boolean saveChanges,
    boolean asynchronous
  ) throws Exception {
    return
      createWeblogicRestResponse(
        WebLogicRestClient.delete(
          WebLogicRestRequest.builder()
            .connection(invocationContext.getConnection())
            .path(getEditTreePath(path))
            .saveChanges(saveChanges)
            .asynchronous(asynchronous)
            .build()
        )
      );
  }

  private String getFields(String... properties) {
    if (properties == null || properties.length < 1) {
      return null;
    }
    return String.join(",", properties);
  }

  private JsonObject createWeblogicRestResponse(Response response) {
    JsonObjectBuilder respBldr = Json.createObjectBuilder();
    addStatusCode(respBldr, response);
    JsonObject weblogicResponse = getWeblogicResponse(response);
    addMessages(respBldr, weblogicResponse);
    addBody(respBldr, weblogicResponse);
    JsonObject weblogicRestResponse = respBldr.build();
    // FortifyIssueSuppression Log Forging
    // This response is from WebLogic and is, therefore, safe from forging
    LOGGER.fine("weblogicRestResponse " + weblogicRestResponse);
    return weblogicRestResponse;
  }

  private JsonObject getWeblogicResponse(Response response) {
    try {
      return response.readEntity(JsonObject.class);
    } catch (IllegalStateException ise) {
      // response is the org.glassfish.jersey.message.internal.OutboundJaxrsResponse,
      // that was returned from the INSTANCE.get() call. Use response.getEntity()
      // to retrieve the "messages" Json object from the response, and assign it to
      // weblogicResponse.
      return (JsonObject) response.getEntity();
    }
  }

  private void addStatusCode(JsonObjectBuilder respBldr, Response response) {
    int statusCode = response.getStatus();
    respBldr.add("statusCode", statusCode);
  }

  private void addMessages(JsonObjectBuilder respBldr, JsonObject weblogicResponse) {
    JsonArray messages = weblogicResponse.getJsonArray("messages");
    if (messages != null) {
      respBldr.add("messages", messages);
    }
  }

  private void addBody(JsonObjectBuilder respBldr, JsonObject weblogicResponse) {
    JsonObjectBuilder bodyBldr = Json.createObjectBuilder();
    for (Map.Entry<String, JsonValue> entry : weblogicResponse.entrySet()) {
      String key = entry.getKey();
      if (!"messages".equals(key)) {
        bodyBldr.add(key, entry.getValue());
      }
    }
    respBldr.add("body", bodyBldr);
  }

  private void throwAsUnexpectedResponseIfHaveMessages(JsonObject response) throws Exception {
    JsonArray messages = response.getJsonArray("messages");
    if (messages != null && !messages.isEmpty()) {
      throw asUnexpectedResponse(response);
    }
  }

  private void throwIfNotFound(JsonObject response) throws NoDataFoundException {
    if (isNotFound(response)) {
      throw new NoDataFoundException(getMessages(response));
    }
  }

  private void throwIfBadRequest(JsonObject response) throws BadRequestException {
    if (isBadRequest(response)) {
      throw new BadRequestException(getMessages(response));
    }
  }

  private Exception asUnexpectedResponse(JsonObject response) {
    return new Exception(response.toString());
  }

  private JsonArray getMessages(JsonObject response) {
    return response.getJsonArray("messages");
  }

  private Path changeManagerChildPath(String child) {
    return (new Path()).childPath("changeManager").childPath(child);
  }

  private List<String> getEditTreePath(Path path) throws Exception {
    return (new Path("edit")).childPath(path).getComponents();
  }

  private boolean isOK(JsonObject response) {
    return isStatus(response, Response.Status.OK.getStatusCode());
  }

  private boolean isAccepted(JsonObject response) {
    return isStatus(response, Response.Status.ACCEPTED.getStatusCode());
  }

  private boolean isCreated(JsonObject response) {
    return isStatus(response, Response.Status.CREATED.getStatusCode());
  }

  private boolean isNotFound(JsonObject response) {
    return isStatus(response, Response.Status.NOT_FOUND.getStatusCode());
  }

  private boolean isBadRequest(JsonObject response) {
    return isStatus(response, Response.Status.BAD_REQUEST.getStatusCode());
  }

  private boolean isStatus(JsonObject response, int status) {
    return status == response.getInt("statusCode");
  }

  private void broadcastWeblogicConfigEvent(InboundEvent inboundEvent) {
    String name = inboundEvent.getName();
    String data = inboundEvent.readData();
    // FortifyIssueSuppression Log Forging
    // This response is from WebLogic and is, therefore, safe from forging
    LOGGER.info("broadcaseWeblogicConfigEvent name=" + name + " data=" + data);
    if ("weblogic-configuration-changed".equals(name)) {
      broadcastConfigChanged(data);
    } else if ("weblogic-configuration-changes-cancelled".equals(name)) {
      broadcastChangesCancelled(data);
    } else {
      // FortifyIssueSuppression Log Forging
      // This response is from WebLogic and is, therefore, safe from forging
      LOGGER.severe("Unexpected weblogic configuration event. name=" + name + ", data=" + data);
    }
  }

  @Override
  protected void listenersModified(boolean haveListener) throws Exception {
    synchronized (this.weblogicConfigEventSource) {
      if (haveListener && this.weblogicConfigEventSource == null) {
        this.weblogicConfigEventSource = createWeblogicConfigEventSource();
      } else if (!haveListener && this.weblogicConfigEventSource != null) {
        destroyWeblogicConfigEventSource();
        this.weblogicConfigEventSource = null;
      }
    }
  }

  private EventSource createWeblogicConfigEventSource() throws Exception {
    WebLogicRestRequest request =
      WebLogicRestRequest
        .builder()
        .path(getEditTreePath(
          changeManagerChildPath("configurationChanged")
        )
      ).build();
    EventSource eventSource =
      WebLogicRestClient.getEventSource(request, "weblogic_configuration_changed_listener");
    eventSource.register(
      inboundEvent -> {
        broadcastWeblogicConfigEvent(inboundEvent);
      }
    );
    eventSource.open();
    return eventSource;
  }

  private void destroyWeblogicConfigEventSource() {
    this.weblogicConfigEventSource.close();
  }

  private JsonObject expandReturnedValues(JsonObject returnedValues, boolean expandedValues) {
    if (expandedValues) {
      // the values are already expanded
      return returnedValues;
    } else {
      return expandInlineValues(returnedValues);
    }
  }

  private JsonObject expandInlineValues(JsonObject inlineValues) {
    // TBD: ideally, we'd walk the corresponding WeblogicBeanTypes/Properties
    // to distinguish between contained beans, referenced beans, etc
    //
    // the only patterns we should see are:
    //
    // foo: scalar == scalar ->  foo: { value: <scalar> }
    // foo: { items: [ {...}, ] } == contained collection -> foo: { items: { expandInlineValues(...)
    // } ] }
    // foo: {...(not items)} == contained singleton -> foo: { expandedInlineValues(...) }
    // foo: [...] = reference, references, array of scalars -> foo: { value:[...] }
    // identity: [...] = this bean's identity - don't wrap it! -> identity: [ ... ]
    // changeManager: {...} = WLS REST change manager - don't wrap it! -> changeManager: {...}
    JsonObjectBuilder bldr = Json.createObjectBuilder();
    for (Map.Entry<String, JsonValue> e : inlineValues.entrySet()) {
      String property = e.getKey();
      JsonValue inlineValue = e.getValue();
      JsonValue expandedValue = null;
      if ("identity".equals(property) || "changeManager".equals(property)) {
        // The identity and changeManager properties are always sent inline
        expandedValue = inlineValue;
      } else if (inlineValue.getValueType().equals(JsonValue.ValueType.OBJECT)) {
        JsonObject inlineObject = inlineValue.asJsonObject();
        JsonArray inlineItems = inlineObject.getJsonArray("items");
        if (inlineItems != null) {
          // contained collection of beans.  need to expand each bean.
          JsonArrayBuilder expandedItems = Json.createArrayBuilder();
          for (int i = 0; i < inlineItems.size(); i++) {
            JsonObject inlineItem = inlineItems.getJsonObject(i);
            JsonObject expandedItem = expandInlineValues(inlineItem);
            expandedItems.add(expandedItem);
          }
          expandedValue = Json.createObjectBuilder().add("items", expandedItems).build();
        } else {
          // contained bean. need to expand it.
          expandedValue = expandInlineValues(inlineObject);
        }
      } else {
        // this should be a null, a scalar or an array.
        // regardless it's a property value so we need to wrap it.
        expandedValue = Json.createObjectBuilder().add("value", inlineValue).build();
      }
      bldr.add(property, expandedValue);
    }
    return bldr.build();
  }

  private JsonObject inlineExpandedValues(JsonObject expandedValues) throws Exception {
    JsonObjectBuilder bldr = Json.createObjectBuilder();
    for (Map.Entry<String, JsonValue> e : expandedValues.entrySet()) {
      String property = e.getKey();
      JsonValue value = e.getValue();
      JsonValue inlineValue = null;
      if ("identity".equals(property)) {
        // The identity property is always sent inline
        inlineValue = value;
      } else {
        ExpandedValue expandedValue = ExpandedValue.wrap(value);
        if (expandedValue.hasSet() && !expandedValue.isSet()) {
          throw
            new BadRequestException(
              "Trying to unset a property: property="
              + property
              + ", value="
              + value
            );
        }
        if (!expandedValue.hasValue()) {
          throw
            new BadRequestException(
              "Property value missing: property="
              + property
              + ", value="
              + value
            );
        }
        inlineValue = expandedValue.getValue();
      }
      bldr.add(property, inlineValue);
    }
    return bldr.build();
  }

  private boolean allPropertiesSettable(Path unfoldedBeanPathWithIdentities) throws Exception {
    WeblogicBeanType type = getWeblogicBeanTypes().getDomainMBeanType();
    boolean inCollection = false;
    for (String component : unfoldedBeanPathWithIdentities.getComponents()) {
      if (inCollection) {
        // this component is an identity. skip it.
        inCollection = false;
      } else {
        WeblogicBeanProperty prop =
          type.getLocalPropertyByPropertyRestName("allTypesSettable", component);
        type = prop.getBeanType();
        if (!type.isSettable()) {
          return false;
        }
        if (prop.isContainedCollection()) {
          inCollection = true;
        }
      }
    }
    return true;
  }

  private boolean allPropertiesSettable(JsonObject query) throws Exception {
    return allPropertiesSettable(getWeblogicBeanTypes().getDomainMBeanType(), query);
  }

  private boolean allPropertiesSettable(WeblogicBeanType type, JsonObject relativeQuery)
      throws Exception {
    if (!type.isSettable()) {
      return false;
    }
    JsonObject children = relativeQuery.getJsonObject("children");
    if (children != null) {
      for (Map.Entry<String, JsonValue> entry : children.entrySet()) {
        String propName = entry.getKey();
        if ("changeManager".equals(propName) || "consoleChangeManager".equals(propName)) {
          // there's no corresponding bean - don't worry about settable
        } else {
          WeblogicBeanProperty prop =
            type.getLocalPropertyByPropertyRestName("allTypesSettable", propName);
          if (!allPropertiesSettable(prop.getBeanType(), entry.getValue().asJsonObject())) {
            return false;
          }
        }
      }
    }
    return true;
  }

  /**
   * For the most part, this class just delegates create requests to the WLS REST api as is.
   * <p>
   * However there are some deficiencies in the WLS REST api that are not present in other ways
   * of managing the weblogic config (e.g. offline WDT).
   * <p>
   * In particular, when a JDBCSystemResource is created, the WLS REST api requires that the
   * caller manually set the new JDBCSystemResource's JDBCResource's name too. (while offline WDT
   * does not).
   * <p>
   * If we fixed this by writing a custom java plugin for the mbean type, the plugin would need
   * to be aware of which WeblogicConfigurationSPI implementation was being used. That's not good!
   * <p>
   * Instead, we'll work around these issues inside this class. This method is the home for these
   * work arounds.
   * <p>
   * It's called after the class successfully creates a new bean. It is passed the info that was
   * passed to the create call, along with the response from the successful WLS REST create call.
   * <p>
   * It gets its job done by calling public methods of this class. If one of those methods throws
   * an exception, this method lets it flow back.
   * <p>
   * If everything succeeds, it combines any messages from the create response with any messages
   * from the extra calls and returns them.
   */
  private JsonArray workAroundWLSRestCreateIssues(
    InvocationContext invocationContext,
    Path containingProperty,
    JsonObject createProperties,
    JsonObject createResponse
  ) throws NoDataFoundException, BadRequestException, Exception {
    JsonArray createMessages = createResponse.getJsonArray("messages");
    if (!containingProperty.getDotSeparatedPath().equals("JDBCSystemResources")) {
      // no work around needed
      return createMessages;
    }
    // When a JDBCSystemResource is created, its JDBCResource's name needs to be
    // set to its name too.
    ExpandedValue nameEV = ExpandedValue.wrap(createProperties.get("name"));
    String name = nameEV.getStringValue();
    Path bean = containingProperty.childPath(name).childPath("JDBCResource");
    JsonObject beanProperties = Json.createObjectBuilder().add("name", nameEV.getJson()).build();
    JsonArray beanMessages = setBeanProperties(invocationContext, bean, beanProperties);
    return combineMessages(createMessages, beanMessages);
  }

  // Combine two arrays of messages into one array that has both sets of messages
  private JsonArray combineMessages(JsonArray messages1, JsonArray messages2) {
    if (messages1 == null && messages2 == null) {
      return null;
    } else if (messages1 != null && messages2 != null) {
      return messages1;
    } else if (messages1 == null && messages2 != null) {
      return messages2;
    } else {
      JsonArrayBuilder bldr = Json.createArrayBuilder(messages1);
      for (int i = 0; i < messages2.size(); i++) {
        bldr.add(messages2.get(i));
      }
      return bldr.build();
    }
  }
}
