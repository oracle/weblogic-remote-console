// Copyright (c) 2020, 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.driver.plugins;

import java.util.logging.Logger;
import javax.json.JsonArray;
import javax.json.JsonObject;

import weblogic.console.backend.driver.CollectionValue;
import weblogic.console.backend.driver.ExpandedValue;
import weblogic.console.backend.driver.InvocationContext;
import weblogic.console.backend.driver.WeblogicConfiguration;
import weblogic.console.backend.utils.Path;

/** Custom code for processing the ServerMBean. */
public abstract class ServerMBeanCustomizer {

  private static final Logger LOGGER = Logger.getLogger(ServerMBeanCustomizer.class.getName());

  public static void deleteServer(
      WeblogicConfiguration weblogicConfiguration,
      InvocationContext invocationContext,
      @Source(
              collection = "/migratableTargets",
              properties = {"name", "identity"})
          JsonObject migratableTargets)
      throws Exception {
    LOGGER.finest("deleteServer invocationContext=" + invocationContext);
    LOGGER.finest("deleteServer migratableTargets=" + migratableTargets);

    // Get the name of the cluster that we're about to delete
    String serverName = invocationContext.getIdentity().getFoldedBeanPathWithIdentities().getLastComponent();

    // Get the name of the corresponding automatically created migratable target.
    String migratableTargetName = serverName + " (migratable)";

    // Loop over the migratable targets.
    // If it's the automatically created one for this server, delete it.
    JsonArray items = CollectionValue.getItems(migratableTargets);
    for (int i = 0; i < items.size(); i++) {

      // Get the migratable target's name
      JsonObject item = items.getJsonObject(i);
      String name = ExpandedValue.getStringValue(item.get("name"));

      if (migratableTargetName.equals(name)) {
        // This is the automatically created migratable target for the
        // server we're about to delete.  Delete it.

        // Get this item's identity and convert it to a Path so we can delete it.
        Path itemPath = PluginUtils.identityToPath(item.getJsonArray("identity"));

        // Delete it.
        LOGGER.finest("deleteServer deleting corresponding migratable target " + itemPath);
        weblogicConfiguration.deleteBean(invocationContext, itemPath);
      }
    }

    // Delete the server
    Path serverPath = invocationContext.getIdentity().getUnfoldedBeanPathWithIdentities();
    LOGGER.finest("deleteServer deleting server " + serverPath);
    weblogicConfiguration.deleteBean(invocationContext, serverPath);
  }
}
