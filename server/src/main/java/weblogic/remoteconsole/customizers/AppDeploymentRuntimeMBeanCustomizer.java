// Copyright (c) 2020, 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.customizers;

import java.util.ArrayList;
import java.util.List;
import java.util.Properties;

import weblogic.remoteconsole.common.repodef.BeanActionDef;
import weblogic.remoteconsole.common.utils.Path;
import weblogic.remoteconsole.server.repo.ArrayValue;
import weblogic.remoteconsole.server.repo.BeanActionArg;
import weblogic.remoteconsole.server.repo.InvocationContext;
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
  public static Response<Value> startInAdminMode(InvocationContext ic) {
    Properties deploymentOptions = new Properties();
    deploymentOptions.setProperty("adminMode", "true");
    return customizeAction(ic, "start_targets_deploymentOptions", deploymentOptions);
  }

  /**
   * Customize the AppDeploymentRuntimeMBean's forceStop action
   */
  public static Response<Value> forceStop(InvocationContext ic) {
    Properties deploymentOptions = new Properties();
    deploymentOptions.setProperty("gracefulIgnoreSessions", "true");
    return customizeAction(ic, "stop_targets_deploymentOptions", deploymentOptions);
  }

  /**
   * Customize the AppDeploymentRuntimeMBean's stopToAdminMode action
   */
  public static Response<Value> stopToAdminMode(InvocationContext ic) {
    Properties deploymentOptions = new Properties();
    deploymentOptions.setProperty("adminMode", "true");
    deploymentOptions.setProperty("gracefulProductionToAdmin", "true");
    return customizeAction(ic, "stop_targets_deploymentOptions", deploymentOptions);
  }

  private static Response<Value> customizeAction(
    InvocationContext ic,
    String action,
    Properties deploymentOptions
  ) {
    // an empty set of targets mean invoke the action on all the servers the app is deployed to:
    Value targetsValue = new ArrayValue(new ArrayList<Value>());
    Value deploymentOptionsValue = new PropertiesValue(deploymentOptions);
    BeanActionDef actionDef = ic.getBeanTreePath().getTypeDef().getActionDef(new Path(action));
    List<BeanActionArg> args = new ArrayList<>();
    args.add(new BeanActionArg(actionDef.getParamDef("targets"), targetsValue));
    args.add(new BeanActionArg(actionDef.getParamDef("deploymentOptions"), deploymentOptionsValue));
    return ic.getPageRepo().getBeanRepo().asBeanReaderRepo().invokeAction(ic, actionDef, args);
  }
}
