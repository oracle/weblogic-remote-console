// Copyright (c) 2020, 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.driver;

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

import weblogic.console.backend.pagedesc.WeblogicPageSource;
import weblogic.console.backend.typedesc.HarvestedDefaultValue;
import weblogic.console.backend.typedesc.HarvestedValue;
import weblogic.console.backend.typedesc.WeblogicBeanIdentity;
import weblogic.console.backend.typedesc.WeblogicBeanProperty;
import weblogic.console.backend.utils.Path;
import weblogic.console.backend.utils.PluginInvocationUtils;
import weblogic.console.backend.utils.StringUtils;

/**
 * Transforms a WebLogic REST configuration search query response into an RDJ json response.
 */
public class ConfigurationPageWeblogicSearchResponseRestMapper extends BasePageWeblogicSearchResponseRestMapper {

  private static final Logger LOGGER =
    Logger.getLogger(ConfigurationPageWeblogicSearchResponseRestMapper.class.getName());

  private WeblogicConfiguration weblogicConfiguration;

  private WeblogicConfiguration getWeblogicConfiguration() {
    return this.weblogicConfiguration;
  }

  private JsonObject requestBody;

  private JsonObject getRequestBody() {
    return this.requestBody;
  }

  /** Get the RDJ for a page */
  public static JsonObject createRDJ(
    WeblogicConfiguration weblogicConfiguration,
    PageRestMapping pageRestMapping,
    InvocationContext invocationContext,
    JsonObject weblogicSearchResponse
  ) throws Exception {
    LOGGER.finest("createRDJ weblogicConfiguration=" + weblogicConfiguration);
    LOGGER.finest("createRDJ pageRestMapping=" + pageRestMapping);
    LOGGER.finest("createRDJ invocationContext=" + invocationContext);
    LOGGER.finest("createRDJ searchResponse=" + weblogicSearchResponse);
    JsonObject rdj =
      (new ConfigurationPageWeblogicSearchResponseRestMapper(
        weblogicConfiguration,
        pageRestMapping,
        invocationContext,
        weblogicSearchResponse,
        null) // no RDJ request body available
      ).createRDJ();
    LOGGER.finest("createRDJ rdj=" + rdj);
    return rdj;
  }

  /** Get the RDJ for a page */
  private JsonObject createRDJ() throws Exception {
    addDataToResponse();
    addChangeManagerToResponse();
    addMessagesToResponse();
    addPageDefinitionToResponse();
    return getResponseBuilder().build();
  }

  /** Get the sub type discriminator for a bean instance */
  public static String getSubTypeDiscriminator(
    WeblogicConfiguration weblogicConfiguration,
    PageRestMapping pageRestMapping,
    InvocationContext invocationContext,
    JsonObject weblogicSearchResponse
  ) throws Exception {
    LOGGER.finest("getSubTypeDiscriminator weblogicConfiguration=" + weblogicConfiguration);
    LOGGER.finest("getSubTypeDiscriminator pageRestMapping=" + pageRestMapping);
    LOGGER.finest("getSubTypeDiscriminator invocationContext=" + invocationContext);
    LOGGER.finest("getSubTypeDiscriminator searchResponse=" + weblogicSearchResponse);
    String discriminator =
      (new ConfigurationPageWeblogicSearchResponseRestMapper(
        weblogicConfiguration,
        pageRestMapping,
        invocationContext,
        weblogicSearchResponse,
        null) // no RDJ request body available
      ).getSubTypeDiscriminator();
    LOGGER.finest("getSubTypeDiscriminator=" + discriminator);
    return discriminator;
  }

  /** Get the sub type discriminator for the bean instance */
  @Override
  protected String getSubTypeDiscriminator(
    SegmentWeblogicData instanceWeblogicData
  ) throws Exception {
    JsonValue rdjDiscriminator = getSubTypeDiscriminatorValue(instanceWeblogicData);
    if (rdjDiscriminator == null) {
      return null;
    }
    // sub type discriminators are always supposed to be Strings
    return ExpandedValue.getStringValue(rdjDiscriminator);
  }

  private ConfigurationPageWeblogicSearchResponseRestMapper(
    WeblogicConfiguration weblogicConfiguration,
    PageRestMapping pageRestMapping,
    InvocationContext invocationContext,
    JsonObject weblogicSearchResponse,
    JsonObject requestBody
  ) throws Exception {
    super(
      pageRestMapping,
      invocationContext,
      weblogicSearchResponse
    );
    this.weblogicConfiguration = weblogicConfiguration;
    this.requestBody = requestBody;
  }

  /** Adds the table or form to the RDJ - i.e. the bean(s)' data/properties. */
  @Override
  protected void addDataToResponse() throws Exception {
    if (getPageRestMapping().getPageSource().isCreateForm()) {
      getResponseBuilder().add("data", createCreateFormRDJData());
    } else {
      super.addDataToResponse();
    }
  }

  /** Get the properties for a create form RDJ */
  private JsonObject createCreateFormRDJData() throws Exception {
    String createFormPropertiesMethod =
      getPageRestMapping()
        .getPageSource()
        .getPagePath()
        .getPagesPath()
        .getBeanType()
        .getCreateFormPropertiesMethod();
    if (StringUtils.isEmpty(createFormPropertiesMethod)) {
      return standardCreateFormProperties();
    } else {
      return customCreateFormProperties(createFormPropertiesMethod);
    }
  }

  // Add info about all the create form's properties to its RDJ
  private JsonObject standardCreateFormProperties() throws Exception {
    boolean secureMode =
      getWeblogicSearchResponse()
        .getJsonObject("securityConfiguration")
        .getJsonObject("secureMode")
        .getJsonObject("secureModeEnabled")
        .getBoolean("value");
    boolean productionMode =
      getWeblogicSearchResponse()
        .getJsonObject("productionModeEnabled")
        .getBoolean("value");
    JsonObjectBuilder bldr = Json.createObjectBuilder();
    addCreateFormProperties(
      getPageRestMapping().getPagePathSegment(),
      secureMode,
      productionMode,
      bldr
    );
    return bldr.build();
  }

  /// Add info about this segment's properties, and child segment's properties, to the create form RDJ
  private void addCreateFormProperties(
    PathSegmentRestMapping segmentMapping,
    boolean secureMode,
    boolean productionMode,
    JsonObjectBuilder propertiesBldr
  ) throws Exception {
    for (PropertyRestMapping propMapping : segmentMapping.getProperties()) {
      addCreateFormProperty(propMapping, secureMode, productionMode, propertiesBldr);
    }
    for (PathSegmentRestMapping childSegmentMapping : segmentMapping.getChildren()) {
      addCreateFormProperties(childSegmentMapping, secureMode, productionMode, propertiesBldr);
    }
  }

  // Add info about a property to the create form RDJ
  private void addCreateFormProperty(
    PropertyRestMapping propMapping,
    boolean secureMode,
    boolean productionMode,
    JsonObjectBuilder propertiesBldr
  ) throws Exception {
    WeblogicBeanProperty beanProp = propMapping.getBeanProperty();
    String name = beanProp.getName();

    // Skip the 'identity' property since the new bean doesn't exist yet
    if ("identity".equals(name)) {
      return;
    }

    JsonObjectBuilder propertyBldr = Json.createObjectBuilder();

    // Add an initial value to the property
    addCreateFormPropertyValue(beanProp, secureMode, productionMode, propertyBldr);

    // If the property is has options, add them
    addCreateFormPropertyOptions(propMapping, propertyBldr);

    // Add the property to the RDJ
    propertiesBldr.add(name, propertyBldr);
  }

  // Adds the following to the RDJ:
  // - whether the property's value should be written to config.xml if the user doesn't change it
  // - the property's default value (if one is available)
  private void addCreateFormPropertyValue(
      WeblogicBeanProperty beanProp,
      boolean serverInSecureMode,
      boolean serverInProductionMode,
      JsonObjectBuilder propertyBldr
  ) throws Exception {
    // Whether the default value for this property should
    // be written to config.xml if the user doesn't change it.
    boolean isSet = false;

    // The default value for this property to include in the RDJ.
    // If null, then don't include a value in the RDJ.
    // i.e. it's a derived default and we don't know what
    // the computed default value is.
    JsonValue defaultJsonValue = getPropertyTypeDefaultJsonValue(beanProp);

    // See if this property has a default value, i.e. top-level yaml that has one or more of default, secure, production
    // or derivedDefault
    HarvestedDefaultValue defaultValue = beanProp.getDefaultValue();
    if (defaultValue != null) {  // i.e specified on the MBean/yaml
      // The bean says something about the default for this property
      if (defaultValue.isDerivedDefault()) {
        // This property has a derived default.
        defaultJsonValue = null; // i.e. don't set value in output
      } else {
        // Get the appropriate default value depending on what mode the domain is running in.
        HarvestedValue selectedVal = getDefaultValue(serverInSecureMode, serverInProductionMode, defaultValue);
        if (selectedVal != null) {
          // we have a default value from the bean infos.  use it.
          defaultJsonValue = harvestedValueToJsonValue(beanProp, selectedVal);
        }
      }
    }

    if ("Name".equals(beanProp.getName())) {
      if (defaultJsonValue == null || defaultJsonValue != JsonValue.NULL) {
        // if Name has a derived default, or a non-null fixed default,
        // force it to NULL since the default name probably isn't what
        // the user wants:
        defaultJsonValue = JsonValue.NULL;
        isSet = true;
      }
    }

    // Record whether this property's default value should be
    // written to config.xml if the user doesn't change it
    propertyBldr.add("set", isSet);

    // If we have a default value, record it too
    if (defaultJsonValue != null) {
      propertyBldr.add("value", defaultJsonValue);
    }
  }

  // Return the appropriate harvested default value,
  // depending on whether the domain is in secure mode,
  // production mode or normal mode.
  private HarvestedValue getDefaultValue(
    boolean secureMode,
    boolean productionMode,
    HarvestedDefaultValue dflt
  ) {
    HarvestedValue defaultValue = null;
    if (secureMode) {
      // the domain is running in secure mode.
      // see if this property has a secure mode default.
      HarvestedValue val = dflt.getSecureModeValue();
      if (val != null) {
        return val;
      }
    }
    if (productionMode) {
      // we don't have a secure default and the domain is running in production mode.
      // see if this property has a production mode default.
      HarvestedValue val = dflt.getProductionModeValue();
      if (val != null) {
        return val;
      }
    }
    // we don't have a secure mode or production mode default.
    // see if this property has a normal default value.
    return dflt.getValue();
  }

  private JsonValue harvestedValueToJsonValue(
    WeblogicBeanProperty beanProp,
    HarvestedValue value
  ) throws Exception {
    Object javaValue = value.getValue();
    if (javaValue == null) {
      return JsonValue.NULL;
    }
    String type = beanProp.getPropertyType();
    String val = javaValue.toString();
    if (
      WeblogicBeanProperty.PROPERTY_TYPE_STRING.equals(type)
        || WeblogicBeanProperty.PROPERTY_TYPE_SECRET.equals(type)
        || WeblogicBeanProperty.PROPERTY_TYPE_DATE.equals(type)
    ) {
      return Json.createValue(val);
    }
    if (WeblogicBeanProperty.PROPERTY_TYPE_INT.equals(type)) {
      return Json.createValue(Integer.parseInt(val));
    }
    if (WeblogicBeanProperty.PROPERTY_TYPE_LONG.equals(type)) {
      return Json.createValue(Long.parseLong(val));
    }
    if (WeblogicBeanProperty.PROPERTY_TYPE_DOUBLE.equals(type)) {
      return Json.createValue(Double.parseDouble(val));
    }
    throw new AssertionError("Unknown property type : " + beanProp + " " + type);
  }

  // Gets the default value to use based solely on the property's type.
  // Used when the bean info doesn't have a default value for the property.
  private JsonValue getPropertyTypeDefaultJsonValue(WeblogicBeanProperty beanProp) throws Exception {
    if (beanProp.isArray()) {
      return JsonValue.EMPTY_JSON_ARRAY;
    }
    String type = beanProp.getPropertyType();
    if (
      WeblogicBeanProperty.PROPERTY_TYPE_STRING.equals(type)
        || WeblogicBeanProperty.PROPERTY_TYPE_SECRET.equals(type)
        || WeblogicBeanProperty.PROPERTY_TYPE_DATE.equals(type)
        || WeblogicBeanProperty.PROPERTY_TYPE_REFERENCE.equals(type)
    ) {
      return JsonValue.NULL;
    }
    if (
      WeblogicBeanProperty.PROPERTY_TYPE_INT.equals(type)
        || WeblogicBeanProperty.PROPERTY_TYPE_LONG.equals(type)
        || WeblogicBeanProperty.PROPERTY_TYPE_DOUBLE.equals(type)
    ) {
      return Json.createValue(0);
    }
    if (WeblogicBeanProperty.PROPERTY_TYPE_BOOLEAN.equals(type)) {
      return JsonValue.FALSE;
    }
    if (WeblogicBeanProperty.PROPERTY_TYPE_PROPERTIES.equals(type)) {
      return JsonValue.EMPTY_JSON_OBJECT;
    }
    throw new AssertionError("Unknown property type : " + beanProp + " " + type);
  }

  private void addCreateFormPropertyOptions(
    PropertyRestMapping propMapping,
    JsonObjectBuilder propertyBldr
  ) throws Exception {
    WeblogicBeanProperty beanProp = propMapping.getBeanProperty();

    if (!beanProp.isReferences() && !beanProp.isReference()) {
      // currently only references support options
      return;
    }

    // We don't support create form properties that have a custom method for computing the options yet
    if (beanProp.getOptionsMethod() != null) {
      throw new AssertionError(
        "optionsMethod create form properties are not supported yet:"
        + " " + getPageRestMapping()
        + " " + beanProp
      );
    }

    // Get the options as weblogic identities
    JsonArray weblogicOptions =
      getWeblogicReferenceOptionsFromOptionsSources(propMapping);
    if (weblogicOptions == null) {
      // This property doesn't support options
      return;
    }

    // Convert the options to RDJ identities
    JsonArray rdjOptions = getRDJIdentitiesFromWeblogicIdentities(weblogicOptions);

    // See if we need to add a None option
    boolean allowNullReference = beanProp.isReference() && beanProp.isAllowNullReference();

    // Sort the references and add a None options if needed
    JsonArray sortedRDJOptions = sortRDJReferences(rdjOptions, allowNullReference);

    // Add the options to this property
    propertyBldr.add("options", sortedRDJOptions);

    // Add the optionsSources for this property
    addOptionsSources(propertyBldr, propMapping);
  }

  private JsonObject customCreateFormProperties(String methodName) throws Exception {
    String context = "customCreateFormProperties";
    Method method = PluginInvocationUtils.getMethod(context, methodName);
    PluginInvocationUtils.checkSignature(
      context,
      method,
      JsonObject.class, // returns an object with the properties to add to the RDJ
      WeblogicPageSource.class,
      InvocationContext.class,
      WeblogicConfiguration.class
    );
    List<Object> args = new ArrayList<>();
    args.add(getPageRestMapping().getPageSource());
    args.add(getInvocationContext());
    args.add(getWeblogicConfiguration());
    return (JsonObject)PluginInvocationUtils.invokeMethod(method, args);
  }

  /** Delete a bean instance */
  public static void deleteBean(
    WeblogicConfiguration weblogicConfiguration,
    PageRestMapping pageRestMapping,
    InvocationContext invocationContext,
    JsonObject weblogicSearchResponse,
    boolean asynchronous
  ) throws Exception {
    LOGGER.finest("deleteBean weblogicConfiguration=" + weblogicConfiguration);
    LOGGER.finest("deleteBean pageRestMapping=" + pageRestMapping);
    LOGGER.finest("deleteBean invocationContext=" + invocationContext);
    LOGGER.finest("deleteBean searchResponse=" + weblogicSearchResponse);
    LOGGER.finest("deleteBean asynchronous=" + asynchronous);
    (new ConfigurationPageWeblogicSearchResponseRestMapper(
      weblogicConfiguration,
      pageRestMapping,
      invocationContext,
      weblogicSearchResponse,
      null) // no request body available
    ).deleteBean(asynchronous);
  }

  /** Delete the bean instance */
  private void deleteBean(boolean asynchronous) throws Exception {
    // See if the bean exists.  If not, throw not found so that we don't start a config transaction.
    SegmentWeblogicData segment =
      findSegmentWeblogicData(getPageRestMapping().getPagePathSegment());
    if (segment == null) {
      throw newNoDataFoundException();
    }
    // Start a config txn, delete the bean (and anything that goes along with it) then save the
    // changes
    getWeblogicConfiguration().startEdit(getInvocationContext());
    deleteBean(segment, asynchronous);
    getWeblogicConfiguration().saveChanges(getInvocationContext());
  }

  // The bean exists and the config txn is started.  Go ahead and delete the bean.
  private void deleteBean(SegmentWeblogicData segment, boolean asynchronous) throws Exception {
    TypePluginRestMapping deletePlugin = getPageRestMapping().getDeletePlugin();
    if (deletePlugin == null) {
      // delete the bean
      getWeblogicConfiguration().deleteBean(
        getInvocationContext(),
        segment.getIdentity().getUnfoldedBeanPathWithIdentities(),
        asynchronous
      );
    } else {
      // call the plugin (who is responsible for deleting the bean)
      LOGGER.finer("usePluginToDeleteBean " + deletePlugin + " " + segment);
      PluginInvocationUtils.invokeMethod(
        deletePlugin.getMethod(), getPluginArguments(segment, deletePlugin)
      );
    }
  }

  /**
   * Returns a plugin argument whose value comes from an object in the mapper,
   * e.g. the WeblogicBeanIdentity or WeblogicConfiguration.
   */
  @Override
  protected Object getBuiltinPluginArgument(
    SegmentWeblogicData instanceWeblogicData,
    BuiltinPluginParameterRestMapping parameterMapping
  ) throws Exception {
    Class<?> javaClass = parameterMapping.getJavaClass();
    if (javaClass.equals(WeblogicConfiguration.class)) {
      return getWeblogicConfiguration();
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
    ExpandedValue weblogicIdentities = ExpandedValue.wrap(weblogicReferences);
    JsonArray rdjReferences =
      getRDJIdentitiesFromWeblogicIdentities(weblogicIdentities.getValue().asJsonArray());
    if (!propertyMapping.getBeanProperty().isOrdered()) {
      // sort the references since they're not ordered
      rdjReferences = sortRDJReferences(rdjReferences, false); // don't add 'None'
    } else {
      // don't sort them since they're ordered
    }
    JsonObject rdjIdentities =
      ExpandedValue.fromValue(rdjReferences).copySet(weblogicIdentities).getJson();
    if (includeOptions(propertyMapping)) {
      JsonArray options =
        getRDJReferenceOptions(instanceWeblogicData, propertyMapping, false); // don't add 'None'
      if (options != null) {
        JsonObjectBuilder builder = Json.createObjectBuilder(rdjIdentities).add("options", options);
        addOptionsSources(builder, propertyMapping);
        return builder.build();
      } else {
        return rdjIdentities;
      }
    } else {
      return rdjIdentities;
    }
  }

  /**
   * Convert a weblogic reference in the WLS REST response (or from a plugin)
   * into a reference in the RDJ.
   */
  @Override
  protected JsonValue weblogicReferenceToResponseReference(
    JsonValue weblogicReference,
    SegmentWeblogicData instanceWeblogicData,
    PropertyRestMapping propertyMapping
  ) throws Exception {
    ExpandedValue weblogicIdentity = ExpandedValue.wrap(weblogicReference);
    JsonObject rdjIdentity =
      ExpandedValue
        .fromValue(weblogicIdentityToResponseIdentity(weblogicIdentity.getValue()))
        .copySet(weblogicIdentity)
        .getJson();
    if (includeOptions(propertyMapping)) {
      // By default, we always add a 'None' option for a reference property.
      // But if 'allowNullReference' is set to false in type.yaml, we will not add that.
      boolean allowNullReference = propertyMapping.getBeanProperty().isAllowNullReference();
      JsonArray options =
        getRDJReferenceOptions(instanceWeblogicData, propertyMapping, allowNullReference); // add 'None'
      if (options != null) {
        JsonObjectBuilder builder = Json.createObjectBuilder(rdjIdentity).add("options", options);
        addOptionsSources(builder, propertyMapping);
        return builder.build();
      } else {
        // An error saying that there isn't an options property has already been reported.
        // Return the identity since we can't add options to it.
        return rdjIdentity;
      }
    } else {
      return rdjIdentity;
    }
  }

  /**
   * Adds the optionsSources for the options when the options sources can be determined.
   */
  private void addOptionsSources(
    JsonObjectBuilder optionsBuilder,
    PropertyRestMapping propertyMapping
  ) throws Exception {
    Path path = getIdentity().getFoldedBeanPathWithIdentities();
    WeblogicBeanIdentity identity = getTypes().getWeblogicConfigBeanIdentityFromFoldedBeanPathWithIdentities(path);
    JsonArray optionsSources = getRDJReferencesOptionsSources(propertyMapping, identity);
    if (!optionsSources.isEmpty()) {
      optionsBuilder.add("optionsSources", optionsSources);
    }
  }

  /**
   * Convert list of weblogic references that can only have zero or one references
   * in it to a single reference in the RDJ.
   */
  @Override
  protected JsonValue getWeblogicReferenceFromWeblogicReferences(
    JsonValue weblogicValue,
    PropertyRestMapping propertyMapping
  ) throws Exception {
    JsonArray weblogicIdentities = ExpandedValue.getReferencesValue(weblogicValue);
    JsonValue weblogicIdentity =
      getWeblogicIdentityFromWeblogicIdentities(
        weblogicIdentities,
        propertyMapping.getBeanProperty()
      );
    return
      ExpandedValue
        .fromValue(weblogicIdentity)
        .copySet(ExpandedValue.wrap(weblogicValue))
        .getJson();
  }

  // Uncomment when we add support for string properties that hold mbean references
  /*
    @Override protected JsonValue
    getWeblogicReferenceFromBeanKeyString(
      JsonValue weblogicValue,
      SegmentWeblogicData instanceWeblogicData,
      PropertyRestMapping propertyMapping
    ) throws Exception {
      String beanKey = ExpandedValue.getStringValue(weblogicValue);
      JsonValue weblogicIdentity = null;
      if (StringUtils.isEmpty(beanKey)) {
        weblogicIdentity = JsonValue.NULL;
      } else {
        weblogicIdentity =
          findWeblogicReferenceInOptions(beanKey, instanceWeblogicData, propertyMapping);
      }
      return
        ExpandedValue
          .fromValue(weblogicIdentity)
          .copySet(ExpandedValue.wrap(weblogicValue))
          .getJson();
    }

    private JsonValue
    findWeblogicReferenceInOptions(
      String key,
      SegmentWeblogicData instanceWeblogicData,
      PropertyRestMapping propertyMapping
    ) throws Exception {
      JsonArray options =
        getWeblogicReferenceOptions(instanceWeblogicData, propertyMapping);
      JsonArray match = null;
      for (int i = 0; i < options.size(); i++) {
        JsonArray weblogicReference = options.getJsonObject(i).getJsonArray("identity");
        int size = weblogicReference.size();
        String lastComponent = weblogicReference.getString(size-1);
        if (key.equals(lastComponent)) {
          if (match != null) {
            // Do we need to pick the 'nearest' match path-wise?
            // i.e. a scoped reference over a global reference with the same key?
            throw
              new AssertionError(
                "Multiple matching references for "
                + key
                + " : "
                + options
                + " "
                + propertyMapping
              );
          }
          match = weblogicReference;
        }
      }
      if (match == null) {
        throw
          new AssertionError(
            "Couldn't find matching reference for "
            + key
            + " : "
            + options
            + " "
            + propertyMapping
          );
      }
      return match;
    }
  */

  /** Returns whether we need to include a list of options for a reference or list of references. */
  private boolean includeOptions(PropertyRestMapping propertyMapping) throws Exception {
    if (propertyMapping.getOptions() == null) {
      return false;
    }
    if (getPageRestMapping().getPageSource().isSliceForm()) {
      return propertyMapping.getBeanProperty().isUpdateWritable();
    } else {
      // Note: we don't populate any fields for create form RDJs
      // therefore this must be a table
      return false;
    }
  }

  /** Get the list RDJ references that can be used for a reference or list of references property */
  private JsonArray getRDJReferenceOptions(
    SegmentWeblogicData instanceWeblogicData,
    PropertyRestMapping propertyMapping,
    boolean addNoneOption
  ) throws Exception {
    return
      sortRDJReferences(
        getRDJIdentitiesFromWeblogicIdentities(
          getWeblogicReferenceOptions(instanceWeblogicData, propertyMapping)
        ),
        addNoneOption
      );
  }

  /**
   * Get the list WLS references that can be used for a reference or list of references property
   * <p>
   * It either gets them from the overall WLS REST response or calls a plugin to calculate them.
   */
  private JsonArray getWeblogicReferenceOptions(
    SegmentWeblogicData instanceWeblogicData,
    PropertyRestMapping propertyMapping
  ) throws Exception {
    PluginRestMapping optionsMethod = propertyMapping.getOptionsMethod();
    if (optionsMethod != null) {
      return usePluginToComputeWeblogicReferenceOptions(instanceWeblogicData, optionsMethod);
    } else {
      return getWeblogicReferenceOptionsFromOptionsSources(propertyMapping);
    }
  }

  /**
   * Call a plugin to get the list of WLS references that can be used for
   * a reference or list of references property.
   */
  private JsonArray usePluginToComputeWeblogicReferenceOptions(
    SegmentWeblogicData instanceWeblogicData,
    PluginRestMapping optionsMethod
  ) throws Exception {
    LOGGER.finer(
      "usePluginToComputeWeblogicReferenceOptions "
      + optionsMethod
      + " "
      + instanceWeblogicData
    );
    JsonObject expandedValue =
      (JsonObject)PluginInvocationUtils.invokeMethod(
        optionsMethod.getMethod(),
        getPluginArguments(instanceWeblogicData, optionsMethod)
      );
    LOGGER.finer("optionsMethod returned " + expandedValue);
    return ExpandedValue.getReferencesValue(expandedValue);
  }

  /**
   * Get the list of WLS references that can be used for a reference or
   * list of references property from the overall WLS REST response.
   */
  private JsonArray getWeblogicReferenceOptionsFromOptionsSources(
    PropertyRestMapping propertyMapping
  ) throws Exception {
    JsonArrayBuilder identitiesBldr = Json.createArrayBuilder();
    for (OptionsRestMapping optionsMapping : propertyMapping.getOptions()) {
      collectWeblogicIdentities(identitiesBldr, optionsMapping);
    }
    return identitiesBldr.build();
  }

  /**
   * Get the list of WLS references that can be used for a reference or list of
   * references property from the overall WLS REST response for a single options source.
   */
  private void collectWeblogicIdentities(
    JsonArrayBuilder identitiesBldr,
    OptionsRestMapping optionsMapping
  ) throws Exception {
    SegmentWeblogicData optionsParent = findSegmentWeblogicData(optionsMapping.getParent());
    JsonValue weblogicOptions =
      optionsParent.getWeblogicData().get(optionsMapping.getBeanProperty().getRestName());
    if (weblogicOptions == null) {
      throw
        new AssertionError(
          "Can't find the options property prop="
          + optionsMapping.getBeanProperty().getRestName()
          + " parent="
          + optionsParent
         + " options="
          + optionsMapping
        );
    }
    WeblogicBeanProperty optionsBeanProp = optionsMapping.getBeanProperty();
    JsonArray identities = null;
    if (optionsBeanProp.isReferences()) {
      identities = ExpandedValue.getValue(weblogicOptions).asJsonArray();
    } else if (optionsBeanProp.isContainedCollection()) {
      identities = findItems(weblogicOptions.asJsonObject());
    } else {
      throw
        new AssertionError(
          "Options property is not a collection of references or a collection of children: "
          + optionsMapping
        );
    }
    for (int i = 0; i < identities.size(); i++) {
      identitiesBldr.add(identities.get(i));
    }
  }

  /** Get the list of RDJ references that are the source for a reference or list of references property */
  private JsonArray getRDJReferencesOptionsSources(
    PropertyRestMapping propertyMapping,
    WeblogicBeanIdentity identity
  ) throws Exception {
    return
      getRDJIdentitiesFromWeblogicIdentities(
        getOptionsSources(propertyMapping, identity)
      );
  }

  /**
   * Get the list of WebLogic identities used as the source for the options of a property.
   * <p>
   * The WebLogic identity of the bean is used to derive instance names that
   * represent the WebLogic collection for which the options mapping references.
   */
  private JsonArray getOptionsSources(
    PropertyRestMapping propertyMapping,
    WeblogicBeanIdentity identity
  ) throws Exception {
    Path unfoldedBeanIdentity = identity.getUnfoldedBeanPathWithIdentities();
    List<OptionsRestMapping> optionsMappings = propertyMapping.getOptions();

    LOGGER.finest(
      "getOptionsSources for WebLogic identity"
      + unfoldedBeanIdentity
      + " using "
      + optionsMappings
    );

    // Create the optionsSources using each OptionsRestMapping found in the PropertyRestMapping...
    JsonArrayBuilder identitiesBuilder = Json.createArrayBuilder();
    for (OptionsRestMapping optionsMapping : optionsMappings) {
      JsonArray optionsSource = getOptionsSource(optionsMapping, unfoldedBeanIdentity);
      identitiesBuilder.add(Json.createObjectBuilder().add("identity", optionsSource).build());
    }

    // Build the array of optionSources to return...
    JsonArray optionsSources = identitiesBuilder.build();

    LOGGER.finest(
      "getOptionsSources returning "
      + optionsSources
      + " for WebLogic identity: "
      + unfoldedBeanIdentity);

    // Done.
    return optionsSources;
  }

  /**
   * Compute the WebLogic identity which is the source for the options of a property.
   * <p>
   * Walk the options mapping parent until the root and collect the path segments
   * along the way while using the bean identity for any instance names along the path.
   * <p>
   * Complete the Weblogic identity for the collection by using the bean property of
   * the options mapping.
   */
  private JsonArray getOptionsSource(
    OptionsRestMapping optionsMapping,
    Path unfoldedBeanIdentity
  ) throws Exception {
    ArrayList<String> identity = new ArrayList<>();
    PathSegmentRestMapping path = optionsMapping.getParent();

    // Starting at the options mapping parent, traverse the parents until the root and
    // push the Weblogic identity path segments that form the options source identity
    while ((path != null) && !path.isRoot()) {
      int index = path.getIdentityIndex();
      String name = path.getBeanProperty().getRestName();
      boolean containedCollection = path.getBeanProperty().isContainedCollection();

      // Include the instance name for collections when needed....
      if (containedCollection && (index >= 0) && (index < (unfoldedBeanIdentity.getComponents().size()))) {
        identity.add(0, unfoldedBeanIdentity.getComponents().get(index));
      }

      // Add the weblogic identity path segment name...
      identity.add(0, name);

      // Traverse to the next parent...
      path = path.getParent();
    }

    // Add the collection name to the end of the WebLogic identity...
    identity.add(optionsMapping.getBeanProperty().getRestName());

    // Create the WebLogic indentity of the optionsSources...
    JsonArrayBuilder optionsSource = Json.createArrayBuilder();
    for (String segment : identity) {
      optionsSource.add(segment);
    }

    // Done.
    return optionsSource.build();
  }

  /**
   * Get the string value of the key property for a bean from the WLS REST response's value
   * (or from the value returned from a plugin).
   */
  @Override
  protected String getKey(JsonObject weblogicBeanData, String keyProp) {
    JsonObject expandedValue = weblogicBeanData.getJsonObject(keyProp);
    return ExpandedValue.getStringValue(expandedValue);
  }
}
