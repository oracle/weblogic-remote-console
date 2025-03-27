// Copyright (c) 2021, 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.webapp;

import java.text.ParseException;
import java.util.Arrays;
import java.util.Date;
import javax.json.JsonArray;
import javax.json.JsonNumber;
import javax.json.JsonObject;
import javax.json.JsonString;
import javax.json.JsonValue;
import javax.json.JsonValue.ValueType;

import org.glassfish.jersey.media.multipart.FormDataMultiPart;
import weblogic.console.utils.Path;
import weblogic.console.utils.StringUtils;
import weblogic.remoteconsole.common.utils.DateUtils;
import weblogic.remoteconsole.common.utils.UrlUtils;
import weblogic.remoteconsole.server.repo.BeanTreePath;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.Response;

/**
 * Converts JAXRS JSON request bodies to POJOs (lingua franca)
 */
public abstract class RequestBodyMapper<T> {

  private InvocationContext ic;
  private JsonObject requestBody;
  private FormDataMultiPart parts;
  // use a response so we can return BadRequest for poorly formatted request bodies:
  private Response<T> response = new Response<>();

  protected static final String PROP_RESOURCE_DATA = "resourceData";

  protected RequestBodyMapper(
    InvocationContext ic,
    JsonObject requestBody
  ) {
    this(ic, requestBody, null);
  }

  protected RequestBodyMapper(
    InvocationContext ic,
    JsonObject requestBody,
    FormDataMultiPart parts
  ) {
    this.ic = ic;
    this.requestBody = requestBody;
    this.parts = parts;
  }

  public Response<T> fromRequestBody() {
    if (isOK()) {
      parseRequestBody();
    }
    return getResponse();
  }

  protected InvocationContext getInvocationContext() {
    return ic;
  }

  protected JsonObject getRequestBody() {
    return requestBody;
  }

  protected FormDataMultiPart getParts() {
    return parts;
  }

  public Response<T> getResponse() {
    return response;
  }
  
  protected boolean isOK() {
    return getResponse().isSuccess();
  }

  protected abstract void parseRequestBody();

  protected JsonObject getRequiredJsonObject(JsonObject object, String key) {
    JsonValue value = getRequiredJsonValue(object, key);
    return (value != null) ? asJsonObject(key, value) : null;
  }

  protected JsonObject getOptionalJsonObject(JsonObject object, String key) {
    JsonValue value = getOptionalJsonValue(object, key);
    return (value != null) ? asJsonObject(key, value) : null;
  }

  protected JsonArray getRequiredJsonArray(JsonObject object, String key) {
    JsonValue value = getRequiredJsonValue(object, key);
    return (value != null) ? asJsonArray(key, value) : null;
  }

  protected JsonArray getOptionalJsonArray(JsonObject object, String key) {
    JsonValue value = getOptionalJsonValue(object, key);
    return (value != null) ? asJsonArray(key, value) : null;
  }

  protected String getRequiredString(JsonObject object, String key) {
    JsonValue value = getRequiredJsonValue(object, key);
    return (value != null) ? asString(key, value) : null;
  }

  protected String getOptionalString(JsonObject object, String key) {
    return getOptionalString(object, key, null);
  }

  protected String getOptionalString(JsonObject object, String key, String defaultValue) {
    JsonValue value = getOptionalJsonValue(object, key);
    return (value != null) ? asString(key, value) : defaultValue;
  }

  protected boolean getRequiredBoolean(JsonObject object, String key) {
    JsonValue value = getRequiredJsonValue(object, key);
    return (value != null) ? asBoolean(key, value) : false;
  }

  protected boolean getOptionalBoolean(JsonObject object, String key) {
    return getOptionalBoolean(object, key, false);
  }

  protected boolean getOptionalBoolean(JsonObject object, String key, boolean dflt) {
    JsonValue value = getOptionalJsonValue(object, key);
    return (value != null) ? asBoolean(key, value) : dflt;
  }

  protected int getRequiredInt(JsonObject object, String key) {
    JsonValue value = getRequiredJsonValue(object, key);
    return (value != null) ? asInt(key, value) : 0;
  }

  protected int getOptionalInt(JsonObject object, String key) {
    JsonValue value = getOptionalJsonValue(object, key);
    return (value != null) ? asInt(key, value) : 0;
  }

  protected long getRequiredLong(JsonObject object, String key) {
    JsonValue value = getRequiredJsonValue(object, key);
    return (value != null) ? asLong(key, value) : 0;
  }

  protected long getOptionalLong(JsonObject object, String key) {
    JsonValue value = getOptionalJsonValue(object, key);
    return (value != null) ? asLong(key, value) : 0;
  }

  protected double getRequiredDouble(JsonObject object, String key) {
    JsonValue value = getRequiredJsonValue(object, key);
    return (value != null) ? asDouble(key, value) : 0;
  }

  protected double getOptionalDouble(JsonObject object, String key) {
    JsonValue value = getOptionalJsonValue(object, key);
    return (value != null) ? asDouble(key, value) : 0;
  }

  protected Date getRequiredDate(JsonObject object, String key) {
    JsonValue value = getRequiredJsonValue(object, key);
    return (value != null) ? asDate(key, value) : null;
  }

  protected Date getOptionalDate(JsonObject object, String key) {
    JsonValue value = getOptionalJsonValue(object, key);
    return (value != null) ? asDate(key, value) : null;
  }

  protected BeanTreePath getRequiredBeanTreePath(JsonObject object, String key) {
    JsonValue value = getRequiredJsonValue(object, key);
    return (value != null) ? asBeanTreePath(key, value) : null;
  }

  protected BeanTreePath getOptionalBeanTreePath(JsonObject object, String key) {
    JsonValue value = getOptionalJsonValue(object, key);
    return (value != null) ? asBeanTreePath(key, value) : null;
  }

  protected BeanTreePath asBeanTreePath(String key, JsonValue jsonValue) {
    JsonObject jsonObject = asJsonObject(key, jsonValue);
    if (!isOK()) {
      return null;
    }
    String resourceData = getRequiredString(jsonObject, PROP_RESOURCE_DATA);
    if (StringUtils.isEmpty(resourceData)) {
      badFormat(key + " resourceData must not be null or empty");
      return null;
    }
    // should be api/<provider>/<repo>/data/...
    // want to return the ... part
    Path requiredPrefixPath = new Path();
    requiredPrefixPath.addComponent("api");
    requiredPrefixPath.addComponent(getInvocationContext().getProvider().getName());
    requiredPrefixPath.addComponent(getInvocationContext().getPageRepo().getPageRepoDef().getName());
    requiredPrefixPath.addComponent("data");
    String requiredPrefix = "/" + UrlUtils.pathToRelativeUri(requiredPrefixPath);
    if (!resourceData.startsWith(requiredPrefix)) {
      badFormat(
        key
        + " resourceData must start with " + requiredPrefix
        + " : " + resourceData
      );
      return null;
    }
    Path repoRelativePath = UrlUtils.relativeUriToPath(resourceData.substring(requiredPrefix.length()));
    return BeanTreePath.create(getInvocationContext().getPageRepo().getBeanRepo(), repoRelativePath);
  }

  protected JsonValue getRequiredJsonValue(JsonObject object, String key) {
    JsonValue value = getOptionalJsonValue(object, key);
    if (value == null) {
      badFormat(key + " is required");
      return null;
    }
    return value;
  }

  protected JsonValue getOptionalJsonValue(JsonObject object, String key) {
    return (object.containsKey(key)) ? object.get(key) : null;
  }

  protected JsonObject asJsonObject(String key, JsonValue value) {
    if (validateType(value, key, ValueType.OBJECT)) {
      return value.asJsonObject();
    }
    return null;
  }

  protected JsonArray asJsonArray(String key, JsonValue value) {
    if (validateType(value, key, ValueType.ARRAY, ValueType.NULL)) {
      if (value == JsonValue.NULL) {
        return JsonValue.EMPTY_JSON_ARRAY;
      } else {
        return value.asJsonArray();
      }
    }
    return null;
  }

  protected String asString(String key, JsonValue value) {
    if (validateType(value, key, ValueType.STRING, ValueType.NULL)) {
      if (JsonString.class.isInstance(value)) {
        return JsonString.class.cast(value).getString();
      } else {
        return null;
      }
    }
    return null;
  }

  protected boolean asBoolean(String key, JsonValue value) {
    if (validateType(value, key, ValueType.TRUE, ValueType.FALSE)) {
      return (value == JsonValue.TRUE) ? true : false;
    }
    return false;
  }

  protected int asInt(String key, JsonValue value) {
    if (validateType(value, key, ValueType.NUMBER)) {
      try {
        return JsonNumber.class.cast(value).intValueExact();
      } catch (ArithmeticException e) {
        badFormat(key + " must be an integer: " + value);
      }
    }
    return 0;
  }

  protected long asLong(String key, JsonValue value) {
    if (validateType(value, key, ValueType.NUMBER)) {
      try {
        return JsonNumber.class.cast(value).longValueExact();
      } catch (ArithmeticException e) {
        badFormat(key + " must be a long: " + value);
      }
    }
    return 0;
  }

  protected double asDouble(String key, JsonValue value) {
    if (validateType(value, key, ValueType.NUMBER)) {
      // JsonNumber doesn't have a method to check whether
      // the number fits in a double.
      return JsonNumber.class.cast(value).doubleValue();
    }
    return 0;
  }

  protected Date asDate(String key, JsonValue value) {
    String dateAsString = asString(key, value);
    if (isOK()) {
      try {
        return DateUtils.parseDate(dateAsString);
      } catch (ParseException e) {
        badFormat(e.getMessage());
      }
    }
    return null;
  }

  protected boolean validateType(JsonValue value, String key, ValueType... typesWant) {
    ValueType typeHave = value.getValueType();
    for (ValueType typeWant : typesWant) {
      if (typeWant == typeHave) {
        return true;
      }
    }
    badFormat(key + " must be " + Arrays.toString(typesWant) + ", received " + typeHave);
    return false;
  }

  protected void badFormat(String message) {
    getResponse().addFailureMessage(message);
    getResponse().setFrontEndBadRequest();
  }
}
