// Copyright (c) 2020, 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend;

import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;
import javax.json.Json;
import javax.json.JsonArray;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;

import weblogic.console.backend.Message.Severity;
import weblogic.console.backend.utils.StringUtils;

/** */
public abstract class JavaxJsonUtils {

  private static final Logger LOGGER = Logger.getLogger(JavaxJsonUtils.class.getName());

  public static JsonObject textAsMessagesJsonObject(String text, Severity severity) {
    return throwableAsMessagesJsonObject(null, text, severity);
  }

  public static JsonObject throwableAsMessagesJsonObject(
    Throwable throwable,
    String text,
    Severity severity
  ) {
    return
      Json.createObjectBuilder()
        .add("messages", throwableAsMessagesJsonArray(throwable, text, severity))
        .build();
  }

  public static JsonArray createMessagesJsonArray(List<Message> messages) {
    JsonArrayBuilder messagesBldr = Json.createArrayBuilder();
    for (Message message : messages) {
      messagesBldr.add(getMessageJson(message));
    }
    return messagesBldr.build();
  }

  public static JsonObject getMessageJson(Message message) {
    JsonObjectBuilder messageBldr =
      Json.createObjectBuilder()
        .add("message", message.getText())
        .add("severity", message.getSeverity().name());
    String property = message.getProperty();
    if (StringUtils.notEmpty(property)) {
      messageBldr.add("property", property);
    }
    return messageBldr.build();
  }

  public static JsonArray throwableAsMessagesJsonArray(Throwable throwable) {
    return throwableAsMessagesJsonArray(throwable, null, null);
  }
  
  public static JsonArray throwableAsMessagesJsonArray(Throwable throwable, String severityLevel) {
    return throwableAsMessagesJsonArray(throwable, null, Severity.valueOf(severityLevel));
  }

  private static JsonArray throwableAsMessagesJsonArray(
    Throwable throwable,
    String text,
    Severity severity
  ) {
    if (severity == null) {
      severity = Severity.ERROR;
    }
    List<Message> list = new ArrayList<Message>();
    if (text != null) {
      list.add(new Message(text, severity));
    }
    if (throwable != null) {
      String text1 = getExceptionMessage(throwable);
      if (text1 != null && !text1.equals(text)) {
        list.add(new Message(text1, severity));
      }
    }
    return createMessagesJsonArray(list);
  }

  private static String getExceptionMessage(Throwable t) {
    if (t == null) {
      return "";
    }
    String message = t.getLocalizedMessage();
    if (StringUtils.isEmpty(message)) {
      message = t.toString();
    }
    if (StringUtils.isEmpty(message)) {
      message = t.getClass().getName();
    }
    return message;
  }
}
