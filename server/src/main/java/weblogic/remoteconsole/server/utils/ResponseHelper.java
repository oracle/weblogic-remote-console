// Copyright (c) 2020, 2021, Oracle Corporation and/or its affiliates.
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
    try {
      if (!response.hasEntity()) {
        return null;
      }
      if (!MediaType.APPLICATION_JSON.equals(response.getHeaderString("Content-Type"))) {
        return null;
      }
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
        .entity(MessageUtils.throwableAsMessagesJsonObject(cause, text))
        .build();
  }
}
