// Copyright (c) 2020, 2024, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.customizers;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.Option;
import weblogic.remoteconsole.server.repo.Value;

/** 
 * Custom code for mbeans that reference a cluster
 * and are restricted to using that cluster's servers.
 */
public class MBeanClusterServersCustomizer {
  private static final String IDENTITY = "identity";
  private static final String CLUSTER = "Cluster";

  private MBeanClusterServersCustomizer() {
  }

  // Return the servers that are a member of this singleton service's cluster.
  public static List<Option> getServersOfSameCluster(
    InvocationContext invocationContext,
    @Source(
      collection = "/Domain/Servers",
      properties = {IDENTITY, CLUSTER}
    ) List<Map<String,Value>> servers,
    @Source(
      property = CLUSTER
    ) Value clusterWant
  ) {
    return extractServersOfSameCluster(invocationContext, servers, clusterWant);
  }

  private static List<Option> extractServersOfSameCluster(
    InvocationContext invocationContext,
    List<Map<String,Value>> servers,
    Value clusterWant
  ) {
    List<Option> options = new ArrayList<>();
    for (Map<String,Value> server : servers) {
      Value serverIdentity = server.get(IDENTITY);
      Value serverCluster = server.get(CLUSTER);
      if (clusterMatches(serverCluster, clusterWant)) {
        options.add(new Option(invocationContext, serverIdentity));
      }
    }
    return options;
  }

  private static boolean clusterMatches(Value clusterHave, Value clusterWant) {
    if (clusterWant.isNullReference()) {
      // The cluster isn't set. Return all the servers.
      return true;
    } else {
      // The cluster is set. Only return servers targeted to the same cluster.
      if (clusterHave.isNullReference()) {
        return false;
      }
      return getIdentity(clusterHave).equals(getIdentity(clusterWant));
    }
  }

  private static String getIdentity(Value ref) {
    return ref.asBeanTreePath().getPath().getDotSeparatedPath();
  }
}
