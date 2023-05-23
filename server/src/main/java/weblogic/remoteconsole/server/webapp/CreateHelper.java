// Copyright (c) 2021, 2023, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.webapp;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import javax.json.JsonObject;

import org.glassfish.jersey.media.multipart.FormDataBodyPart;
import weblogic.remoteconsole.common.repodef.BeanPropertyDef;
import weblogic.remoteconsole.common.repodef.BeanTypeDef;
import weblogic.remoteconsole.common.repodef.LocalizedConstants;
import weblogic.remoteconsole.common.utils.Path;
import weblogic.remoteconsole.common.utils.StringUtils;
import weblogic.remoteconsole.server.repo.BeanEditorRepo;
import weblogic.remoteconsole.server.repo.BeanPropertyValue;
import weblogic.remoteconsole.server.repo.BeanPropertyValues;
import weblogic.remoteconsole.server.repo.BeanReaderRepoSearchBuilder;
import weblogic.remoteconsole.server.repo.BeanReaderRepoSearchResults;
import weblogic.remoteconsole.server.repo.BeanSearchResults;
import weblogic.remoteconsole.server.repo.BeanTreePath;
import weblogic.remoteconsole.server.repo.BeansPropertyValues;
import weblogic.remoteconsole.server.repo.FormProperty;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.PageEditorRepo;
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
    {
      Response<Void> r = ic.getPageRepo().asPageReaderRepo().verifyDoesntExist(ic, newBeanPath);
      if (!r.isSuccess()) {
        response.copyUnsuccessfulResponse(r);
        return CreateResponseMapper.toResponse(ic, response);
      }
    }
    // Create the bean
    {
      Response<Void> r = createBean(ic, properties);
      if (!r.isSuccess()) {
        response.copyUnsuccessfulResponse(r);
        return CreateResponseMapper.toResponse(ic, response);
      }
    }
    response.setSuccess(newBeanPath);
    return CreateResponseMapper.toResponse(ic, response);
  }

  protected Response<Void> createBean(InvocationContext ic, List<FormProperty> properties) {
    return ic.getPageRepo().asPageEditorRepo().create(ic, properties);
  }

  protected Response<Void> cloneBean(
    InvocationContext ic,
    BeanTreePath copyFromBTP,
    BeanTreePath copyToBTP,
    List<FormProperty> formProperties
  ) {
    // Don't clone properties that specified on the create form.
    Set<Path> propertiesToIgnore = new HashSet<>();
    for (FormProperty formProperty : formProperties) {
      propertiesToIgnore.add(formProperty.getFieldDef().asBeanPropertyDef().getPropertyPath());
    }
    return cloneBean(ic, copyFromBTP, copyToBTP, propertiesToIgnore);
  }

  protected Response<Void> cloneBean(
    InvocationContext ic,
    BeanTreePath copyFromBTP,
    BeanTreePath copyToBTP,
    Set<Path> propertiesToIgnore
  ) {
    Response<Void> response = new Response<>();
    InvocationContext copyFromIC = new InvocationContext(ic, copyFromBTP);
    InvocationContext copyToIC = new InvocationContext(ic, copyToBTP);
    // Get the properties that should be copied to the new bean.
    Response<BeansPropertyValues> getResponse = getPropertiesToClone(copyFromIC, copyToIC, propertiesToIgnore);
    if (!getResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(getResponse);
    }
    // Copy the properties to clone to the new bean
    {
      Response<Void> r = setCloneProperties(copyToIC, getResponse.getResults());
      if (!r.isSuccess()) {
        return response.copyUnsuccessfulResponse(r);
      }
    }
    return response.setSuccess(null);
  }

  // Get the property values that should be copied to the new bean
  private Response<BeansPropertyValues> getPropertiesToClone(
    InvocationContext copyFromIC,
    InvocationContext copyToIC,
    Set<Path> propertiesToIgnore
  ) {
    Response<BeansPropertyValues> response = new Response<>();
    BeansPropertyValues values = new BeansPropertyValues(copyToIC.getBeanTreePath());
    BeanTreePath copyFromBTP = copyFromIC.getBeanTreePath();
    // Figure out which properties we should fetch.
    List<BeanPropertyDef> propertyDefsToClone = getPropertyDefsToClone(copyFromBTP, propertiesToIgnore);
    // Make a search builder for those properties, ask it to return whether the properties have been set too.
    BeanReaderRepoSearchBuilder builder = beanEditor(copyFromIC).createSearchBuilder(copyFromIC, true);
    for (BeanPropertyDef propertyDef : propertyDefsToClone) {
      builder.addProperty(copyFromBTP, propertyDef);
    }
    // Get the properties from the bean we're cloning from
    Response<BeanReaderRepoSearchResults> searchResponse = builder.search();
    if (!searchResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(searchResponse);
    }
    BeanSearchResults beanResults = searchResponse.getResults().getBean(copyFromBTP);
    if (beanResults == null) {
      response.addFailureMessage("Bean to copy from does not exist: " + copyFromBTP);
      return response.setUserBadRequest();
    }
    // Convert them into the format for setting them on the new bean
    for (BeanPropertyDef propertyDef : propertyDefsToClone) {
      Value value = beanResults.getUnsortedValue(propertyDef);
      if (value != null) {
        SettableValue settableValue = value.asSettable();
        // Only copy properties that have been explictly set.
        if (settableValue.isSet()) {
          values.addPropertyValue(new BeanPropertyValue(propertyDef, settableValue));
        }
      } else {
        // The propery isn't available (e.g. because one of the folded beans doesn't exist)
        // Skip it.
      }
    }
    return response.setSuccess(values);
  }

  // Return the property defs that should be fetched from the bean to copy from
  private List<BeanPropertyDef> getPropertyDefsToClone(BeanTreePath copyFromBTP, Set<Path> propertiesToIgnore) {
    List<BeanPropertyDef> toClone = new ArrayList<>();
    for (BeanPropertyDef propertyDef : copyFromBTP.getTypeDef().getPropertyDefs()) {
      if (shouldCloneProperty(propertyDef, propertiesToIgnore)) {
        toClone.add(propertyDef);
      }
    }
    return toClone;
  }

  // Decides whether a property should be copied.
  private boolean shouldCloneProperty(
    BeanPropertyDef propertyDef,
    Set<Path> propertiesToIgnore
  ) {
    if (!propertyDef.isUpdateWritable()) {
      return false;
    }
    if (propertiesToIgnore.contains(propertyDef.getPropertyPath())) {
      // Don't include ones that are on the create form since 'createBean' will set them.
      return false;
    }
    if (!isSettable(propertyDef)) {
      // Almost all mbean properties support isSet, and a few (mostly WLDF) don't.
      // We want to keep the new bean's configuration sparse.
      // Therefore, only copy over the properties that we know are set.
      // Skip the ones where we can't tell.  Cloning is best effort
      // and the customer can explictly set the others if needed.
      return false;
    }
    return true;
  }

  private boolean isSettable(BeanPropertyDef propertyDef) {
    BeanTypeDef typeDef = propertyDef.getTypeDef();
    if (!propertyDef.getParentPath().isEmpty()) {
      typeDef = typeDef.getChildDef(propertyDef.getParentPath()).getChildTypeDef();
    }
    return typeDef.isSettable();
  }

  // Copy the property values of the bean to copy from to the new bean
  private Response<Void> setCloneProperties(InvocationContext copyToIC, BeansPropertyValues values) {
    Response<Void> response = new Response<>();
    for (BeanPropertyValues beanValues : values.getSortedBeansPropertyValues()) {
      Response<Void> r = beanEditor(copyToIC).updateBean(copyToIC, beanValues);
      if (!r.isSuccess()) {
        return response.copyUnsuccessfulResponse(r);
      }
    }
    return response.setSuccess(null);
  }

  // Sometimes a new bean is created then downstream modifications to
  // the new bean can fail.  Use this method to remove the new bean
  // so that the overall create is atomic.
  protected Response<Void> cleanupFailedCreate(InvocationContext ic, BeanTreePath newBeanBTP) {
    return pageEditor(ic).delete(new InvocationContext(ic, newBeanBTP));
  }

  protected PageEditorRepo pageEditor(InvocationContext ic) {
    return ic.getPageRepo().asPageEditorRepo();
  }

  protected BeanEditorRepo beanEditor(InvocationContext ic) {
    return ic.getPageRepo().getBeanRepo().asBeanEditorRepo();
  }

  protected Response<BeanTreePath> computeNewBeanPath(InvocationContext ic, List<FormProperty> properties) {
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
      if (property.getFieldDef().asBeanPropertyDef().getPropertyPath().equals(propertyPath)) {
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
        throw new AssertionError("Non-string key " + property.getFieldDef());
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
      if (property.getFieldDef().asBeanPropertyDef().getPropertyPath().equals(propertyPath)) {
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
        throw new AssertionError("Non-boolean key " + property.getFieldDef());
      }
    }
    // TBD if the property has a default value, use it?
    return dflt;
  }
}
