// Copyright (c) 2022, 2025, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.filter;

import java.io.IOException;
import java.util.List;
import java.util.UUID;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.HttpMethod;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerRequestFilter;
import javax.ws.rs.container.PreMatching;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Cookie;
import javax.ws.rs.core.PathSegment;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import javax.ws.rs.ext.Provider;

import weblogic.remoteconsole.common.utils.UrlUtils;
import weblogic.remoteconsole.server.providers.ProjectManager;
import weblogic.remoteconsole.server.providers.ProjectManager.Project;
import weblogic.remoteconsole.server.repo.Frontend;
import weblogic.remoteconsole.server.repo.FrontendManager;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.token.SsoTokenManager;
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
  @Context
  private HttpServletRequest requestServletContext;
  private static boolean inputOutputTrace =
    (System.getenv("BACKEND_FRONTEND_INPUT_OUTPUT_TRACE") != null);
  private static final Logger LOGGER = Logger.getLogger(SessionFilter.class.getName());

  @Override
  public void filter(ContainerRequestContext reqContext) throws IOException {
    if (inputOutputTrace) {
      LOGGER.info("Entering SessionFilter "
        + reqContext.getRequest().toString()
        + " with " + reqContext.getUriInfo().getRequestUri());
    }

    List<PathSegment> segs = reqContext.getUriInfo().getPathSegments(false);

    // Determine if FINE log level is enabled to avoid logger overhead
    // as the SessionFilter is used for all Console Backend requests
    if (LOGGER.isLoggable(Level.FINE)) {
      LOGGER.fine(
        "Request"
        + " uri="
        + reqContext.getUriInfo().getRequestUri()
        + " method="
        + reqContext.getMethod()
        + " cookies="
        + reqContext.getCookies()
        + " headers="
        + reqContext.getHeaders()
        + " and UserPrincipal of "
        + reqContext.getSecurityContext().getUserPrincipal()
      );
    }

    // Check if this request is for the JAX-RS resources in the Console Backend
    if ((segs.size() == 0) || !segs.get(0).getPath().equals(UriUtils.API_URI)) {
      LOGGER.fine("Ignoring request NOT for Console Backend JAX-RS resource!");
      return;
    }

    // Skip session id handling for the SSO token endpoint
    if ((segs.size() > 1) && segs.get(1).getPath().equals(RemoteConsoleResource.SSO_TOKEN_PATH)) {
      LOGGER.fine("Setup SsoTokenManager for request!");
      SsoTokenManager.setInRequestContext(reqContext);
      return;
    }

    // HTTP OPTIONS is ignored for the session handling of other resources
    if (reqContext.getMethod().equals(HttpMethod.OPTIONS)) {
      LOGGER.finest("Ignoring OPTIONS request for session handling!");
      return;
    }

    Frontend frontend = null;
    String windowId = reqContext.getHeaderString("Unique-Id");
    if (requestServletContext != null) {
      frontend = FrontendManager.find(requestServletContext.getSession().getId(), windowId);
      if (frontend == null) {
        frontend = FrontendManager.create(requestServletContext.getSession().getId(), windowId);
        LOGGER.fine("Creating a new frontend, using the session context: " + frontend);
      } else {
        LOGGER.fine("Using request servlet context to use frontend: " + frontend);
      }
    } else {
      // Look for the session id and setup the request context property
      Cookie sessionId = reqContext.getCookies().get(WebAppUtils.CONSOLE_BACKEND_COOKIE);
      if (sessionId == null) {
        String header = reqContext.getHeaderString("X-Session-Token");
        if (header != null) {
          LOGGER.fine("The backend cookie was not present, but the X-Session-Token: "
            + header + " was");
          sessionId = new Cookie("whocares", header);
        }
      }
      if (sessionId == null) {
        // Create frontend instance
        LOGGER.fine("Creating a new frontend, because the session id is null");
        frontend = FrontendManager.create(UUID.randomUUID().toString(), windowId);
        WebAppUtils.storeCookieInContext(reqContext, frontend);
      } else {
        frontend = FrontendManager.find(sessionId.getValue(), windowId);
        if (frontend == null) {
          LOGGER.fine("Creating a new frontend, because we can't find the sessionId/windowId combo");
          // We have a session ID and we're going to assume it is legit (no
          // reason not to) but couldn't find the sessionId/windowId combo.
          // We'll make a new frontend using the combo
          frontend = FrontendManager.create(sessionId.getValue(), windowId);
        }
      }
    }
    frontend.storeInRequestContext(reqContext);
    frontend.setLastRequestTime();
    InvocationContext ic = new InvocationContext();
    ic.setFrontend(frontend);
    WebAppUtils.storeInvocationContextInRequestContext(reqContext, ic);
    ic.setLocales(reqContext.getAcceptableLanguages());
    ic.setUriInfo(reqContext.getUriInfo());
    if (reqContext.getSecurityContext().getUserPrincipal() != null) {
      ic.setUser(reqContext.getSecurityContext().getUserPrincipal().getName());
    }
    frontend.initIfNeeded(ic);
    if (isProviderBasedPath(reqContext)) {
      setupConnectionAndRewriteURL(reqContext, frontend, ic);
    }
  }

  private static boolean isProviderBasedPath(ContainerRequestContext reqContext) {
    List<PathSegment> segs = reqContext.getUriInfo().getPathSegments(false);
    // Must be at least three segments "/api/provider/<something>"
    if (segs.size() < 3) {
      return false;
    }
    if (RemoteConsoleResource.isReserved(segs.get(1).getPath())) {
      return false;
    }
    return true;
  }

  // We know from test above that the path includes a provider (i.e. has two
  // segments at least
  private static void setupConnectionAndRewriteURL(
    ContainerRequestContext reqContext,
    Frontend frontend,
    InvocationContext ic
  ) {
    // Do not decode the path segments or else the segment will be screwed up
    // when putting it back together
    List<PathSegment> segs = reqContext.getUriInfo().getPathSegments(false);

    String providerName = UrlUtils.urlDecode(segs.get(1).getPath());
    ProjectManager projManager = frontend.getProjectManager();
    weblogic.remoteconsole.server.providers.Provider provider;
    if (providerName.equals("-project-")) {
      // Funny dance here:  "unset provider" is the project management provider
      projManager.unsetCurrentLiveProvider();
      provider = projManager.getCurrentLiveProvider();
    } else if (providerName.equals("-current-")) {
      provider = projManager.getCurrentLiveProvider();
    } else {
      Project proj = projManager.getCurrentProject();
      if (!proj.getNames().contains(providerName)) {
        reqContext.abortWith(Response.status(Status.FORBIDDEN).build());
        LOGGER.fine(
          "Aborted Console Backend request due to bad provider: "
            + providerName + " with frontend: " + frontend.getID());
        return;
      }
      provider = proj.getProvider(providerName).getLiveProvider();
      if (provider == null) {
        proj.getProvider(providerName).start(ic);
        provider = proj.getProvider(providerName).getLiveProvider();
      }
    }
    ic.setProvider(provider);
    provider.start(ic);
    String rootName = UrlUtils.urlDecode(segs.get(2).getPath());
    StringBuilder newPath = new StringBuilder();
    newPath.append(reqContext.getUriInfo().getBaseUri().getPath());
    newPath.append(UriUtils.API_URI + '/');
    // We can do this better, but, for now, the Project Management provider
    // is its own thing and this makes it that
    // if (provider.getRoots() == null) {
    //   rootName = "project";
    // }
    newPath.append(rootName);
    for (PathSegment seg : segs.subList(3, segs.size())) {
      newPath.append("/");
      newPath.append(seg.getPath());
    }
    if (inputOutputTrace) {
      LOGGER.info("Change url from " + reqContext.getUriInfo().getRequestUri()
        + " to " + newPath);
    }
    reqContext.setRequestUri(
      reqContext.getUriInfo().getRequestUriBuilder().replacePath(newPath.toString()).build());
  }
}
