// Copyright (c) 2021, 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.customizers;

import java.util.ArrayList;
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
import weblogic.console.utils.Path;
import weblogic.console.utils.StringUtils;
import weblogic.remoteconsole.common.repodef.BeanPropertyDef;
import weblogic.remoteconsole.common.utils.Message;
import weblogic.remoteconsole.server.repo.ArrayValue;
import weblogic.remoteconsole.server.repo.BeanReaderRepoSearchBuilder;
import weblogic.remoteconsole.server.repo.BeanReaderRepoSearchResults;
import weblogic.remoteconsole.server.repo.BeanSearchResults;
import weblogic.remoteconsole.server.repo.BeanTreePath;
import weblogic.remoteconsole.server.repo.ConfigurationTransactionHelper;
import weblogic.remoteconsole.server.repo.FileContentsValue;
import weblogic.remoteconsole.server.repo.FormProperty;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.Response;
import weblogic.remoteconsole.server.repo.Value;
import weblogic.remoteconsole.server.repo.weblogic.WebLogicRestInvoker;
import weblogic.remoteconsole.server.webapp.CreateHelper;


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
      String securityModel = getStringProperty("SecurityModel", false);
      if (securityModel != null && !securityModel.equals("DDOnly")) {
        deploymentOptions.setProperty("securityModel", securityModel);
      }
      return deploymentOptions;
    }

    @Override
    protected Response<BeanTreePath> createBeanInternal(
      InvocationContext ic,
      List<FormProperty> properties,
      boolean multiPart
    ) {
      Response<BeanTreePath> response = super.createBeanInternal(ic, properties, multiPart);
      if (response.isSuccess()) {
        BeanTreePath defaultNewBeanPath = response.getResults();
        String baseAppName = defaultNewBeanPath.getLastSegment().getKey();
        Response<List<String>> matchResponse = getMatchingAppNames(ic, baseAppName);
        if (!matchResponse.isSuccess()) {
          // TBD - should we just navigate to the table instead?
          return response.copyUnsuccessfulResponse(matchResponse);
        }
        BeanTreePath collectionBeanPath = ic.getBeanTreePath();
        List<String> matchingNames = matchResponse.getResults();
        if (matchingNames.size() == 1) {
          // There's exactly one match.  Go there.
          String actualName = matchingNames.get(0);
          BeanTreePath actualNewBeanPath =
            BeanTreePath.create(
              collectionBeanPath.getBeanRepo(),
              collectionBeanPath.getPath().childPath(actualName)
            );
          response.setSuccess(actualNewBeanPath);
        } else {
          // There are either multiple matches or zero matches.  Go back to the collection instead.
          response.setSuccess(collectionBeanPath);
        }
      }
      return response;
    }

    @Override
    protected Response<Void> createBean(InvocationContext ic, List<FormProperty> properties, boolean multiPart) {
      if (!multiPart) {
        return super.createBean(ic, properties, multiPart);
      }
      this.ic = ic;
      this.formProperties = properties;

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

    private Response<List<String>> getMatchingAppNames(InvocationContext ic, String appName) {
      Response<List<String>> response = new Response<>();
      Response<List<String>> getResponse = getAppNames(ic);
      if (!getResponse.isSuccess()) {
        return response.copyUnsuccessfulResponse(getResponse);
      }
      List<String> matchingNames = new ArrayList<>();
      for (String candidateAppName : getResponse.getResults()) {
        if (appNameMatches(candidateAppName, appName)) {
          matchingNames.add(candidateAppName);
        }
      }
      return new Response<List<String>>().setSuccess(matchingNames);
    }

    private boolean appNameMatches(String candidateAppName, String unversionedAppName) {
      if (unversionedAppName.equals(candidateAppName)) {
        return true;
      }
      int versionIndex = candidateAppName.indexOf("#");
      if (versionIndex > -1) {
        String candidateUnversionedAppName = candidateAppName.substring(0, versionIndex);
        if (unversionedAppName.equals(candidateUnversionedAppName)) {
          return true;
        }
      }
      return false;
    }
  
    private Response<List<String>> getAppNames(InvocationContext ic) {
      Response<List<String>> response = new Response<>();
      BeanTreePath collectionBTP = ic.getBeanTreePath();
      BeanReaderRepoSearchBuilder builder =
        ic.getPageRepo().getBeanRepo().asBeanReaderRepo().createSearchBuilder(ic, false);
      BeanPropertyDef namePropertyDef =
        collectionBTP.getTypeDef().getPropertyDef("Name");
      builder.addProperty(collectionBTP, namePropertyDef);
      Response<BeanReaderRepoSearchResults> searchResponse = builder.search();
      if (!searchResponse.isSuccess()) {
        return response.copyUnsuccessfulResponse(searchResponse);
      }
      List<String> names = new ArrayList<>();
      for (BeanSearchResults beanResults : searchResponse.getResults().getCollection(collectionBTP)) {
        names.add(beanResults.getValue(namePropertyDef).asString().getValue());
      }
      return response.setSuccess(names);
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
      setStringValue(formProperties, "SecurityModelUpload", "securityModel", builder);
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
