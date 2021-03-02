// Copyright (c) 2020, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend;

import javax.json.JsonObject;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

public abstract class ResponseHelper {
  public static JsonObject getEntityAsJson(Response response) {
    if (!response.hasEntity()) {
      return null;
    }
    if (!MediaType.APPLICATION_JSON.equals(response.getHeaderString("Content-Type"))) {
      return null;
    }
    try {
      return response.readEntity(JsonObject.class);
    } catch (IllegalStateException ise) {
      // the response was already read and has been cached
      return (JsonObject) response.getEntity();
    }
  }

  public static String getEntityAsString(Response response) {
    if (!response.hasEntity()) {
      return null;
    }
    try {
      return response.readEntity(String.class);
    } catch (IllegalStateException ise) {
      // the response was already read and has been cached
      return response.getEntity().toString();
    }
  }

  public static Response createExceptionResponse(Throwable cause) {
    return createExceptionResponse(cause, null);
  }

  public static Response createExceptionResponse(Throwable cause, String text) {
    return
      Response
        .status(Response.Status.INTERNAL_SERVER_ERROR)
        .entity(JavaxJsonUtils.throwableAsMessagesJsonObject(cause, text, null))
        .build();
  }

  public static Response createNotOkResponse(String text, Response.Status status) {
    return createNotOkResponse(Response.status(status).build(), text);
  }

  public static Response createNotOkResponse(Response response) {
    return createNotOkResponse(response, response.getStatusInfo().getReasonPhrase());
  }

  public static Response createNotOkResponse(Response response, String text) {
    return
      Response
        .status(response.getStatus())
        .entity(JavaxJsonUtils.throwableAsMessagesJsonObject(null, text, null))
        .build();
  }

  public static Response createIncompatibleModeResponse() {
    return
      Response.status(Response.Status.BAD_REQUEST)
      .entity(
        JavaxJsonUtils.textAsMessagesJsonObject(
          "Operation requires console backend to be running in ONLINE mode. Specify"
          + " -Dweblogic.username=<admin-user>, -Dweblogic.password=<admin-password> and"
          + " -Dweblogic.adminUrl=<admin-url> when starting console backend, to run in"
          + " ONLINE mode.",
          Message.Severity.WARNING
        )
      )
      .build();
  }
}
