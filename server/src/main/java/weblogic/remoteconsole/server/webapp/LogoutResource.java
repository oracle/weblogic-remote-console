// Copyright (c) 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.webapp;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.GET;
import javax.ws.rs.Produces;
import javax.ws.rs.container.ResourceContext;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

public class LogoutResource {
  private static LogoutHandler logoutHandler;

  @GET
  @Produces(MediaType.APPLICATION_JSON)
  public Response logout(
    @Context ResourceContext context,
    @Context HttpServletRequest request
  ) {
    if (logoutHandler == null) {
      return Response.status(
        Status.NOT_FOUND.getStatusCode(), "Not supported").build();
    }
    return logoutHandler.handle(context, request);
  }

  public static void setLogoutHandler(LogoutHandler logoutHandlerParam) {
    logoutHandler = logoutHandlerParam;
  }

  public interface LogoutHandler {
    public Response handle(
      ResourceContext context,
      HttpServletRequest request
    );
  }
}
