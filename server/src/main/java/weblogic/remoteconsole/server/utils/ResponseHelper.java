// Copyright (c) 2020, 2024, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.utils;

import javax.json.JsonObject;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import weblogic.remoteconsole.common.utils.MessageUtils;

public class ResponseHelper {

  private ResponseHelper() {
  }

  public static JsonObject getEntityAsJson(Response response) {
    if (!response.hasEntity()) {
      return null;
    }
    Object entity = response.getEntity();
    if (entity instanceof JsonObject) {
      // The entity has already been read as a json object.
      return (JsonObject)entity;
    }
    if (!MediaType.APPLICATION_JSON.equals(response.getHeaderString("Content-Type"))) {
      return null;
    }
    return response.readEntity(JsonObject.class);
  }

  public static String getEntityAsString(Response response) {
    if (!response.hasEntity()) {
      return null;
    }
    Object entity = response.getEntity();
    if (entity instanceof String) {
      // The response has already been read as a string.
      return (String)entity;
    }
    try {
      return response.readEntity(String.class);
    } catch (IllegalStateException ise) {
      // The response was already read as something other than a string
      // and has been cached.  Convert it to a string.
      return response.getEntity().toString();
    }
  }

  public static Response createExceptionResponse(Throwable cause) {
    return createExceptionResponse(cause, null);
  }

  public static Response createExceptionResponse(Throwable cause, String text) {
    return
      createExceptionResponse(Response.Status.INTERNAL_SERVER_ERROR, cause, text);
  }

  public static Response createExceptionResponse(
    Response.Status status,
    Throwable cause,
    String text
  ) {
    return
      Response
        .status(status)
        .entity(MessageUtils.throwableAsMessagesJsonObject(cause, text))
        .build();
  }
}
