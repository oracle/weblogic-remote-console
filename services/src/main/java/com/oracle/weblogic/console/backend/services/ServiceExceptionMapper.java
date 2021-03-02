// Copyright (c) 2020, 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package com.oracle.weblogic.console.backend.services;

import javax.json.Json;
import javax.json.JsonArray;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.ext.ExceptionMapper;
import javax.ws.rs.ext.Provider;

import weblogic.console.backend.JavaxJsonUtils;
import weblogic.console.backend.driver.DriverException;

@Provider
public class ServiceExceptionMapper implements ExceptionMapper<ServiceException> {
  @Override
  public Response toResponse(ServiceException se) {
    return
      Response
        .status(se.getHttpStatus().getCode())
        .type(MediaType.APPLICATION_JSON)
        .entity(
          Json.createObjectBuilder().add("messages", getMessages(se)).build()
        )
        .build();
  }

  private static JsonArray getMessages(ServiceException se) {
    // Get the exception that has the messages to report
    Throwable t = getFirstThrowableWithMessage(se);

    JsonArray messages = null;

    // If the exception is a DriverException has a JsonArray of messages,
    // use them as-is
    if (t instanceof DriverException) {
      DriverException de = (DriverException)t;
      messages = de.getMessages();
    }

    // If not, convert the exception's message string into a JsonArray of messages,
    // using the service exception's severity
    if (messages == null) {
      messages = JavaxJsonUtils.throwableAsMessagesJsonArray(t, se.getSeverity().getLevel());
    }

    return messages;
  }

  private static Throwable getFirstThrowableWithMessage(Throwable t) {
    for (Throwable th = t; th != null; th = th.getCause()) {
      if (th.getLocalizedMessage() != null) {
        return th;
      }
    }
    // none of the throwables has a message. return the outermost one.
    return t;
  }
}
