// Copyright (c) 2021, 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.webapp;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Properties;
import javax.json.Json;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObjectBuilder;
import javax.json.JsonValue;

import weblogic.remoteconsole.common.repodef.BeanChildDef;
import weblogic.remoteconsole.common.repodef.LocalizedConstants;
import weblogic.remoteconsole.common.utils.Message;
import weblogic.remoteconsole.common.utils.Path;
import weblogic.remoteconsole.common.utils.StringUtils;
import weblogic.remoteconsole.server.repo.ArrayValue;
import weblogic.remoteconsole.server.repo.BeanTreePath;
import weblogic.remoteconsole.server.repo.BeanTreePathSegment;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.PropertiesValue;
import weblogic.remoteconsole.server.repo.Response;
import weblogic.remoteconsole.server.repo.SecretValue;
import weblogic.remoteconsole.server.repo.SettableValue;
import weblogic.remoteconsole.server.repo.StringValue; 
import weblogic.remoteconsole.server.repo.ThrowableValue; 
import weblogic.remoteconsole.server.repo.UnresolvedReference;
import weblogic.remoteconsole.server.repo.Value;

/**
 * Base class for mapping a weblogic.remoteconsole.server.repo.Response
 * to a javax.ws.rs.core.Response (i.e. mapping a CBE response to
 * a JAXRS response).
 */
public abstract class ResponseMapper<T> {

  private InvocationContext invocationContext;
  private JsonObjectBuilder entityBuilder;
  private Response<T> response;

  private static final String DISPLAYED_DATE_TIME_FORMAT = "EEE MMM dd kk:mm:ss z yyyy";

  protected ResponseMapper(InvocationContext invocationContext, Response<T> response) {
    this.invocationContext = invocationContext;
    this.response = response;
  }

  protected InvocationContext getInvocationContext() {
    return invocationContext;
  }

  protected JsonObjectBuilder getEntityBuilder() {
    return entityBuilder;
  }

  protected Response<T> getResponse() {
    return response;
  }

  protected javax.ws.rs.core.Response toResponse() {
    this.entityBuilder = Json.createObjectBuilder();
    addMessages();
    if (getResponse().isNotFound()) {
      return
        javax.ws.rs.core.Response
          .status(javax.ws.rs.core.Response.Status.NOT_FOUND)
          .entity(getEntityBuilder().build())
          .build();
    }
    if (getResponse().isServiceNotAvailable()) {
      return
        javax.ws.rs.core.Response
          .status(javax.ws.rs.core.Response.Status.SERVICE_UNAVAILABLE)
          .entity(getEntityBuilder().build())
          .build();
    }
    if (getResponse().isUserBadRequest()) {
      return
        javax.ws.rs.core.Response
          .status(javax.ws.rs.core.Response.Status.BAD_REQUEST)
          .entity(getEntityBuilder().build())
          .build();
    }
    if (getResponse().isFrontEndBadRequest()) {
      getEntityBuilder().add("frontEndBadRequest", true);
      return
        javax.ws.rs.core.Response
          .status(javax.ws.rs.core.Response.Status.BAD_REQUEST)
          .entity(getEntityBuilder().build())
          .build();
    }
    if (getResponse().isSuccess()) {
      addResults();
      return javax.ws.rs.core.Response.ok(getEntityBuilder().build()).build();
    }
    throw new AssertionError("Unsupported Response " + getResponse().getClass());
  }

  private void addMessages() {
    if (getResponse().getMessages().isEmpty()) {
      return;
    }
    JsonArrayBuilder builder = Json.createArrayBuilder();
    for (Message pageMessage : getResponse().getMessages()) {
      builder.add(messageToJson(pageMessage));
    }
    getEntityBuilder().add("messages", builder);
  }

  private JsonObjectBuilder messageToJson(Message message) {
    JsonObjectBuilder builder = Json.createObjectBuilder();
    builder.add("severity", getSeverity(message));
    builder.add("message", message.getText());
    String property = message.getProperty();
    if (StringUtils.notEmpty(property)) {
      builder.add("property", property);
    }
    return builder;
  }

  private String getSeverity(Message message) {
    // Map the CBE message severities to the JET ones to make it easier for the CFE
    if (message.isSuccess()) {
      return "info";
    }
    if (message.isWarning()) {
      return "warning";
    }
    if (message.isFailure()) {
      return "error";
    }
    throw new AssertionError("Unsupported message type");
  }

  protected abstract void addResults();

  protected void addValueToJsonObject(JsonObjectBuilder builder, Value value) {
    Value unsettableValue = Value.unsettableValue(value);
    if (unsettableValue == null) {
      return;
    }
    if (value.isSettable()) {
      SettableValue settable = value.asSettable();
      if (settable.isSet()) {
        builder.add("set", true);
      } else if (settable.isUnset()) {
        builder.add("set", false);
      } else {
        // we don't know whether the property is set.
      }
    }
    if (unsettableValue.isUnknown()) {
      return;
    }
    if (unsettableValue.isModelToken()) {
      builder.add("modelToken", unsettableValue.asModelToken().getToken());
    } else {
      builder.add("value", valueToJson(unsettableValue));
    }
  }

  protected JsonValue valueToJson(Value value) {
    if (value.isArray()) {
      return arrayToJson(value.asArray());
    }
    if (value.isString()) {
      return stringToJson(value.asString());
    }
    if (value.isBoolean()) {
      return booleanToJson(value.asBoolean().getValue());
    }
    if (value.isLong()) {
      return Json.createValue(value.asLong().getValue());
    }
    if (value.isInt()) {
      return Json.createValue(value.asInt().getValue());
    }
    if (value.isDouble()) {
      return Json.createValue(value.asDouble().getValue());
    }
    if (value.isNullReference()) {
      return JsonValue.NULL;
    }
    if (value.isBeanTreePath()) {
      return beanTreePathToJson(value.asBeanTreePath());
    }
    if (value.isUnresolvedReference()) {
      return unresolvedReferenceToJson(value.asUnresolvedReference());
    }
    if (value.isReferenceAsReferences()) {
      return valueToJson(value.asReferenceAsReferences().asReference());
    }
    if (value.isSecret()) {
      return secretToJson(value.asSecret());
    }
    if (value.isDate()) {
      return dateToJson(value.asDate().getValue());
    }
    if (value.isProperties()) {
      return propertiesToJson(value.asProperties());
    }
    if (value.isDateAsLong()) {
      return valueToJson(value.asDateAsLong().asDate());
    }
    if (value.isHealthState()) {
      return Json.createValue(value.asHealthState().getValue());
    }
    if (value.isThrowable()) {
      return throwableToJson(value.asThrowable());
    }
    throw new AssertionError("Unsupported value: " + value.getClass());
  }

  private JsonValue stringToJson(StringValue value) {
    String str = value.getValue();
    if (str == null) {
      return JsonValue.NULL;
    } else {
      return Json.createValue(str);
    }
  }

  private JsonValue secretToJson(SecretValue value) {
    String str = value.getValue();
    if (str == null) {
      return JsonValue.NULL;
    } else {
      return Json.createValue("********");
    }
  }

  private JsonValue propertiesToJson(PropertiesValue value) {
    Properties properties = value.getValue();
    JsonObjectBuilder builder = Json.createObjectBuilder();
    for (String key : properties.stringPropertyNames()) {
      String val = properties.getProperty(key);
      builder.add(key, val);
    }
    return builder.build();
  }

  private JsonValue throwableToJson(ThrowableValue value) {
    return throwableToJson(value.getValue());
  }

  private JsonValue throwableToJson(Throwable throwable) {
    if (throwable == null) {
      return JsonValue.NULL;
    }
    JsonObjectBuilder builder = Json.createObjectBuilder();
    builder.add("message", throwable.getMessage());
    builder.add("cause", throwableToJson(throwable.getCause()));
    return builder.build();
  }

  private JsonValue arrayToJson(ArrayValue array) {
    JsonArrayBuilder builder = Json.createArrayBuilder();
    for (Value value : array.getValues()) {
      JsonObjectBuilder itemBuilder = Json.createObjectBuilder();
      addValueToJsonObject(itemBuilder, value);
      builder.add(itemBuilder);
    }
    return builder.build();
  }

  private JsonValue unresolvedReferenceToJson(UnresolvedReference unresolvedReference) {
    String key = unresolvedReference.getKey();
    return
      Json.createObjectBuilder()
        .add("label", key)
        .add("unresolvedReference", key)
        .build();
  }

  private JsonValue booleanToJson(boolean val) {
    return (val) ? JsonValue.TRUE : JsonValue.FALSE;
  }

  private JsonValue dateToJson(Date date) {
    String dateAsString = "";
    if (date != null) {
      // Convert the date to an user-visible string.
      dateAsString = new SimpleDateFormat(DISPLAYED_DATE_TIME_FORMAT).format(date);
    }
    return Json.createValue(dateAsString);
  }

  protected JsonValue beanTreePathToJson(BeanTreePath beanTreePath) {
    return beanTreePathToJson(beanTreePath, "");
  }

  protected JsonValue beanTreePathToJson(BeanTreePath beanTreePath, String queryParams) {
    return beanTreePathToJson(beanTreePath, getBeanTreePathLabel(beanTreePath), queryParams);
  }

  protected JsonValue beanTreePathToJson(BeanTreePath beanTreePath, String label, String queryParams) {
    return
      Json.createObjectBuilder()
        .add("label", label)
        .add("resourceData", getBackendRelativeUri(beanTreePath, queryParams))
        .build();
  }

  private String getBeanTreePathLabel(BeanTreePath beanTreePath) {
    if (beanTreePath == null) {
      return getInvocationContext().getLocalizer().localizeString(LocalizedConstants.NULL_REFERENCE);
    }
    if (beanTreePath.isRoot()) {
      // There is no label for the root bean of the repo.
      // This isn't a problem since the user never sees it anyway.
      return "";
    }
    BeanTreePathSegment lastSegment = beanTreePath.getLastSegment();
    BeanChildDef childDef = lastSegment.getChildDef();
    if (childDef.isCollection() && lastSegment.isKeySet()) {
      return lastSegment.getKey();
    } else {
      return getInvocationContext().getLocalizer().localizeString(childDef.getLabel());
    }
  }

  private JsonValue getBackendRelativeUri(BeanTreePath beanTreePath, String queryParams) {
    if (beanTreePath == null) {
      return JsonValue.NULL;
    }
    return getBackendRelativeUri(beanTreePath.getPath(), queryParams);
  }

  protected JsonValue getBackendRelativeUri(Path rootRelativePath, String queryParams) {
    Path connectionRelativePath = new Path();
    String pageRepoName =
      getInvocationContext().getPageRepo().getPageRepoDef().getName();
    connectionRelativePath.addComponent(pageRepoName);
    connectionRelativePath.addComponent("data");
    connectionRelativePath.addPath(rootRelativePath);
    String backendRelativeUri =
      UriUtils.getBackendRelativeUri(getInvocationContext(), connectionRelativePath)
      +
      queryParams;
    return Json.createValue(backendRelativeUri);
  }
}
