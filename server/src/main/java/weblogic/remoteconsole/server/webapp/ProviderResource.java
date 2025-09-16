// Copyright (c) 2020, 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.webapp;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.logging.Logger;
import javax.json.Json;
import javax.json.JsonArray;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;
import javax.json.JsonString;
import javax.json.JsonValue;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.DefaultValue;
import javax.ws.rs.GET;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.container.ResourceContext;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.PathSegment;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import org.glassfish.jersey.media.multipart.FormDataContentDisposition;
import org.glassfish.jersey.media.multipart.FormDataParam;
import weblogic.console.utils.StringUtils;
import weblogic.remoteconsole.server.providers.AdminServerDataProvider;
import weblogic.remoteconsole.server.providers.AdminServerDataProviderImpl;
import weblogic.remoteconsole.server.providers.PropertyListDataProviderImpl;
import weblogic.remoteconsole.server.providers.Provider;
import weblogic.remoteconsole.server.providers.ProviderManager;
import weblogic.remoteconsole.server.providers.WDTCompositeDataProviderImpl;
import weblogic.remoteconsole.server.providers.WDTModelDataProvider;
import weblogic.remoteconsole.server.providers.WDTModelDataProviderImpl;
import weblogic.remoteconsole.server.repo.InvocationContext;

/**
 * This resource is used to support the provider operations.  It is mostly
 * responsible for manipulating the REST API elements and relies on the
 * ProviderManager to handle the actual management.
*/
public class ProviderResource extends BaseResource {
  private static final Logger LOGGER =
    Logger.getLogger(ProviderResource.class.getName());
  private static final Set<String> reservedNames = new HashSet<>();
  public static final String DOMAIN_URL = "domainUrl";
  public static final String WDT_MODEL = "model";
  public static final String WDT_MODELS = "modelNames";
  public static final String PROPERTIES = "properties";
  public static final String PROPERTY_LISTS = "propertyLists";
  public static final String PROVIDER_TYPE = "providerType";
  public static final String PROVIDER_NAME = "name";
  public static final String PROVIDER_LABEL = "label";
  public static final String PROVIDER_SETTINGS = "settings";
  public static final String PROVIDER_INSECURE = "insecure";
  public static final String PROXY_OVERRIDE = "proxyOverride";
  public static final String PROVIDER_SSO = "sso";
  public static final String PROVIDER_LOCAL = "local";
  public static final String TEST_ACTION = "test";
  @Context HttpHeaders headers;

  static {
    reservedNames.add(RemoteConsoleResource.ABOUT_PATH);
    reservedNames.add(RemoteConsoleResource.DOMAIN_STATUS_PATH);
    reservedNames.add(RemoteConsoleResource.SSO_TOKEN_PATH);
    reservedNames.add("providers");
    reservedNames.add(AdminServerDataProviderImpl.TYPE_NAME);
    reservedNames.add(WDTModelDataProviderImpl.TYPE_NAME);
    reservedNames.add(WDTCompositeDataProviderImpl.TYPE_NAME);
    reservedNames.add(PropertyListDataProviderImpl.TYPE_NAME);
  }

  @GET
  @Produces(MediaType.APPLICATION_JSON)
  @Path("/{pathSegments: .+}")
  public Response getProviderInfoWithPath(
    @QueryParam("action") @DefaultValue("none") String action,
    @PathParam("pathSegments") List<PathSegment> pathSegments,
    @Context ResourceContext resourceContext) {
    int nameIndex = 0;
    if (pathSegments.size() <= nameIndex) {
      return WebAppUtils.addCookieFromContext(
        resourceContext,
        Response.status(Status.BAD_REQUEST.getStatusCode(), "Need name")
      ).build();
    }
    String first = pathSegments.get(nameIndex).getPath();
    String typeConstraint = null;
    String nameConstraint = null;
    if (first.equals(AdminServerDataProviderImpl.TYPE_NAME)
      || first.equals(WDTModelDataProviderImpl.TYPE_NAME)
      || first.equals(WDTCompositeDataProviderImpl.TYPE_NAME)
      || first.equals(PropertyListDataProviderImpl.TYPE_NAME)) {
      typeConstraint = first;
      nameIndex++;
      if (pathSegments.size() <= nameIndex) {
        return WebAppUtils.addCookieFromContext(
          resourceContext,
          Response.status(Status.BAD_REQUEST.getStatusCode(), "Need name")
        ).build();
      }
    }
    nameConstraint = pathSegments.get(nameIndex).getPath();
    ProviderManager pm = ProviderManager.getFromContext(resourceContext);
    InvocationContext ic = WebAppUtils.getInvocationContextFromResourceContext(resourceContext);
    for (Provider prov : pm.getAll()) {
      if ((typeConstraint != null) && !prov.getType().equals(typeConstraint)) {
        continue;
      }
      if ((nameConstraint != null) && !prov.getName().equals(nameConstraint)) {
        continue;
      }
      if (action.equals("test")) {
        prov.test(ic);
        removeSsoTokenAdminServerConnection(pm, prov);
      }
      if (action.equals("start")) {
        prov.start(ic);
        removeSsoTokenAdminServerConnection(pm, prov);
      }
      return WebAppUtils.addCookieFromContext(resourceContext,
        Response.ok(prov.toJSON(ic), MediaType.APPLICATION_JSON)).build();
    }
    pm.save(ic);
    return
      WebAppUtils.addCookieFromContext(
        resourceContext,
        Response.status(Status.BAD_REQUEST.getStatusCode(), "No such provider")
      ).build();
  }

  // Remove the SSO token after the provider action completed successfully
  private static void removeSsoTokenAdminServerConnection(ProviderManager pm, Provider provider) {
    if (provider.getType().equals(AdminServerDataProviderImpl.TYPE_NAME)) {
      pm.removeSsoToken(provider.getName());
    }
  }

  @GET
  @Produces(MediaType.APPLICATION_JSON)
  @Path("/help")
  public Response getAllHelp(@Context ResourceContext resourceContext) {
    JsonObjectBuilder ret = Json.createObjectBuilder();
    InvocationContext ic = WebAppUtils.getInvocationContextFromResourceContext(resourceContext);
    ret.add("data", ProviderManager.getAllHelp(ic));
    return WebAppUtils.addCookieFromContext(resourceContext,
      Response.ok(ret.build(), MediaType.APPLICATION_JSON)).build();
  }

  @GET
  @Produces(MediaType.APPLICATION_JSON)
  @Path("/" + AdminServerDataProviderImpl.TYPE_NAME)
  public Response getProviderInfoAdminServerDataProviders(
    @Context ResourceContext resourceContext) {
    JsonArrayBuilder builder = Json.createArrayBuilder();
    ProviderManager pm = ProviderManager.getFromContext(resourceContext);
    InvocationContext ic = WebAppUtils.getInvocationContextFromResourceContext(resourceContext);
    for (Provider prov : pm.getAll()) {
      if (prov.getType().equals(AdminServerDataProviderImpl.TYPE_NAME)) {
        builder.add(prov.toJSON(ic));
      }
    }
    return WebAppUtils.addCookieFromContext(resourceContext,
      Response.ok(builder.build(), MediaType.APPLICATION_JSON)).build();
  }

  @GET
  @Produces(MediaType.APPLICATION_JSON)
  @Path("/" + WDTModelDataProviderImpl.TYPE_NAME)
  public Response getProviderInfoWDTModelDataProviders(
    @Context ResourceContext resourceContext) {
    JsonArrayBuilder builder = Json.createArrayBuilder();
    ProviderManager pm = ProviderManager.getFromContext(resourceContext);
    InvocationContext ic = WebAppUtils.getInvocationContextFromResourceContext(resourceContext);
    for (Provider prov : pm.getAll()) {
      if (prov.getType().equals(WDTModelDataProviderImpl.TYPE_NAME)) {
        builder.add(prov.toJSON(ic));
      }
    }
    return WebAppUtils.addCookieFromContext(resourceContext,
      Response.ok(builder.build(), MediaType.APPLICATION_JSON)).build();
  }

  @GET
  @Produces(MediaType.APPLICATION_JSON)
  @Path("/" + WDTCompositeDataProviderImpl.TYPE_NAME)
  public Response getProviderInfoWDTCompositeDataProviders(
    @Context ResourceContext resourceContext) {
    JsonArrayBuilder builder = Json.createArrayBuilder();
    ProviderManager pm = ProviderManager.getFromContext(resourceContext);
    InvocationContext ic = WebAppUtils.getInvocationContextFromResourceContext(resourceContext);
    for (Provider prov : pm.getAll()) {
      if (prov.getType().equals(WDTCompositeDataProviderImpl.TYPE_NAME)) {
        builder.add(prov.toJSON(ic));
      }
    }
    return WebAppUtils.addCookieFromContext(resourceContext,
      Response.ok(builder.build(), MediaType.APPLICATION_JSON)).build();
  }

  @GET
  @Produces(MediaType.APPLICATION_JSON)
  @Path("/" + PropertyListDataProviderImpl.TYPE_NAME)
  public Response getProviderInfoPropertyListDataProviders(
    @Context ResourceContext resourceContext) {
    JsonArrayBuilder builder = Json.createArrayBuilder();
    ProviderManager pm = ProviderManager.getFromContext(resourceContext);
    InvocationContext ic = WebAppUtils.getInvocationContextFromResourceContext(resourceContext);
    for (Provider prov : pm.getAll()) {
      if (prov.getType().equals(PropertyListDataProviderImpl.TYPE_NAME)) {
        builder.add(prov.toJSON(ic));
      }
    }
    return WebAppUtils.addCookieFromContext(resourceContext,
      Response.ok(builder.build(), MediaType.APPLICATION_JSON)).build();
  }

  @GET
  @Produces(MediaType.APPLICATION_JSON)
  public Response getProviderInfoAll(
    @Context ResourceContext resourceContext) {
    JsonArrayBuilder builder = Json.createArrayBuilder();
    ProviderManager pm = ProviderManager.getFromContext(resourceContext);
    InvocationContext ic = WebAppUtils.getInvocationContextFromResourceContext(resourceContext);
    for (Provider prov : pm.getAll()) {
      builder.add(prov.toJSON(ic));
    }
    return WebAppUtils.addCookieFromContext(resourceContext,
      Response.ok(builder.build(), MediaType.APPLICATION_JSON)).build();
  }

  @DELETE
  @Produces(MediaType.APPLICATION_JSON)
  public Response deleteProviderInfoAll(
    @Context ResourceContext resourceContext
  ) {
    ProviderManager.getFromContext(resourceContext).terminateAllProviders();
    return WebAppUtils.addCookieFromContext(
      resourceContext,
      Response.ok()
        .entity(Json.createObjectBuilder().build())
        .type(MediaType.APPLICATION_JSON)
    ).build();
  }

  @POST
  @Consumes(MediaType.APPLICATION_JSON)
  @Produces(MediaType.APPLICATION_JSON)
  @Path("/" + AdminServerDataProviderImpl.TYPE_NAME)
  public Response submitProviderInfoAdminPath(
    @Context ResourceContext resourceContext,
    @HeaderParam(HttpHeaders.AUTHORIZATION) String authHeader,
    JsonObject data
  ) {
    LOGGER.fine("POST provider");

    ProviderManager pm = ProviderManager.getFromContext(resourceContext);
    // Check that all expected data is passed with the request
    if (data == null) {
      LOGGER.fine("POST create bad request: no data");
      return Response.status(
        Status.BAD_REQUEST.getStatusCode(), "Missing Request Content").build();
    }
    JsonString jname = data.getJsonString(PROVIDER_NAME);
    if (jname == null) {
      LOGGER.fine("POST create bad request: no name");
      return Response.status(
        Status.BAD_REQUEST.getStatusCode(), "Missing Name").build();
    }
    String name = jname.getString();
    JsonString jsonLabel = data.getJsonString(PROVIDER_LABEL);
    String label;
    if (jsonLabel == null) {
      label = name;
    } else {
      label = jsonLabel.getString();
    }

    return submitAdminServerDataProviderInfo(
      pm, name, label, resourceContext, authHeader, data);
  }

  @POST
  @Consumes(MediaType.MULTIPART_FORM_DATA)
  @Produces(MediaType.APPLICATION_JSON)
  @Path("/" + WDTModelDataProviderImpl.TYPE_NAME)
  public Response submitProviderInfoWDTModelPath(
    @Context ResourceContext resourceContext,
    @FormDataParam("data") InputStream dataStream,
    @FormDataParam("model") InputStream modelStream,
    @FormDataParam("model") FormDataContentDisposition modelContent
  ) throws Exception {
    LOGGER.fine("POST provider");

    ProviderManager pm = ProviderManager.getFromContext(resourceContext);
    JsonObject data = Json.createReader(dataStream).readObject();
    JsonString jname = data.getJsonString(PROVIDER_NAME);
    if (jname == null) {
      LOGGER.fine("POST create bad request: no name");
      return Response.status(
        Status.BAD_REQUEST.getStatusCode(), "Missing Name").build();
    }
    String name = jname.getString();

    // Check if a property list has been specified
    List<String> propLists = null;
    JsonArray jprops = data.getJsonArray(PROPERTY_LISTS);
    if ((jprops != null) && !jprops.isEmpty()) {
      LOGGER.fine("POST specified property list providers");
      propLists = new ArrayList<>(jprops.size());
      for (int i = 0; i < jprops.size(); i++) {
        propLists.add(jprops.getString(i));
      }
    }

    // Check the file name to see if using a JSON extension
    boolean isJson = false;
    if ((modelContent != null) && (modelContent.getFileName() != null)) {
      String fileName = modelContent.getFileName().trim().toLowerCase();
      isJson = fileName.endsWith(".json");
    }

    JsonString jsonLabel = data.getJsonString(PROVIDER_LABEL);
    String label;
    if (jsonLabel == null) {
      label = name;
    } else {
      label = jsonLabel.getString();
    }

    return submitWDTModelDataProviderInfo(
      pm, name, label, resourceContext, modelStream, propLists, isJson);
  }

  @POST
  @Consumes(MediaType.APPLICATION_JSON)
  @Produces(MediaType.APPLICATION_JSON)
  @Path("/" + WDTCompositeDataProviderImpl.TYPE_NAME)
  public Response submitProviderInfoWDTCompositeModels(
    @Context ResourceContext resourceContext,
    JsonObject data
  ) {
    LOGGER.fine("POST provider");

    ProviderManager pm = ProviderManager.getFromContext(resourceContext);
    // Check that all expected data is passed with the request
    if (data == null) {
      LOGGER.fine("POST create bad request: no data");
      return Response.status(
        Status.BAD_REQUEST.getStatusCode(), "Missing Request Content").build();
    }
    JsonString jname = data.getJsonString(PROVIDER_NAME);
    if (jname == null) {
      LOGGER.fine("POST create bad request: no name");
      return Response.status(
        Status.BAD_REQUEST.getStatusCode(), "Missing Name").build();
    }
    String name = jname.getString();
    JsonString jsonLabel = data.getJsonString(PROVIDER_LABEL);
    String label;
    if (jsonLabel == null) {
      label = name;
    } else {
      label = jsonLabel.getString();
    }

    return submitWDTCompositeDataProviderInfo(pm, name, label, resourceContext, data);
  }

  @POST
  @Consumes(MediaType.MULTIPART_FORM_DATA)
  @Produces(MediaType.APPLICATION_JSON)
  @Path("/" + PropertyListDataProviderImpl.TYPE_NAME)
  public Response submitProviderInfoPropertyListDataProviders(
    @Context ResourceContext resourceContext,
    @FormDataParam("data") InputStream dataStream,
    @FormDataParam("properties") InputStream propertiesStream
  ) {
    LOGGER.fine("POST provider");

    ProviderManager pm = ProviderManager.getFromContext(resourceContext);
    JsonObject data = Json.createReader(dataStream).readObject();
    JsonString jname = data.getJsonString(PROVIDER_NAME);
    if (jname == null) {
      LOGGER.fine("POST create bad request: no name");
      return Response.status(
        Status.BAD_REQUEST.getStatusCode(), "Missing Name").build();
    }
    String name = jname.getString();
    JsonString jsonLabel = data.getJsonString(PROVIDER_LABEL);
    String label;
    if (jsonLabel == null) {
      label = name;
    } else {
      label = jsonLabel.getString();
    }

    return submitPropertyListDataProviderInfo(
      pm, name, label, resourceContext, propertiesStream);
  }

  @POST
  @Consumes(MediaType.APPLICATION_JSON)
  @Produces(MediaType.APPLICATION_JSON)
  public Response submitProviderInfoAny(
    @Context ResourceContext resourceContext,
    @HeaderParam(HttpHeaders.AUTHORIZATION) String authorizationHeader,
    JsonObject data
  ) {
    LOGGER.fine("POST provider");

    // Check that all expected data is passed with the request
    if (data == null) {
      LOGGER.fine("POST create bad request: no data");
      return Response.status(
        Status.BAD_REQUEST.getStatusCode(), "Missing Request Content").build();
    }

    if (data.getJsonArray("dataProviders") != null) {
      JsonArray dataProviders = data.getJsonArray("dataProviders");
      for (int i = 0; i < dataProviders.size(); i++) {
        Response resp = createOneAnyProvider(
          resourceContext,
          authorizationHeader,
          dataProviders.getJsonObject(i)
        );
        if (resp.getStatus() != Response.Status.CREATED.getStatusCode()) {
          return resp;
        }
      }
      return Response.status(Status.CREATED)
        .entity(Json.createObjectBuilder().build())
        .type(MediaType.APPLICATION_JSON)
        .build();
    }
    return createOneAnyProvider(resourceContext,authorizationHeader, data);
  }

  private Response createOneAnyProvider(
    @Context ResourceContext resourceContext,
    @HeaderParam(HttpHeaders.AUTHORIZATION) String authorizationHeader,
    JsonObject data
  ) {
    ProviderManager pm = ProviderManager.getFromContext(resourceContext);
    JsonString jname = data.getJsonString(PROVIDER_NAME);
    if (jname == null) {
      LOGGER.fine("POST create bad request: no name");
      return Response.status(
        Status.BAD_REQUEST.getStatusCode(), "Missing Name").build();
    }
    String name = jname.getString();

    JsonString jsonLabel = data.getJsonString(PROVIDER_LABEL);
    String label;
    if (jsonLabel == null) {
      label = name;
    } else {
      label = jsonLabel.getString();
    }

    JsonString jtype = data.getJsonString(PROVIDER_TYPE);
    if (jtype == null) {
      LOGGER.fine("POST create bad request: no type");
      return Response.status(
        Status.BAD_REQUEST.getStatusCode(), "Missing Type").build();
    }
    if (jtype.getString().equals(AdminServerDataProviderImpl.TYPE_NAME)) {
      return submitAdminServerDataProviderInfo(
        pm, name, label, resourceContext, authorizationHeader, data);
    }
    if (jtype.getString().equals(WDTModelDataProviderImpl.TYPE_NAME)) {
      return submitWDTModelDataProviderInfo(pm, name, label, resourceContext, data);
    }
    if (jtype.getString().equals(WDTCompositeDataProviderImpl.TYPE_NAME)) {
      return submitWDTCompositeDataProviderInfo(pm, name, label, resourceContext, data);
    }
    if (jtype.getString().equals(PropertyListDataProviderImpl.TYPE_NAME)) {
      return submitPropertyListDataProviderInfo(pm, name, label, resourceContext, data);
    }
    LOGGER.fine("POST create bad request: bad type");
    return Response.status(Status.BAD_REQUEST.getStatusCode(),
      "Unknown Data Provider Type " + jtype.getString() + " for " + name).build();
  }

  private static Response submitAdminServerDataProviderInfo(
    ProviderManager pm,
    String name,
    String label,
    ResourceContext resourceContext,
    String authorizationHeader,
    JsonObject data
  ) {
    if (reservedNames.contains(name)) {
      LOGGER.fine("POST create reserved name: " + name);
      return Response.status(
        Status.BAD_REQUEST.getStatusCode(), "Reserved name").build();
    }
    JsonString jurl = data.getJsonString(DOMAIN_URL);
    if (jurl == null) {
      LOGGER.fine("POST create bad request");
      return Response.status(
        Status.BAD_REQUEST.getStatusCode(), "Missing URL").build();
    }
    // The provider SSO setting will ignore the authorization header
    String url = jurl.getString();
    boolean sso = getSsoAdminServerDataProviderSetting(data);
    if (StringUtils.isEmpty(url) || (!sso && StringUtils.isEmpty(authorizationHeader))) {
      LOGGER.fine("POST create bad request");
      return Response.status(Status.BAD_REQUEST.getStatusCode(),
        "Missing Admin Server Data Provider Content").build();
    }
    boolean local = getDirectAdminServerDataProviderSetting(data);
    // Now obtain the domain URL and try connecting to the domain with the
    // supplied credentials
    LOGGER.fine("POST data: " + data.toString());
    InvocationContext ic = WebAppUtils.getInvocationContextFromResourceContext(resourceContext);
    updateAdminServerDataProvider(
      pm.createAdminServerDataProvider(name, label, url, authorizationHeader, sso, local),
      data
    );
    pm.save(ic);
    return
      WebAppUtils.addCookieFromContext(
        resourceContext,
        Response.status(Status.CREATED).entity(pm.getJSON(name, ic)).type(MediaType.APPLICATION_JSON)
      ).build();
  }

  private static boolean getSsoAdminServerDataProviderSetting(JsonObject data) {
    JsonObject bag = data.getJsonObject(PROVIDER_SETTINGS);
    if ((bag != null) && (bag != JsonValue.NULL)) {
      JsonValue sso = bag.get(PROVIDER_SSO);
      if ((sso != null) && (sso != JsonValue.NULL) && bag.getBoolean(PROVIDER_SSO)) {
        return true;
      }
    }
    return false;
  }

  private static boolean getDirectAdminServerDataProviderSetting(JsonObject data) {
    JsonObject bag = data.getJsonObject(PROVIDER_SETTINGS);
    if ((bag != null) && (bag != JsonValue.NULL)) {
      JsonValue localJSON = bag.get(PROVIDER_LOCAL);
      if ((localJSON != null) && (localJSON != JsonValue.NULL) && bag.getBoolean(PROVIDER_LOCAL)) {
        return true;
      }
    }
    return false;
  }

  private static void updateAdminServerDataProvider(
    AdminServerDataProvider provider,
    JsonObject data
  ) {
    // Check if any settings are provided for the connection
    JsonObject bag = data.getJsonObject(PROVIDER_SETTINGS);
    if ((bag == null) || (bag == JsonValue.NULL)) {
      LOGGER.finest("No supplied AdminServerConnection settings!");
      return;
    }

    // Check for insecure connection setting
    JsonValue insecure = bag.get(PROVIDER_INSECURE);
    if ((insecure != null) && (insecure != JsonValue.NULL) && bag.getBoolean(PROVIDER_INSECURE)) {
      provider.setInsecureConnection(true);
    }

    JsonValue proxyOverride = bag.get(PROXY_OVERRIDE);
    if ((proxyOverride != null) && (proxyOverride != JsonValue.NULL)) {
      provider.setProxyOverride(bag.getString(PROXY_OVERRIDE));
    }
  }

  private static Response submitWDTModelDataProviderInfo(
    ProviderManager pm,
    String name,
    String label,
    ResourceContext resourceContext,
    JsonObject data
  ) {
    // Check if a property list has been specified
    List<String> propLists = null;
    JsonArray jprops = data.getJsonArray(PROPERTY_LISTS);
    if ((jprops != null) && !jprops.isEmpty()) {
      LOGGER.fine("POST specified property list providers");
      propLists = new ArrayList<>(jprops.size());
      for (int i = 0; i < jprops.size(); i++) {
        propLists.add(jprops.getString(i));
      }
    }

    JsonString jmodel = data.getJsonString(WDT_MODEL);
    if ((jmodel == null) || (jmodel == JsonValue.NULL)) {
      // IFF the property list is specified and the model provider exists just update the provider
      if ((propLists != null) && pm.hasProvider(name, WDTModelDataProviderImpl.TYPE_NAME)) {
        return updateWDTModelDataProviderInfo(pm, name, resourceContext, propLists);
      }
      // Otherwise this is a bad request to create the provider
      LOGGER.fine("POST create bad request: no model");
      return WebAppUtils.addCookieFromContext(resourceContext,
        Response.status(Status.BAD_REQUEST.getStatusCode(), "No Model")).build();
    }

    // Convert the posted JSON data to a stream like that of the form data
    try (ByteArrayInputStream is = new ByteArrayInputStream(jmodel.getString().getBytes())) {
      return submitWDTModelDataProviderInfo(
        pm, name, label, resourceContext, is, propLists, false);
    } catch (IOException ioe) {
      LOGGER.fine("POST create bad request: bad model - " + ioe.toString());
      return Response.status(
        Status.BAD_REQUEST.getStatusCode(), "Bad Model").build();
    }
  }

  private static Response submitWDTModelDataProviderInfo(
    ProviderManager pm,
    String name,
    String label,
    ResourceContext resourceContext,
    InputStream modelStream,
    List<String> propLists,
    boolean isJson
  ) {
    if (reservedNames.contains(name)) {
      LOGGER.fine("POST create reserved name: " + name);
      return Response.status(
        Status.BAD_REQUEST.getStatusCode(), "Reserved name").build();
    }
    InvocationContext ic = WebAppUtils.getInvocationContextFromResourceContext(resourceContext);
    WDTModelDataProvider provider = pm.createWDTModelDataProvider(name, label);
    provider.parseModel(modelStream, isJson, ic);
    if (propLists != null) {
      provider.setPropertyListProviders(propLists, pm);
    }
    pm.save(ic);
    return WebAppUtils.addCookieFromContext(
      resourceContext,
      Response.status(Status.CREATED)
        .entity(pm.getJSON(name, ic))
        .type(MediaType.APPLICATION_JSON)
    ).build();
  }

  private static Response updateWDTModelDataProviderInfo(
    ProviderManager pm,
    String name,
    ResourceContext resourceContext,
    List<String> propLists
  ) {
    InvocationContext ic = WebAppUtils.getInvocationContextFromResourceContext(resourceContext);
    WDTModelDataProvider provider = (WDTModelDataProvider)
      pm.getProvider(name, WDTModelDataProviderImpl.TYPE_NAME);
    provider.setPropertyListProviders(propLists, pm);
    return WebAppUtils.addCookieFromContext(
      resourceContext,
      Response.status(Status.OK)
        .entity(pm.getJSON(name, ic))
        .type(MediaType.APPLICATION_JSON)
    ).build();
  }

  private static Response submitPropertyListDataProviderInfo(
    ProviderManager pm,
    String name,
    String label,
    ResourceContext resourceContext,
    JsonObject data
  ) {
    JsonString properties = data.getJsonString(PROPERTIES);
    if ((properties == null) || (properties == JsonValue.NULL)) {
      LOGGER.fine("POST create bad request: no properties");
      return WebAppUtils.addCookieFromContext(resourceContext,
        Response.status(Status.BAD_REQUEST.getStatusCode(), "No Properties")).build();
    }

    // Convert the posted JSON data to a stream like that of the form data
    try (ByteArrayInputStream is = new ByteArrayInputStream(properties.getString().getBytes())) {
      return submitPropertyListDataProviderInfo(pm, name, label, resourceContext, is);
    } catch (IOException ioe) {
      LOGGER.fine("POST create bad request: bad properties - " + ioe.toString());
      return Response.status(
        Status.BAD_REQUEST.getStatusCode(), "Bad Properties").build();
    }
  }

  private static Response submitPropertyListDataProviderInfo(
    ProviderManager pm,
    String name,
    String label,
    ResourceContext resourceContext,
    InputStream propertiesStream
  ) {
    if (reservedNames.contains(name)) {
      LOGGER.fine("POST create reserved name: " + name);
      return Response.status(
        Status.BAD_REQUEST.getStatusCode(), "Reserved name").build();
    }
    InvocationContext ic = WebAppUtils.getInvocationContextFromResourceContext(resourceContext);
    pm.createPropertyListDataProvider(name, label).parse(propertiesStream, ic);
    pm.save(ic);
    return WebAppUtils.addCookieFromContext(
      resourceContext,
      Response.status(Status.CREATED)
        .entity(pm.getJSON(name, ic))
        .type(MediaType.APPLICATION_JSON)
    ).build();
  }

  private static Response submitWDTCompositeDataProviderInfo(
    ProviderManager pm,
    String name,
    String label,
    ResourceContext resourceContext,
    JsonObject data
  ) {
    if (reservedNames.contains(name)) {
      LOGGER.fine("POST create reserved name: " + name);
      return Response.status(
        Status.BAD_REQUEST.getStatusCode(), "Reserved name").build();
    }
    JsonArray jmodels = data.getJsonArray(WDT_MODELS);
    if ((jmodels == null) || jmodels.isEmpty()) {
      LOGGER.fine("POST create bad request");
      return Response.status(
        Status.BAD_REQUEST.getStatusCode(), "Missing model names").build();
    }
    List<String> models = new ArrayList<>(jmodels.size());
    for (int i = 0; i < jmodels.size(); i++) {
      String model = jmodels.getString(i);
      if (!pm.hasProvider(model, WDTModelDataProviderImpl.TYPE_NAME)) {
        LOGGER.fine("POST create bad request - not found: " + model);
        return Response.status(
          Status.BAD_REQUEST.getStatusCode(), "Model not found").build();
      }
      models.add(model);
    }
    InvocationContext ic = WebAppUtils.getInvocationContextFromResourceContext(resourceContext);
    pm.createWDTCompositeDataProvider(name, label, models).checkModels(ic);
    pm.save(ic);
    return
      WebAppUtils.addCookieFromContext(
        resourceContext,
        Response.status(Status.CREATED)
          .entity(pm.getJSON(name, ic))
          .type(MediaType.APPLICATION_JSON)
      ).build();
  }

  @DELETE
  @Path("/{pathSegments: .+}")
  public Response deleteProvider(
    @Context ResourceContext resourceContext,
    @PathParam("pathSegments") List<PathSegment> pathSegments
  ) {
    int nameIndex = 0;
    String first = pathSegments.get(0).getPath();
    String typeConstraint = null;
    String nameConstraint = null;
    if (first.equals(AdminServerDataProviderImpl.TYPE_NAME)
      || first.equals(WDTModelDataProviderImpl.TYPE_NAME)
      || first.equals(WDTCompositeDataProviderImpl.TYPE_NAME)
      || first.equals(PropertyListDataProviderImpl.TYPE_NAME)) {
      typeConstraint = first;
      nameIndex++;
    }
    if (pathSegments.size() <= nameIndex) {
      return WebAppUtils.addCookieFromContext(
        resourceContext,
        Response.status(Status.BAD_REQUEST.getStatusCode(), "Need name")
      ).build();
    }
    nameConstraint = pathSegments.get(nameIndex).getPath();
    ProviderManager pm = ProviderManager.getFromContext(resourceContext);
    for (Provider prov : pm.getAll()) {
      if ((typeConstraint != null) && !prov.getType().equals(typeConstraint)) {
        continue;
      }
      if ((nameConstraint != null) && !prov.getName().equals(nameConstraint)) {
        continue;
      }
      pm.deleteProvider(prov.getName());
      InvocationContext ic = WebAppUtils.getInvocationContextFromResourceContext(resourceContext);
      pm.save(ic);
      return WebAppUtils.addCookieFromContext(
        resourceContext,
        Response.ok()
          .entity(Json.createObjectBuilder().build())
          .type(MediaType.APPLICATION_JSON)
      ).build();
    }
    return
      WebAppUtils.addCookieFromContext(
        resourceContext,
        Response.status(Status.BAD_REQUEST.getStatusCode(), "No such provider")
      ).build();
  }
}
