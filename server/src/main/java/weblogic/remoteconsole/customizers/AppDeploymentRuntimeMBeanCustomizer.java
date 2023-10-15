// Copyright (c) 2020, 2023, Oracle and/or its affiliates.
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
import weblogic.remoteconsole.server.repo.StringValue;
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

  /**
   * Customize the AppDeploymentRuntimeMBean's redeploy method
   */
  public static Response<Value> redeploy(
    InvocationContext ic,
    PageActionDef pageActionDef,
    List<FormProperty> formProperties
  ) {
    return
      customizeAction(
        ic,
        "redeploy_targets_applicationPath_plan_deploymentOptions",
        new Properties(),
        Map.of("applicationPath", new StringValue(null), "plan", new StringValue(null))
      );
  }

  /**
   * Customize the AppDeploymentRuntimeMBean's update action
   */
  public static Response<Value> update(
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
    return ic.getPageRepo().getBeanRepo().asBeanReaderRepo().invokeAction(ic, actionDef, args);
  }
}
