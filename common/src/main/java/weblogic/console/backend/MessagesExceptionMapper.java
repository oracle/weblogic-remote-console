// Copyright (c) 2020, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend;

import javax.json.Json;
import javax.json.JsonObject;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.ext.ExceptionMapper;
import javax.ws.rs.ext.Provider;

@Provider
public class MessagesExceptionMapper implements ExceptionMapper<MessagesException> {
  @Override
  public Response toResponse(MessagesException me) {
    JsonObject entityJsonObject =
      Json.createObjectBuilder()
        .add("messages", JavaxJsonUtils.throwableAsMessagesJsonArray(me))
        .build();
    return
      Response
        .status(me.getHttpStatus().getCode())
        .entity(entityJsonObject)
        .type(MediaType.APPLICATION_JSON)
        .build();
  }
}
