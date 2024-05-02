// Copyright (c) 2021, 2024, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.customizers;

import java.util.ArrayList;
import java.util.List;
import java.util.Properties;
import javax.json.JsonObject;

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
public abstract class DeploymentUploadableCreatableBeanCollectionResource extends CreatableBeanCollectionResource {

  @Override
  protected javax.ws.rs.core.Response createCollectionChild(JsonObject requestBody) {
    // The user wants to deploy an app whose files are already on the server.
    // Use the DeploymentManager (insteaqd of the WLS REST convenience endpoint)
    // so that we can specify the deployment options.
    return createCreateHelper().createBean(getInvocationContext(), requestBody);
  }

  protected abstract DeploymentCreateHelper createCreateHelper();

  protected abstract static class DeploymentCreateHelper extends CreateHelper {
    InvocationContext ic;
    private List<FormProperty> formProperties;
  
    @Override
    protected Response<Void> createBean(InvocationContext ic, List<FormProperty> formProperties) {
      this.ic = ic;
      this.formProperties = formProperties;
      return ConfigurationTransactionHelper.editConfiguration(
          ic,
          new ConfigurationTransactionHelper.ConfigurationEditor() {
            @Override
            public Response<Void> editConfiguration() {
              Response<Void> response = new Response<>();
              Response<Value> createResponse = createDeployment();
              if (!createResponse.isSuccess()) {
                return response.copyUnsuccessfulResponse(createResponse);
              }
              return response.setSuccess(null);
            }
          }
      );
    }

    private Response<Value> createDeployment() {
      String name = getStringProperty("Name", true);
      String applicationPath = getStringProperty("SourcePath", true);
      String plan = getStringProperty("PlanPath", false);
      Properties deploymentOptions = getDeploymentOptions();
      String startOption = getStringProperty("OnDeployment", false);
      boolean startFlag = true;
      if ("startInAdminMode".equals(startOption)) {
        deploymentOptions.setProperty("adminMode", "true");
      } else if ("doNotStart".equals(startOption)) {
        startFlag = false;
      }
      return customizeAction(name, applicationPath, getTargets(), getPlan(), deploymentOptions, startFlag);
    }
  
    private Response<Value> customizeAction(
      String name,
      String applicationPath,
      List<Value> targets,
      String plan,
      Properties deploymentOptions,
      boolean startApp
    ) {
      BeanTreePath dmBTP =
        BeanTreePath.create(ic.getBeanTreePath().getBeanRepo(), new Path("DomainRuntime.DeploymentManager"));
      InvocationContext dmIC = new InvocationContext(ic, dmBTP);
      Path path = new Path((startApp) ? "deploy_name_applicationPath_targets_plan_deploymentOptions"
          : "distribute_name_applicationPath_targets_plan_deploymentOptions");
      BeanActionDef actionDef =
        dmBTP.getTypeDef().getActionDef(path);
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

    protected String getPlan() {
      // plans are not supported by default
      return null;
    }
  
    protected List<Value> getTargets() {
      // targets are supported by default
      List<Value> targets = new ArrayList<>();
      FormProperty fp = getFormProperty("Targets", false);
      if (fp != null) {
        ArrayValue targetsArrayValue = fp.getValue().asSettable().getValue().asArray();
        List<Value> targetsListFromForm = targetsArrayValue.getValues();
        for (Value one : targetsListFromForm) {
          targets.add(new StringValue(((BeanTreePath)one).getLastSegment().getKey()));
        }
      }
      return targets;
    }
  
    // The deployment options are unique for every kind of deployment.
    // The DeploymentManagerMBean.deploy() method recognizes the deployment options specified
    // in DeploymentManagerImpl.deployRecognizedOptions
    abstract Properties getDeploymentOptions();

    protected String getStringProperty(String propertyName, boolean required) {
      FormProperty formProperty = getFormProperty(propertyName, required);
      return (formProperty != null) ? formProperty.getValue().asSettable().getValue().asString().getValue() : null;
    }

    protected int getIntProperty(String propertyName, boolean required) {
      FormProperty formProperty = getFormProperty(propertyName, required);
      if (formProperty == null) {
        return -1;
      }
      return formProperty.getValue().asSettable().getValue().asInt().getValue();
    }

    protected boolean getBooleanProperty(String propertyName, boolean required, boolean dflt) {
      FormProperty formProperty = getFormProperty(propertyName, required);
      return (formProperty != null) ? formProperty.getValue().asSettable().getValue().asBoolean().getValue() : dflt;
    }

    private FormProperty getFormProperty(String propertyName, boolean required) {
      for (FormProperty formProperty : formProperties) {
        if (propertyName.equals(formProperty.getName())) {
          return formProperty;
        }
      }
      if (required) {
        throw new AssertionError("Missing required form property: " + propertyName + " " + formProperties);
      } else {
        return null;
      }
    }
  }
}
