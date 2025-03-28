// Copyright (c) 2022, 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo.weblogic;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.json.Json;
import javax.json.JsonArray;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;

import weblogic.console.utils.Path;
import weblogic.remoteconsole.common.repodef.BeanPropertyDef;
import weblogic.remoteconsole.common.repodef.weblogic.AggregatedRuntimeMBeanNameHandler;
import weblogic.remoteconsole.server.repo.BeanTreePath;

/**
 * Helps conduct searches for an aggregated runtime mbean.
 */
class AggregatedRuntimeMBeanWebLogicSearchHelper extends WebLogicBeanTypeSearchHelper {

  private static final AggregatedRuntimeMBeanNameHandler NAME_HANDLER = AggregatedRuntimeMBeanNameHandler.INSTANCE;
  private static final Path SERVER_RUNTIMES_PATH = new Path("DomainRuntime.ServerRuntimes");

  @Override
  void addProperty(
    WebLogicRestBeanRepoSearchBuilder searchBuilder,
    BeanTreePath beanTreePath,
    BeanPropertyDef propertyDef
  ) {
    // Get the property on every running server
    super.addProperty(searchBuilder, NAME_HANDLER.getUnfabricatedBeanTreePath(beanTreePath), propertyDef);
  }

  @Override
  JsonObject findWebLogicSearchResults(
    WebLogicRestBeanRepoSearchResults searchResults,
    BeanTreePath aggregatedBeanTreePath,
    boolean haveExpandedValues
  ) {
    if (haveExpandedValues) {
      throw new AssertionError("The server runtime tree never uses expanded values");
    }
    Map<String, JsonObject> unaggregatedResults =
      getUnaggregatedWebLogicSearchResults(searchResults, aggregatedBeanTreePath);
    if (aggregatedBeanTreePath.isCollection()) {
      return aggregateCollectionResults(searchResults, aggregatedBeanTreePath, unaggregatedResults);
    } else {
      return aggregateBeanResults(searchResults, aggregatedBeanTreePath, unaggregatedResults);
    }
  }

  private JsonObject aggregateCollectionResults(
    WebLogicRestBeanRepoSearchResults searchResults,
    BeanTreePath aggregatedCollectionPath,
    Map<String,JsonObject> unaggregatedResults
  ) {
    Map<String,Map<String,JsonObject>> unaggregatedCollectionResults = new HashMap<>();
    for (Map.Entry<String,JsonObject> entry : unaggregatedResults.entrySet()) {
      String serverName = entry.getKey();
      JsonArray items = entry.getValue().getJsonArray("items");
      for (int i = 0; i < items.size(); i++) {
        JsonObject item = items.getJsonObject(i);
        String beanName = getName(item, aggregatedCollectionPath);
        Map<String,JsonObject> beanResults = unaggregatedCollectionResults.get(beanName);
        if (beanResults == null) {
          beanResults = new HashMap<>();
          unaggregatedCollectionResults.put(beanName, beanResults);
        }
        beanResults.put(serverName, item);
      }
    }
    JsonArrayBuilder itemsBldr = Json.createArrayBuilder();
    for (Map.Entry<String,Map<String,JsonObject>> entry : unaggregatedCollectionResults.entrySet()) {
      String beanName = entry.getKey();
      BeanTreePath aggregatedBeanPath =
        BeanTreePath.create(
          searchResults.getBuilder().getBeanRepo(),
          aggregatedCollectionPath.getPath().childPath(beanName)
        );
      itemsBldr.add(aggregateBeanResults(searchResults, aggregatedBeanPath, entry.getValue()));
    }
    JsonObjectBuilder bldr = Json.createObjectBuilder();
    bldr.add("items", itemsBldr);
    return bldr.build();
  }

  private JsonObject aggregateBeanResults(
    WebLogicRestBeanRepoSearchResults searchResults,
    BeanTreePath aggregatedBeanPath,
    Map<String,JsonObject> unaggregatedBeanResults
  ) {
    if (unaggregatedBeanResults.isEmpty() && aggregatedBeanPath.isCollectionChild()) {
      // The child isn't running on any servers so treat it as not-found.
      // This will enable us to return custom messages for links from the
      // config/edit tree to the monitoring tree when the bean in the
      // edit tree isn't running anywhere.
      return null;
    }
    // This method needs a lot of enhancements
    // - verifying that the per-server instances' values are present and don't conflict
    // - supporting type-specific aggregatable properties, perhaps with custom aggregator methods
    JsonObjectBuilder bldr = Json.createObjectBuilder();
    bldr.add("identity", searchResults.getBuilder().getBeanRepo().toJson(aggregatedBeanPath));
    if (!unaggregatedBeanResults.isEmpty()) {
      JsonObject first = unaggregatedBeanResults.values().iterator().next();
      bldr.add("name", getName(first, aggregatedBeanPath));
      bldr.add("type", getType(first, aggregatedBeanPath));
      BeanPropertyDef discDef =
        aggregatedBeanPath.getTypeDef().getSubTypeDiscriminatorPropertyDef();
      if (discDef != null) {
        String discName = discDef.getOnlinePropertyName();
        if (first.containsKey(discName)) {
          bldr.add(discName, first.get(discName));
        } else {
          throw
            new AssertionError(
              "subtypediscriminator missing from unaggregated search results:"
              + " " + aggregatedBeanPath
              + " " + discDef
              + " " + first
            );
        }
      }
    } else {
      // There are no instances.  Set the type to the base type.
      bldr.add("type", getTypeName(aggregatedBeanPath));
    }
    return bldr.build();
  }
  
  private Map<String,JsonObject> getUnaggregatedWebLogicSearchResults(
    WebLogicRestBeanRepoSearchResults searchResults,
    BeanTreePath aggregatedBeanTreePath
  ) {
    Map<String,JsonObject> rtn = new HashMap<>();
    for (String serverName : getServerRuntimeNames(searchResults)) {
      BeanTreePath perServerPath =
        getPerServerBeanTreePath(searchResults, serverName, aggregatedBeanTreePath);
      JsonObject perServerResults =
        super.findWebLogicSearchResults(searchResults, perServerPath, false);
      if (perServerResults != null) {
        rtn.put(serverName, perServerResults);
      }
    }
    return rtn;
  }

  private List<String> getServerRuntimeNames(
    WebLogicRestBeanRepoSearchResults searchResults
  ) {
    List<String> rtn = new ArrayList<>();
    BeanTreePath serverRuntimesPath =
      BeanTreePath.create(searchResults.getBuilder().getBeanRepo(), SERVER_RUNTIMES_PATH);
    JsonObject serverRuntimes = super.findWebLogicSearchResults(searchResults, serverRuntimesPath, false);
    if (serverRuntimes != null) {
      JsonArray items = serverRuntimes.getJsonArray("items");
      for (int i = 0; i < items.size(); i++) {
        JsonObject item = items.getJsonObject(i);
        String keyProp = "name";
        if (item.containsKey(keyProp)) {
          rtn.add(item.getString(keyProp));
        } else {
          // The bean results from WebLogic are broken (didn't include the name).
          // We've seen this for the WLDFDataAccessRuntimeMBean for a JMS Server
          // whose name includes the ')' character.
          // Ignore the bean.
        }
      }
    }
    return rtn;
  }

  private BeanTreePath getPerServerBeanTreePath(
    WebLogicRestBeanRepoSearchResults searchResults,
    String serverName,
    BeanTreePath aggregatedBeanTreePath
  ) {
    // i.e. DomainRunime.ServerRuntimes.<ServerName>:
    Path path = SERVER_RUNTIMES_PATH.childPath(serverName);
    // i.e. DomainRuntime.AggregatedFoo.Bar:
    Path aggregatedPath = aggregatedBeanTreePath.getPath();
    // i.e. DomainRuntime.ServerRuntimes.<ServerName>.Foo:
    path.addComponent(NAME_HANDLER.getUnfabricatedName(aggregatedPath.getComponents().get(1)));
    if (aggregatedPath.length() > 2) {
      // i.e. DomainRuntime.ServerRuntimes.<ServerName>.Foo.Bar
      path.addPath(aggregatedPath.subPath(2, aggregatedPath.length()));
    }
    return BeanTreePath.create(searchResults.getBuilder().getBeanRepo(), path);
  }

  // Get this bean's name from the WLS REST response.
  // It should always be present since the corresponding
  // query should have said to include it.
  // However, some badly coded mbeans and REST apis don't return it,
  // so, if it's missing, do our best to concoct a value.
  private String getName(JsonObject item, BeanTreePath aggregatedBeanPath) {
    if (item.containsKey("name")) {
      return item.getString("name");
    }
    if (item.containsKey("identity")) {
      JsonArray identity = item.getJsonArray("identity");
      if (!identity.isEmpty()) {
        return identity.getString(identity.size() - 1);
      }
    }
    return getTypeName(aggregatedBeanPath);
  }

  // Get this bean's type from the WLS REST response.
  // It should always be present since the corresponding
  // query should have said to include it.
  // However, some badly coded mbeans and REST apis don't return it,
  // so, if it's missing, do our best to concoct a value.
  private String getType(JsonObject item, BeanTreePath aggregatedBeanPath) {
    if (item.containsKey("type")) {
      return item.getString("type");
    }
    return getTypeName(aggregatedBeanPath);
  }

  private String getTypeName(BeanTreePath aggregatedBeanPath) {
    return aggregatedBeanPath.getLastSegment().getChildDef().getChildTypeDef().getInstanceName();
  }
}
