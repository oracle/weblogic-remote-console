// Copyright (c) 2021, 2023, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.customizers;

import java.util.ArrayList;
import java.util.List;
import java.util.Properties;
import javax.json.JsonObject;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.glassfish.jersey.media.multipart.FormDataBodyPart;
import org.glassfish.jersey.media.multipart.FormDataParam;
import weblogic.remoteconsole.common.repodef.BeanActionDef;
import weblogic.remoteconsole.common.utils.Path;
import weblogic.remoteconsole.server.repo.ArrayValue;
import weblogic.remoteconsole.server.repo.BeanActionArg;
import weblogic.remoteconsole.server.repo.BeanTreePath;
import weblogic.remoteconsole.server.repo.ConfigurationTransactionHelper;
import weblogic.remoteconsole.server.repo.FormProperty;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.PropertiesValue;
import weblogic.remoteconsole.server.repo.Response;
import weblogic.remoteconsole.server.repo.StringValue;
import weblogic.remoteconsole.server.repo.Value;
import weblogic.remoteconsole.server.webapp.CreatableBeanCollectionResource;
import weblogic.remoteconsole.server.webapp.CreateHelper;

/**
 * Custom code for deploying application.
 * JAXRS resource for uploading and creating AppDeploymentMBeans for the upload case.
 * Console extension is used for calling the deploy() method of DomainRuntime/DeploymentManager, for the non-upload
 * case.
 */
public class AppDeploymentMBeanUploadableCreatableBeanCollectionResource extends CreatableBeanCollectionResource {
  @POST
  @Consumes(MediaType.MULTIPART_FORM_DATA)
  @Produces(MediaType.APPLICATION_JSON)
  public javax.ws.rs.core.Response post(
    @FormDataParam("requestBody") JsonObject requestBody,
    @FormDataParam("Source") FormDataBodyPart source,
    @FormDataParam("Plan") FormDataBodyPart plan
  ) {
    setCreateFormPagePath();
    return CreateHelper.create(getInvocationContext(), requestBody, source, plan);
  }

  protected javax.ws.rs.core.Response createCollectionChild(JsonObject requestBody) {
    return (new AppDeploymentMBeanCreateHelper()).createBean(getInvocationContext(), requestBody);
  }

  private static class AppDeploymentMBeanCreateHelper extends CreateHelper {
    @Override
    protected Response<Void> createBean(InvocationContext ic, List<FormProperty> formProperties) {
      return ConfigurationTransactionHelper.editConfiguration(
          ic,
          new ConfigurationTransactionHelper.ConfigurationEditor() {
            @Override
            public Response<Void> editConfiguration() {
              Response<Void> response = new Response<>();
              Response<Value> createResponse = createAppDeployment(ic, formProperties);
              if (!createResponse.isSuccess()) {
                return response.copyUnsuccessfulResponse(createResponse);
              }
              return response.setSuccess(null);
            }
          }
      );
    }

    private Response<Value> createAppDeployment(InvocationContext ic, List<FormProperty> formProperties) {
      // DeploymentManagerMBean.deploy() method
      // options recognized for deploy() is specified in DeploymentManagerImpl.deployRecognizedOptions
      // the one we want to set is "stageMode", "library", "AdminMode". There is no planStageMode.
      // System.out.println("DEBUG create " + ic.getBeanTreePath() + " " + formProperties);

      String name = getStringFromFormProperties("Name", formProperties, true);
      String applicationPath = getStringFromFormProperties("SourcePath", formProperties, true);
      String plan = getStringFromFormProperties("PlanPath", formProperties, false);
      Properties deploymentOptions = getPropertiesFromFormProperties(formProperties);
      List<Value> targetList = new ArrayList<>();
      FormProperty fp = findOptionalFormProperties("Targets", formProperties);
      if (fp != null) {
        ArrayValue targetsArrayValue = (ArrayValue) fp.getValue().asSettable().getValue();
        List<Value> targetsListFromForm = targetsArrayValue.getValues();
        for (Value one : targetsListFromForm) {
          targetList.add(new StringValue(
              ((BeanTreePath)one).getLastSegment().getKey())
          );
        }
      }
      return
        customizeAction(
            ic,
            name,
            applicationPath,
            targetList,
            plan,
            deploymentOptions
        );
    }

    private static Response<Value> customizeAction(
        InvocationContext ic,
        String name,
        String applicationPath,
        List<Value> targets,
        String plan,
        Properties deploymentOptions
    ) {
      BeanTreePath dmBTP =
          BeanTreePath.create(ic.getBeanTreePath().getBeanRepo(), new Path("DomainRuntime.DeploymentManager"));
      InvocationContext dmIC = new InvocationContext(ic, dmBTP);
      BeanActionDef actionDef =
          dmBTP.getTypeDef().getActionDef(new Path("deploy_name_applicationPath_targets_plan_deploymentOptions"));
      // Arguments order for deploy(): name, applicationPath, targets, plan, deploymentOptions
      Value deploymentOptionsValue = new PropertiesValue(deploymentOptions);
      List<BeanActionArg> args = new ArrayList<>();
      args.add(new BeanActionArg(actionDef.getParamDef("name"), new StringValue(name)));
      args.add(new BeanActionArg(actionDef.getParamDef("applicationPath"), new StringValue(applicationPath)));
      args.add(new BeanActionArg(actionDef.getParamDef("targets"), new ArrayValue(targets)));
      args.add(new BeanActionArg(actionDef.getParamDef("plan"), new StringValue(plan)));
      args.add(new BeanActionArg(actionDef.getParamDef("deploymentOptions"), deploymentOptionsValue));
      return dmIC.getPageRepo().getBeanRepo().asBeanReaderRepo().invokeAction(dmIC, actionDef, args);
    }

    private static String getStringFromFormProperties(
        String name,
        List<FormProperty> formProperties,
        boolean required
    ) {
      FormProperty formProperty = (required)
          ? findRequiredFormProperties(name, formProperties) :
          findOptionalFormProperties(name, formProperties);
      String value = (formProperty == null)
          ? null : formProperty.getValue().asSettable().getValue().asString().getValue();
      return value;
    }

    private static Boolean getBooleanFromFormProperty(
        String name,
        List<FormProperty> formProperties,
        boolean required
    ) {
      FormProperty formProperty = (required)
          ? findRequiredFormProperties(name, formProperties) :
          findOptionalFormProperties(name, formProperties);
      Boolean value = (formProperty == null)
          ? null : formProperty.getValue().asSettable().getValue().asBoolean().getValue();
      return value;
    }


    private static Properties getPropertiesFromFormProperties(List<FormProperty> formProperties) {
      Properties properties = new Properties();
      String stageMode = getStringFromFormProperties("NonNullStagingMode", formProperties, false);
      if (stageMode != null && ! stageMode.equals("default")) {
        properties.setProperty("stageMode", stageMode);
      }
      Boolean adminMode = getBooleanFromFormProperty("AdminMode", formProperties, false);
      if (adminMode != null) {
        properties.setProperty("adminMode", adminMode.toString());
      }
      return properties;
    }

    private static FormProperty findRequiredFormProperties(String propertyName, List<FormProperty> formProperties) {
      FormProperty formProperty = findOptionalFormProperties(propertyName, formProperties);
      if (formProperty == null) {
        throw new AssertionError("Missing required form property: " + propertyName + " " + formProperties);
      } else {
        return formProperty;
      }
    }

    private static FormProperty findOptionalFormProperties(String propertyName, List<FormProperty> formProperties) {
      for (FormProperty formProperty : formProperties) {
        if (propertyName.equals(formProperty.getName())) {
          return formProperty;
        }
      }
      return null;
    }
  }

}
