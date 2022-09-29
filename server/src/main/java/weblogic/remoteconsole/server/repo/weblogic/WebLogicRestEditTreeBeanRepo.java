// Copyright (c) 2021, 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo.weblogic;

import java.util.Map;
import java.util.logging.Logger;
import javax.json.Json;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;
import javax.json.JsonValue;
import javax.ws.rs.core.MediaType;

import org.glassfish.jersey.media.multipart.FormDataMultiPart;
import org.glassfish.jersey.media.multipart.file.StreamDataBodyPart;
import weblogic.remoteconsole.common.repodef.weblogic.WebLogicEditTreeBeanRepoDef;
import weblogic.remoteconsole.common.utils.Path;
import weblogic.remoteconsole.common.utils.WebLogicMBeansVersion;
import weblogic.remoteconsole.server.repo.BeanPropertyValue;
import weblogic.remoteconsole.server.repo.BeanPropertyValues;
import weblogic.remoteconsole.server.repo.BeanReaderRepoSearchBuilder;
import weblogic.remoteconsole.server.repo.BeanRepo;
import weblogic.remoteconsole.server.repo.BeanTreePath;
import weblogic.remoteconsole.server.repo.ChangeManagerBeanRepo;
import weblogic.remoteconsole.server.repo.FileContentsValue;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.Response;
import weblogic.remoteconsole.server.repo.SettableValue;
import weblogic.remoteconsole.server.repo.Value;

/**
 * This class manages the 'next' weblogic configuration (i.e. edit tree)
 * by using the WebLogic REST api on the admin server.
 */
public class WebLogicRestEditTreeBeanRepo extends WebLogicRestBeanRepo implements ChangeManagerBeanRepo { 
  private static final Logger LOGGER = Logger.getLogger(WebLogicRestEditTreeBeanRepo.class.getName());
  private static final String EDIT = "edit";
  private static final Path EDIT_PATH = new Path(EDIT);
  private static final Path CHANGE_MANAGER_PATH = EDIT_PATH.childPath("changeManager");

  public static BeanRepo getInstance(final InvocationContext ic) {
    return ic.getPageRepo().getBeanRepo();
  }

  public WebLogicRestEditTreeBeanRepo(final WebLogicMBeansVersion mbeansVersion) {
    super(
      mbeansVersion.findOrCreate(WebLogicEditTreeBeanRepoDef.class),
      Map.of(
        "Domain", EDIT
      )
    );
  }

  @Override
  public BeanReaderRepoSearchBuilder createSearchBuilder(InvocationContext invocationContext, boolean includeIsSet) {
    LOGGER.fine("createSearchBuilder " + invocationContext.getBeanTreePath());
    return new WebLogicRestEditTreeBeanRepoSearchBuilder(this, invocationContext, includeIsSet);
  }

  @Override
  public Response<Void> startEdit(InvocationContext ic) {
    return invokeChangeManagerAction(ic, "startEdit");
  }

  @Override
  public Response<Void> saveChanges(InvocationContext ic) {
    // The WLS REST api doesn't include a saveChanges operation.
    // However, if you POST to a bean, without making any changes to it,
    // then the WLS REST api saves the changes.
    Response<Void> response = new Response<>();
    Response<JsonObject> postResponse =
      WebLogicRestInvoker.post(
        ic,
        EDIT_PATH, // the domain mbean
        Json.createObjectBuilder().build(), // no properties
        false, // expandedValues
        true, // saveChanges,
        false // asynchronous
      );
    if (!postResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(postResponse);
    }
    return response.copyMessages(postResponse);
  }

  @Override
  public Response<Void> commitChanges(InvocationContext ic) {
    return invokeChangeManagerAction(ic, "activate");
  }

  @Override
  public Response<Void> discardChanges(InvocationContext ic) {
    return invokeChangeManagerAction(ic, "cancelEdit");
  }

  @Override
  public Response<Void> updateBean(InvocationContext ic, BeanPropertyValues propertyValues) {
    Response<Void> response = new Response<>();
    // Use expanded values if the property's type supports SettableBean
    boolean useExpandedValues = propertyValues.getBeanTreePath().getTypeDef().isSettable();
    boolean isCreate = false;
    Response<JsonObject> postResponse =
      WebLogicRestInvoker.post(
        ic,
        EDIT_PATH.childPath(getTreeRelativeRestPath(propertyValues.getBeanTreePath())),
        propertyValuesToJson(useExpandedValues, isCreate, propertyValues),
        useExpandedValues,
        false, // savehanges,
        false // asynchronous
      );
    convertRestMessagesToRepoMessages(postResponse, response);
    return response.copyStatus(postResponse);
  }

  @Override
  public Response<Void> createBean(InvocationContext ic, BeanPropertyValues propertyValues) {
    Response<Void> response = new Response<>();
    boolean useExpandedValues = false; // WLS REST doesn't support expanded values for create
    boolean isCreate = true;
    boolean saveChanges = false;
    JsonObject requestBody = propertyValuesToJson(useExpandedValues, isCreate, propertyValues);
    BeanTreePath beanTreePath = propertyValues.getBeanTreePath();
    Path restPath = EDIT_PATH.childPath(getTreeRelativeRestPath(beanTreePath));
    boolean async = beanTreePath.isAsyncCreate();
    Response<JsonObject> postResponse = null;
    if (isMultiPart(propertyValues)) {
      FormDataMultiPart parts = getParts(requestBody, propertyValues);
      postResponse =
        WebLogicRestInvoker.post(ic, restPath, parts, useExpandedValues, saveChanges, async);
    } else {
      postResponse =
        WebLogicRestInvoker.post(ic, restPath, requestBody, useExpandedValues, saveChanges, async);
    }
    convertRestMessagesToRepoMessages(postResponse, response);
    return response.copyStatus(postResponse);
  }

  @Override
  public Response<Void> deleteBean(InvocationContext ic, BeanTreePath beanTreePath) {
    Response<Void> response = new Response<>();
    Response<JsonObject> deleteResponse =
      WebLogicRestInvoker.delete(
        ic,
        EDIT_PATH.childPath(getTreeRelativeRestPath(beanTreePath)),
        false, // saveChanges,
        beanTreePath.isAsyncDelete()
      );
    if (!deleteResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(deleteResponse);
    }
    return response;
  }

  private boolean isMultiPart(BeanPropertyValues propertyValues) {
    for (BeanPropertyValue propertyValue : propertyValues.getPropertyValues()) {
      if (propertyValue.getValue().getValue().isFileContents()) {
        return true;
      }
    }
    return false;
  }

  private FormDataMultiPart getParts(JsonObject requestBody, BeanPropertyValues propertyValues) {
    FormDataMultiPart parts = new FormDataMultiPart();
    parts.field("model", requestBody.toString(), MediaType.APPLICATION_JSON_TYPE);
    for (BeanPropertyValue propertyValue : propertyValues.getPropertyValues()) {
      Value value = propertyValue.getValue().getValue();
      if (value.isFileContents()) {
        FileContentsValue fcValue = value.asFileContents();
        parts.bodyPart(
          new StreamDataBodyPart(
            propertyValue.getPropertyDef().getOnlinePropertyName(),
            fcValue.getInputStream(),
            fcValue.getFileName()
          )
        );
      }
    }
    return parts;
  }

  private JsonObject propertyValuesToJson(
    boolean useExpandedValues,
    boolean isCreate,
    BeanPropertyValues propertyValues
  ) {
    JsonObjectBuilder builder = Json.createObjectBuilder();
    for (BeanPropertyValue propertyValue : propertyValues.getPropertyValues()) {
      JsonValue jsonValue = propertyValueToJson(useExpandedValues, isCreate, propertyValue);
      if (jsonValue != null) {
        builder.add(propertyValue.getPropertyDef().getOnlinePropertyName(), jsonValue);
      }
    }
    return builder.build();
  }

  private JsonValue propertyValueToJson(
    boolean useExpandedValues,
    boolean isCreate,
    BeanPropertyValue propertyValue
  ) {
    SettableValue settableValue = propertyValue.getValue();
    boolean unset = settableValue.isUnset();
    if (unset) {
      if (isCreate) {
        // Skip the property since the user wants the default value,
        // which create sets up when the property isn't specified.
        return null; 
      } else if (!useExpandedValues) {
        // Skip the property since this bean doesn't support unsetting properties
        return null;
      }
    }
    Value value = settableValue.getValue();
    if (value != null && value.isFileContents()) {
      // these go into a multi part form (v.s. the json request body)
      return null;
    }
    JsonValue jsonValue = unset ? null : toJson(value);
    if (!useExpandedValues) {
      // expanded values aren't not supported for this bean and operation
      // so send the raw value instead
      return jsonValue;
    }
    JsonObjectBuilder builder = Json.createObjectBuilder();
    builder.add("set", !unset);
    if (!unset) {
      builder.add("value", jsonValue);
    }
    return builder.build();
  }

  private Response<Void> invokeChangeManagerAction(InvocationContext ic, String action) {
    Response<Void> response = new Response<>();
    Response<JsonObject> postResponse =
      WebLogicRestInvoker.post(
        ic,
        CHANGE_MANAGER_PATH.childPath(action),
        Json.createObjectBuilder().build(),
        false, // expandedValues,
        false, // saveChanges,
        false // asynchronous
      );
    if (!postResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(postResponse);
    }
    return response.copyMessages(postResponse);
  }
}
