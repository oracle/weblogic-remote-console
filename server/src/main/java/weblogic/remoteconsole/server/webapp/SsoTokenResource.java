// Copyright (c) 2023, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.webapp;

import java.util.logging.Level;
import java.util.logging.Logger;
import javax.json.Json;
import javax.json.JsonNumber;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;
import javax.json.JsonString;
import javax.ws.rs.Consumes;
import javax.ws.rs.DefaultValue;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.container.ResourceContext;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import weblogic.remoteconsole.server.providers.AdminServerDataProvider;
import weblogic.remoteconsole.server.token.SsoTokenManager;

/**
 * This resource is used to support obtaining and using 
 * WebLogic specific tokens and relies on the SsoTokenManager
 * and the AdminServerDataProvider to maintain state.
*/
public class SsoTokenResource extends BaseResource {
  private static final Logger LOGGER = Logger.getLogger(SsoTokenResource.class.getName());
  private static final String SSOID = "ssoid";
  private static final String TOKEN = "token";
  private static final String DOMAIN = "domain";
  private static final String EXPIRES = "expires";

  @GET
  @Produces(MediaType.APPLICATION_JSON)
  public Response getTokenAvailable(
    @QueryParam(SSOID) @DefaultValue("") String ssoid,
    @Context ResourceContext resourceContext
  ) {
    LOGGER.fine("GET token");
    if ((ssoid == null) || ssoid.isBlank()) {
      LOGGER.fine("GET token bad request: ssoid missing");
      return Response.status(Status.BAD_REQUEST).build();
    }

    // Lookup the provider...
    LOGGER.fine("GET token ssoid = " + ssoid);
    SsoTokenManager ssoTokenManager = SsoTokenManager.getFromResourceContext(resourceContext);
    AdminServerDataProvider provider = (ssoTokenManager != null) ? ssoTokenManager.get(ssoid) : null;

    // Check if SSO token ID is not found...
    if (provider == null) {
      LOGGER.fine("GET token unable to find ssoid!");
      return Response.status(Status.NOT_FOUND).build();
    }

    // Otherwise return status of SSO token availability...
    boolean available = provider.isSsoTokenAvailable();
    LOGGER.fine("GET token available state: " + available);
    JsonObjectBuilder result = Json.createObjectBuilder().add(SSOID, ssoid).add("available", available);
    if (available) {
      result.add(EXPIRES, provider.getSsoTokenExpires());
    }
    return Response.ok().entity(result.build()).build();
  }

  @POST
  @Consumes(MediaType.APPLICATION_JSON)
  public Response postToken(
    @Context ResourceContext resourceContext,
    JsonObject data
  ) {
    LOGGER.fine("POST token");
    String ssoid = getSsoId(data);
    if ((ssoid == null) || ssoid.isBlank()) {
      LOGGER.fine("POST token bad request: ssoid missing");
      return Response.status(Status.BAD_REQUEST).build();
    }

    // Lookup the provider...
    LOGGER.fine("POST token ssoid = " + ssoid);
    SsoTokenManager ssoTokenManager = SsoTokenManager.getFromResourceContext(resourceContext);
    AdminServerDataProvider provider = (ssoTokenManager != null) ? ssoTokenManager.get(ssoid) : null;

    // Check if SSO token ID is not found...
    if (provider == null) {
      LOGGER.fine("POST token unable to find ssoid!");
      return Response.status(Status.NOT_FOUND).build();
    }

    // Check for token already posted...
    if (provider.isSsoTokenAvailable()) {
      LOGGER.fine("POST token already available!");
      return Response.status(Status.BAD_REQUEST).build();
    }

    // Set the token on the provider
    if (!setSsoToken(provider, data)) {
      LOGGER.fine("POST token unable to set token!");
      return Response.status(Status.BAD_REQUEST).build();
    }

    // Done.
    return Response.ok().build();
  }

  private boolean setSsoToken(AdminServerDataProvider provider, JsonObject data) {
    boolean result = false;
    try {
      JsonString tokenJson = data.getJsonString(TOKEN);
      JsonString domainJson = data.getJsonString(DOMAIN);
      JsonNumber expiresJson = data.getJsonNumber(EXPIRES);
      result = provider.setSsoToken(
        (tokenJson != null) ? tokenJson.getString() : null,
        (domainJson != null) ? domainJson.getString() : null,
        (expiresJson != null) ? expiresJson.longValueExact() : 0L
      );
    } catch (Exception exc) {
      LOGGER.log(Level.FINE, "Failure setting token: " + exc.toString(), exc);
    }
    return result;
  }

  private String getSsoId(JsonObject data) {
    String result = null;
    try {
      JsonString ssoidJson = (data != null) ? data.getJsonString(SSOID) : null;
      result = (ssoidJson != null) ? ssoidJson.getString() : null;
    } catch (Exception exc) {
      LOGGER.log(Level.FINE, "Failure reading ssoid: " + exc.toString(), exc);
    }
    return result;
  }
}
