// Copyright (c) 2022, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.filter;

import java.io.IOException;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerRequestFilter;
import javax.ws.rs.container.PreMatching;
import javax.ws.rs.core.Cookie;
import javax.ws.rs.core.PathSegment;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import javax.ws.rs.ext.Provider;

import weblogic.remoteconsole.common.utils.StringUtils;
import weblogic.remoteconsole.server.providers.ProviderManager;
import weblogic.remoteconsole.server.repo.Frontend;
import weblogic.remoteconsole.server.repo.FrontendManager;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.webapp.RemoteConsoleResource;
import weblogic.remoteconsole.server.webapp.UriUtils;
import weblogic.remoteconsole.server.webapp.WebAppUtils;

/**
 * This filter is used to handle the creation and assignment of sessions
 * (frontends) and the session oriented data, like providers and invocation contexts.
 *
 * The logic is pretty simple:  if the user arrives without a cookie, a new frontend
 * is created and a new cookie is returned to match the new frontend.  If the user
 * arrives with a cookie, it is either valid or not.  If it is not, the request is
 * rejected.  Otherwise, the appropriate frontend is assigned to the request.
 *
 * Where's the security?  Well, the backend has no access to secure data itself, so
 * there's nothing to protect there.  When the user uses the backend to access wLS, they
 * provide their own credentials and that data must be kept from interlopers.
 * That's what this system does.  It makes sure that only by providing the right cookie
 * can one access an existing session.
 *
 * One interesting implementation choice made here was that the filter strips out the
 * provider from normal requests.  So, if one access /provider1/x/y/z, the filter
 * looks up "provider1", sets it up in the InvocationContext and stripts it out of the
 * URL.  The rest of the code just assumes that the request was to the /x/y/z and that
 * the provider was set otherwise.  If "provider1" doesn't exist, the request is
 * rejected.
*/
@Provider
@PreMatching
public class SessionFilter implements ContainerRequestFilter {
  private static boolean inputOutputTrace =
    (System.getenv("BACKEND_FRONTEND_INPUT_OUTPUT_TRACE") != null);
  private static final Logger LOGGER = Logger.getLogger(SessionFilter.class.getName());

  @Override
  public void filter(ContainerRequestContext requestContext) throws IOException {
    if (inputOutputTrace) {
      LOGGER.info("Entering SessionFilter "
        + requestContext.getRequest().toString()
        + " with " + requestContext.getUriInfo().getRequestUri());
    }

    List<PathSegment> segs = requestContext.getUriInfo().getPathSegments(false);

    // Determine if FINE log level is enabled to avoid logger overhead
    // as the SessionFilter is used for all Console Backend requests
    if (LOGGER.isLoggable(Level.FINE)) {
      LOGGER.fine(
        "Request"
        + " uri="
        + requestContext.getUriInfo().getRequestUri()
        + " method="
        + requestContext.getMethod()
        + " cookies="
        + requestContext.getCookies()
        + " headers="
        + requestContext.getHeaders()
      );
    }

    // Check if this request is for the JAX-RS resources in the Console Backend
    if ((segs.size() == 0) || !segs.get(0).getPath().equals(UriUtils.API_URI)) {
      LOGGER.fine("Ignoring request NOT for Console Backend JAX-RS resource!");
      return;
    }

    // Look for the session id and setup the request context property
    Cookie sessionId = requestContext.getCookies().get(WebAppUtils.CONSOLE_BACKEND_COOKIE);
    if (sessionId == null) {
      String header = requestContext.getHeaderString("X-Session-Token");
      if (header != null) {
        sessionId = new Cookie("whocares", header);
      }
    }
    Frontend frontend;
    if (sessionId == null) {
      // Create frontend instance
      LOGGER.fine("Creating a new frontend");
      frontend = FrontendManager.create();
      WebAppUtils.storeCookieInContext(requestContext, frontend);
    } else {
      frontend = FrontendManager.find(sessionId.getValue());
      if (frontend == null) {
        frontend = FrontendManager.create();
        WebAppUtils.storeCookieInContext(requestContext, frontend);
        requestContext.abortWith(
          WebAppUtils.addCookieFromRequestContext(
          requestContext,
          Response.status(Status.FORBIDDEN)
        ).build());
        LOGGER.fine("Aborted Console Backend request due to bad session!");
        return;
      }
    }
    frontend.storeInRequestContext(requestContext);
    frontend.setLastRequestTime();
    InvocationContext ic = new InvocationContext();
    WebAppUtils.storeInvocationContextInRequestContext(requestContext, ic);
    ic.setLocales(requestContext.getAcceptableLanguages());
    ic.setUriInfo(requestContext.getUriInfo());
    if (isProviderBasedPath(requestContext)) {
      setupConnectionAndRewriteURL(requestContext, frontend, ic);
    }
  }

  private static boolean isProviderBasedPath(ContainerRequestContext requestContext) {
    List<PathSegment> segs = requestContext.getUriInfo().getPathSegments(false);
    // Must be at least three segments "/api/provider/<something>
    if (segs.size() < 3) {
      return false;
    }
    if (segs.get(1).getPath().equals(
        RemoteConsoleResource.PROVIDER_MANAGEMENT_PATH)) {
      return false;
    }
    if (segs.get(0).getPath().equals(RemoteConsoleResource.ABOUT_PATH)) {
      return false;
    }
    return true;
  }

  // We know from test above that the path includes a provider (i.e. has two
  // segments at least
  private static void setupConnectionAndRewriteURL(
    ContainerRequestContext requestContext,
    Frontend frontend,
    InvocationContext ic
  ) {
    // Do not decode the path segments or else the segment will be screwed up
    // when putting it back together
    List<PathSegment> segs = requestContext.getUriInfo().getPathSegments(false);

    ProviderManager pm = frontend.getProviderManager();
    // Decode only the provider segment
    String provider = StringUtils.urlDecode(segs.get(1).getPath());
    if (!pm.hasProvider(provider)) {
      requestContext.abortWith(Response.status(Status.FORBIDDEN).build());
      LOGGER.fine(
        "Aborted Console Backend request due to bad provider: " + provider
          + " with frontend: " + frontend.getID());
      return;
    }
    if (!pm.startProvider(provider, ic)) {
      LOGGER.fine("Aborted Console Backend request due to failed provider!");
      requestContext.abortWith(Response.status(Status.FORBIDDEN).build());
      return;
    }
    StringBuilder newPath = new StringBuilder();
    newPath.append("/" + UriUtils.API_URI);
    for (PathSegment seg : segs.subList(2, segs.size())) {
      newPath.append("/");
      newPath.append(seg.getPath());
    }
    requestContext.setRequestUri(
      requestContext.getUriInfo().getRequestUriBuilder().replacePath(newPath.toString()).build());
  }
}
