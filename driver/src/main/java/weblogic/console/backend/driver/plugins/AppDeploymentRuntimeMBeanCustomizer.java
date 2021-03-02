// Copyright (c) 2020, 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.driver.plugins;

import java.util.logging.Logger;
import javax.json.Json;
import javax.json.JsonObject;
//import javax.json.JsonObjectBuilder;

import weblogic.console.backend.driver.InvocationContext;
import weblogic.console.backend.driver.WeblogicRuntime;
//import weblogic.console.backend.utils.Path;

/** Custom code for processing the AppDeploymentRuntimeMBean */
public class AppDeploymentRuntimeMBeanCustomizer {
  private static final Logger LOGGER = Logger.getLogger(AppDeploymentRuntimeMBeanCustomizer.class.getName());

  /**
   * Customize the AppDeploymentRuntimeMBean's startInAdminMode action
   */
  public static JsonObject customizeStartInAdminMode(
    InvocationContext invocationContext,
    WeblogicRuntime weblogicRuntime,
    String actionName,
    JsonObject arguments
  ) throws Exception {
    LOGGER.fine("customizeStartInAdminMode " + invocationContext);
    return
      customizeAction(
        invocationContext,
        weblogicRuntime,
        "start",
        Json
          .createObjectBuilder()
          .add("adminMode", "true")
          .build()
      );
  }

  /**
   * Customize the AppDeploymentRuntimeMBean's forceStop action
   */
  public static JsonObject customizeForceStop(
    InvocationContext invocationContext,
    WeblogicRuntime weblogicRuntime,
    String actionName,
    JsonObject arguments
  ) throws Exception {
    LOGGER.fine("customizeForceStop " + invocationContext);
    return
      customizeAction(
        invocationContext,
        weblogicRuntime,
        "stop",
        Json
          .createObjectBuilder()
          .add("gracefulIgnoreSessions", "true")
          .build()
      );
  }

  /**
   * Customize the AppDeploymentRuntimeMBean's stopToAdminMode action
   */
  public static JsonObject customizeStopToAdminMode(
    InvocationContext invocationContext,
    WeblogicRuntime weblogicRuntime,
    String actionName,
    JsonObject arguments
  ) throws Exception {
    LOGGER.fine("customizeStopToAdminMode " + invocationContext);
    return
      customizeAction(
        invocationContext,
        weblogicRuntime,
        "stop",
        Json
          .createObjectBuilder()
          .add("adminMode", "true")
          .add("gracefulProductionToAdmin", "true")
          .build()
      );
  }

  private static JsonObject customizeAction(
    InvocationContext invocationContext,
    WeblogicRuntime weblogicRuntime,
    String actionName,
    JsonObject deploymentOptions
  ) throws Exception {
    return
      weblogicRuntime.invokeAction(
        invocationContext,
        invocationContext.getIdentity().getUnfoldedBeanPathWithIdentities(),
        actionName,
        true, // asynchronous
        Json
          .createObjectBuilder()
          .add("targets", Json.createArrayBuilder()) // all servers the app is deployed to
          .add("deploymentOptions", deploymentOptions)
          .build()
      ); 
  }
}
