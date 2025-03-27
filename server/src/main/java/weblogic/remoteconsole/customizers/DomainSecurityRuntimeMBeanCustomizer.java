// Copyright (c) 2023, 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.customizers;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import javax.json.Json;
import javax.json.JsonArray;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;

import weblogic.console.utils.Path;
import weblogic.console.utils.StringUtils;
import weblogic.remoteconsole.common.repodef.BeanPropertyDef;
import weblogic.remoteconsole.common.repodef.BeanTypeDef;
import weblogic.remoteconsole.server.repo.BeanReaderRepoSearchBuilder;
import weblogic.remoteconsole.server.repo.BeanReaderRepoSearchResults;
import weblogic.remoteconsole.server.repo.BeanSearchResults;
import weblogic.remoteconsole.server.repo.BeanTreePath;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.StringValue;
import weblogic.remoteconsole.server.repo.TableCell;
import weblogic.remoteconsole.server.repo.TableRow;
import weblogic.remoteconsole.server.repo.Value;
import weblogic.remoteconsole.server.repo.weblogic.WebLogicRestInvoker;
import weblogic.remoteconsole.server.webapp.BaseResource;

/** 
 * Custom code for processing the DomainSecurityRuntimeMBean
 */
public class DomainSecurityRuntimeMBeanCustomizer {

  private DomainSecurityRuntimeMBeanCustomizer() {
  }

  // Customize the DomainSecurityRuntimeMBean's JAXRS resource
  public static BaseResource createResource(InvocationContext ic) {
    return new DomainSecurityRuntimeMBeanResource();
  }

  public static List<TableRow> getSecurityWarningsSliceTableRows(
    InvocationContext ic,
    BeanReaderRepoSearchResults searchResults
  ) {
    return processWarnings(getSecurityWarnings(ic), getServerClusterMap(ic));
  }

  private static JsonArray getSecurityWarnings(InvocationContext ic) {
    JsonObject searchResults =
      WebLogicRestInvoker.post(
        ic,
        new Path("domainRuntime.search"),
        getSecurityWarningsQuery(),
        false, // expanded values
        false, // save changes
        false // asynchronous
       ).getResults();
    JsonObject domainSecurityRuntime = searchResults.getJsonObject("domainSecurityRuntime");
    if (domainSecurityRuntime != null) {
      return domainSecurityRuntime.getJsonArray("securityValidationWarnings");
    } else {
      // The domain doesn't support security warnings. Send back an empty list.
      return Json.createArrayBuilder().build();
    }
  }

  private static JsonObject getSecurityWarningsQuery() {
    JsonObjectBuilder domainSecurityRuntime = Json.createObjectBuilder();
    domainSecurityRuntime.add("fields", Json.createArrayBuilder().add("securityValidationWarnings"));
    domainSecurityRuntime.add("links", Json.createArrayBuilder());
    JsonObjectBuilder domainRuntimeChildren = Json.createObjectBuilder();
    domainRuntimeChildren.add("domainSecurityRuntime", domainSecurityRuntime);
    JsonObjectBuilder domainRuntime = Json.createObjectBuilder();
    domainRuntime.add("fields", Json.createArrayBuilder());
    domainRuntime.add("links", Json.createArrayBuilder());
    domainRuntime.add("children", domainRuntimeChildren);
    return domainRuntime.build();
  }

  private static Map<String,String> getServerClusterMap(InvocationContext ic) {
    // Get each server's identity and cluster reference
    BeanTreePath serversBeanPath =
      BeanTreePath.create(ic.getBeanTreePath().getBeanRepo(), new Path("Domain.Servers"));
    BeanTypeDef serversTypeDef = serversBeanPath.getTypeDef();
    BeanPropertyDef identityPropertyDef = serversTypeDef.getIdentityPropertyDef();
    BeanPropertyDef clusterPropertyDef = serversTypeDef.getPropertyDef(new Path("Cluster"));
    boolean includeIsSet = false; // because this is a table
    BeanReaderRepoSearchBuilder builder =
      ic.getPageRepo().getBeanRepo().asBeanReaderRepo().createSearchBuilder(ic, includeIsSet);
    builder.addProperty(serversBeanPath, identityPropertyDef);
    builder.addProperty(serversBeanPath, clusterPropertyDef);
    BeanReaderRepoSearchResults searchResults = builder.search().getResults();
    // Create a mapping from server name to cluster name
    Map<String,String> serverClusterMap = new HashMap<>();
    for (BeanSearchResults serverResults : searchResults.getCollection(serversBeanPath)) {
      BeanTreePath identity = serverResults.getValue(identityPropertyDef).asBeanTreePath();
      Value cluster = serverResults.getValue(clusterPropertyDef);
      String serverName = identity.asBeanTreePath().getLastSegment().getKey();
      if (cluster.isBeanTreePath()) {
        String clusterName = cluster.asBeanTreePath().getLastSegment().getKey();
        serverClusterMap.put(serverName, clusterName);
      }
    }
    return serverClusterMap;
  }

  private static List<TableRow> processWarnings(JsonArray warnings, Map<String,String> serverClusterMap) {
    Map<String,TableRow> sortedRows = new TreeMap<>();
    for (int i = 0; i < warnings.size(); i++) {
      JsonObject warning = warnings.getJsonObject(i);
      String id = warning.getString("id");
      String description = warning.getString("description");
      String serverName = warning.getString("serverName");
      String clusterName = serverClusterMap.get(serverName);
      TableRow row = new TableRow();
      row.getCells().add(new TableCell("Id", new StringValue(id)));
      row.getCells().add(new TableCell("Description", new StringValue(description)));
      row.getCells().add(new TableCell("Server", new StringValue(serverName)));
      if (!StringUtils.isEmpty(clusterName)) {
        row.getCells().add(new TableCell("Cluster", new StringValue(clusterName)));
      }
      sortedRows.put(getSortingKey(id, description, serverName, clusterName), row);
    }
    return new ArrayList<TableRow>(sortedRows.values());
  }

  private static String getSortingKey(String id, String description, String serverName, String clusterName) {
    // Sort by id, then description, then cluster (if clustered), then server
    StringBuilder sb = new StringBuilder();
    sb.append("id=").append(id);
    sb.append(", desciption=").append(description);
    if (!StringUtils.isEmpty(clusterName)) {
      sb.append(", cluster=").append(clusterName);
    }
    sb.append(", server=").append(serverName);
    return sb.toString();
  }
}
