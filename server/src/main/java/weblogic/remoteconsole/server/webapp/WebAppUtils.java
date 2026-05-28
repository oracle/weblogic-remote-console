// Copyright (c) 2022, 2026, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.webapp;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.StringReader;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import javax.json.Json;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;
import javax.json.JsonReader;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ResourceContext;
import javax.ws.rs.core.Cookie;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.NewCookie;
import javax.ws.rs.core.Response;

import weblogic.remoteconsole.common.repodef.LocalizedConstants;
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

  public static Response ok(ResourceContext resContext, JsonArrayBuilder builder) {
    return WebAppUtils.addCookieFromContext(resContext,
      Response.ok(builder.build(), MediaType.APPLICATION_JSON)).build();
  }

  public static Response ok(ResourceContext resContext, JsonObjectBuilder builder) {
    builder.add("statusData", Json.createObjectBuilder()
      .add("shoppingCart", Json.createObjectBuilder()
        .add("link", "linky")
        .add("state", "full")
        .add("version", "" + (new Date().getTime()))));
    return WebAppUtils.addCookieFromContext(resContext,
      Response.ok(builder.build(), MediaType.APPLICATION_JSON)).build();
  }

  public static Response ok(ResourceContext resContext, JsonObject object) {
    return ok(resContext, Json.createObjectBuilder(object));
  }

  public static JsonObject readJsonObject(InputStream inputStream, InvocationContext ic) {
    try (JsonReader reader = Json.createReader(new StringReader(readEntity(inputStream)))) {
      return reader.readObject();
    } catch (Exception e) {
      throw new FailedRequestException(
        ic.getLocalizer().localizeString(LocalizedConstants.REQUEST_POORLY_FORMED_MESSAGE),
        e
      );
    }
  }

  public static void drainEntityStream(InputStream inputStream, InvocationContext ic) {
    try {
      byte[] buffer = new byte[4096];
      while (inputStream.read(buffer) != -1) {
        // Drain the request entity before responding to keep Helidon from closing the connection.
      }
    } catch (IOException e) {
      throw new FailedRequestException(
        ic.getLocalizer().localizeString(LocalizedConstants.REQUEST_POORLY_FORMED_MESSAGE),
        e
      );
    }
  }

  private static String readEntity(InputStream inputStream) throws IOException {
    ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
    byte[] buffer = new byte[4096];
    int bytesRead;
    while ((bytesRead = inputStream.read(buffer)) != -1) {
      outputStream.write(buffer, 0, bytesRead);
    }
    return outputStream.toString(StandardCharsets.UTF_8);
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
