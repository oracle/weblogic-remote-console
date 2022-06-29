// Copyright (c) 2021, 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.webapp;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;
import javax.json.JsonArray;
import javax.json.JsonObject;
import javax.json.JsonValue;

import org.glassfish.jersey.media.multipart.FormDataBodyPart;
import weblogic.remoteconsole.common.repodef.PageDef;
import weblogic.remoteconsole.common.repodef.PagePropertyDef;
import weblogic.remoteconsole.server.repo.ArrayValue;
import weblogic.remoteconsole.server.repo.BooleanValue;
import weblogic.remoteconsole.server.repo.DoubleValue;
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
  private boolean isSliceForm;
  private List<PagePropertyDef> propertyDefs;

  public static Response<List<FormProperty>> fromRequestBody(
    InvocationContext ic,
    JsonObject requestBody,
    FormDataBodyPart... uploadedFiles
  ) {
    return (new FormRequestBodyMapper(ic, requestBody, uploadedFiles)).fromRequestBody();
  }

  private FormRequestBodyMapper(
    InvocationContext ic,
    JsonObject requestBody,
    FormDataBodyPart... uploadedFiles
  ) {
    super(ic, requestBody, uploadedFiles);
    Response<PageDef> pageDefResponse =
      ic.getPageRepo().asPageReaderRepo().getPageDef(getInvocationContext());
    if (!pageDefResponse.isSuccess()) {
      getResponse().copyUnsuccessfulResponse(pageDefResponse);
      return;
    }
    PageDef pageDef = pageDefResponse.getResults();
    if (pageDef.isSliceFormDef()) {
      isSliceForm = true;
      propertyDefs = pageDef.asSliceFormDef().getAllPropertyDefs();
    } else if (pageDef.isCreateFormDef()) {
      isSliceForm = false;
      propertyDefs = pageDef.asCreateFormDef().getAllPropertyDefs();
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
    for (FormDataBodyPart uploadedFile : getUploadedFiles()) {
      FormProperty formProperty = getFormProperty(uploadedFile);
      if (!isOK()) {
        return null;
      }
      if (formProperty != null) {
        formProperties.add(formProperty);
      }
    }
    return formProperties;
  }

  private FormProperty getFormProperty(String name, JsonObject propertiesJson) {
    PagePropertyDef propertyDef = getPropertyDef(name);
    if (!isOK()) {
      return null;
    }
    if (isReadOnly(propertyDef)) {
      // ignore read-only properties so that the CFE can always send back the RDJ
      // instead of trimming it to writable properties.
      return null;
    }
    JsonObject propertyJson = getRequiredJsonObject(propertiesJson, name);
    if (!isOK()) {
      return null;
    }
    Value value = getPropertyValue(propertyDef, propertyJson);
    if (!isOK()) {
      return null;
    }
    if (value == null) {
      // We can't write this property out, e.g. we can't figure out whether it's a settable value
      // because the caller posted back the form from GET and the user didn't set the value.
      return null;
    }
    return new FormProperty(propertyDef, value);
  }

  private FormProperty getFormProperty(FormDataBodyPart uploadedFile) {
    if (uploadedFile == null) {
      return null;
    }
    String name = uploadedFile.getFormDataContentDisposition().getName();
    PagePropertyDef propertyDef = getPropertyDef(name);
    if (!isOK()) {
      return null;
    }
    if (isReadOnly(propertyDef)) {
      // ignore read-only properties so that the CFE can always send back the RDJ
      // instead of trimming it to writable properties.
      return null;
    }
    if (!propertyDef.isFileContents()) {
      badFormat("Property is not an uploaded file: " + name);
      return null;
    }
    Value value =
      new FileContentsValue(
        uploadedFile.getFormDataContentDisposition().getFileName(),
        uploadedFile.getEntityAs(InputStream.class),
        uploadedFile.getMediaType().getType()
      );
    return new FormProperty(propertyDef, new SettableValue(value));
  }

  private boolean isReadOnly(PagePropertyDef propertyDef) {
    if (isSliceForm) {
      return !propertyDef.isUpdateWritable();
    } else {
      return !propertyDef.isCreateWritable();
    }
  }

  private PagePropertyDef getPropertyDef(String name) {
    for (PagePropertyDef propertyDef : propertyDefs) {
      if (getPropertyName(propertyDef).equals(name)) {
        return propertyDef;
      }
    }
    badFormat("Unsupported property name: " + name);
    return null;
  }

  private Value getPropertyValue(PagePropertyDef propertyDef, JsonObject propertyJson) {
    String propertyName = getPropertyName(propertyDef);
    boolean hasValue = propertyJson.containsKey(PROP_VALUE);
    boolean hasModelToken = propertyJson.containsKey(PROP_MODEL_TOKEN);
    if (hasValue && hasModelToken) {
      badFormat(propertyName + " specifies " + PROP_VALUE + " and " + PROP_MODEL_TOKEN);
      return null;
    }
    if (!hasValue && !hasModelToken) {
      boolean set = isSet(propertyJson);
      if (!isOK()) {
        return null;
      }
      if (set) {
        badFormat(propertyName + " doesn't specify " + PROP_VALUE + " or " + PROP_MODEL_TOKEN);
        return null;
      } else {
        // continue - the user wants to unset the property
        return new SettableValue(null, false);
      }
    }
    Value value =
      (hasValue && propertyDef.isArray() && !propertyDef.isReferenceAsReferences())
      ? getValueAsArrayValue(propertyDef, propertyJson)
      : getSingleValue(propertyDef, propertyJson);
    if (value == null) {
      return null;
    }
    return createSettableValue(propertyJson, value);
  }

  private Value getValueAsArrayValue(PagePropertyDef propertyDef, JsonObject propertyJson) {
    JsonArray itemsJson = getRequiredJsonArray(propertyJson, PROP_VALUE);
    if (!isOK()) {
      return null;
    }
    List<Value> values = new ArrayList<>();
    for (int i = 0; i < itemsJson.size(); i++) {
      JsonObject itemJson = asJsonObject(getPropertyName(propertyDef), itemsJson.get(i));
      if (!isOK()) {
        return null;
      }
      Value value = getSingleValue(propertyDef, itemJson);
      if (!isOK()) {
        return null;
      }
      values.add(value);
    }
    return new ArrayValue(values);
  }

  private Value getSingleValue(PagePropertyDef propertyDef, JsonObject json) {
    String propertyName = getPropertyName(propertyDef);
    boolean hasValue = json.containsKey(PROP_VALUE);
    boolean hasModelToken = json.containsKey(PROP_MODEL_TOKEN);
    if (hasValue && hasModelToken) {
      badFormat(propertyName + " specifies " + PROP_VALUE + " and " + PROP_MODEL_TOKEN);
      return null;
    }
    if (!hasValue && !hasModelToken) {
      badFormat(propertyName + " does not specify " + PROP_VALUE + " or " + PROP_MODEL_TOKEN);
      return null;
    }
    if (hasModelToken) {
      return getValueAsModelToken(propertyDef, json);
    }
    JsonValue jsonValue = getRequiredJsonValue(json, PROP_VALUE);
    if (!isOK()) {
      return null;
    }
    if (propertyDef.isString()) {
      return getValueAsString(propertyDef, jsonValue);
    }
    if (propertyDef.isBoolean()) {
      return getValueAsBoolean(propertyDef, jsonValue);
    }
    if (propertyDef.isInt()) {
      return getValueAsInt(propertyDef, jsonValue);
    }
    if (propertyDef.isLong()) {
      return getValueAsLong(propertyDef, jsonValue);
    }
    if (propertyDef.isDouble()) {
      return getValueAsDouble(propertyDef, jsonValue);
    }
    if (propertyDef.isSecret()) {
      return getValueAsSecret(propertyDef, jsonValue);
    }
    if (propertyDef.isReference()) {
      return getValueAsReference(propertyDef, jsonValue);
    }
    if (propertyDef.isDate()) {
      return getValueAsDate(propertyDef, jsonValue);
    }
    if (propertyDef.isProperties()) {
      return getValueAsProperties(propertyDef, jsonValue);
    }
    throw new AssertionError("Unsupported property type " + propertyDef);
  }

  private Value getValueAsModelToken(PagePropertyDef propertyDef, JsonObject propertyJson) {
    String modelToken = getRequiredString(propertyJson, PROP_MODEL_TOKEN);
    if (!isOK()) {
      return null;
    }
    return new ModelToken(modelToken);
  }

  private Value getValueAsString(PagePropertyDef propertyDef, JsonValue jsonValue) {
    String val = asString(getPropertyName(propertyDef), jsonValue);
    if (!isOK()) {
      return null;
    }
    return new StringValue(val);
  }

  private Value getValueAsBoolean(PagePropertyDef propertyDef, JsonValue jsonValue) {
    boolean val = asBoolean(getPropertyName(propertyDef), jsonValue);
    if (!isOK()) {
      return null;
    }
    return new BooleanValue(val);
  }

  private Value getValueAsInt(PagePropertyDef propertyDef, JsonValue jsonValue) {
    int val = asInt(getPropertyName(propertyDef), jsonValue);
    if (!isOK()) {
      return null;
    }
    return new IntValue(val);
  }

  private Value getValueAsLong(PagePropertyDef propertyDef, JsonValue jsonValue) {
    long val = asLong(getPropertyName(propertyDef), jsonValue);
    if (!isOK()) {
      return null;
    }
    return new LongValue(val);
  }

  private Value getValueAsDouble(PagePropertyDef propertyDef, JsonValue jsonValue) {
    double val = asDouble(getPropertyName(propertyDef), jsonValue);
    if (!isOK()) {
      return null;
    }
    return new DoubleValue(val);
  }

  private Value getValueAsSecret(PagePropertyDef propertyDef, JsonValue jsonValue) {
    String val = asString(getPropertyName(propertyDef), jsonValue);
    if (!isOK()) {
      return null;
    }
    return new SecretValue(val);
  }

  private Value getValueAsReference(PagePropertyDef propertyDef, JsonValue jsonValue) {
    if (jsonValue == JsonValue.NULL) {
      return NullReference.INSTANCE;
    }
    JsonObject jsonObject = asJsonObject(propertyDef.getPropertyName(), jsonValue);
    if (!isOK()) {
      return null;
    }
    boolean haveResolvedRef = jsonObject.containsKey(PROP_RESOURCE_DATA);
    boolean haveUnresolvedRef = jsonObject.containsKey(PROP_UNRESOLVED_REFERENCE);
    if (haveResolvedRef && haveUnresolvedRef) {
      badFormat(propertyDef + " specifies both " + PROP_RESOURCE_DATA + " and " + PROP_UNRESOLVED_REFERENCE);
      return null;
    }
    if (!haveResolvedRef && !haveUnresolvedRef) {
      badFormat(propertyDef + " doesn't specify " + PROP_RESOURCE_DATA + " or " + PROP_UNRESOLVED_REFERENCE);
      return null;
    }
    if (haveResolvedRef) {
      return asBeanTreePath(propertyDef.getPropertyName(), jsonValue);
    } else {
      return asUnresolvedReference(propertyDef, jsonValue);
    }
  }

  private UnresolvedReference asUnresolvedReference(PagePropertyDef propertyDef, JsonValue jsonValue) {
    if (!propertyDef.isSupportsUnresolvedReferences()) {
      badFormat(propertyDef + " doesn't support unresolved references");
      return null;
    }
    JsonObject jsonObject = asJsonObject(propertyDef.getPropertyName(), jsonValue);
    if (!isOK()) {
      return null;
    }
    String key = getRequiredString(jsonObject, PROP_UNRESOLVED_REFERENCE);
    if (!isOK()) {
      return null;
    }
    return new UnresolvedReference(key);
  }

  private Value getValueAsDate(PagePropertyDef propertyDef, JsonValue jsonValue) {
    throw new AssertionError("Setting Date properties is not currently supported.");
  }

  private Value getValueAsProperties(PagePropertyDef propertyDef, JsonValue jsonValue) {
    JsonObject jsonObject = asJsonObject(getPropertyName(propertyDef), jsonValue);
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

  private String getPropertyName(PagePropertyDef propertyDef) {
    return propertyDef.getFormPropertyName();
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
