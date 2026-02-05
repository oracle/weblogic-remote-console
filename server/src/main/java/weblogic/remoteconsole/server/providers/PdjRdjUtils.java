// Copyright (c) 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.providers;

import java.util.HashMap;
import java.util.Map;
import javax.json.Json;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;

import weblogic.remoteconsole.common.repodef.LocalizableString;
import weblogic.remoteconsole.server.repo.InvocationContext;

public class PdjRdjUtils {
  private static Map<String, LocalizableString> localMap = new HashMap<>();
  private static String[] stringList = new String[] {
    "Name"
  };

  static {
    for (String string : stringList) {
      localMap.put(string, new LocalizableString(string));
    }
  }

  public static String localized(InvocationContext ic, String string) {
    return ic.getLocalizer().localizeString(localMap.get(string));
  }

  public static JsonObject resourceDataMaker(String value) {
    JsonObjectBuilder builder = Json.createObjectBuilder();
    builder.add("resourceData", value);
    return builder.build();
  }

  public static JsonObject resourceDataMaker(String label, String value) {
    JsonObjectBuilder builder = Json.createObjectBuilder();
    builder.add("label", label);
    builder.add("resourceData", value);
    return builder.build();
  }

  public static JsonObject makeInvoker(String operationName) {
    return Json.createObjectBuilder()
      .add("invoker", Json.createObjectBuilder()
        .add("resourceData", "/api/project/data?param=" + operationName)
      )
    .build();
  }

  public static JsonObjectBuilder makeInvoker(
    String operationName, String projectName) {
    return Json.createObjectBuilder()
      .add("invoker", Json.createObjectBuilder()
        .add("resourceData", "/api/project/data/"
          + projectName
          + "?param=" + operationName)
      );
  }

  public static JsonObjectBuilder makeInvoker(
    String operationName,
    String projectName,
    String providerName) {
    return Json.createObjectBuilder()
      .add("invoker", Json.createObjectBuilder()
        .add("resourceData", "/api/project/data/"
          + "/" + projectName
          + "/" + providerName
          + "?param=" + operationName)
      );
  }

  // Convert a label of "Import" to a name of "import"
  public static JsonObjectBuilder pdjActionMaker(
    String name,
    String label,
    String rows) {
    return Json.createObjectBuilder()
      .add("name", name)
      .add("label", label)
      .add("rows", rows)
      .add("polling", Json.createObjectBuilder()
        .add("maxAttempts", 1)
        .add("reloadSeconds", 1));

  }

  public static JsonObject valueObject(boolean value, boolean isSet) {
    JsonObjectBuilder builder = Json.createObjectBuilder();
    builder.add("value", value);
    builder.add("set", isSet);
    return builder.build();
  }

  public static JsonObject valueObject(boolean value) {
    JsonObjectBuilder builder = Json.createObjectBuilder();
    builder.add("value", value);
    builder.add("set", true);
    return builder.build();
  }

  public static JsonObject valueObject(String value) {
    JsonObjectBuilder builder = Json.createObjectBuilder();
    if (value == null) {
      builder.add("value", "");
      builder.add("set", false);
    } else {
      builder.add("value", value);
      builder.add("set", true);
    }
    return builder.build();
  }

  public static JsonObjectBuilder pdjObject(
    String name,
    String label,
    String type,
    String... options) {
    JsonObjectBuilder builder = Json.createObjectBuilder();
    builder.add("name", name);
    builder.add("label", label);
    builder.add("type", type);
    boolean notKey = true;
    for (String option : options) {
      if (option.equals("readOnly")) {
        builder.add("readOnly", true);
      } else if (option.equals("required")) {
        builder.add("required", true);
      } else if (option.equals("notkey")) {
        notKey = true;
      }
    }
    if (!notKey) {
      builder.add("key", true);
    }
    return builder;
  }

  public static JsonObjectBuilder addHelp(
    JsonObject helpObject,
    String fieldName,
    JsonObjectBuilder builder) {
    JsonObject fieldHelp = helpObject.getJsonObject(fieldName);
    if (fieldHelp != null) {
      String summary = fieldHelp.getString("helpSummaryHTML");
      if (summary != null) {
        builder.add("helpSummaryHTML", summary);
      }
      String detail = fieldHelp.getString("detailedHelpHTML");
      if (detail != null) {
        builder.add("detailedHelpHTML", summary);
      }
    }
    return builder;
  }

}
