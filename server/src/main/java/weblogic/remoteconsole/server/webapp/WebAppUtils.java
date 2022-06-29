// Copyright (c) 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.webapp;

import java.util.Date;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ResourceContext;
import javax.ws.rs.core.Cookie;
import javax.ws.rs.core.NewCookie;
import javax.ws.rs.core.Response;

import weblogic.remoteconsole.server.repo.Frontend;
import weblogic.remoteconsole.server.repo.InvocationContext;

public class WebAppUtils {
  public static final String CONSOLE_BACKEND_COOKIE = "WebLogicRemoteConsoleSessionID";
  public static final String CONSOLE_BACKEND_COOKIE_PATH = "/" + UriUtils.API_URI;
  private static boolean useTokenNotCookie;

  public static InvocationContext getInvocationContextFromResourceContext(
    ResourceContext resourceContext
  ) {
    ContainerRequestContext requestContext =
      resourceContext.getResource(ContainerRequestContext.class);
    return (requestContext != null)
      ? getInvocationContextFromRequestContext(requestContext)
      : null;
  }
  
  public static void setUseTokenNotCookie() {
    useTokenNotCookie = true;
  }

  public static InvocationContext getInvocationContextFromRequestContext(
    ContainerRequestContext requestContext
  ) {
    return (InvocationContext) requestContext.getProperty(InvocationContext.class.getName());
  }

  public static void storeInvocationContextInRequestContext(
    ContainerRequestContext requestContext,
    InvocationContext ic
  ) {
    requestContext.setProperty(InvocationContext.class.getName(), ic);
  }

  public static Response.ResponseBuilder addCookieFromContext(
    ResourceContext context,
    Response.ResponseBuilder response
  ) {
    ContainerRequestContext requestContext =
      context.getResource(ContainerRequestContext.class);
    return addCookieFromRequestContext(requestContext, response);
  }

  public static Response.ResponseBuilder addCookieFromRequestContext(
    ContainerRequestContext requestContext,
    Response.ResponseBuilder response
  ) {
    // The session filter puts a new cookie in the ContainerRequestContext if
    // there is a new one
    NewCookie cookie =
      (NewCookie) requestContext.getProperty(NewCookie.class.getName());
    if (cookie != null) {
      if (useTokenNotCookie) {
        response.header("X-Session-Token", cookie.toCookie().getValue());
      } else {
        response.cookie(cookie);
      }
    }
    return response;
  }

  public static void storeCookieInContext(
    ContainerRequestContext requestContext,
    Frontend frontend
  ) {
    Date expiry = null;
    int maxAge = NewCookie.DEFAULT_MAX_AGE;
    boolean secure = requestContext.getSecurityContext().isSecure();

    String value = frontend.getID();

    // Check if the SameSite Cookie attribute is specified
    if (frontend.isSameSiteCookieEnabled()) {
      value = value + ";SameSite=" + frontend.getValueSameSiteCookie();
    }

    // Create the new Cookie with the parameters
    requestContext.setProperty(NewCookie.class.getName(),
      new NewCookie(
        CONSOLE_BACKEND_COOKIE,
        value,
        CONSOLE_BACKEND_COOKIE_PATH,
        null,
        Cookie.DEFAULT_VERSION,
        null,
        maxAge,
        expiry,
        secure,
        true
      )
    );
  }
}
