// Copyright (c) 2021, 2022, Oracle and/or its affiliates.
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

import weblogic.remoteconsole.common.repodef.BeanPropertyDef;
import weblogic.remoteconsole.common.repodef.BeanTypeDef;
import weblogic.remoteconsole.common.utils.Path;
import weblogic.remoteconsole.common.utils.StringUtils;
import weblogic.remoteconsole.server.repo.BeanActionArg;
import weblogic.remoteconsole.server.repo.BeanReaderRepoSearchBuilder;
import weblogic.remoteconsole.server.repo.BeanReaderRepoSearchResults;
import weblogic.remoteconsole.server.repo.BeanSearchResults;
import weblogic.remoteconsole.server.repo.BeanTreePath;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.Response;
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

  // Customize the DomainSecurityRUntimeMBean's JAXRS resource
  public static BaseResource createResource(InvocationContext ic) {
    return new DomainSecurityRuntimeMBeanResource();
  }

  public static Response<List<TableRow>> getSecurityWarningsSliceTableRows(
    InvocationContext ic,
    BeanReaderRepoSearchResults searchResults
  ) {
    Response<List<TableRow>> response = new Response<>();
    Response<Void> refreshResponse = refreshSecurityWarnings(ic);
    if (!refreshResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(refreshResponse);
    }
    Response<JsonArray> warningsResponse = getSecurityWarnings(ic);
    if (!warningsResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(warningsResponse);
    }
    Response<Map<String,String>> serversResponse = getServerClusterMap(ic);
    if (!serversResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(serversResponse);
    }
    response.setSuccess(processWarnings(warningsResponse.getResults(), serversResponse.getResults()));
    return response;
  }

  private static Response<Void> refreshSecurityWarnings(InvocationContext ic) {
    Response<Void> response = new Response<>();
    Path action = new Path("refreshCache");
    BeanTypeDef typeDef = ic.getBeanTreePath().getTypeDef();
    if (typeDef.hasActionDef(action)) {
      Response<Value> invokeResponse =
        ic.getPageRepo().getBeanRepo().asBeanReaderRepo().invokeAction(
          ic,
          typeDef.getActionDef(action),
          new ArrayList<BeanActionArg>() // no args
        );
      if (!invokeResponse.isSuccess()) {
        return response.copyUnsuccessfulResponse(invokeResponse);
      }
    } else {
      // Skip refreshing the warnings since the user's role doesn't allow it.
    }
    return response;
  }

  private static Response<JsonArray> getSecurityWarnings(InvocationContext ic) {
    Response<JsonArray> response = new Response<>();
    Response<JsonObject> searchResponse =
      WebLogicRestInvoker.post(
        ic,
        new Path("domainRuntime.search"),
        getSecurityWarningsQuery(),
        false, // expanded values
        false, // save changes
        false // asynchronous
       );
    if (!searchResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(searchResponse);
    }
    JsonObject searchResults = searchResponse.getResults();
    JsonObject domainSecurityRuntime = searchResults.getJsonObject("domainSecurityRuntime");
    if (domainSecurityRuntime != null) {
      response.setSuccess(domainSecurityRuntime.getJsonArray("securityValidationWarnings"));
    } else {
      // The domain doesn't support security warnings. Send back an empty list.
      response.setSuccess(Json.createArrayBuilder().build());
    }
    return response;
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

  private static Response<Map<String,String>> getServerClusterMap(InvocationContext ic) {
    Response<Map<String,String>> response = new Response<>();
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
    Response<BeanReaderRepoSearchResults> searchResponse = builder.search();
    if (!searchResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(searchResponse);
    }
    // Create a mapping from server name to cluster name
    Map<String,String> serverClusterMap = new HashMap<>();
    for (BeanSearchResults serverResults : searchResponse.getResults().getCollection(serversBeanPath)) {
      BeanTreePath identity = serverResults.getValue(identityPropertyDef).asBeanTreePath();
      Value cluster = serverResults.getValue(clusterPropertyDef);
      String serverName = identity.asBeanTreePath().getLastSegment().getKey();
      if (cluster.isBeanTreePath()) {
        String clusterName = cluster.asBeanTreePath().getLastSegment().getKey();
        serverClusterMap.put(serverName, clusterName);
      }
    }
    response.setSuccess(serverClusterMap);
    return response;
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
