// Copyright (c) 2020, 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.customizers;

import java.util.List;
import java.util.Map;

import weblogic.remoteconsole.server.repo.BeanEditorRepo;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.Response;
import weblogic.remoteconsole.server.repo.Value;

/** 
 * Custom code for processing the ClusterMBean
 */
public class ClusterMBeanCustomizer {
  private static final String IDENTITY = "identity";
  private static final String NAME = "Name";
  private static final String CLUSTER = "Cluster";

  private ClusterMBeanCustomizer() {
  }

  // Before a cluster can be deleted, migratable targets or singleton services
  // that use it need to be deleted.  This customizer handles this.
  public static Response<Void> deleteCluster(
    InvocationContext ic,
    @Source(
      collection = "/Domain/SingletonServices",
      properties = {IDENTITY, NAME, CLUSTER}
    ) List<Map<String,Value>> singletonServices,
    @Source(
      collection = "/Domain/MigratableTargets",
      properties = {IDENTITY, NAME, CLUSTER}
    ) List<Map<String,Value>> migratableTargets
  ) {
    BeanEditorRepo beanEditorRepo =
      ic.getPageRepo().getBeanRepo().asBeanEditorRepo();
    {
      // Remove any singleton services that use this cluster
      Response<Void> response =
        removeItemsReferencedByThisCluster(ic, beanEditorRepo, singletonServices);
      if (!response.isSuccess()) {
        return response;
      }
    }
    {
      // Remove any migratable targets that use this cluster
      Response<Void> response =
        removeItemsReferencedByThisCluster(ic, beanEditorRepo, migratableTargets);
      if (!response.isSuccess()) {
        return response;
      }
    }
    // Now we can delete the cluster.
    return beanEditorRepo.deleteBean(ic, ic.getBeanTreePath());
  }

  private static Response<Void> removeItemsReferencedByThisCluster(
    InvocationContext ic,
    BeanEditorRepo beanEditorRepo,
    List<Map<String,Value>> collection
  ) {
    // Get the name of the cluster that we're about to delete
    String clusterNameWant =
      ic.getBeanTreePath().getLastSegment().getKey();
    // Loop over the items in the collection.  If the item references this cluster, delete it.
    for (Map<String,Value> item : collection) {
      // Get this item's cluster reference
      Value cluster = item.get(CLUSTER);
      if (!cluster.isNullReference()) {
        String clusterNameHave = cluster.asBeanTreePath().getLastSegment().getKey();
        if (clusterNameWant.equals(clusterNameHave)) {
          // This item uses this cluster. Delete it.
          Response<Void> response =
            beanEditorRepo.deleteBean(ic, item.get(IDENTITY).asBeanTreePath());
          if (!response.isSuccess()) {
            return response;
          }
        }
      }
    }
    return new Response<Void>();
  }
}
