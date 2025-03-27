// Copyright (c) 2020, 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.customizers;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Properties;

import weblogic.console.utils.Path;
import weblogic.remoteconsole.common.repodef.BeanActionDef;
import weblogic.remoteconsole.common.repodef.BeanPropertyDef;
import weblogic.remoteconsole.common.repodef.BeanTypeDef;
import weblogic.remoteconsole.common.repodef.LocalizedConstants;
import weblogic.remoteconsole.common.repodef.PageActionDef;
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

/**
 * Custom code for processing the AppDeploymentRuntimeMBean
 */
public class AppDeploymentRuntimeMBeanCustomizer {

  private AppDeploymentRuntimeMBeanCustomizer() {
  }

  /**
   * Customize the AppDeploymentRuntimeMBean's startInAdminMode action
   */
  public static Value startInAdminMode(
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
  public static Value forceStop(
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
  public static Value stopToAdminMode(
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
  public static Value redeploySourceOnServer(
      InvocationContext ic,
      PageActionDef pageActionDef,
      List<FormProperty> formProperties
  ) {
    // Get the old plan path from the domainConfig tree first:
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
    BeanReaderRepoSearchResults searchResults = builder.search().getResults();
    BeanSearchResults appResults = searchResults.getBean(appBeanPath);
    if (appResults == null) {
      // the app doesn't exist
      throw Response.notFoundException();
    }
    //Handle the source path
    FormProperty sourcePathProperty = CustomizerUtils.findRequiredFormProperty("SourcePath", formProperties);
    Value sourcePathValue = sourcePathProperty.getValue().asSettable().getValue();
    FormProperty planPathProperty = CustomizerUtils.findRequiredFormProperty("PlanPath", formProperties);
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
   * Customize the AppDeploymentRuntimeMBean's update action, the Deployment Plan Path may be changed.
   */
  public static Value updatePlanOnServer(
      InvocationContext ic,
      PageActionDef pageActionDef,
      List<FormProperty> formProperties
  ) {
    // Get the old plan path from the domainConfig tree first:
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
    BeanReaderRepoSearchResults searchResults = builder.search().getResults();
    BeanSearchResults appResults = searchResults.getBean(appBeanPath);
    if (appResults == null) {
      // the app doesn't exist
      throw Response.notFoundException();
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

  // Validate that the app doesn't already have a plan
  // and return the default plan path
  public static void customizeCreatePlanActionInputForm(InvocationContext ic, Page page) {
    BeanTreePath appRtBTP = (ic.getIdentities() == null) ? ic.getBeanTreePath() : ic.getIdentities().get(0);
    String appName = appRtBTP.getLastSegment().getKey(); // MyApp
    Path appCfgPath = new Path("Domain.AppDeployments").childPath(appName); // Domain/AppDeployments/MyApp
    BeanTreePath appCfgBTP = BeanTreePath.create(appRtBTP.getBeanRepo(), appCfgPath);
    InvocationContext appCfgIc = new InvocationContext(ic, appCfgBTP);
    BeanTypeDef appCfgTypeDef = appCfgBTP.getTypeDef();
    BeanPropertyDef planPathPropertyDef = appCfgTypeDef.getPropertyDef(new Path("AbsolutePlanPath"));
    // Don't return whether properties are set.
    BeanReaderRepoSearchBuilder builder =
        ic.getPageRepo().getBeanRepo().asBeanReaderRepo().createSearchBuilder(appCfgIc, false);
    builder.addProperty(appCfgBTP, planPathPropertyDef);
    BeanReaderRepoSearchResults searchResults = builder.search().getResults();
    BeanSearchResults beanResults = searchResults.getBean(appCfgBTP);
    if (beanResults == null) {
      throw Response.notFoundException();
    }
    Value planPath = beanResults.getValue(planPathPropertyDef);
    if (planPath.asString().getValue() != null) {
      throw
        Response
          .userBadRequestException()
          .addFailureMessage(
            ic.getLocalizer().localizeString(
              LocalizedConstants.APPLICATION_HAS_PLAN,
              appName, // the application's name
              planPath.asString().getValue()
            )
          );
    } else {
      BeanReaderRepoSearchBuilder builder2 =
          ic.getPageRepo().getBeanRepo().asBeanReaderRepo().createSearchBuilder(ic, false);
      BeanPropertyDef defaultPlanPathPropertyDef =
          appRtBTP.getTypeDef().getPropertyDef(new Path("Configuration.DefaultPlanPath"));
      builder2.addProperty(appRtBTP, defaultPlanPathPropertyDef);
      BeanReaderRepoSearchResults searchResultsRT = builder2.search().getResults();
      BeanSearchResults beanResultsRT = searchResultsRT.getBean(appRtBTP);
      if (beanResultsRT == null) {
        return;
      }
      Value defaultPlanPathValue = beanResultsRT.getValue(defaultPlanPathPropertyDef);
      if (defaultPlanPathValue != null) {
        List<FormProperty> oldProperties = page.asForm().getProperties();
        List<FormProperty> newProperties =
          List.of(
            CustomizerUtils.createFormProperty("PlanPath", oldProperties, defaultPlanPathValue)
          );
        oldProperties.clear();
        oldProperties.addAll(newProperties);
      }
    }
  }

  public static void customizeRedeployActionInputForm(InvocationContext ic, Page page) {
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
    BeanReaderRepoSearchResults searchResults = builder.search().getResults();
    BeanSearchResults beanResults = searchResults.getBean(appCfgBTP);
    Value planPathValue = beanResults.getValue(planPathPropertyDef);
    Value sourcePathValue = beanResults.getValue(sourcePathPropertyDef);
    List<FormProperty> oldProperties = page.asForm().getProperties();
    List<FormProperty> newProperties =
      List.of(
        CustomizerUtils.createFormProperty("PlanPath", oldProperties, planPathValue),
        CustomizerUtils.createFormProperty("SourcePath", oldProperties, sourcePathValue)
      );
    oldProperties.clear();
    oldProperties.addAll(newProperties);
  }


  public static void customizeUpdatePlanActionInputForm(InvocationContext ic, Page page) {
    commonPlanActionInputForm(ic, page, false);
  }

  private static void commonPlanActionInputForm(InvocationContext ic, Page page, boolean needToExist) {
    // ic.getIdentities() is null when called from a form, and an array of 1 when called from a table:
    BeanTreePath appRtBTP = (ic.getIdentities() == null) ? ic.getBeanTreePath() : ic.getIdentities().get(0);
    String appName = appRtBTP.getLastSegment().getKey(); // MyApp
    Path appCfgPath = new Path("Domain.AppDeployments").childPath(appName); // Domain/AppDeployments/MyApp
    BeanTreePath appCfgBTP = BeanTreePath.create(appRtBTP.getBeanRepo(), appCfgPath);
    InvocationContext appCfgIc = new InvocationContext(ic, appCfgBTP);
    BeanTypeDef appCfgTypeDef = appCfgBTP.getTypeDef();
    BeanPropertyDef planPathPropertyDef = appCfgTypeDef.getPropertyDef(new Path("AbsolutePlanPath"));
    // Don't return whether properties are set.
    BeanReaderRepoSearchBuilder builder =
        ic.getPageRepo().getBeanRepo().asBeanReaderRepo().createSearchBuilder(appCfgIc, false);
    builder.addProperty(appCfgBTP, planPathPropertyDef);
    BeanReaderRepoSearchResults searchResults = builder.search().getResults();
    BeanSearchResults beanResults = searchResults.getBean(appCfgBTP);
    if (beanResults == null) {
      throw Response.notFoundException();
    }
    Value planPath = beanResults.getValue(planPathPropertyDef);
    if (needToExist && planPath.asString().getValue() == null) {
      throw
        Response
          .userBadRequestException()
          .addFailureMessage(
            ic.getLocalizer().localizeString(
              LocalizedConstants.APPLICATION_HAS_NO_PLAN,
              appName
            )
          );
    } else {
      List<FormProperty> oldProperties = page.asForm().getProperties();
      List<FormProperty> newProperties =
        List.of(
          CustomizerUtils.createFormProperty("PlanPath", oldProperties, planPath)
        );
      oldProperties.clear();
      oldProperties.addAll(newProperties);
    }
  }

  private static Value customizeAction(
    InvocationContext ic,
    String action,
    Properties deploymentOptions
  ) {
    return customizeAction(ic, action, deploymentOptions, Map.of());
  }

  private static Value customizeAction(
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
    return response.getResults();
  }
}
