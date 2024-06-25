// Copyright (c) 2021, 2024, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.customizers;

import java.util.List;
import java.util.Properties;
import java.util.logging.Logger;
import javax.json.Json;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;
import javax.json.JsonValue;
import javax.ws.rs.core.MediaType;

import org.glassfish.jersey.media.multipart.FormDataMultiPart;
import org.glassfish.jersey.media.multipart.file.StreamDataBodyPart;
import weblogic.remoteconsole.common.utils.Message;
import weblogic.remoteconsole.common.utils.Path;
import weblogic.remoteconsole.common.utils.StringUtils;
import weblogic.remoteconsole.server.repo.ArrayValue;
import weblogic.remoteconsole.server.repo.BeanTreePath;
import weblogic.remoteconsole.server.repo.ConfigurationTransactionHelper;
import weblogic.remoteconsole.server.repo.FileContentsValue;
import weblogic.remoteconsole.server.repo.FormProperty;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.Response;
import weblogic.remoteconsole.server.repo.Value;
import weblogic.remoteconsole.server.repo.weblogic.WebLogicRestInvoker;
import weblogic.remoteconsole.server.webapp.CreateHelper;
import weblogic.remoteconsole.server.webapp.CreateResponseMapper;
import weblogic.remoteconsole.server.webapp.FormRequestBodyMapper;

/**
 * Custom JAXRS resource for uploading and deploying AppDeploymentMBeans
 */

public class AppDeploymentMBeanUploadableCreatableBeanCollectionResource
  extends DeploymentUploadableCreatableBeanCollectionResource {

  private static final Logger LOGGER = Logger.getLogger(
      AppDeploymentMBeanUploadableCreatableBeanCollectionResource.class.getName());


  @Override
  protected DeploymentCreateHelper createCreateHelper() {
    return new AppDeploymentMBeanCreateHelper();
  }

  @Override
  protected javax.ws.rs.core.Response createCollectionChild(JsonObject requestBody, FormDataMultiPart parts) {
    if (parts == null) {
      return super.createCollectionChild(requestBody, parts);
    } else {
      if (!supportsDistributeApplication(getInvocationContext())) {
        LOGGER.info("'AppDeploymentUploadAndDeployResource' is not found. "
            + "Deployment and upload will continue with 'stageMode' set to default "
            + "and application will be started after deployment."
        );
        return CreateHelper.create(getInvocationContext(), requestBody, parts);
      } else {
        AppDeploymentMBeanCreateHelper helper = new AppDeploymentMBeanCreateHelper();
        return helper.createBean(getInvocationContext(), requestBody, parts);
      }
    }
  }

  private boolean supportsDistributeApplication(InvocationContext ic) {
    boolean support = ic.getPageRepo().getBeanRepo().getBeanRepoDef().supportsCapabilities(
        List.of("AppDeploymentRuntimeUploadAndDeploy"));
    return support;
  }

  private static class AppDeploymentMBeanCreateHelper extends DeploymentCreateHelper {
    private InvocationContext invocationContext;
    private List<FormProperty> formProperties;

    @Override
    protected String getPlan() {
      return getStringProperty("PlanPath", false);
    }

    @Override
    protected Properties getDeploymentOptions() {
      Properties deploymentOptions = new Properties();
      String stageMode = getStringProperty("StagingMode", false);
      if (stageMode != null && !stageMode.equals("default")) {
        deploymentOptions.setProperty("stageMode", stageMode);
      }
      return deploymentOptions;
    }

    @Override
    public javax.ws.rs.core.Response createBean(
        InvocationContext ic,
        JsonObject requestBody,
        FormDataMultiPart parts
    ) {
      if (parts == null) {
        return super.createBean(ic, requestBody, parts);
      }

      Response<BeanTreePath> response = new Response<>();
      // Unmarshal the request body.
      Response<List<FormProperty>> unmarshalResponse =
          FormRequestBodyMapper.fromRequestBody(ic, requestBody, parts);
      if (!unmarshalResponse.isSuccess()) {
        response.copyUnsuccessfulResponse(unmarshalResponse);
        return CreateResponseMapper.toResponse(ic, response);
      }
      // Find the new bean's expected path
      List<FormProperty> formProperties = unmarshalResponse.getResults();
      Response<BeanTreePath> pathResponse = computeNewBeanPath(ic, formProperties);
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
        Response<Void> r = createBeanUpload(ic, formProperties);
        if (!r.isSuccess()) {
          response.copyUnsuccessfulResponse(r);
          return CreateResponseMapper.toResponse(ic, response);
        }
      }
      response.setSuccess(newBeanPath);
      return CreateResponseMapper.toResponse(ic, response);
    }

    public Response<Void> createBeanUpload(InvocationContext ic, List<FormProperty> formProperties) {
      this.ic = ic;
      this.formProperties = formProperties;

      return ConfigurationTransactionHelper.editConfiguration(
          ic,
          new ConfigurationTransactionHelper.ConfigurationEditor() {
            @Override
            public Response<Void> editConfiguration() {
              return doCreate();
            }
          }
      );
    }

    private Response<Void> doCreate() {
      Path restPath = (new Path("domainRuntime"));
      restPath.addComponent("deploymentManager");
      restPath.addComponents("uploadAndDeploy");
      JsonObject requestBodyProp = formPropertyToJasonObject(formProperties);
      boolean useExpandedValues = false;
      boolean saveChanges = false;
      boolean async = true;
      Response<Void> response = new Response<>();
      FormDataMultiPart multiParts = getParts(requestBodyProp, formProperties);
      Response<JsonObject> postResponse =
          WebLogicRestInvoker.post(ic, restPath, multiParts, useExpandedValues, saveChanges, async);
      convertRestMessagesToRepoMessages(postResponse, response);
      return response.copyStatus(postResponse);
    }

    private JsonObject formPropertyToJasonObject(List<FormProperty> formProperties) {
      JsonObjectBuilder builder = Json.createObjectBuilder();
      setStringValue(formProperties, "Name", "name", builder);
      setStringValue(formProperties, "StagingModeUpload", "stageMode", builder);
      setStringValue(formProperties, "OnDeploymentUpload", "onDeployment", builder);
      setArrayValue(formProperties, "Targets", "targets", builder);
      return builder.build();
    }

    private void setStringValue(List<FormProperty> formProperties,
             String propName, String useName, JsonObjectBuilder builder) {
      for (FormProperty oneProp: formProperties) {
        if (oneProp.getName().equals(propName)) {
          builder.add(useName, Json.createValue(oneProp.getValue().asSettable().getValue().asString().getValue()));
        }
      }
    }

    private void setArrayValue(List<FormProperty> formProperties,
          String propName, String useName, JsonObjectBuilder builder) {
      JsonArrayBuilder arrayBuilder = Json.createArrayBuilder();
      for (FormProperty oneProp: formProperties) {
        if (oneProp.getName().equals(propName)) {
          ArrayValue targetsArrayValue = oneProp.getValue().asSettable().getValue().asArray();
          List<Value> targetsListFromForm = targetsArrayValue.getValues();
          for (Value one : targetsListFromForm) {
            JsonValue jsonValue = Json.createValue((((BeanTreePath) one).getLastSegment().getKey()));
            arrayBuilder.add(jsonValue);
          }
          builder.add(useName, arrayBuilder.build());
        }
      }
    }

    private FormDataMultiPart getParts(JsonObject requestBody,  List<FormProperty> formProperties) {
      FormDataMultiPart parts = new FormDataMultiPart();
      parts.field("model", requestBody.toString(), MediaType.APPLICATION_JSON_TYPE);
      for (FormProperty formProperty : formProperties) {
        Value value = formProperty.getValue().asSettable().getValue();
        if (value.isFileContents()) {
          FileContentsValue fcValue = value.asFileContents();
          parts.bodyPart(
              new StreamDataBodyPart(
                  formProperty.getName(),
                  fcValue.getInputStream(),
                  fcValue.getFileName()
              )
          );
        }
      }
      return parts;
    }

    private void convertRestMessagesToRepoMessages(Response<?> restResponse, Response<?> repoResponse) {
      for (Message restMessage : restResponse.getMessages()) {
        repoResponse.addMessage(
            new Message(
                restMessage.getSeverity(),
                StringUtils.getBeanName(restMessage.getProperty()),
                restMessage.getText()
            )
        );
      }
    }
  }
}
