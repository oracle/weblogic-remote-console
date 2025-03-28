// Copyright (c) 2020, 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.customizers;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import weblogic.console.utils.Path;
import weblogic.remoteconsole.common.repodef.BeanPropertyDef;
import weblogic.remoteconsole.common.repodef.BeanTypeDef;
import weblogic.remoteconsole.server.repo.BeanEditorRepo;
import weblogic.remoteconsole.server.repo.BeanReaderRepoSearchBuilder;
import weblogic.remoteconsole.server.repo.BeanReaderRepoSearchResults;
import weblogic.remoteconsole.server.repo.BeanSearchResults;
import weblogic.remoteconsole.server.repo.BeanTreePath;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.Response;
import weblogic.remoteconsole.server.repo.TableCell;
import weblogic.remoteconsole.server.repo.TableRow;
import weblogic.remoteconsole.server.repo.Value;

/** 
 * Custom code for processing the ClusterMBean
 */
public class ClusterMBeanCustomizer {
  private static final String IDENTITY = "identity";
  private static final String CLUSTER = "Cluster";

  private ClusterMBeanCustomizer() {
  }

  public static List<TableRow> getServersSliceTableRows(
    InvocationContext ic,
    BeanReaderRepoSearchResults overallSearchResults
  ) {
    if (overallSearchResults.getBean(ic.getBeanTreePath()) == null) {
      throw Response.notFoundException();
    }
    // Get each server's identity and cluster reference
    List<TableRow> rows = new ArrayList<>();
    BeanTreePath serversBeanPath =
      BeanTreePath.create(ic.getBeanTreePath().getBeanRepo(), new Path("Domain.Servers"));
    BeanTypeDef serversTypeDef = serversBeanPath.getTypeDef();
    BeanPropertyDef identityPropertyDef = serversTypeDef.getIdentityPropertyDef();
    BeanPropertyDef clusterPropertyDef = serversTypeDef.getPropertyDef(new Path("Cluster"));
    // Don't return whether properties are set.
    BeanReaderRepoSearchBuilder builder =
      ic.getPageRepo().getBeanRepo().asBeanReaderRepo().createSearchBuilder(ic, false);
    builder.addProperty(serversBeanPath, identityPropertyDef);
    builder.addProperty(serversBeanPath, clusterPropertyDef);
    BeanReaderRepoSearchResults searchResults = builder.search().getResults();

    // Add a row for every server in this cluster
    for (BeanSearchResults serverResults : searchResults.getCollection(serversBeanPath)) {
      BeanTreePath serverIdentity = serverResults.getValue(identityPropertyDef).asBeanTreePath();
      Value clusterValue = serverResults.getValue(clusterPropertyDef);
      if (clusterValue.isBeanTreePath()) {
        BeanTreePath clusterIdentity = clusterValue.asBeanTreePath();
        if (clusterIdentity.equals(ic.getBeanTreePath())) {
          TableRow row = new TableRow();
          row.getCells().add(new TableCell("Server", serverIdentity));
          row.getCells().add(new TableCell(IDENTITY, serverIdentity));
          rows.add(row);
        }
      }
    }

    return rows;
  }

  // Before a cluster can be deleted, migratable targets or singleton services
  // that use it need to be deleted.  This customizer handles this.
  public static void deleteCluster(
    InvocationContext ic,
    @Source(
      collection = "/Domain/SingletonServices",
      properties = {IDENTITY, CLUSTER}
    ) List<Map<String,Value>> singletonServices,
    @Source(
      collection = "/Domain/MigratableTargets",
      properties = {IDENTITY, CLUSTER}
    ) List<Map<String,Value>> migratableTargets
  ) {
    BeanEditorRepo beanEditorRepo =
      ic.getPageRepo().getBeanRepo().asBeanEditorRepo();
    // Remove any singleton services that use this cluster
    removeItemsReferencedByThisCluster(ic, beanEditorRepo, singletonServices);
    // Remove any migratable targets that use this cluster
    removeItemsReferencedByThisCluster(ic, beanEditorRepo, migratableTargets);
    // Now we can delete the cluster.
    beanEditorRepo.deleteBean(ic, ic.getBeanTreePath()).getResults();
  }

  private static void removeItemsReferencedByThisCluster(
    InvocationContext ic,
    BeanEditorRepo beanEditorRepo,
    List<Map<String,Value>> collection
  ) {
    // Get the name of the cluster that we're about to delete
    String clusterKeyWant =
      ic.getBeanTreePath().getLastSegment().getKey();
    // Loop over the items in the collection.  If the item references this cluster, delete it.
    for (Map<String,Value> item : collection) {
      // Get this item's cluster reference
      Value cluster = item.get(CLUSTER);
      String clusterKeyHave = getClusterKeyFromClusterReference(cluster);
      if (clusterKeyWant.equals(clusterKeyHave)) {
        // This item uses this cluster. Delete it.
        beanEditorRepo.deleteBean(ic, item.get(IDENTITY).asBeanTreePath()).getResults();
      }
    }
  }

  private static String getClusterKeyFromClusterReference(Value cluster) {
    if (cluster.isBeanTreePath()) {
      return cluster.asBeanTreePath().getLastSegment().getKey();
    }
    if (cluster.isModelToken()) {
      return cluster.asModelToken().getToken();
    }
    return null;
  }
}
