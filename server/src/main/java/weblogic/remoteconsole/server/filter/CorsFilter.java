// Copyright (c) 2020, 2023, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.filter;

import java.io.IOException;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.ws.rs.HttpMethod;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerResponseContext;
import javax.ws.rs.container.ContainerResponseFilter;
import javax.ws.rs.core.Response.Status;
import javax.ws.rs.ext.Provider;

import weblogic.remoteconsole.server.token.SsoTokenManager;

@Provider
public class CorsFilter implements ContainerResponseFilter {
  private static boolean inputOutputTrace =
    (System.getenv("BACKEND_FRONTEND_INPUT_OUTPUT_TRACE") != null);
  private static final Logger LOGGER = Logger.getLogger(CorsFilter.class.getName());
  private static final String ORIGIN_LOCALHOST_8000 = "http://localhost:8000";

  // From https://www.baeldung.com/cors-in-jax-rs
  @Override
  public void filter(ContainerRequestContext req, ContainerResponseContext res) throws IOException {
    List<String> origin = req.getHeaders().get("Origin");
    if ((origin != null) && !origin.isEmpty()) {
      String allowOrigin = origin.get(0);
      if (!ORIGIN_LOCALHOST_8000.equals(allowOrigin)) {
        LOGGER.fine("Origin=" + allowOrigin);
        // Handle CORS headers based on SSO token manager which was
        // established from the session filter for the token endpoint,
        // otherwise, the CORS request is not allowed!
        SsoTokenManager ssoTokenManager = SsoTokenManager.getFromRequestContext(req);
        if ((ssoTokenManager != null) &&  ssoTokenManager.isAllowedOrigin(allowOrigin)) {
          res
            .getHeaders()
            .add("Access-Control-Allow-Origin", allowOrigin);
          res
            .getHeaders()
            .add("Access-Control-Request-Private-Network", "true");
          res
            .getHeaders()
            .add("Access-Control-Allow-Headers", "content-type, accept, origin");
          res
            .getHeaders()
            .add("Access-Control-Allow-Methods", "POST, GET, OPTIONS");

          // Set status for a pre-flight request...
          if (req.getMethod().equals(HttpMethod.OPTIONS)) {
            res.setStatusInfo(Status.OK);
          }
        }
      } else {
        // Allow localhost:8000 - ojet serve
        res
          .getHeaders()
          .add("Access-Control-Allow-Origin", allowOrigin);
        res
          .getHeaders()
          .add("Access-Control-Allow-Credentials", "true");
        res
          .getHeaders()
          .add("Access-Control-Allow-Headers", "origin, content-type, accept, authorization, x-session-token");
        res
          .getHeaders()
          .add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, HEAD");

        if (req.getMethod().equals(HttpMethod.OPTIONS)) {
          res.setStatus(200);
        }
      }
      res
        .getHeaders()
        .add("Access-Control-Expose-Headers", "x-session-token");
      
    }

    // Determine if FINE log level is enabled to avoid logger overhead
    // as the CorsFilter is used for all Console Backend requests
    if (LOGGER.isLoggable(Level.FINE)) {
      LOGGER.fine(
        "Response"
        + " status="
        + res.getStatus()
        + " headers="
        + res.getStringHeaders()
        + " for Request uri="
        + req.getUriInfo().getRequestUri()
        + " method="
        + req.getMethod()
      );
    }

    if (inputOutputTrace) {
      java.util.logging.Logger.getLogger(CorsFilter.class.getName()).info(
        "Exiting CorsFilter "
        + req.getRequest().toString()
        + " with " + req.getUriInfo().getRequestUri());
    }
  }
}
