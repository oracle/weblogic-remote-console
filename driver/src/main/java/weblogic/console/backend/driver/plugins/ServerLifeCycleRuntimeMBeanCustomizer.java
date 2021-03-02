// Copyright (c) 2020, 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.driver.plugins;

import java.util.logging.Logger;
import javax.json.Json;
import javax.json.JsonArray;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;

import weblogic.console.backend.driver.CollectionValue;
import weblogic.console.backend.driver.ExpandedValue;
import weblogic.console.backend.driver.InvocationContext;
import weblogic.console.backend.driver.NoDataFoundException;
import weblogic.console.backend.driver.WeblogicObjectQueryBuilder;
import weblogic.console.backend.driver.WeblogicRuntime;
import weblogic.console.backend.utils.Path;

/** Custom code for processing the ServerLifeCycleRuntimeMBean */
public class ServerLifeCycleRuntimeMBeanCustomizer {

  // WLS REST api constants used more than once
  private static final String SERVERS = "servers";
  private static final String GRACEFUL_SHUTDOWN_TIMEOUT = "gracefulShutdownTimeout";
  private static final String IGNORE_SESSIONS_DURING_SHUTDOWN = "ignoreSessionsDuringShutdown";

  private static final Logger LOGGER = Logger.getLogger(ServerLifeCycleRuntimeMBeanCustomizer.class.getName());

  /**
   * Customize the ServerLifeCycleRuntimeMBean's restartSSL action
   */
  public static JsonObject customizeRestartSSL(
    InvocationContext invocationContext,
    WeblogicRuntime weblogicRuntime,
    String actionName,
    JsonObject arguments
  ) throws Exception {
    LOGGER.fine("customizeRestartSSL " + invocationContext);
    // invoke restartSSL on the corresponding server runtime mbean

    // The unfolded bean path the user invoked is serverLifeCycleRuntimes/serverName
    // Extract the server name from it
    String serverName = getServerName(invocationContext);

    // The unfolded bean path for the server runtime mbean is serverRuntimes/serverName
    Path serverRuntime = new Path("serverRuntimes");
    serverRuntime.addComponent(serverName);

    // This will 404 if the server runtime doesn't exist.
    // It's either because the server doesn't exist or the server isn't running.
    // Ideally, we should return a 404 if the server doesn't exist and
    // a 400 if the server isn't running.
    // That requires an extra call to see if the server exists.
    // Not worth it at this point.
    return
      weblogicRuntime.invokeAction(
        invocationContext,
        serverRuntime,
        "restartSSLChannels",
        false, // synchronous
        arguments
      );
  }

  /**
   * Customize the ServerLifeCycleRuntimeMBean's shutdown action
   */
  public static JsonObject customizeShutdown(
    InvocationContext invocationContext,
    WeblogicRuntime weblogicRuntime,
    String actionName,
    JsonObject arguments
  ) throws Exception {
    LOGGER.fine("customizeShutdown " + invocationContext);

    // Get the corresponding ServerMBean's gracefulShutdownTimeout & ignoreSessionsDuringShutdown
    JsonObject properties =
      getServerConfigurationProperties(
        invocationContext,
        weblogicRuntime,
        GRACEFUL_SHUTDOWN_TIMEOUT,
        IGNORE_SESSIONS_DURING_SHUTDOWN
      );

    // Convert them into the arguments to pass into the shutdown call
    JsonObject shutdownArgs =
      Json.createObjectBuilder()
      .add("timeout", properties.get(GRACEFUL_SHUTDOWN_TIMEOUT))
      .add("ignoreSessions", properties.get(IGNORE_SESSIONS_DURING_SHUTDOWN))
      .build();

    // Call shutdown
    return
      weblogicRuntime.invokeAction(
        invocationContext,
        invocationContext.getIdentity().getUnfoldedBeanPathWithIdentities(),
        "shutdown",
        false, // synchronous
        shutdownArgs
      );
  }

  /*
   * Get some configuration properties, in non-expanded-value format,
   * for the server corresponding to the ServerLifeCycleRuntimeMBean the user invoked.
   * 404s if the server doesn't exist
   */
  private static JsonObject getServerConfigurationProperties(
    InvocationContext invocationContext,
    WeblogicRuntime weblogicRuntime,
    String... fields
  ) throws Exception {
    // Create the query to get the properties from the corresponding server's configuration
    String serverName = getServerName(invocationContext);
    WeblogicObjectQueryBuilder queryBldr = new WeblogicObjectQueryBuilder();
    queryBldr
      .getOrCreateChild(SERVERS)
      .setKey("name", serverName)
      .addFields(fields);

    // Execute the query
    JsonObject searchResults =
      weblogicRuntime.getConfigBeanTreeSlice(invocationContext, queryBldr.getBuilder().build());

    // See if we found the server
    JsonArray servers =
      CollectionValue.getItems(searchResults.getJsonObject(SERVERS));
    if (servers.isEmpty()) {
      // the server doesn't exist.
      throw new NoDataFoundException(serverName + " not found");
    }

    // Convert the properties from expanded values to inline values
    JsonObject expandedProperties = servers.getJsonObject(0);
    JsonObjectBuilder properties = Json.createObjectBuilder();
    for (String field : fields) {
      properties.add(field, ExpandedValue.wrap(expandedProperties.get(field)).getValue());
    }

    return properties.build();
  }

  /*
   * Get the name of the server
   */
  private static String getServerName(InvocationContext invocationContext) {
    // The unfolded bean path the user invoked is serverLifeCycleRuntimes/serverName
    // Extract the server name from it
    return invocationContext.getIdentity().getUnfoldedBeanPathWithIdentities().getComponents().get(1);
  }
}
