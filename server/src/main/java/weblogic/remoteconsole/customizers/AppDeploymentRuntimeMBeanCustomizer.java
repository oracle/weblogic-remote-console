// Copyright (c) 2020, 2024, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.customizers;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Properties;

import weblogic.remoteconsole.common.repodef.BeanActionDef;
import weblogic.remoteconsole.common.repodef.BeanPropertyDef;
import weblogic.remoteconsole.common.repodef.BeanTypeDef;
import weblogic.remoteconsole.common.repodef.LocalizedConstants;
import weblogic.remoteconsole.common.repodef.PageActionDef;
import weblogic.remoteconsole.common.utils.Path;
import weblogic.remoteconsole.server.repo.ArrayValue;
import weblogic.remoteconsole.server.repo.BeanActionArg;
import weblogic.remoteconsole.server.repo.BeanReaderRepoSearchBuilder;
import weblogic.remoteconsole.server.repo.BeanReaderRepoSearchResults;
import weblogic.remoteconsole.server.repo.BeanSearchResults;
import weblogic.remoteconsole.server.repo.BeanTreePath;
import weblogic.remoteconsole.server.repo.FormProperty;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.Page;
import weblogic.remoteconsole.server.repo.PropertiesValue;
import weblogic.remoteconsole.server.repo.Response;
import weblogic.remoteconsole.server.repo.Value;
import weblogic.remoteconsole.server.webapp.BaseResource;

/**
 * Custom code for processing the AppDeploymentRuntimeMBean
 */
public class AppDeploymentRuntimeMBeanCustomizer {

  private AppDeploymentRuntimeMBeanCustomizer() {
  }

  /**
   * Customize the AppDeploymentRuntimeMBean's startInAdminMode action
   */
  public static Response<Value> startInAdminMode(
    InvocationContext ic,
    PageActionDef pageActionDef,
    List<FormProperty> formProperties
  ) {
    Properties deploymentOptions = new Properties();
    deploymentOptions.setProperty("adminMode", "true");
    return customizeAction(ic, "start_targets_deploymentOptions", deploymentOptions);
  }

  /**
   * Customize the AppDeploymentRuntimeMBean's forceStop action
   */
  public static Response<Value> forceStop(
    InvocationContext ic,
    PageActionDef pageActionDef,
    List<FormProperty> formProperties
  ) {
    Properties deploymentOptions = new Properties();
    deploymentOptions.setProperty("gracefulIgnoreSessions", "true");
    return customizeAction(ic, "stop_targets_deploymentOptions", deploymentOptions);
  }

  /**
   * Customize the AppDeploymentRuntimeMBean's stopToAdminMode action
   */
  public static Response<Value> stopToAdminMode(
    InvocationContext ic,
    PageActionDef pageActionDef,
    List<FormProperty> formProperties
  ) {
    Properties deploymentOptions = new Properties();
    deploymentOptions.setProperty("adminMode", "true");
    deploymentOptions.setProperty("gracefulProductionToAdmin", "true");
    return customizeAction(ic, "stop_targets_deploymentOptions", deploymentOptions);
  }

  /*
   * Redeploy the application for the case where both the source and deployment plan is on the server.
   * User may have changed location of the application or the deployment plan.
   */
  public static Response<Value> redeploySourceOnServer(
      InvocationContext ic,
      PageActionDef pageActionDef,
      List<FormProperty> formProperties
  ) {
    // Get the old plan path from the domainConfig tree first:
    Response<Value> response = new Response<>();
    // Don't return whether properties are set.
    BeanReaderRepoSearchBuilder builder =
        ic.getPageRepo().getBeanRepo().asBeanReaderRepo().createSearchBuilder(ic, false);
    String appName = ic.getBeanTreePath().getLastSegment().getKey();
    BeanTreePath appBeanPath =
        BeanTreePath.create(
            ic.getBeanTreePath().getBeanRepo(),
            (new Path("Domain.AppDeployments")).childPath(appName)
        );

    BeanPropertyDef planPropertyDef =
        appBeanPath.getTypeDef().getPropertyDef(new Path("AbsolutePlanPath"));
    builder.addProperty(appBeanPath, planPropertyDef);
    Response<BeanReaderRepoSearchResults> searchResponse = builder.search();
    if (!searchResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(searchResponse);
    }
    BeanSearchResults appResults = searchResponse.getResults().getBean(appBeanPath);
    if (appResults == null) {
      // the app doesn't exist
      return response.setNotFound();
    }
    //Handle the source path
    FormProperty sourcePathProperty = findRequiredFormProperty("SourcePath", formProperties);
    Value sourcePathValue = sourcePathProperty.getValue().asSettable().getValue();
    FormProperty planPathProperty = findRequiredFormProperty("PlanPath", formProperties);
    Value planPathValue = planPathProperty.getValue().asSettable().getValue();
    // Now invoke the low level update action:
    return
      customizeAction(
          ic,
          "redeploy_targets_applicationPath_plan_deploymentOptions",
          new Properties(),
          Map.of("applicationPath", sourcePathValue, "plan", planPathValue)
      );
  }


  /**
   * Customize the AppDeploymentRuntimeMBean's update action
   */
  public static Response<Value> updateExisting(
    InvocationContext ic,
    PageActionDef pageActionDef,
    List<FormProperty> formProperties
  ) {
    // Get the old plan path from the domainConfig tree first:
    Response<Value> response = new Response<>();
    // Don't return whether properties are set.
    BeanReaderRepoSearchBuilder builder =
      ic.getPageRepo().getBeanRepo().asBeanReaderRepo().createSearchBuilder(ic, false);
    String appName = ic.getBeanTreePath().getLastSegment().getKey();

    BeanTreePath appBeanPath =
      BeanTreePath.create(
        ic.getBeanTreePath().getBeanRepo(),
        (new Path("Domain.AppDeployments")).childPath(appName)
      );
    BeanPropertyDef planPropertyDef =
      appBeanPath.getTypeDef().getPropertyDef(new Path("AbsolutePlanPath"));
    builder.addProperty(appBeanPath, planPropertyDef);
    Response<BeanReaderRepoSearchResults> searchResponse = builder.search();
    if (!searchResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(searchResponse);
    }
    BeanSearchResults appResults = searchResponse.getResults().getBean(appBeanPath);
    if (appResults == null) {
      // the app doesn't exist
      return response.setNotFound();
    }
    Value planPath = appResults.getValue(planPropertyDef);
    // Now invoke the low level update action:
    return
      customizeAction(
        ic,
        "update_targets_plan_deploymentOptions",
        new Properties(),
        Map.of("plan", planPath)
      );
  }

  /**
   * Customize the AppDeploymentRuntimeMBean's update action, the Deployment Plan Path may be changed.
   */
  public static Response<Value> updatePlanOnServer(
      InvocationContext ic,
      PageActionDef pageActionDef,
      List<FormProperty> formProperties
  ) {
    // Get the old plan path from the domainConfig tree first:
    Response<Value> response = new Response<>();
    // Don't return whether properties are set.
    BeanReaderRepoSearchBuilder builder =
        ic.getPageRepo().getBeanRepo().asBeanReaderRepo().createSearchBuilder(ic, false);
    String appName = ic.getBeanTreePath().getLastSegment().getKey();

    BeanTreePath appBeanPath =
        BeanTreePath.create(
            ic.getBeanTreePath().getBeanRepo(),
            (new Path("Domain.AppDeployments")).childPath(appName)
        );
    BeanPropertyDef planPropertyDef =
        appBeanPath.getTypeDef().getPropertyDef(new Path("AbsolutePlanPath"));
    builder.addProperty(appBeanPath, planPropertyDef);
    Response<BeanReaderRepoSearchResults> searchResponse = builder.search();
    if (!searchResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(searchResponse);
    }
    BeanSearchResults appResults = searchResponse.getResults().getBean(appBeanPath);
    if (appResults == null) {
      // the app doesn't exist
      return response.setNotFound();
    }
    Value planPath = formProperties.get(0).getValue().asSettable().getValue();
    // Now invoke the low level update action:
    return
        customizeAction(
            ic,
            "update_targets_plan_deploymentOptions",
            new Properties(),
            Map.of("plan", planPath)
        );
  }

  public static Response<Value> updatePlanOnLocal(
      InvocationContext ic,
      PageActionDef pageActionDef,
      List<FormProperty> formProperties
  ) {
    BaseResource br = new AppDeploymentMBeanUploadableCreatableBeanCollectionResource();
    return null;
  }



  // Validate that the app doesn't already have a plan
  public static Response<Void> customizeCreatePlanActionInputForm(InvocationContext ic, Page page) {
    Response<Void> response = new Response<>();
    // ic.getIdentities() is null when called from a form, and an array of 1 when called from a table:
    BeanTreePath appBTP = (ic.getIdentities() == null) ? ic.getBeanTreePath() : ic.getIdentities().get(0);
    InvocationContext appIC = new InvocationContext(ic, appBTP);
    BeanTypeDef typeDef = appBTP.getTypeDef();
    BeanPropertyDef planPathPropertyDef = typeDef.getPropertyDef(new Path("DeploymentPlan.PlanPath"));
    // Don't return whether properties are set.
    BeanReaderRepoSearchBuilder builder =
        ic.getPageRepo().getBeanRepo().asBeanReaderRepo().createSearchBuilder(appIC, false);
    builder.addProperty(appBTP, planPathPropertyDef);
    Response<BeanReaderRepoSearchResults> searchResponse = builder.search();
    if (!searchResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(searchResponse);
    }
    BeanSearchResults beanResults = searchResponse.getResults().getBean(appBTP);
    if (beanResults == null) {
      return response.setNotFound();
    }
    Value planPath = beanResults.getValue(planPathPropertyDef);
    if (planPath != null) {
      response.setUserBadRequest();
      response.addFailureMessage(
        ic.getLocalizer().localizeString(
          LocalizedConstants.APPLICATION_HAS_PLAN,
          appBTP.getLastSegment().getKey(), // the application's name
          planPath.asString().getValue()
        )
      );
    } else {
      response.setSuccess(null);
    }
    return response;
  }

  public static Response<Void> customizeRedeployActionInputForm(InvocationContext ic, Page page) {
    Response<Void> response = new Response<>();
    BeanTreePath appRtBTP = (ic.getIdentities() == null) ? ic.getBeanTreePath() : ic.getIdentities().get(0);
    String appName = appRtBTP.getLastSegment().getKey(); // MyApp
    Path appCfgPath = new Path("Domain.AppDeployments").childPath(appName); // Domain/AppDeployments/MyApp
    BeanTreePath appCfgBTP = BeanTreePath.create(appRtBTP.getBeanRepo(), appCfgPath);
    InvocationContext appCfgIc = new InvocationContext(ic, appCfgBTP);
    BeanTypeDef appCfgTypeDef = appCfgBTP.getTypeDef();
    BeanPropertyDef planPathPropertyDef = appCfgTypeDef.getPropertyDef(new Path("AbsolutePlanPath"));
    BeanPropertyDef sourcePathPropertyDef = appCfgTypeDef.getPropertyDef(new Path("AbsoluteSourcePath"));
    BeanReaderRepoSearchBuilder builder =
        ic.getPageRepo().getBeanRepo().asBeanReaderRepo().createSearchBuilder(appCfgIc, false);
    builder.addProperty(appCfgBTP, planPathPropertyDef);
    builder.addProperty(appCfgBTP, sourcePathPropertyDef);
    Response<BeanReaderRepoSearchResults> searchResponse = builder.search();
    if (!searchResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(searchResponse);
    }
    BeanSearchResults beanResults = searchResponse.getResults().getBean(appCfgBTP);
    if (beanResults == null) {
      return response.setNotFound();
    }
    Value planPathValue = beanResults.getValue(planPathPropertyDef);
    Value sourcePathValue = beanResults.getValue(sourcePathPropertyDef);
    List<FormProperty> oldProperties = page.asForm().getProperties();
    List<FormProperty> newProperties =
        List.of(
            createFormProperty("PlanPath", oldProperties, planPathValue),
            createFormProperty("SourcePath", oldProperties, sourcePathValue)
        );
    oldProperties.clear();
    oldProperties.addAll(newProperties);
    response.setSuccess(null);
    return response;
  }


  public static Response<Void> customizeUpdatePlanActionInputForm(InvocationContext ic, Page page) {
    return commonPlanActionInputForm(ic, page, false);
  }

  // Validate that the app does have a plan and pass back the plan path.
  public static Response<Void> customizeEditExistingActionInputForm(InvocationContext ic, Page page) {
    return commonPlanActionInputForm(ic, page, true);
  }

  public static Response<Void> commonPlanActionInputForm(InvocationContext ic, Page page, boolean needToExist) {
    Response<Void> response = new Response<>();
    // ic.getIdentities() is null when called from a form, and an array of 1 when called from a table:
    BeanTreePath appBTP = (ic.getIdentities() == null) ? ic.getBeanTreePath() : ic.getIdentities().get(0);
    InvocationContext appIC = new InvocationContext(ic, appBTP);
    BeanTypeDef typeDef = appBTP.getTypeDef();
    BeanPropertyDef planPathPropertyDef = typeDef.getPropertyDef(new Path("DeploymentPlan.PlanPath"));
    // Don't return whether properties are set.
    BeanReaderRepoSearchBuilder builder =
        ic.getPageRepo().getBeanRepo().asBeanReaderRepo().createSearchBuilder(appIC, false);
    builder.addProperty(appBTP, planPathPropertyDef);
    Response<BeanReaderRepoSearchResults> searchResponse = builder.search();
    if (!searchResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(searchResponse);
    }
    BeanSearchResults beanResults = searchResponse.getResults().getBean(appBTP);
    if (beanResults == null) {
      return response.setNotFound();
    }
    Value planPath = beanResults.getValue(planPathPropertyDef);
    if (needToExist && planPath == null) {
      response.setUserBadRequest();
      response.addFailureMessage(
          ic.getLocalizer().localizeString(
              LocalizedConstants.APPLICATION_HAS_NO_PLAN,
              appBTP.getLastSegment().getKey() // the application's name
          )
      );
    } else {
      List<FormProperty> oldProperties = page.asForm().getProperties();
      List<FormProperty> newProperties =
          List.of(
              createFormProperty("PlanPath", oldProperties, planPath)
          );
      oldProperties.clear();
      oldProperties.addAll(newProperties);
      response.setSuccess(null);
    }
    return response;
  }


  private static FormProperty createFormProperty(
      String propName,
      List<FormProperty> oldProperties,
      Value propValue
  ) {
    return
        new FormProperty(
            findRequiredFormProperty(propName, oldProperties).getFieldDef(),
            propValue
        );
  }

  private static FormProperty findRequiredFormProperty(String propertyName, List<FormProperty> formProperties) {
    FormProperty formProperty = findOptionalFormProperty(propertyName, formProperties);
    if (formProperty == null) {
      throw new AssertionError("Missing required form property: " + propertyName + " " + formProperties);
    } else {
      return formProperty;
    }
  }


  private static FormProperty findOptionalFormProperty(String propertyName, List<FormProperty> formProperties) {
    for (FormProperty formProperty : formProperties) {
      if (propertyName.equals(formProperty.getName())) {
        return formProperty;
      }
    }
    return null;
  }

  private static Response<Value> customizeAction(
    InvocationContext ic,
    String action,
    Properties deploymentOptions
  ) {
    return customizeAction(ic, action, deploymentOptions, Map.of());
  }

  private static Response<Value> customizeAction(
    InvocationContext ic,
    String action,
    Properties deploymentOptions,
    Map<String,Value> extraArgs
  ) {
    // an empty set of targets mean invoke the action on all the servers the app is deployed to:
    Value targetsValue = new ArrayValue(List.of());
    Value deploymentOptionsValue = new PropertiesValue(deploymentOptions);
    BeanActionDef actionDef = ic.getBeanTreePath().getTypeDef().getActionDef(new Path(action));
    List<BeanActionArg> args = new ArrayList<>();
    args.add(new BeanActionArg(actionDef.getParamDef("targets"), targetsValue));
    args.add(new BeanActionArg(actionDef.getParamDef("deploymentOptions"), deploymentOptionsValue));
    for (Map.Entry<String,Value> extraArg : extraArgs.entrySet()) {
      args.add(new BeanActionArg(actionDef.getParamDef(extraArg.getKey()), extraArg.getValue()));
    }
    Response<Value> response = ic.getPageRepo().getBeanRepo().asBeanReaderRepo().invokeAction(ic, actionDef, args);
    if (response.isUserBadRequest() && response.getMessages().isEmpty()) {
      response.addFailureMessage(
          ic.getLocalizer().localizeString(LocalizedConstants.REFER_TO_DEPLOYMENT_TASKS_DASHBOARD)
      );
    }
    return response;
  }
}
