// Copyright (c) 2021, 2024, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.webapp;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import javax.json.JsonArray;
import javax.json.JsonObject;
import javax.json.JsonValue;

import org.glassfish.jersey.media.multipart.FormDataBodyPart;
import org.glassfish.jersey.media.multipart.FormDataMultiPart;
import weblogic.remoteconsole.common.repodef.PageDef;
import weblogic.remoteconsole.common.repodef.PageFieldDef;
import weblogic.remoteconsole.server.repo.ArrayValue;
import weblogic.remoteconsole.server.repo.BooleanValue;
import weblogic.remoteconsole.server.repo.DateAsLongValue;
import weblogic.remoteconsole.server.repo.DateValue;
import weblogic.remoteconsole.server.repo.DoubleValue;
import weblogic.remoteconsole.server.repo.EntitleNetExpressionValue;
import weblogic.remoteconsole.server.repo.FileContentsValue;
import weblogic.remoteconsole.server.repo.FormProperty;
import weblogic.remoteconsole.server.repo.IntValue;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.LongValue;
import weblogic.remoteconsole.server.repo.ModelToken;
import weblogic.remoteconsole.server.repo.NullReference;
import weblogic.remoteconsole.server.repo.PropertiesValue;
import weblogic.remoteconsole.server.repo.Response;
import weblogic.remoteconsole.server.repo.SecretValue;
import weblogic.remoteconsole.server.repo.SettableValue;
import weblogic.remoteconsole.server.repo.StringValue;
import weblogic.remoteconsole.server.repo.UnresolvedReference;
import weblogic.remoteconsole.server.repo.Value;

/**
 * Converts a JAXRS Request body to a Response<List<FormProperty>>.
 */
public class FormRequestBodyMapper extends RequestBodyMapper<List<FormProperty>> {
  private static final String PROP_SET = "set";
  private static final String PROP_VALUE = "value";
  private static final String PROP_MODEL_TOKEN = "modelToken";
  private static final String PROP_UNRESOLVED_REFERENCE = "unresolvedReference";
  private PageDef pageDef;
  private List<PageFieldDef> fieldDefs;

  public static Response<List<FormProperty>> fromRequestBody(
    InvocationContext ic,
    JsonObject requestBody
  ) {
    return fromRequestBody(ic, requestBody, null);
  }

  public static Response<List<FormProperty>> fromRequestBody(
    InvocationContext ic,
    JsonObject requestBody,
    FormDataMultiPart parts
  ) {
    return (new FormRequestBodyMapper(ic, requestBody, parts)).fromRequestBody();
  }

  private FormRequestBodyMapper(
    InvocationContext ic,
    JsonObject requestBody,
    FormDataMultiPart parts
  ) {
    super(ic, requestBody, parts);
    Response<PageDef> pageDefResponse =
      ic.getPageRepo().asPageReaderRepo().getPageDef(getInvocationContext());
    if (!pageDefResponse.isSuccess()) {
      getResponse().copyUnsuccessfulResponse(pageDefResponse);
      return;
    }
    pageDef = pageDefResponse.getResults();
    if (pageDef.isSliceFormDef()) {
      fieldDefs = new ArrayList<>(pageDef.asSliceFormDef().getAllPropertyDefs());
    } else if (pageDef.isCreateFormDef()) {
      fieldDefs = new ArrayList<>(pageDef.asCreateFormDef().getAllPropertyDefs());
    } else if (pageDef.isActionInputFormDef()) {
      fieldDefs = new ArrayList<>(pageDef.asActionInputFormDef().getParamDefs());
    } else {
      throw new AssertionError("Not a slice form or create form: " + getInvocationContext().getPagePath());
    }
  }

  @Override
  protected void parseRequestBody() {
    List<FormProperty> formProperties = getFormProperties();
    if (isOK()) {
      getResponse().setSuccess(formProperties);
    }
  }

  private List<FormProperty> getFormProperties() {
    List<FormProperty> formProperties = new ArrayList<>();
    JsonObject propertiesJson = getRequiredJsonObject(getRequestBody(), "data");
    if (!isOK()) {
      return null;
    }
    for (String name : propertiesJson.keySet()) {
      FormProperty formProperty = getFormProperty(name, propertiesJson);
      if (!isOK()) {
        return null;
      }
      if (formProperty != null) {
        formProperties.add(formProperty);
      }
    }
    if (getParts() != null) {
      for (Map.Entry<String, List<FormDataBodyPart>> entry : getParts().getFields().entrySet()) {
        List<FormDataBodyPart> parts = entry.getValue();
        if (parts == null || parts.isEmpty()) {
          badFormat("No parts for the property " + entry.getKey());
          return null;
        }
        if (parts.size() > 1) {
          // Currently we don't support multiple parts with the same name
          badFormat("More than one part for the property " + entry.getKey());
          return null;
        }
        FormProperty formProperty = getFormProperty(parts.get(0));
        if (!isOK()) {
          return null;
        }
        if (formProperty != null) {
          formProperties.add(formProperty);
        }
      }
    }
    return formProperties;
  }

  private FormProperty getFormProperty(String name, JsonObject propertiesJson) {
    PageFieldDef fieldDef = getFieldDef(name);
    if (!isOK()) {
      return null;
    }
    if (isReadOnly(fieldDef)) {
      // ignore read-only properties so that the CFE can always send back the RDJ
      // instead of trimming it to writable properties.
      return null;
    }
    JsonObject propertyJson = getRequiredJsonObject(propertiesJson, name);
    if (!isOK()) {
      return null;
    }
    Value value = getPropertyValue(fieldDef, propertyJson);
    if (!isOK()) {
      return null;
    }
    if (value == null) {
      // We can't write this property out, e.g. we can't figure out whether it's a settable value
      // because the caller posted back the form from GET and the user didn't set the value.
      return null;
    }
    return new FormProperty(fieldDef, value);
  }

  private FormProperty getFormProperty(FormDataBodyPart part) {
    if (part == null) {
      return null;
    }
    String name = part.getFormDataContentDisposition().getName();
    if ("requestBody".equals(name)) {
      // multi-part POSTs always send in the request body as a part.
      // It's always called 'requestBody' and is always handled separately
      // by a JsonObject arg to the jaxrs method.
      return null;
    }
    PageFieldDef fieldDef = getFieldDef(name);
    if (!isOK()) {
      return null;
    }
    if (isReadOnly(fieldDef)) {
      // ignore read-only properties so that the CFE can always send back the RDJ
      // instead of trimming it to writable properties.
      return null;
    }
    if (!fieldDef.isFileContents()) {
      badFormat("Property is not an uploaded file: " + name);
      return null;
    }
    Value value =
      new FileContentsValue(
        part.getFormDataContentDisposition().getFileName(),
        part.getEntityAs(InputStream.class),
        part.getMediaType().getType()
      );
    return new FormProperty(fieldDef, new SettableValue(value));
  }

  private boolean isReadOnly(PageFieldDef fieldDef) {
    if (pageDef.isSliceFormDef()) {
      return !fieldDef.asPagePropertyDef().isUpdateWritable();
    }
    if (pageDef.isCreateFormDef()) {
      return !fieldDef.asPagePropertyDef().isCreateWritable();
    }
    if (pageDef.isActionInputFormDef()) {
      // Currently action parameters are always writable:
      return false;
    } else {
      throw new AssertionError("Unsupported form " + pageDef + " " + fieldDef);
    }
  }

  private PageFieldDef getFieldDef(String name) {
    for (PageFieldDef fieldDef : fieldDefs) {
      if (getFieldName(fieldDef).equals(name)) {
        return fieldDef;
      }
    }
    badFormat("Unsupported field name: " + name);
    return null;
  }

  private Value getPropertyValue(PageFieldDef fieldDef, JsonObject propertyJson) {
    String fieldName = getFieldName(fieldDef);
    boolean hasValue = propertyJson.containsKey(PROP_VALUE);
    boolean hasModelToken = propertyJson.containsKey(PROP_MODEL_TOKEN);
    if (hasValue && hasModelToken) {
      badFormat(fieldName + " specifies " + PROP_VALUE + " and " + PROP_MODEL_TOKEN);
      return null;
    }
    if (!hasValue && !hasModelToken) {
      boolean set = isSet(propertyJson);
      if (!isOK()) {
        return null;
      }
      if (set) {
        badFormat(fieldName + " doesn't specify " + PROP_VALUE + " or " + PROP_MODEL_TOKEN);
        return null;
      } else {
        // continue - the user wants to unset the property
        return new SettableValue(null, false);
      }
    }
    Value value =
      (hasValue && fieldDef.isArray() && !fieldDef.isReferenceAsReferences())
      ? getValueAsArrayValue(fieldDef, propertyJson)
      : getSingleValue(fieldDef, propertyJson);
    if (value == null) {
      return null;
    }
    return createSettableValue(propertyJson, value);
  }

  private Value getValueAsArrayValue(PageFieldDef fieldDef, JsonObject propertyJson) {
    JsonArray itemsJson = getRequiredJsonArray(propertyJson, PROP_VALUE);
    if (!isOK()) {
      return null;
    }
    List<Value> values = new ArrayList<>();
    for (int i = 0; i < itemsJson.size(); i++) {
      JsonObject itemJson = asJsonObject(getFieldName(fieldDef), itemsJson.get(i));
      if (!isOK()) {
        return null;
      }
      Value value = getSingleValue(fieldDef, itemJson);
      if (!isOK()) {
        return null;
      }
      values.add(value);
    }
    return new ArrayValue(values);
  }

  private Value getSingleValue(PageFieldDef fieldDef, JsonObject json) {
    String fieldName = getFieldName(fieldDef);
    boolean hasValue = json.containsKey(PROP_VALUE);
    boolean hasModelToken = json.containsKey(PROP_MODEL_TOKEN);
    if (hasValue && hasModelToken) {
      badFormat(fieldName + " specifies " + PROP_VALUE + " and " + PROP_MODEL_TOKEN);
      return null;
    }
    if (!hasValue && !hasModelToken) {
      badFormat(fieldName + " does not specify " + PROP_VALUE + " or " + PROP_MODEL_TOKEN);
      return null;
    }
    if (hasModelToken) {
      return getValueAsModelToken(fieldDef, json);
    }
    JsonValue jsonValue = getRequiredJsonValue(json, PROP_VALUE);
    if (!isOK()) {
      return null;
    }
    if (fieldDef.isString()) {
      return getValueAsString(fieldDef, jsonValue);
    }
    if (fieldDef.isBoolean()) {
      return getValueAsBoolean(fieldDef, jsonValue);
    }
    if (fieldDef.isInt()) {
      return getValueAsInt(fieldDef, jsonValue);
    }
    if (fieldDef.isLong()) {
      return getValueAsLong(fieldDef, jsonValue);
    }
    if (fieldDef.isDouble()) {
      return getValueAsDouble(fieldDef, jsonValue);
    }
    if (fieldDef.isSecret()) {
      return getValueAsSecret(fieldDef, jsonValue);
    }
    if (fieldDef.isReference()) {
      return getValueAsReference(fieldDef, jsonValue);
    }
    // Note: DateAsLong properties return true for both isDateAsLong and isDate
    // v.s. Date properties return false for isDateAsLong and true for isDate
    // So, check for isDateAsLong first.
    if (fieldDef.isDateAsLong()) {
      return getValueAsDateAsLong(fieldDef, jsonValue);
    }
    if (fieldDef.isDate()) {
      return getValueAsDate(fieldDef, jsonValue);
    }
    if (fieldDef.isProperties()) {
      return getValueAsProperties(fieldDef, jsonValue);
    }
    if (fieldDef.isEntitleNetExpression()) {
      return getValueAsEntitleNetExpression(fieldDef, jsonValue);
    }
    throw new AssertionError("Unsupported field type " + fieldDef);
  }

  private Value getValueAsModelToken(PageFieldDef fieldDef, JsonObject propertyJson) {
    String modelToken = getRequiredString(propertyJson, PROP_MODEL_TOKEN);
    if (!isOK()) {
      return null;
    }
    return new ModelToken(modelToken);
  }

  private Value getValueAsString(PageFieldDef fieldDef, JsonValue jsonValue) {
    String val = asString(getFieldName(fieldDef), jsonValue);
    if (!isOK()) {
      return null;
    }
    return new StringValue(val);
  }

  private Value getValueAsBoolean(PageFieldDef fieldDef, JsonValue jsonValue) {
    boolean val = asBoolean(getFieldName(fieldDef), jsonValue);
    if (!isOK()) {
      return null;
    }
    return new BooleanValue(val);
  }

  private Value getValueAsInt(PageFieldDef fieldDef, JsonValue jsonValue) {
    int val = asInt(getFieldName(fieldDef), jsonValue);
    if (!isOK()) {
      return null;
    }
    return new IntValue(val);
  }

  private Value getValueAsLong(PageFieldDef fieldDef, JsonValue jsonValue) {
    long val = asLong(getFieldName(fieldDef), jsonValue);
    if (!isOK()) {
      return null;
    }
    return new LongValue(val);
  }

  private Value getValueAsDouble(PageFieldDef fieldDef, JsonValue jsonValue) {
    double val = asDouble(getFieldName(fieldDef), jsonValue);
    if (!isOK()) {
      return null;
    }
    return new DoubleValue(val);
  }

  private Value getValueAsSecret(PageFieldDef fieldDef, JsonValue jsonValue) {
    String val = asString(getFieldName(fieldDef), jsonValue);
    if (!isOK()) {
      return null;
    }
    return new SecretValue(val);
  }

  private Value getValueAsReference(PageFieldDef fieldDef, JsonValue jsonValue) {
    if (jsonValue == JsonValue.NULL) {
      return NullReference.INSTANCE;
    }
    JsonObject jsonObject = asJsonObject(fieldDef.getFormFieldName(), jsonValue);
    if (!isOK()) {
      return null;
    }
    boolean haveResolvedRef = jsonObject.containsKey(PROP_RESOURCE_DATA);
    boolean haveUnresolvedRef = jsonObject.containsKey(PROP_UNRESOLVED_REFERENCE);
    if (haveResolvedRef && haveUnresolvedRef) {
      badFormat(fieldDef + " specifies both " + PROP_RESOURCE_DATA + " and " + PROP_UNRESOLVED_REFERENCE);
      return null;
    }
    if (!haveResolvedRef && !haveUnresolvedRef) {
      badFormat(fieldDef + " doesn't specify " + PROP_RESOURCE_DATA + " or " + PROP_UNRESOLVED_REFERENCE);
      return null;
    }
    if (haveResolvedRef) {
      return asBeanTreePath(fieldDef.getFormFieldName(), jsonValue);
    } else {
      return asUnresolvedReference(fieldDef, jsonValue);
    }
  }

  private UnresolvedReference asUnresolvedReference(PageFieldDef fieldDef, JsonValue jsonValue) {
    if (!fieldDef.isPagePropertyDef()) {
      throw new AssertionError("Unresolved references not supported for " + fieldDef + " " + jsonValue);
    }
    if (!fieldDef.asPagePropertyDef().isSupportsUnresolvedReferences()) {
      badFormat(fieldDef + " doesn't support unresolved references");
      return null;
    }
    JsonObject jsonObject = asJsonObject(fieldDef.getFormFieldName(), jsonValue);
    if (!isOK()) {
      return null;
    }
    String key = getRequiredString(jsonObject, PROP_UNRESOLVED_REFERENCE);
    if (!isOK()) {
      return null;
    }
    return new UnresolvedReference(key);
  }

  private Value getValueAsDate(PageFieldDef fieldDef, JsonValue jsonValue) {
    Date date = asDate(getFieldName(fieldDef), jsonValue);
    if (!isOK()) {
      return null;
    }
    return new DateValue(date);
  }

  private Value getValueAsDateAsLong(PageFieldDef fieldDef, JsonValue jsonValue) {
    Date date = asDate(getFieldName(fieldDef), jsonValue);
    if (!isOK()) {
      return null;
    }
    return new DateAsLongValue(date);
  }

  private Value getValueAsProperties(PageFieldDef fieldDef, JsonValue jsonValue) {
    JsonObject jsonObject = asJsonObject(getFieldName(fieldDef), jsonValue);
    if (!isOK()) {
      return null;
    }
    Properties properties = new Properties();
    for (String key : jsonObject.keySet()) {
      String value = getRequiredString(jsonObject, key);
      if (!isOK()) {
        return null;
      }
      properties.setProperty(key, value);
    }
    return new PropertiesValue(properties);
  }

  private Value getValueAsEntitleNetExpression(PageFieldDef fieldDef, JsonValue jsonValue) {
    // The CBE just passes them straight through as json values:
    return new EntitleNetExpressionValue(jsonValue);
  }

  private String getFieldName(PageFieldDef fieldDef) {
    return fieldDef.getFormFieldName();
  }

  private SettableValue createSettableValue(JsonObject propertyJson, Value value) {
    boolean set = isSet(propertyJson);
    if (!isOK()) {
      return null;
    }
    return new SettableValue(value, set);
  }

  private boolean isSet(JsonObject propertyJson) {
    if (propertyJson.containsKey(PROP_SET)) {
      return getRequiredBoolean(propertyJson, PROP_SET);
    } else {
      // The caller didn't specify whether the property is set.
      // Since the caller is only supposed to send in properties that
      // should be written out, assume the caller wants it to be tagged as set.
      return true;
    }
  }
}
