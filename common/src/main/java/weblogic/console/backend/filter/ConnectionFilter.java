// Copyright (c) 2020, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.filter;

import java.io.IOException;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerRequestFilter;
import javax.ws.rs.container.PreMatching;
import javax.ws.rs.core.Cookie;
import javax.ws.rs.core.Response;
import javax.ws.rs.ext.Provider;

import weblogic.console.backend.ConsoleBackendRuntime;

@Provider
@PreMatching
public class ConnectionFilter implements ContainerRequestFilter {
  private static final Logger LOGGER = Logger.getLogger(ConnectionFilter.class.getName());

  /** The JAX-RS resource paths to enable about and connection endpoints */
  private static final String API_RESOURCE = "api";

  private static final String API_ABOUT_RESOURCE = API_RESOURCE + "/about";
  private static final String API_CONNECTION_RESOURCE = API_RESOURCE + "/connection";

  /** The Cookie name and path used by the Console Backend */
  public static final String CONSOLE_BACKEND_COOKIE = "WLSRemoteConsoleSessionID";

  public static final String CONSOLE_BACKEND_COOKIE_PATH = "/api";

  /** The property name for the Console Backend session id in the ContainerRequestContext */
  public static final String CONSOLE_BACKEND_SESSION_ID = "wls.console.backend.session";

  @Override
  public void filter(ContainerRequestContext reqCtx) throws IOException {

    // Determine if FINE log level is enabled to avoid logger overhead
    // as the ConnectionFilter is used for all Console Backend requests
    if (LOGGER.isLoggable(Level.FINE)) {
      LOGGER.fine(
        "Request"
        + "\npath="
        + reqCtx.getUriInfo().getPath()
        + "\nmethod="
        + reqCtx.getMethod()
        + "\ncookies="
        + reqCtx.getCookies()
        + "\nheaders="
        + reqCtx.getHeaders()
      );
    }

    // The filter handling only applies when Console Backend is in standalone mode
    if (ConsoleBackendRuntime.Mode.STANDALONE == ConsoleBackendRuntime.INSTANCE.getMode()) {
      String connectionId = null;

      // Check if this request is for the JAX-RS resources in the Console Backend
      String path = reqCtx.getUriInfo().getPath();
      if (!path.startsWith(API_RESOURCE)) {
        LOGGER.fine("Request NOT for Console Backend JAX-RS resource!");
        return;
      }

      // Look for the session id and setup the request context property
      Cookie sessionId = reqCtx.getCookies().get(CONSOLE_BACKEND_COOKIE);
      if (sessionId != null) {
        String id = sessionId.getValue();
        reqCtx.setProperty(CONSOLE_BACKEND_SESSION_ID, id);

        // Console Backend Session ID maps to the Connection ID
        connectionId = id;
        LOGGER.fine("Request using Console Backend Session ID: " + id);
      }

      // Check if this request is for the connection or about endpoint which is allowed without a
      // valid session
      if (path.startsWith(API_CONNECTION_RESOURCE) || path.equals(API_ABOUT_RESOURCE)) {
        LOGGER.fine("Request for connection or about endpoint allowed!");
        return;
      }

      // Allow valid connection to continue...
      if (isValidConnection(connectionId)) {
        LOGGER.fine("Request for Console Backend JAX-RS resource using a valid session!");
        return;
      }

      // Abort the request since a valid session was not supplied!
      reqCtx.abortWith(Response.status(Response.Status.FORBIDDEN).build());
      LOGGER.fine("Aborted Console Backend request due to an invalid session!");
    }
  }

  /** Determine if the supplied Connection ID is valid by using the Connection Manager */
  private boolean isValidConnection(String connectionId) {
    return ConsoleBackendRuntime.INSTANCE.getConnectionManager().isValidConnection(connectionId);
  }
}
