// Copyright (c) 2020, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.driver.plugins;

import java.util.logging.Logger;
import javax.json.Json;
import javax.json.JsonArray;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObject;

import weblogic.console.backend.driver.CollectionValue;
import weblogic.console.backend.driver.ExpandedValue;

/** Custom code for processing the MigratableTargetMBean */
public abstract class MigratableTargetMBeanCustomizer {
  private static final Logger LOGGER = Logger.getLogger(MigratableTargetMBeanCustomizer.class.getName());

  // TBD - put these in some common constants class?
  private static final String IDENTITY = "identity";
  private static final String CLUSTER = "cluster";

  // Return the servers that is a member of the same cluster of this MigratableTarget.
  public static JsonObject getServersOfSameCluster(
    @Source(
      collection = "/servers",
      properties = {IDENTITY, CLUSTER}
    ) JsonObject serversArg,
    @Source(
      property = CLUSTER
    ) JsonObject clusterRef
  ) {
    return extractServersOfSameCluster(serversArg, clusterRef);
  }

  public static JsonObject extractServersOfSameCluster(
    JsonObject serversArg,
    JsonObject clusterRef
  ) {
    JsonArray jsonArray = ExpandedValue.getReferenceValue(clusterRef);
    String clusterName = (jsonArray != null) ? jsonArray.getString(1) : null;

    JsonArrayBuilder ccServersOptions = Json.createArrayBuilder();
    JsonArray servers = CollectionValue.getItems(serversArg);

    if (clusterName == null) {
      // no cluster is set for this migratableTarget, return the entire list of servers.
      ccServersOptions.addAll(Json.createArrayBuilder(servers));
    } else {
      // Return all servers that are member of the cluster.
      for (int i = 0; i < servers.size(); i++) {
        JsonObject server = servers.getJsonObject(i);
        JsonObject serverClusterRef = server.getJsonObject(CLUSTER);
        JsonArray serverA = ExpandedValue.getReferenceValue(serverClusterRef);
        String serverClusterName = (serverA != null) ? serverA.getString(1) : null;
        if (serverClusterName == null) {
          continue;
        } else {
          if (clusterName.equals(serverClusterName)) {
            ccServersOptions.add(
              Json.createObjectBuilder().add(
                IDENTITY,
                server.getJsonArray(IDENTITY)
              )
            );
          }
        }
      }
    }
    return ExpandedValue.fromValue(ccServersOptions.build()).set(true).getJson();
  }
}
