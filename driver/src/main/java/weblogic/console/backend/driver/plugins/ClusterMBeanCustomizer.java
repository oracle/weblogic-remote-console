// Copyright (c) 2020, 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.driver.plugins;

import java.util.logging.Logger;
import javax.json.JsonArray;
import javax.json.JsonObject;
import javax.json.JsonValue;

import weblogic.console.backend.driver.CollectionValue;
import weblogic.console.backend.driver.ExpandedValue;
import weblogic.console.backend.driver.InvocationContext;
import weblogic.console.backend.driver.WeblogicConfiguration;
import weblogic.console.backend.utils.Path;

/** Custom code for processing the ClusterMBean. */
public abstract class ClusterMBeanCustomizer {

  private static final Logger LOGGER = Logger.getLogger(ClusterMBeanCustomizer.class.getName());

  public static void deleteCluster(
    WeblogicConfiguration weblogicConfiguration,
    InvocationContext invocationContext,
    @Source(
      collection = "/singletonServices",
      properties = {"name", "cluster"}
    ) JsonObject singletonServices,
    @Source(
      collection = "/migratableTargets",
      properties = {"name", "cluster"}
    ) JsonObject migratableTargets
  ) throws Exception {
    LOGGER.finest("deleteCluster invocationContext=" + invocationContext);
    LOGGER.finest("deleteCluster singletonServices=" + singletonServices);
    LOGGER.finest("deleteCluster migratableTargets=" + migratableTargets);

    // Remove any singleton services that use this cluster
    removeItemsReferencedByThisCluster(
      weblogicConfiguration,
      invocationContext,
      singletonServices
    );

    // Remove any migratable targets that use this cluster
    removeItemsReferencedByThisCluster(
      weblogicConfiguration,
      invocationContext,
      migratableTargets
    );

    // Delete the cluster
    Path clusterPath = invocationContext.getIdentity().getUnfoldedBeanPathWithIdentities();
    LOGGER.finest("deleteCluster deleting cluster " + clusterPath);
    weblogicConfiguration.deleteBean(invocationContext, clusterPath);
  }

  private static void removeItemsReferencedByThisCluster(
    WeblogicConfiguration weblogicConfiguration,
    InvocationContext invocationContext,
    JsonObject collection
  ) throws Exception {
    // Get the name of the cluster that we're about to delete
    String clusterNameWant = invocationContext.getIdentity().getFoldedBeanPathWithIdentities().getLastComponent();

    // Loop over the items in the collection.  If the item references this cluster, delete it.
    JsonArray items = CollectionValue.getItems(collection);
    for (int i = 0; i < items.size(); i++) {

      // Get this item's cluster reference
      JsonObject item = items.getJsonObject(i);
      JsonValue cluster = ExpandedValue.getValue(item.get("cluster"));
      if (cluster != JsonValue.NULL) {

        // Get the item's cluster's name.
        // The last component of the reference's identity is the cluster's name
        JsonArray clusterIdentity = cluster.asJsonArray();
        String clusterNameHave = clusterIdentity.getString(clusterIdentity.size() - 1);

        if (clusterNameWant.equals(clusterNameHave)) {
          // This item uses this cluster. Delete it.

          // Get this item's identity and convert it to a Path so we can delete it.
          Path itemPath = PluginUtils.identityToPath(item.getJsonArray("identity"));

          // Delete it.
          LOGGER.finest("deleteCluster deleting referencing mbean " + itemPath);
          weblogicConfiguration.deleteBean(invocationContext, itemPath);
        }
      }
    }
  }
}
