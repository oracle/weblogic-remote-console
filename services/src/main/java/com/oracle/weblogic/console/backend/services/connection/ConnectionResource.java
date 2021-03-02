// Copyright (c) 2020, 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package com.oracle.weblogic.console.backend.services.connection;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.logging.Logger;
import javax.json.Json;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.POST;
import javax.ws.rs.Produces;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ResourceContext;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Cookie;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.NewCookie;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.ResponseBuilder;
import javax.ws.rs.core.Response.Status;

import com.oracle.weblogic.console.backend.services.ServiceException;
import weblogic.console.backend.ConsoleBackendRuntime;
import weblogic.console.backend.WebLogicProperties;
import weblogic.console.backend.connection.Connection;
import weblogic.console.backend.connection.ConnectionManager;
import weblogic.console.backend.connection.ConnectionManager.ConnectionResponse;
import weblogic.console.backend.filter.ConnectionFilter;
import weblogic.console.backend.utils.StringUtils;

public class ConnectionResource {
  private static final Logger LOGGER = Logger.getLogger(ConnectionResource.class.getName());

  // Names of the JSON values for response data
  private static final String CBE_MODE = "mode";
  private static final String CBE_STATE = "state";
  private static final String USERNAME = "username";
  private static final String DOMAIN_VERSION = "domainVersion";
  private static final String DOMAIN_URL = "domainUrl";
  private static final String DOMAIN_NAME = "domainName";

  // Keys used for handling singleton state status
  private static final String STATUS = "status";
  private static final String CONNECTIONID = "connectionid";
  private static final String MESSAGE = "message";

  // The HTTP headers for the connection request
  @Context HttpHeaders headers;

  @GET
  @Produces(MediaType.APPLICATION_JSON)
  public Response getConnection(@Context ResourceContext context) throws ServiceException {
    ConsoleBackendRuntime.Mode mode = ConsoleBackendRuntime.INSTANCE.getMode();
    ConsoleBackendRuntime.State state = ConsoleBackendRuntime.INSTANCE.getState();
    JsonObjectBuilder reply = null;

    LOGGER.info("GET connection");
    if (mode == ConsoleBackendRuntime.Mode.CREDENTIALS) {
      // When in credentials mode reply is based on current state of the connection
      if (state == ConsoleBackendRuntime.State.CONNECTED) {
        reply = getCurrentCBEConnectionInfo(mode, state);
      } else {
        // Attempt connection again in the same manner as startup with supplied credentials
        LOGGER.info("GET attempt connection again");
        ConsoleBackendRuntime.INSTANCE.attemptConnection();

        // With credentials mode the ConsoleBackendRuntime sets the connection state
        // so check get the state again and return the proper status...
        state = ConsoleBackendRuntime.INSTANCE.getState();
        if (state == ConsoleBackendRuntime.State.CONNECTED) {
          reply = getCurrentCBEConnectionInfo(mode, state);
        } else {
          reply = getCBECredentialsModeInfo();
        }
      }
    } else {
      // When in standalone mode, check for a valid session as this is the Connection ID
      String connectionId = getSessionId(context);
      if (ConsoleBackendRuntime.INSTANCE.getConnectionManager().isValidConnection(connectionId)) {
        LOGGER.info("GET obtained a valid Connection ID: " + connectionId);
        reply = getCBEConnectionInfo(mode, connectionId);
      } else {
        // Invalid session id should always return disconnected state to prevent data leak!
        LOGGER.info("GET anonymous request");
        reply = getAnonymousCBEConnectionInfo();
      }
    }

    // Send reply
    return Response.ok().entity(reply.build()).type(MediaType.APPLICATION_JSON).build();
  }

  @POST
  @Consumes(MediaType.APPLICATION_JSON)
  @Produces(MediaType.APPLICATION_JSON)
  public Response createConnection(
    @Context ResourceContext context,
    @HeaderParam(HttpHeaders.AUTHORIZATION) String authorization,
    JsonObject data
  ) throws ServiceException {
    LOGGER.info("POST connection");

    // Check for standalone mode and return 503 as connections cannot be created
    if (ConsoleBackendRuntime.Mode.STANDALONE != ConsoleBackendRuntime.INSTANCE.getMode()) {
      LOGGER.info("POST connection NOT standalone mode");
      return Response.status(Status.SERVICE_UNAVAILABLE.getStatusCode(), "not standalone mode")
          .build();
    }

    // Check that all expected data is passed with the request
    if (
      (data == null)
        || (data.getJsonString(DOMAIN_URL) == null)
        || StringUtils.isEmpty(data.getString(DOMAIN_URL))
        || StringUtils.isEmpty(authorization)
    ) {
      LOGGER.info("POST connection bad request");
      return Response.status(Status.BAD_REQUEST.getStatusCode(), "Missing Request Content").build();
    }

    // Now obtain the domain URL and try connecting to the domain with the supplied credentials
    LOGGER.info("POST data: " + data.toString());
    String domainUrl = data.getString(DOMAIN_URL);
    Map<String, Object> result = connect(domainUrl, authorization);
    Status status = (Status) result.get(STATUS);
    if (status.getFamily() != Status.Family.SUCCESSFUL) {
      ResponseBuilder response = Response.status(status.getStatusCode(), "Unable to Connect");
      String message = (String) result.get(MESSAGE);
      if (message != null) {
        JsonObject msg = Json.createObjectBuilder().add(MESSAGE, message).build();
        response.entity(msg).type(MediaType.APPLICATION_JSON);
      }
      return response.build();
    }

    // Create the reply based on the successful connection
    String connectionId = String.valueOf(result.get(CONNECTIONID));
    JsonObjectBuilder reply =
      getCBEConnectionInfo(ConsoleBackendRuntime.INSTANCE.getMode(), connectionId);

    // If the user is not an administrator then return a message to display
    ConnectionManager manager = ConsoleBackendRuntime.INSTANCE.getConnectionManager();
    Connection connection = manager.getConnection(connectionId);
    if (connection != null) {
      String message = manager.checkConnectionUserAdministrator(connection, getLocales());
      if (message != null) {
        reply.add(MESSAGE, message);
      }
    }

    // Check if SameSite Cookie attribute is enabled and obtain the value
    String valSameSite = null;
    if (manager.isSameSiteCookieEnabled()) {
      valSameSite = manager.getSameSiteCookieValue();
    }

    // No session timeout at this time
    return
      Response
        .status(Response.Status.CREATED)
        .entity(reply.build())
        .type(MediaType.APPLICATION_JSON)
        .cookie(getCookie(context, connectionId, valSameSite))
        .build();
  }

  @DELETE
  public Response deleteConnection(@Context ResourceContext context) throws ServiceException {
    LOGGER.info("DELETE connection");

    // Check for standalone mode and return 503 as connections cannot be removed
    if (ConsoleBackendRuntime.Mode.STANDALONE != ConsoleBackendRuntime.INSTANCE.getMode()) {
      LOGGER.info("DELETE connection NOT standalone mode");
      return
        Response
          .status(Status.SERVICE_UNAVAILABLE.getStatusCode(), "not standalone mode")
          .build();
    }

    // Obtain the Connection ID
    String connectionId = getSessionId(context);
    LOGGER.info("DELETE Connection ID: " + connectionId);

    // Remove the connection from the Connection Manager when the Connection ID is valid!
    ConnectionManager manager = ConsoleBackendRuntime.INSTANCE.getConnectionManager();
    if (manager.isValidConnection(connectionId)) {
      // Remove the connection
      LOGGER.info("DELETE removing valid Connection ID: " + connectionId);
      manager.removeConnection(connectionId);

      // Disconnect the Console Backend Runtime connection
      disconnect(connectionId);
    }

    // Check if SameSite Cookie attribute is enabled and obrain the value
    String valSameSite = null;
    if (manager.isSameSiteCookieEnabled()) {
      valSameSite = manager.getSameSiteCookieValue();
    }

    // Return a Cookie that clears the existing Session Cookie
    return Response.noContent().cookie(getCookie(context, null, valSameSite)).build();
  }

  /** Clear the Console Backend Runtime singleton connection */
  private void disconnect(String connectionId) {
    Connection current = ConsoleBackendRuntime.INSTANCE.getConnection();
    if ((current != null) && current.getId().equals(connectionId)) {
      ConsoleBackendRuntime.INSTANCE.setConnection(null);
    }
  }

  /**
   * Obtain the connection manager and attempt to make the connection to the WebLogic Domain.
   * <p>
   * When connection is successful, update the singleton Console Backend Runtime connection state
   */
  private Map<String, Object> connect(String domainUrl, String authHeader) {
    Map<String, Object> result = new HashMap<String, Object>();
    ConnectionManager manager = ConsoleBackendRuntime.INSTANCE.getConnectionManager();

    // Obtain the results of the attempt from WebLogic and return when not successful...
    ConnectionResponse response = manager.tryConnection(domainUrl, authHeader, getLocales());
    result.put(STATUS, response.getStatus());
    if (!response.isSuccess()) {
      String message = response.getMessage();
      if (message != null) {
        result.put(MESSAGE, message);
      }
      return result;
    }

    // Get the Connection from the Connection ID
    String connectionId = response.getConnectionId();
    Connection connection = manager.getConnection(connectionId);

    // Clear the current connection and return the new connection.
    // However, IFF the new connection matches the current connection
    // of the Console Backend Runtime, then continue with the current
    // connection as the credentials where validated.
    Connection current = ConsoleBackendRuntime.INSTANCE.getConnection();
    if (current != null) {
      if (isSameConnection(current, connection)) {
        result.put(CONNECTIONID, current.getId());
        manager.removeConnection(connectionId);
        LOGGER.info("Console Backend connection matched new connection: " + connectionId);
        return result;
      }
      manager.removeConnection(current.getId());
    }

    // Establish the singleton connection for the Console Backend
    ConsoleBackendRuntime.INSTANCE.setConnection(connection);
    result.put(CONNECTIONID, connectionId);

    // Done.
    return result;
  }

  /**
   * Determine if two connections are logically the same connection by checking the Username and
   * WebLogic Domain URL values from connections that where returned from the Connection Manager.
   */
  private boolean isSameConnection(Connection curConnection, Connection newConnection) {
    if (
      (newConnection != null)
        && curConnection.getUsername().equalsIgnoreCase(newConnection.getUsername())
        && curConnection.getDomainUrl().equalsIgnoreCase(newConnection.getDomainUrl())
    ) {
      return true;
    }
    return false;
  }

  /**
   * Get the Cookie used for connection response.
   *
   * <p>When the connection id is not supplied, clear the cookie.
   */
  private NewCookie getCookie(ResourceContext context, String connectionId, String valSameSite) {
    // Default Cookie parameters
    String value = connectionId;
    Date expiry = null;
    int maxAge = NewCookie.DEFAULT_MAX_AGE;
    boolean secure = isSecure(context);

    // Check if the Cookie is being cleared and adjust the parameters
    if (StringUtils.isEmpty(connectionId)) {
      value = "";
      maxAge = 0;
      expiry = new Date();
    }

    // Check if the SameSite Cookie attribute is specified
    if (!StringUtils.isEmpty(valSameSite)) {
      value = value + ";SameSite=" + valSameSite;
    }

    // Create thew new Cookie with the parameters
    return new NewCookie(
      ConnectionFilter.CONSOLE_BACKEND_COOKIE,
      value,
      ConnectionFilter.CONSOLE_BACKEND_COOKIE_PATH,
      null,
      Cookie.DEFAULT_VERSION,
      null,
      maxAge,
      expiry,
      secure,
      true
    );
  }

  /** Get the request channel state using the JAX-RS Resource Context */
  private boolean isSecure(ResourceContext context) {
    boolean result = false;

    // Ensure there is a ResourceContext and obtain the ContainerRequestContext
    if (context != null) {
      ContainerRequestContext reqCtx = context.getResource(ContainerRequestContext.class);
      if (reqCtx != null) {
        // Return the state of the request channel
        result = reqCtx.getSecurityContext().isSecure();
      }
    }
    return result;
  }

  /** Get the CBE Session ID using the JAX-RS Resource Context */
  private String getSessionId(ResourceContext context) {
    String result = null;

    // Ensure there is a ResourceContext and obtain the ContainerRequestContext
    if (context != null) {
      ContainerRequestContext reqCtx = context.getResource(ContainerRequestContext.class);
      if (reqCtx != null) {
        // Look for the Session ID set by CBE ConnectionFilter
        Object id = reqCtx.getProperty(ConnectionFilter.CONSOLE_BACKEND_SESSION_ID);
        if (id instanceof String) {
          result = (String) id;
        }
      }
    }
    return result;
  }

  /** Get the reply by ontaining the Connection from the Connection ID */
  private JsonObjectBuilder getCBEConnectionInfo(ConsoleBackendRuntime.Mode mode, String id) {
    JsonObjectBuilder reply = Json.createObjectBuilder().add(CBE_MODE, mode.value);
    addCBEConnectionState(
      reply,
      ConsoleBackendRuntime.INSTANCE.getConnectionManager().getConnection(id)
    );
    return reply;
  }

  /** Get the reply for the specified CBE state */
  private JsonObjectBuilder getCurrentCBEConnectionInfo(
    ConsoleBackendRuntime.Mode mode,
    ConsoleBackendRuntime.State state
  ) {
    JsonObjectBuilder reply = Json.createObjectBuilder().add(CBE_MODE, mode.value);
    if (state != ConsoleBackendRuntime.State.CONNECTED) {
      reply.add(CBE_STATE, state.value);
    } else {
      addCBEConnectionState(reply, ConsoleBackendRuntime.INSTANCE.getConnection());
    }
    return reply;
  }

  /** Update the reply with the infromation from the supplied Connection */
  private void addCBEConnectionState(JsonObjectBuilder reply, Connection connection) {
    if (connection == null) {
      reply.add(CBE_STATE, ConsoleBackendRuntime.State.DISCONNECTED.value);
    } else {
      reply
        .add(CBE_STATE, ConsoleBackendRuntime.State.CONNECTED.value)
        .add(DOMAIN_NAME, connection.getDomainName())
        .add(DOMAIN_URL, connection.getDomainUrl())
        .add(DOMAIN_VERSION, connection.getDomainVersion())
        .add(USERNAME, connection.getUsername());
    }
  }

  /** Get the reply for the CBE disconnected in credentials mode */
  private JsonObjectBuilder getCBECredentialsModeInfo() {
    return
      Json.createObjectBuilder()
        .add(CBE_MODE, ConsoleBackendRuntime.Mode.CREDENTIALS.value)
        .add(CBE_STATE, ConsoleBackendRuntime.State.DISCONNECTED.value)
        .add(
           DOMAIN_URL,
          ConsoleBackendRuntime.INSTANCE.getProperty(
            WebLogicProperties.WEBLOGIC_ADMIN_URL_PROPERTY
          )
        )
        .add(
          USERNAME,
          ConsoleBackendRuntime.INSTANCE.getProperty(
            WebLogicProperties.WEBLOGIC_USERNAME_PROPERTY
          )
        );
  }

  /** Get the reply for an anonymous request in standalone mode */
  private JsonObjectBuilder getAnonymousCBEConnectionInfo() {
    return
      Json.createObjectBuilder()
        .add(CBE_MODE, ConsoleBackendRuntime.Mode.STANDALONE.value)
        .add(CBE_STATE, ConsoleBackendRuntime.State.DISCONNECTED.value);
  }

  /** Get the list of locales from the HTTP headers */
  private List<Locale> getLocales() {
    return ((headers != null) ? headers.getAcceptableLanguages() : null);
  }
}
