// Copyright (c) 2020, 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.utils;

import java.util.ArrayList;
import java.util.List;
import javax.json.Json;
import javax.json.JsonArray;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;

/** */
public class MessageUtils {

  private MessageUtils() {
  }

  public static JsonObject throwableAsMessagesJsonObject(
    Throwable throwable,
    String text
  ) {
    return
      Json.createObjectBuilder()
        .add("messages", throwableAsMessagesJsonArray(throwable, text))
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
    return throwableAsMessagesJsonArray(throwable, null);
  }

  private static JsonArray throwableAsMessagesJsonArray(Throwable throwable, String text) {
    List<Message> list = new ArrayList<Message>();
    if (text != null) {
      list.add(Message.newFailureMessage(text));
    }
    if (throwable != null) {
      String text1 = getExceptionMessage(throwable);
      if (text1 != null && !text1.equals(text)) {
        list.add(Message.newFailureMessage(text1));
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
