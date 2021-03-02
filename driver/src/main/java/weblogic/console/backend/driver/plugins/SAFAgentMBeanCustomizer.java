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

/** Custom code for processing the SAFAgentMBean */
public abstract class SAFAgentMBeanCustomizer {

  private static final Logger LOGGER = Logger.getLogger(SAFAgentMBeanCustomizer.class.getName());

  // TBD - put these in some common constants class?
  private static final String IDENTITY = "identity";
  private static final String TARGETS = "targets";

  // Note: the old console also processes /replicatedStores, but this is a deprecated property
  // thus not available via the WLS REST api.
  public static JsonObject getStoreOptions(
    @Source(
      collection = "/fileStores",
      properties = {IDENTITY, TARGETS}
    ) JsonObject fileStoresArg,
    @Source(
      collection = "/JDBCStores",
      properties = {IDENTITY, TARGETS}
    ) JsonObject jdbcStoresArg,
    @Source(
      property = TARGETS
    ) JsonObject agentTargetsArg
  ) {

    JsonArray fileStores = CollectionValue.getItems(fileStoresArg);
    JsonArray jdbcStores = CollectionValue.getItems(jdbcStoresArg);
    JsonArray agentTargets = ExpandedValue.getReferencesValue(agentTargetsArg);

    JsonArray allStores =
      Json.createArrayBuilder()
        .addAll(Json.createArrayBuilder(fileStores))
        .addAll(Json.createArrayBuilder(jdbcStores))
        .build();

    JsonArrayBuilder storeOptions = Json.createArrayBuilder();

    if (agentTargets.size() > 1) {
      // The SAFAgent has multiple targets.  Don't return any non-default stores.
    } else if (agentTargets.isEmpty()) {
      // The SAFAgent is not targeted. Return all available stores.
      storeOptions.addAll(Json.createArrayBuilder(allStores));
    } else {
      // The SAFAgent is targted to one server.
      // Return all stores that are untargeted or targeted to the same server.
      String agentTarget = agentTargets.getJsonObject(0).toString();
      for (int i = 0; i < allStores.size(); i++) {
        JsonObject store = allStores.getJsonObject(i);
        JsonArray storeTargets = ExpandedValue.getReferencesValue(store.getJsonObject(TARGETS));
        if (isCompatibleStore(storeTargets, agentTarget)) {
          storeOptions.add(Json.createObjectBuilder().add(IDENTITY, store.getJsonArray(IDENTITY)));
        }
      }
    }

    return ExpandedValue.fromValue(storeOptions.build()).set(true).getJson();
  }

  private static boolean isCompatibleStore(JsonArray storeTargets, String agentTarget) {
    if (storeTargets.size() > 1) {
      throw new AssertionError("PersistentStores must always have 0 or 1 targets.");
    }
    if (storeTargets.isEmpty()) {
      // Allow stores which are not targeted. This is a debatable decision.
      return true;
    }
    String storeTarget = storeTargets.getJsonObject(0).toString();
    if (agentTarget.equals(storeTarget)) {
      // The store is targeted to the same server as the SAF agent.
      return true;
    }
    // The store is targeted to a different server than the SAF agent.
    return false;
  }
}
