// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.webapp;

import javax.json.Json;
import javax.json.JsonObject;
import javax.json.JsonValue;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;

import weblogic.remoteconsole.common.utils.StringUtils;

/**
 * If thrown on the request code path, this exception will send back the
 * designated HTTP response code ("Bad Request" in the case of the default 400)
 * as a response to the request and include a message body with the reason
*/
public class FailedRequestException extends WebApplicationException {
  public FailedRequestException(int code, String reason) {
    super(javax.ws.rs.core.Response.status(code)
      .entity(Json.createObjectBuilder().add("messages", createMessages(reason)).build())
      .type(MediaType.APPLICATION_JSON).build());
  }

  public FailedRequestException(int code, String reason, Throwable cause) {
    super(cause, javax.ws.rs.core.Response.status(code)
      .entity(Json.createObjectBuilder().add("messages", createMessages(reason)).build())
      .type(MediaType.APPLICATION_JSON).build());
  }

  public FailedRequestException(String reason) {
    super(javax.ws.rs.core.Response.status(400)
      .entity(Json.createObjectBuilder().add("messages", createMessages(reason)).build())
      .type(MediaType.APPLICATION_JSON).build());
  }

  public FailedRequestException(JsonObject result) {
    super(javax.ws.rs.core.Response.status(400).entity(result).type(MediaType.APPLICATION_JSON).build());
  }

  public FailedRequestException(int code, JsonObject result) {
    super(javax.ws.rs.core.Response.status(code).entity(result).type(MediaType.APPLICATION_JSON).build());
  }

  public FailedRequestException(String reason, Throwable cause) {
    super(cause, javax.ws.rs.core.Response.status(400)
      .entity(Json.createObjectBuilder().add("messages", createMessages(reason)).build())
      .type(MediaType.APPLICATION_JSON).build());
  }

  private static JsonValue createMessages(String message) {
    return Json.createArrayBuilder()
             .add(Json.createObjectBuilder()
                    .add("message", StringUtils.nonNull(message))
                    .add("severity", "ERROR")
                    .build())
             .build();
  }
}
