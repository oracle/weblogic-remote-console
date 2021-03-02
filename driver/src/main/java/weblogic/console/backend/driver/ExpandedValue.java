// Copyright (c) 2020, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.driver;

import java.util.logging.Logger;
import javax.json.Json;
import javax.json.JsonArray;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;
import javax.json.JsonValue;

/** Manages the Json representation of an expanded weblogic configuration value. */
public class ExpandedValue {

  private static final Logger LOGGER = Logger.getLogger(ExpandedValue.class.getName());

  public static final String PROP_VALUE = "value";
  public static final String PROP_SET = "set";

  private JsonObject json;

  public JsonObject getJson() {
    return this.json;
  }

  // String : null maps to JsonValue.NULL, non-null maps directly
  public static String getStringValue(JsonValue expandedValue) {
    return getStringValue(expandedValue.asJsonObject());
  }

  public static String getStringValue(JsonObject expandedValue) {
    return wrap(expandedValue).getStringValue();
  }

  public String getStringValue() {
    return getJson().isNull(PROP_VALUE) ? null : getJson().getString(PROP_VALUE);
  }

  public static ExpandedValue fromString(String value) {
    return fromValue((value == null) ? JsonValue.NULL : Json.createValue(value));
  }

  // boolean : true maps to JsonValue.TRUE, false maps to JsonValue.FALSE
  public static boolean getBooleanValue(JsonValue expandedValue) {
    return getBooleanValue(expandedValue.asJsonObject());
  }

  public static boolean getBooleanValue(JsonObject expandedValue) {
    return wrap(expandedValue).getBooleanValue();
  }

  public boolean getBooleanValue() {
    return getJson().getBoolean(PROP_VALUE);
  }

  public static ExpandedValue fromBoolean(boolean value) {
    return fromValue(value ? JsonValue.TRUE : JsonValue.FALSE);
  }

  // int : int maps to JsonNumber's int value
  public static int getIntValue(JsonValue expandedValue) {
    return getIntValue(expandedValue.asJsonObject());
  }

  public static int getIntValue(JsonObject expandedValue) {
    return wrap(expandedValue).getIntValue();
  }

  public int getIntValue() {
    return getJson().getInt(PROP_VALUE);
  }

  public static ExpandedValue fromInt(int value) {
    return fromValue(Json.createValue(value));
  }

  // mbean reference : null maps to JsonValue.NULL, reference maps to JsonArray
  public static JsonArray getReferenceValue(JsonValue expandedValue) {
    return getReferenceValue(expandedValue.asJsonObject());
  }

  public static JsonArray getReferenceValue(JsonObject expandedValue) {
    return wrap(expandedValue).getReferenceValue();
  }

  public JsonArray getReferenceValue() {
    return getJson().isNull(PROP_VALUE) ? null : getJson().getJsonArray(PROP_VALUE);
  }

  public static ExpandedValue fromReference(JsonArray value) {
    return fromValue((value == null) ? JsonValue.NULL : value);
  }

  // mbean references : maps to JsonArray (i.e. no references maps to an empty array)
  public static JsonArray getReferencesValue(JsonValue expandedValue) {
    return getReferenceValue(expandedValue.asJsonObject());
  }

  public static JsonArray getReferencesValue(JsonObject expandedValue) {
    return wrap(expandedValue).getReferencesValue();
  }

  public JsonArray getReferencesValue() {
    return getJson().getJsonArray(PROP_VALUE);
  }

  public static ExpandedValue fromReferences(JsonArray value) {
    return fromValue(value);
  }

  public static JsonValue getValue(JsonValue expandedValue) {
    return getValue(expandedValue.asJsonObject());
  }

  public static JsonValue getValue(JsonObject expandedValue) {
    return wrap(expandedValue).getValue();
  }

  public JsonValue getValue() {
    return getJson().get(PROP_VALUE);
  }

  public static ExpandedValue fromValue(JsonValue value) {
    return new ExpandedValue().value(value);
  }

  public static ExpandedValue wrap(JsonValue expandedValue) {
    return wrap(expandedValue.asJsonObject());
  }

  public static ExpandedValue wrap(JsonObject expandedValue) {
    return (new ExpandedValue(expandedValue));
  }

  // Create an expanded value that unsets the value
  public static ExpandedValue unset() {
    return (new ExpandedValue()).set(false);
  }

  private ExpandedValue(JsonObject jsonExpandedValue) {
    // TBD - make sure the json has the right fields ... ?
    this.json = jsonExpandedValue;
  }

  private ExpandedValue() {
    init(null, null);
  }

  private void init(JsonValue value, Boolean set) {
    JsonObjectBuilder bldr = Json.createObjectBuilder();
    if (value != null) {
      bldr.add(PROP_VALUE, value);
    }
    if (set != null) {
      bldr.add(PROP_SET, set);
    }
    this.json = bldr.build();
  }

  public boolean hasSet() {
    return getJson().containsKey(PROP_SET);
  }

  public boolean isSet() {
    if (!hasSet()) {
      throw new AssertionError("isSet() called when hasSet() returned false");
    }
    return getJson().getBoolean(PROP_SET, true);
  }

  private Boolean hasIsSetMethodAndItIsSet() {
    return hasSet() ? isSet() : null;
  }

  public ExpandedValue set(boolean set) {
    init(getValue(), set);
    return this;
  }

  public ExpandedValue copySet(ExpandedValue other) {
    init(getValue(), other.hasIsSetMethodAndItIsSet());
    return this;
  }

  public boolean hasValue() {
    return getJson().containsKey(PROP_VALUE);
  }

  public ExpandedValue value(JsonValue value) {
    init(value, hasIsSetMethodAndItIsSet());
    return this;
  }

  @Override
  public String toString() {
    return getJson().toString();
  }
}
