// Copyright (c) 2020, 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.customizers;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import weblogic.remoteconsole.common.repodef.BeanPropertyDef;
import weblogic.remoteconsole.common.repodef.BeanTypeDef;
import weblogic.remoteconsole.common.utils.Path;
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

  public static Response<List<TableRow>> getServersSliceTableRows(
    InvocationContext ic,
    BeanReaderRepoSearchResults searchResults
  ) {
    Response<List<TableRow>> response = new Response<>();
    if (searchResults.getBean(ic.getBeanTreePath()) == null) {
      return response.setNotFound();
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
    Response<BeanReaderRepoSearchResults> searchResponse = builder.search();
    if (!searchResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(searchResponse);
    }

    // Add a row for every server in this cluster
    for (BeanSearchResults serverResults : searchResponse.getResults().getCollection(serversBeanPath)) {
      BeanTreePath serverIdentity = serverResults.getValue(identityPropertyDef).asBeanTreePath();
      Value clusterValue = serverResults.getValue(clusterPropertyDef);
      if (clusterValue.isBeanTreePath()) {
        BeanTreePath clusterIdentity = clusterValue.asBeanTreePath();
        if (clusterIdentity.equals(ic.getBeanTreePath())) {
          TableRow row = new TableRow();
          row.getCells().add(new TableCell("Server", serverIdentity));
          rows.add(row);
        }
      }
    }

    response.setSuccess(rows);
    return response;
  }

  // Before a cluster can be deleted, migratable targets or singleton services
  // that use it need to be deleted.  This customizer handles this.
  public static Response<Void> deleteCluster(
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
    String clusterKeyWant =
      ic.getBeanTreePath().getLastSegment().getKey();
    // Loop over the items in the collection.  If the item references this cluster, delete it.
    for (Map<String,Value> item : collection) {
      // Get this item's cluster reference
      Value cluster = item.get(CLUSTER);
      String clusterKeyHave = getClusterKeyFromClusterReference(cluster);
      if (clusterKeyWant.equals(clusterKeyHave)) {
        // This item uses this cluster. Delete it.
        Response<Void> response =
          beanEditorRepo.deleteBean(ic, item.get(IDENTITY).asBeanTreePath());
        if (!response.isSuccess()) {
          return response;
        }
      }
    }
    return new Response<Void>();
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
