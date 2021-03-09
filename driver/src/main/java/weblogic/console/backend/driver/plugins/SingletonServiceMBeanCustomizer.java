// Copyright (c) 2020, 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.driver.plugins;

import java.util.logging.Logger;
import javax.json.JsonObject;

/** Custom code for processing the SingletonServiceMBean */
public abstract class SingletonServiceMBeanCustomizer {
  private static final Logger LOGGER = Logger.getLogger(SingletonServiceMBeanCustomizer.class.getName());

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
    return MigratableTargetMBeanCustomizer.extractServersOfSameCluster(serversArg, clusterRef);
  }
}
