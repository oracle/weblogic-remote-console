// Copyright (c) 2020, 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package com.oracle.weblogic.console.backend.services.configuration;

import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;
import javax.json.Json;
import javax.json.JsonArray;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;
import javax.json.JsonValue;
import javax.ws.rs.core.Response;

import com.oracle.weblogic.console.backend.services.BaseTreeManager;
import weblogic.console.backend.JavaxJsonUtils;
import weblogic.console.backend.Message;
import weblogic.console.backend.driver.BadRequestException;
import weblogic.console.backend.driver.ConfigurationPageWeblogicSearchResponseRestMapper;
import weblogic.console.backend.driver.ExpandedValue;
import weblogic.console.backend.driver.IdentityUtils;
import weblogic.console.backend.driver.InvocationContext;
import weblogic.console.backend.driver.PageRestMapping;
import weblogic.console.backend.driver.PageWeblogicSearchQueryRestMapper;
import weblogic.console.backend.driver.PathSegmentRestMapping;
import weblogic.console.backend.driver.PropertyRestMapping;
import weblogic.console.backend.driver.WeblogicConfiguration;
import weblogic.console.backend.driver.WeblogicWriteRequest;
import weblogic.console.backend.driver.WeblogicWriteRequestRestMapper;
import weblogic.console.backend.pagedesc.LocalizationUtils;
import weblogic.console.backend.pagedesc.PagePath;
import weblogic.console.backend.typedesc.WeblogicBeanIdentity;
import weblogic.console.backend.typedesc.WeblogicBeanProperty;
import weblogic.console.backend.utils.Path;
import weblogic.console.backend.utils.PluginInvocationUtils;
import weblogic.console.backend.utils.StringUtils;

import static weblogic.console.backend.utils.LocalizedConstants.MSG_DELETE_REFERENCES_FIRST;

/** Does the real work behind the JAXRS resources for the configuration pages. */
public class ConfigurationTreeManager extends BaseTreeManager {

  private static final Logger LOGGER = Logger.getLogger(ConfigurationTreeManager.class.getName());

  /** Returns the RDJ for the root bean or a collection child bean */
  public static Response viewBean(
    InvocationContext invocationContext,
    String slice
  ) throws Exception {
    return (new ConfigurationTreeManager(invocationContext)).viewBean(slice);
  }

  /** Returns the RDJ for an optional singleton bean */
  public static Response viewOptionalSingleton(
    InvocationContext invocationContext,
    String slice
  ) throws Exception {
    return (new ConfigurationTreeManager(invocationContext)).viewOptionalSingleton(slice);
  }

  /** Returns the RDJ for a collection of beans */
  public static Response viewCollection(InvocationContext invocationContext) throws Exception {
    return (new ConfigurationTreeManager(invocationContext)).viewCollection();
  }

  private WeblogicConfiguration weblogicConfiguration;

  protected WeblogicConfiguration getWeblogicConfiguration() {
    return this.weblogicConfiguration;
  }

  /** Constructor */
  protected ConfigurationTreeManager(InvocationContext invocationContext) {
    super(invocationContext);
    this.weblogicConfiguration = WeblogicConfiguration.getWeblogicConfiguration(invocationContext);
  }

  /** Returns the RDJ for a collection or optional singleton create form */
  public static Response viewCreateForm(InvocationContext invocationContext) throws Exception {
    return (new ConfigurationTreeManager(invocationContext)).viewCreateForm();
  }

  /** Returns the RDJ for a collection or optional singleton create form */
  private Response viewCreateForm() throws Exception {
    try {
      LOGGER.fine("viewCreateForm invocationContext="
        + StringUtils.cleanStringForLogging(getInvocationContext()));
      return Response.ok(createRDJ(newCreateFormPagePath())).build();
    } catch (Throwable t) {
      throw toServiceException(t);
    }
  }

  /** Creates a collection child bean */
  public static Response createCollectionChild(
    InvocationContext invocationContext,
    String weblogicConfigurationVersion,
    JsonObject requestBody
  ) throws Exception {
    return createCollectionChild(invocationContext, weblogicConfigurationVersion, requestBody, false);
  }

  public static Response createCollectionChild(
    InvocationContext invocationContext,
    String weblogicConfigurationVersion,
    JsonObject requestBody,
    boolean asynchronous
  ) throws Exception {
    return
      (new ConfigurationTreeManager(invocationContext))
        .createCollectionChild(weblogicConfigurationVersion, requestBody, asynchronous);
  }

  /** Creates a collection child bean */
  private Response createCollectionChild(
    String weblogicConfigurationVersion,
    JsonObject requestBody,
    boolean asynchronous
  ) throws Exception {
    try {
      // FortifyIssueSuppression Log Forging
      // Could come from user, so scrub it
      LOGGER.fine(
        "createCollectionChild invocationContext="
          + StringUtils.cleanStringForLogging(getInvocationContext())
          + " wlsCfgVer="
          + StringUtils.cleanStringForLogging(weblogicConfigurationVersion)
          + " reqBody="
          + StringUtils.cleanStringForLogging(requestBody)
      );
      return createBean(newCreateFormPagePath(), weblogicConfigurationVersion, requestBody, asynchronous);
    } catch (Throwable t) {
      throw toServiceException(t);
    }
  }

  /** Creates a creatable optional singleton bean */
  public static Response createOptionalSingleton(
    InvocationContext invocationContext,
    String weblogicConfigurationVersion,
    JsonObject requestBody
  ) throws Exception {
    return
      (new ConfigurationTreeManager(invocationContext))
        .createOptionalSingleton(weblogicConfigurationVersion, requestBody);
  }

  /** Creates a creatable optional singleton bean */
  private Response createOptionalSingleton(
    String weblogicConfigurationVersion,
    JsonObject requestBody
  ) throws Exception {
    try {
      // FortifyIssueSuppression Log Forging
      // Could come from user, so scrub it
      LOGGER.fine(
        "createOptionalSingleton invocationContext="
          + StringUtils.cleanStringForLogging(getInvocationContext())
          + " wlsCfgVer="
          + StringUtils.cleanStringForLogging(weblogicConfigurationVersion)
          + " reqBody="
          + StringUtils.cleanStringForLogging(requestBody)
      );
      return createBean(newCreateFormPagePath(), weblogicConfigurationVersion, requestBody, false);
    } catch (Throwable t) {
      throw toServiceException(t);
    }
  }

  /** Create a new weblogic bean then customize properties on it and its folded beans. */
  private Response createBean(
    PagePath pagePath,
    String weblogicConfigurationVersion,
    JsonObject requestBody,
    boolean asynchronous
  ) throws Exception {

    verifyWeblogicConfigurationVersion(weblogicConfigurationVersion);

    String createMethod = pagePath.getPagesPath().getBeanType().getCreateMethod();

    JsonArray messages =
      StringUtils.isEmpty(createMethod)
        ?
          standardCreateBean(pagePath, requestBody, asynchronous)
        :
          customCreateBean(createMethod, requestBody);

    return createdBeanResponse(pagePath, requestBody, messages);
  }

  protected Response createdBeanResponse(
    PagePath pagePath,
    JsonObject requestBody,
    JsonArray messages
  ) throws Exception {
    WeblogicBeanIdentity createdBeanIdentity = getCreatedBeanIdentity(pagePath, requestBody);
    JsonValue createdBeanResponseIdentity =
      IdentityUtils.weblogicBeanIdentityToResponseIdentity(
        createdBeanIdentity,
        pagePath.getPagesPath().getPerspectivePath(),
        getInvocationContext().getLocalizer()
      );
    JsonObjectBuilder dataBldr = Json.createObjectBuilder();
    dataBldr.add("identity", createdBeanResponseIdentity);

    // Send back a 201 plus any messages we've collected and the identity of the new bean
    return
       Response
        .status(Response.Status.CREATED)
        .entity(newResponseBody(messages, dataBldr.build()))
        .build();
  }

  // Compute the identity of the bean that just got created
  protected WeblogicBeanIdentity getCreatedBeanIdentity(PagePath pagePath, JsonObject requestBody) throws Exception {
    WeblogicBeanIdentity creatorIdentity = getIdentity();

    if (creatorIdentity.isCreatableOptionalUnfoldedSingleton()) {
      // It's an optional singleton, so it has the same identity as the one used to create it.
      return creatorIdentity;
    }
    if (!creatorIdentity.isCollection()) {
      throw new AssertionError("Creator is not a creatable optional singleton or collection: " + pagePath);
    }

    // It's a collection child, so it has the same identity as the collection except that
    // the name of the new child gets added to the last segment
    // (actually, the value of the key property, which is usually the Name property)

    // Get the collection's folded bean path and add the key to it.
    Path creatorFoldedBeanPath = creatorIdentity.getFoldedBeanPathWithIdentities();
    Path createdFoldedBeanPath = creatorFoldedBeanPath.childPath(getKeyAsString(pagePath, requestBody));

    // Convert the folded bean path to a WeblogicBeanIdentity
    return
      pagePath
        .getPagesPath()
        .getBeanType()
        .getTypes()
        .getWeblogicConfigBeanIdentityFromFoldedBeanPathWithIdentities(createdFoldedBeanPath);
  }

  /** Get the value of the key property in the request body as a string */
  private String getKeyAsString(PagePath pagePath, JsonObject requestBody) throws Exception {
    // Find the key property
    WeblogicBeanProperty keyProperty = pagePath.getPagesPath().getBeanType().getKeyProperty();
    if (keyProperty == null) {
      throw new AssertionError("No key property for collection: " + pagePath);
    }

    // Find the value of the key property in the request body.
    JsonObject wrappedKey = requestBody.getJsonObject("data").getJsonObject(keyProperty.getName());
    if (wrappedKey == null) {
      throw new AssertionError("Key property not in request body: " + requestBody + " " + pagePath);
    }

    String propertyType = keyProperty.getPropertyType();
    if (WeblogicBeanProperty.PROPERTY_TYPE_STRING.equals(propertyType)) {
      return ExpandedValue.getStringValue(wrappedKey);
    } else if (WeblogicBeanProperty.PROPERTY_TYPE_INT.equals(propertyType)) {
      return "" + ExpandedValue.getIntValue(wrappedKey);
    } else if (WeblogicBeanProperty.PROPERTY_TYPE_LONG.equals(propertyType)) {
      return "" + ExpandedValue.getLongValue(wrappedKey);
    } else {
      throw new AssertionError("Key property is not a string or an int: " + pagePath + " " + keyProperty);
    }
  }

  private JsonArray standardCreateBean(
    PagePath pagePath,
    JsonObject requestBody,
    boolean asynchronous
  ) throws Exception {
    // Convert the request body, which contains a list of folded bean properties
    // to set, into a list of unfolded weblogic mbean updates.
    List<WeblogicWriteRequest> writeRequests =
      createWeblogicWriteRequests(pagePath, true, requestBody);

    // wait to start the config transaction until after we figure out the
    // write requests so that if we threw an exception, we won't start the txn
    startEdit();

    // collect the messages from each weblogic write request
    JsonArrayBuilder messagesBuilder = Json.createArrayBuilder();

    // Create the new bean
    Path createdBeanWeblogicRestPath = createTopLevelBean(messagesBuilder, writeRequests.get(0), asynchronous);

    // Update its child beans
    updateBeans(
      messagesBuilder,
      createdBeanWeblogicRestPath,
      writeRequests.subList(1, writeRequests.size())
    );

    saveChanges();

    return messagesBuilder.build();
  }

  private JsonArray customCreateBean(String methodName, JsonObject requestBody) throws Exception {
    String context = "customCreateBean";
    Method method = PluginInvocationUtils.getMethod(context, methodName);
    PluginInvocationUtils.checkSignature(
      context,
      method,
      JsonArray.class, // returns an array of messages to the client
      InvocationContext.class,
      WeblogicConfiguration.class,
      JsonObject.class
    );
    List<Object> args = new ArrayList<>();
    args.add(getInvocationContext());
    args.add(getWeblogicConfiguration());
    args.add(getFoldedPropertiesToSet(requestBody));
    return (JsonArray)PluginInvocationUtils.invokeMethod(method, args);
  }

  /**
   * This is a create request.
   *
   * Create the new top level weblogic bean and set any properties that need to be customized on it,
   * collection any messages
   */
  private Path createTopLevelBean(
    JsonArrayBuilder messagesBldr,
    WeblogicWriteRequest createWriteRequest,
    boolean asynchronous
  ) throws Exception {
    Path containingPropertyWeblogicRestPath = getUnfoldedBeanPathWithIdentities();
    JsonArray weblogicMessages =
      getWeblogicConfiguration().createBean(
        getInvocationContext(),
        containingPropertyWeblogicRestPath,
        createWriteRequest.getWeblogicWriteRequestBody(),
        asynchronous
      );
    recordMessages(createWriteRequest.getSegmentMapping(), weblogicMessages, messagesBldr);
    return getCreatedBeanWeblogicRestPath(containingPropertyWeblogicRestPath, createWriteRequest);
  }

  /** Updates properties of the root bean, a collection child bean or an optional singleton bean */
  public static Response updateBean(
    InvocationContext invocationContext,
    String slice,
    String weblogicConfigurationVersion,
    JsonObject requestBody) throws Exception {
    return
      (new ConfigurationTreeManager(invocationContext))
        .updateBean(slice, weblogicConfigurationVersion, requestBody);
  }

  /* Updates properties of the root bean, a collection child bean or an optional singleton bean */
  private Response updateBean(
    String slice,
    String weblogicConfigurationVersion,
    JsonObject requestBody
  ) throws Exception {
    try {
      // FortifyIssueSuppression Log Forging
      // Could come from user, so scrub it
      LOGGER.fine(
        "updateBean invocationContext="
          + StringUtils.cleanStringForLogging(getInvocationContext())
          + " slice="
          + slice
          + " wlsCfgVer="
          + StringUtils.cleanStringForLogging(weblogicConfigurationVersion)
          + " reqBody="
          + StringUtils.cleanStringForLogging(requestBody)
      );

      verifyWeblogicConfigurationVersion(weblogicConfigurationVersion);

      // Convert the request body, which contains a list of folded bean properties
      // to set, into a list of unfolded weblogic mbean updates.
      List<WeblogicWriteRequest> writeRequests =
        createWeblogicWriteRequests(newBeanSlicePagePath(slice), false, requestBody);

      // wait to start the config transaction until after we figure out the
      // write requests so that if we threw an exception, we won't start the txn
      startEdit();

      // Write out the new properties, collecting any messages along the way
      // so that we return a 200 plus messages, instead of a 400, if there
      // are any problems.  That is, write out what we can and send back
      // messages for what we can't.
      JsonArrayBuilder messagesBuilder = Json.createArrayBuilder();
      updateBeans(messagesBuilder, getUnfoldedBeanPathWithIdentities(), writeRequests);
      saveChanges();

      // Send back a 200 plus any messages we've collected.
      return Response.ok(newResponseBody(messagesBuilder.build())).build();

    } catch (Throwable t) {
      throw toServiceException(t);
    }
  }

  /** Deletes a collection child bean or a creatable optional singleton bean */
  public static Response deleteBean(
    InvocationContext invocationContext,
    String weblogicConfigurationVersion
  ) throws Exception {
    return deleteBean(invocationContext, weblogicConfigurationVersion, false);
  }

  public static Response deleteBean(
    InvocationContext invocationContext,
    String weblogicConfigurationVersion,
    boolean asynchronous
  ) throws Exception {
    return
      (new ConfigurationTreeManager(invocationContext))
        .deleteBean(weblogicConfigurationVersion, asynchronous);
  }

  /* Deletes a collection child bean or a creatable optional singleton bean */
  private Response deleteBean(String weblogicConfigurationVersion, boolean asynchronous) throws Exception {
    try {
      // FortifyIssueSuppression Log Forging
      // Could come from user, so scrub it
      LOGGER.fine(
        "deleteBean invocationContext="
          + StringUtils.cleanStringForLogging(getInvocationContext())
          + " wlsCfgVer="
          + StringUtils.cleanStringForLogging(weblogicConfigurationVersion)
      );

      verifyWeblogicConfigurationVersion(weblogicConfigurationVersion);

      // Get the page mapping for the bean to be deleted.
      PageRestMapping pageRestMapping = getPageRestMapping(newBeanSlicePagePath(null));

      // Get everything we need to delete the bean
      // - the bean's identity (so that we can tell if the bean exists)
      // - any beans/properties needed by the optional delete plugin's
      //   arguments with Source annotations
      JsonObject weblogicRestSearchQuery =
        PageWeblogicSearchQueryRestMapper.createDeleteQuery(
          pageRestMapping,
          getInvocationContext()
        );
      JsonObject weblogicSearchResponse =
        getWeblogicConfiguration().getBeanTreeSlice(getInvocationContext(), weblogicRestSearchQuery);

      // Delete the bean
      try {
        ConfigurationPageWeblogicSearchResponseRestMapper.deleteBean(
          getWeblogicConfiguration(),
          pageRestMapping,
          getInvocationContext(),
          weblogicSearchResponse,
          asynchronous
        );
      } catch (BadRequestException ex) {
        // Got a bad request deleting this bean.
        // This is probably because of one or more of these problems:
        //
        // - There are other beans that reference this bean.  When this bean was
        //   deleted, those references were nulled out by the WLS REST api.
        //   Those beans are now in an invalid state because of the null references.
        //   The user either needs to roll back all the changes or the user needs to
        //   makee those beans refer to someone else.
        //
        // - The user made some prior edits that couldn't be saved (i.e. unrelated
        //   to deleting this bean).  The user needs to correct those problems,
        //   either by rolling back all the edits and starting again, or by fixing
        //   the problems.

        // Get the failure messages explaining the problems in deleting the bean
        // or saving the changes, and add one that recommends that the user remove
        // references to the object before deleting it.
        JsonArrayBuilder messages = Json.createArrayBuilder(ex.getMessages());
        messages.add(
          JavaxJsonUtils.getMessageJson(
            new Message(
              getInvocationContext().getLocalizer().localizeString(
                LocalizationUtils.constantLabelKey(MSG_DELETE_REFERENCES_FIRST)
              ),
              Message.Severity.INFO
            )
          )
        );

        // See if user was in a config txn before the user tried to delete this bean.
        boolean wasInConfigTxn = weblogicSearchResponse.getJsonObject("changeManager").getBoolean("locked");

        if (!wasInConfigTxn) {
          // The user wasn't in a config txn before trying to delete this bean.
          // Try to roll back the config txn we started for deleting this bean.
          // Then the user can fix the references first, then delete this bean again.
          getWeblogicConfiguration().cancelEdit(getInvocationContext());
        } else {
          // The user was already in a config txn.
          // Most likely, this bean has been deleted.
          // Don't roll back so that the user doesn't lose the prior edits.
          // There's a good chance the user will need to roll back all the
          // changes to correct the problem.
        }

        // Send back a 400 and all the messages.
        throw new BadRequestException(messages.build());
      }

      // Send back the good news that we successfully deleted the bean.
      return Response.ok(newResponseBody()).build();
    } catch (Throwable t) {
      throw toServiceException(t);
    }
  }

  /* Get a slice of the bean tree from WLS. */
  @Override
  protected JsonObject getBeanTreeSlice(JsonObject weblogicRestSearchQuery) throws Exception {
    return getWeblogicConfiguration().getBeanTreeSlice(getInvocationContext(), weblogicRestSearchQuery);
  }

  /** Create the RDJ for a collection or a bean slice from the WLS search query results. */
  @Override
  protected JsonObject createRDJ(
    PageRestMapping pageRestMapping,
    JsonObject weblogicSearchResponse
  ) throws Exception {
    return
      ConfigurationPageWeblogicSearchResponseRestMapper.createRDJ(
        getWeblogicConfiguration(),
        pageRestMapping,
        getInvocationContext(),
        weblogicSearchResponse
      );
  }

  /** Get a bean's subtype discriminator from the WLS search query results. */
  @Override
  protected String getSubTypeDiscriminatorFromSearchResponse(
    PageRestMapping baseTypeDefaultSliceRestMapping,
    JsonObject weblogicSearchResponse
  ) throws Exception {
    return
      ConfigurationPageWeblogicSearchResponseRestMapper.getSubTypeDiscriminator(
        getWeblogicConfiguration(),
        baseTypeDefaultSliceRestMapping,
        getInvocationContext(),
        weblogicSearchResponse
      );
  }

  /** We're getting a create form or creating a bean. Create a page path for the create form. */
  protected PagePath newCreateFormPagePath() throws Exception {
    return PagePath.newCreateFormPagePath(newPagesPath(getIdentity().getBeanType()));
  }

  /**
   * This is a create request.
   * <p>
   * Get the path of the weblogic bean we just created.
   */
  private Path getCreatedBeanWeblogicRestPath(
    Path containingPropertyWeblogicRestPath,
    WeblogicWriteRequest createWriteRequest
  ) throws Exception {
    WeblogicBeanProperty containingProperty =
      createWriteRequest.getSegmentMapping().getBeanProperty();
    if (containingProperty.isContainedOptionalSingleton()) {
      return containingPropertyWeblogicRestPath;
    } else {
      String identityPropertyRestName =
        containingProperty.getBeanType().getKeyProperty().getRestName();
      JsonObject weblogicWriteRequestBody = createWriteRequest.getWeblogicWriteRequestBody();
      if (!weblogicWriteRequestBody.containsKey(identityPropertyRestName)) {
        throw
          new Exception(
            "Missing identity property "
            + identityPropertyRestName
            + ": "
            + weblogicWriteRequestBody
          );
      }
      String identity =
        ExpandedValue.getStringValue(
          weblogicWriteRequestBody.getJsonObject(identityPropertyRestName)
        );
      return containingPropertyWeblogicRestPath.childPath(identity);
    }
  }

  /**
   * This is a create or write request.
   * <p>
   * Convert the set of folded bean properties to set in the request body from the client into a
   * corresponding set of unfolded weblogic bean write requests since we need to make a separate WLS
   * write request for each folded bean.
   */
  private List<WeblogicWriteRequest> createWeblogicWriteRequests(
    PagePath pagePath,
    boolean isCreate,
    JsonObject requestBody
  ) throws Exception {
    List<WeblogicWriteRequest> writeRequests =
      WeblogicWriteRequestRestMapper.createWeblogicWriteRequests(
        isCreate,
        getPageRestMapping(pagePath),
        getFoldedPropertiesToSet(requestBody)
      );
    // The request body didn't contain any properties to set on any of
    // the folded mbeans.  Complain!
    if (writeRequests.isEmpty()) {
      throw new Exception("No write requests");
    }
    return writeRequests;
  }

  /**
   * This is a create or update request.
   * <p>
   * Get the properties that need to be set on the underlying weblogic mbeans from the request
   * body that the client sent in.
   * <p>
   * That is, the request body should look like: { data: { ListenPort: ... } }
   */
  private JsonObject getFoldedPropertiesToSet(JsonObject requestBody) {
    return requestBody.getJsonObject("data");
  }

  /**
   * This is a create or write request.
   * <p>
   * Update any corresponding weblogic mbeans. Collect any messages they return.
   */
  private void updateBeans(
    JsonArrayBuilder messagesBldr,
    Path foldedBeanWeblogicRestPath,
    List<WeblogicWriteRequest> writeRequests
  ) throws BadRequestException, Exception {
    for (WeblogicWriteRequest writeRequest : writeRequests) {
      Path beanWeblogicRestPath =
        foldedBeanWeblogicRestPath.childPath(writeRequest.getWeblogicBeanPath());
      JsonArray weblogicMessages =
          getWeblogicConfiguration().setBeanProperties(
            getInvocationContext(),
            beanWeblogicRestPath,
            writeRequest.getWeblogicWriteRequestBody()
          );
      recordMessages(writeRequest.getSegmentMapping(), weblogicMessages, messagesBldr);
    }
  }

  /**
   * This is a create or write request.
   * <p>
   * Collect any messages returned from an individual weblogic bean create/update request.
   */
  private void recordMessages(
    PathSegmentRestMapping segmentMapping,
    JsonArray weblogicMessages,
    JsonArrayBuilder messagesBuilder
  ) {
    if (weblogicMessages != null) {
      for (int i = 0; i < weblogicMessages.size(); i++) {
        recordMessage(segmentMapping, weblogicMessages.getJsonObject(i), messagesBuilder);
      }
    }
  }

  /**
   * This is a create or write request.
   * <p>
   * Collect a message returned from an individual weblogic bean create/update request.
   * <p>
   * If it's a property scoped message, convert it from a weblogic bean scoped message into a
   * folded bean scoped message.
   */
  private void recordMessage(
    PathSegmentRestMapping segmentMapping,
    JsonObject weblogicMessage,
    JsonArrayBuilder messagesBuilder
  ) {
    String propertyRDJName = null;
    String propertyRestName = weblogicMessage.getString("field");
    if (propertyRestName != null) {
      PropertyRestMapping propertyMapping = segmentMapping.findPropertyByRestName(propertyRestName);
      if (propertyMapping == null) {
        // Weird - the Weblogic REST api returned a property-scoped message
        // for a property that doesn't appear on the page.
        throw
          new AssertionError(
            "Can't find RDJ property for "
            + propertyRestName
            + " "
            + segmentMapping
          );
      } else {
        propertyRDJName = propertyMapping.getBeanProperty().getName();
      }
    }
    if (propertyRDJName == null) {
      // This is a global message.  Record it as is.
      messagesBuilder.add(weblogicMessage);
    } else {
      // This is a property-scoped message.  Change the weblogic property rest
      // name to its corresponding RDJ property name then record it.
      messagesBuilder.add(
        Json.createObjectBuilder()
          .add("property", propertyRDJName)
          .add("severity", weblogicMessage.getString("severity"))
          .add("message", weblogicMessage.getString("message"))
      );
    }
  }

  /**
   * Verify that the weblogic configuration version that the client sent in matches the current one
   * for the domain.
   */
  protected void verifyWeblogicConfigurationVersion(
    String weblogicConfigurationVersion
  ) throws Exception {
    getWeblogicConfiguration().verifyWeblogicConfigurationVersion(
      getInvocationContext(),
      weblogicConfigurationVersion
    );
  }

  /** Convenience methods */
  protected void startEdit() throws Exception {
    getWeblogicConfiguration().startEdit(getInvocationContext());
  }

  protected void saveChanges() throws Exception, BadRequestException {
    getWeblogicConfiguration().saveChanges(getInvocationContext());
  }
}
