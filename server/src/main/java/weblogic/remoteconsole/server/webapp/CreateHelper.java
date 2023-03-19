// Copyright (c) 2021, 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.webapp;

import java.util.List;
import javax.json.JsonObject;

import org.glassfish.jersey.media.multipart.FormDataBodyPart;
import weblogic.remoteconsole.common.repodef.LocalizedConstants;
import weblogic.remoteconsole.common.utils.Path;
import weblogic.remoteconsole.common.utils.StringUtils;
import weblogic.remoteconsole.server.repo.BeanTreePath;
import weblogic.remoteconsole.server.repo.FormProperty;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.Response;
import weblogic.remoteconsole.server.repo.SettableValue;
import weblogic.remoteconsole.server.repo.Value;

/**
 * Utility code called by JAXRS resources to create a bean.
 */
public class CreateHelper {

  protected CreateHelper() {
  }

  public static javax.ws.rs.core.Response create(
    InvocationContext ic,
    JsonObject requestBody,
    FormDataBodyPart... uploadedFiles
  ) {
    return (new CreateHelper()).createBean(ic, requestBody, uploadedFiles);
  }

  public javax.ws.rs.core.Response createBean(
    InvocationContext ic,
    JsonObject requestBody,
    FormDataBodyPart... uploadedFiles
  ) {
    Response<BeanTreePath> response = new Response<>();
    // Unmarshal the request body.
    Response<List<FormProperty>> unmarshalResponse =
      FormRequestBodyMapper.fromRequestBody(ic, requestBody, uploadedFiles);
    if (!unmarshalResponse.isSuccess()) {
      response.copyUnsuccessfulResponse(unmarshalResponse);
      return CreateResponseMapper.toResponse(ic, response);
    }
    // Find the new bean's expected path
    List<FormProperty> properties = unmarshalResponse.getResults();
    Response<BeanTreePath> pathResponse = computeNewBeanPath(ic, properties);
    if (!pathResponse.isSuccess()) {
      response.copyUnsuccessfulResponse(pathResponse);
      return CreateResponseMapper.toResponse(ic, response);
    }
    BeanTreePath newBeanPath = pathResponse.getResults();
    // Make sure the bean doesn't exist
    Response<Void> doesntExistResponse =
      ic.getPageRepo().asPageReaderRepo().verifyDoesntExist(ic, newBeanPath);
    if (!doesntExistResponse.isSuccess()) {
      response.copyUnsuccessfulResponse(doesntExistResponse);
      return CreateResponseMapper.toResponse(ic, response);
    }
    // Create the bean
    Response<Void> createResponse = createBean(ic, properties);
    if (!createResponse.isSuccess()) {
      response.copyUnsuccessfulResponse(createResponse);
      return CreateResponseMapper.toResponse(ic, response);
    }
    response.setSuccess(newBeanPath);
    return CreateResponseMapper.toResponse(ic, response);
  }

  protected Response<Void> createBean(InvocationContext ic, List<FormProperty> properties) {
    return ic.getPageRepo().asPageEditorRepo().create(ic, properties);
  }

  private Response<BeanTreePath> computeNewBeanPath(InvocationContext ic, List<FormProperty> properties) {
    Response<BeanTreePath> response = new Response<>();
    // returns the new bean's BeanTreePath
    BeanTreePath creatorBeanPath = ic.getBeanTreePath();
    if (creatorBeanPath.isOptionalSingleton()) {
      // The create call is directly on the optional singleton.
      return response.setSuccess(creatorBeanPath);
    } else if (creatorBeanPath.isCollection()) {
      // The create call is in the collection.
      // Find the new bean's key (usually Name) and use it
      // to constuct the new bean's path.
      Response<String> keyResponse = getKey(ic, properties);
      if (!keyResponse.isSuccess()) {
        return response.copyUnsuccessfulResponse(keyResponse);
      }
      Path collectionPath = creatorBeanPath.getPath();
      String childKey = keyResponse.getResults();
      // Note: can't use creatorBeanPath.childPath(childKey) since it assumes we want the entire collection
      // e.g. Servers + foo -> Servers/*/foo
      // v.s. Servers + foo -> Servers/foo
      Path childPath = collectionPath.childPath(childKey);
      BeanTreePath childBeanPath = BeanTreePath.create(creatorBeanPath.getBeanRepo(), childPath);
      return response.setSuccess(childBeanPath);
    } else {
      throw new AssertionError("Not an optional singleton or collection");
    }
  }

  protected Response<String> getKey(InvocationContext ic, List<FormProperty> properties) {
    return
      findRequiredStringProperty(
        ic,
        ic.getBeanTreePath().getTypeDef().getKeyPropertyDef().getPropertyPath(),
        properties
      );
  }

  protected Response<String> findRequiredStringProperty(
    InvocationContext ic,
    Path propertyPath,
    List<FormProperty> properties
  ) {
    String value = findOptionalStringProperty(propertyPath, properties);
    Response<String> response = new Response<>();
    if (StringUtils.isEmpty(value)) {
      response.addFailureMessage(
        ic.getLocalizer().localizeString(
          LocalizedConstants.REQUIRED_PROPERTY_NOT_SPECIFIED,
          propertyPath
        )
      );
      return response.setUserBadRequest();
    }
    return response.setSuccess(value);
  }

  protected String findOptionalStringProperty(
    Path propertyPath,
    List<FormProperty> properties
  ) {
    for (FormProperty property : properties) {
      if (property.getPropertyDef().getPropertyPath().equals(propertyPath)) {
        return getStringPropertyValue(property);
      }
    }
    return null;
  }

  private String getStringPropertyValue(FormProperty property) {
    // request bodies always send in settable values:
    SettableValue settableValue = property.getValue().asSettable();
    if (!settableValue.isUnset()) {
      Value value = settableValue.getValue();
      if (value.isString()) {
        if (StringUtils.notEmpty(value.asString().getValue())) {
          return value.asString().getValue();
        }
      } else {
        throw new AssertionError("Non-string key " + property.getPropertyDef());
      }
    }
    return null;
  }


  protected boolean findOptionalBooleanProperty(
    Path propertyPath,
    List<FormProperty> properties,
    boolean dflt
  ) {
    for (FormProperty property : properties) {
      if (property.getPropertyDef().getPropertyPath().equals(propertyPath)) {
        return getBooleanPropertyValue(property, dflt);
      }
    }
    return dflt;
  }

  private boolean getBooleanPropertyValue(FormProperty property, boolean dflt) {
    // request bodies always send in settable values:
    SettableValue settableValue = property.getValue().asSettable();
    if (!settableValue.isUnset()) {
      Value value = settableValue.getValue();
      if (value.isBoolean()) {
        return value.asBoolean().getValue();
      } else {
        throw new AssertionError("Non-boolean key " + property.getPropertyDef());
      }
    }
    // TBD if the property has a default value, use it?
    return dflt;
  }
}
