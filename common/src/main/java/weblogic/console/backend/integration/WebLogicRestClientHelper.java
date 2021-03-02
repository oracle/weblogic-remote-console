// Copyright (c) 2020, 2021, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.integration;

import java.util.ArrayList;
import java.util.List;
import javax.json.Json;
import javax.json.JsonArray;
import javax.json.JsonObject;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.MultivaluedHashMap;
import javax.ws.rs.core.MultivaluedMap;
import javax.ws.rs.core.Response;

import weblogic.console.backend.JavaxJsonUtils;
import weblogic.console.backend.Message;
import weblogic.console.backend.ResponseHelper;

abstract class WebLogicRestClientHelper {

  static Response getWebLogicRestErrorMessages(Response response) {
    List<Message> messages = new ArrayList<>();
    if (!addMessagesFromJsonEntity(response, messages)) {
      if (!addMessageFromStringEntity(response, messages)) {
        // There are no messages. That's OK.
      }
    }
    JsonObject entity =
      Json.createObjectBuilder()
        .add("messages", JavaxJsonUtils.createMessagesJsonArray(messages))
        .build();
    return
      Response
        .status(response.getStatus(), response.getStatusInfo().getReasonPhrase())
        .entity(entity)
        .build();
  }

  static MultivaluedMap<String, Object> createHeaders(WebLogicRestRequest request) {
    MultivaluedMap<String, Object> headers = new MultivaluedHashMap<>();
    headers.add("Content-type", MediaType.APPLICATION_JSON);
    headers.add("X-Requested-By", "ConsoleBackendRestClient");
    headers.add("X-Skip-Resource-Links", "true");
    for (String header : request.headers().keySet()) {
      headers.add(header, request.headers().get(header));
    }
    return headers;
  }

  static boolean isErrorResponse(String httpMethod, int httpStatus) {
    boolean result;
    switch (httpMethod) {
      case "PUT":
        result = (httpStatus != Response.Status.NO_CONTENT.getStatusCode());
        break;
      case "POST":
        result =
          (httpStatus != Response.Status.OK.getStatusCode()
          && httpStatus != Response.Status.CREATED.getStatusCode());
        break;
      default:
        result = (httpStatus != Response.Status.OK.getStatusCode());
    }
    return result;
  }

  // private:
  private static boolean addMessagesFromJsonEntity(Response response, List<Message> messages) {
    JsonObject entity = ResponseHelper.getEntityAsJson(response);
    if (entity == null) {
      return false;
    }
    // check for a list of messages:
    if (addMessagesFromErrorsDetails(entity, messages)) {
      return true;
    }
    // check for a single message:
    if (addMessageFromJsonMessage(entity, messages)) {
      return true;
    }
    // WLS didn't return any messages.  That's OK.
    return true;
  }

  private static boolean addMessagesFromErrorsDetails(JsonObject entity, List<Message> messages) {
    String errorKey = "wls:errorsDetails";
    if (!entity.containsKey(errorKey)) {
      return false;
    }
    JsonArray errors = entity.getJsonArray(errorKey);
    for (int i = 0; i < errors.size(); i++) {
      addMessageFromJsonMessage(errors.getJsonObject(i), messages);
    }
    return true;
  }

  private static boolean addMessageFromJsonMessage(JsonObject json, List<Message> messages) {
    if (!json.containsKey("title")) {
      return false;
    }
    String severity = json.getString("title");
    String text = json.getString("detail");
    String property = null;
    if (json.containsKey("o:errorPath")) {
      property = json.getString("o:errorPath");
    }
    messages.add(
      new Message(text, getConsoleMessageSeverityFromWeblogicSeverity(severity), property)
    );
    return true;
  }

  private static Message.Severity getConsoleMessageSeverityFromWeblogicSeverity(
      String wlsSeverity) {
    if ("SUCCESS".equals(wlsSeverity)) {
      return Message.Severity.INFO;
    }
    if ("WARNING".equals(wlsSeverity)) {
      return Message.Severity.WARNING;
    }
    if ("FAILURE".equals(wlsSeverity)) {
      return Message.Severity.ERROR;
    }
    throw new AssertionError("Unexpected wlsSeverity: " + wlsSeverity);
  }

  private static boolean addMessageFromStringEntity(Response response, List<Message> messages) {
    String entity = ResponseHelper.getEntityAsString(response);
    if (entity == null) {
      return false;
    }
    messages.add(
      new Message(entity, getConsoleMessageSeverityFromHttpStatus(response.getStatus()))
    );
    return true;
  }

  private static Message.Severity getConsoleMessageSeverityFromHttpStatus(int status) {
    return
      (
        status == Response.Status.OK.getStatusCode()
        || status == Response.Status.CREATED.getStatusCode()
      )
      ? Message.Severity.INFO
      : Message.Severity.ERROR;
  }
}
