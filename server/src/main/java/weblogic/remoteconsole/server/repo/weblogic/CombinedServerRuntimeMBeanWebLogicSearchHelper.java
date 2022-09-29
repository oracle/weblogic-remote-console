// Copyright (c) 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo.weblogic;

import javax.json.Json;
import javax.json.JsonArray;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;

import weblogic.remoteconsole.common.repodef.BeanPropertyDef;
import weblogic.remoteconsole.common.utils.Path;
import weblogic.remoteconsole.server.repo.BeanTreePath;

/**
 * Helps conduct searches for the mbeans that combine a
 * ServerLifeCycleRuntimeMBean and a ServerRuntimeMBean
 */
class CombinedServerRuntimeMBeanWebLogicSearchHelper extends WebLogicBeanTypeSearchHelper {

  @Override
  void addProperty(
    WebLogicRestBeanRepoSearchBuilder searchBuilder,
    BeanTreePath beanTreePath,
    BeanPropertyDef propertyDef
  ) {
    Path propertyPath = propertyDef.getPropertyPath();
    String firstComponent = propertyPath.getFirstComponent();
    Path restOfPath = propertyPath.subPath(1, propertyPath.length());
    BeanTreePath slcrtPath = getServerLifeCycleRuntimePath(beanTreePath);
    BeanTreePath srtPath = getServerRuntimePath(beanTreePath);
    if ("identity".equals(firstComponent) || "Type".equals(firstComponent) || "State".equals(firstComponent)) {
      // Fetch the SRT & SLCRT identities so we can figure out whether the server is known and is running
      Path identityPath = new Path("identity");
      addProperty(searchBuilder, slcrtPath, identityPath);
      addProperty(searchBuilder, srtPath, identityPath);
      // Fetch the SRT state if it's available
      // That is, set the state to the SRT's state if it's available, otherwise set it to 'NOT_RUNNING'
      // (since it's too expensive to get it from SLCRT's state)
      addProperty(searchBuilder, srtPath, new Path("State"));
    } else if ("Name".equals(firstComponent)) {
      // Use the SLCRT's name (can't get it from the SRT since it won't exist if the server isn't running)
      addProperty(searchBuilder, slcrtPath, new Path("Name"));
    } else if ("ServerRuntime".equals(firstComponent)) {
      // Get the corresponding SRT property
      addProperty(searchBuilder, srtPath, restOfPath);
    } else if ("ServerLifeCycleRuntime".equals(firstComponent)) {
      // Get the corresponding SLCRT property
      addProperty(searchBuilder, slcrtPath, restOfPath);
    } else {
      throw new AssertionError("Unknown property: " + propertyDef);
    }
  }
 
  private void addProperty(
    WebLogicRestBeanRepoSearchBuilder searchBuilder,
    BeanTreePath beanTreePath,
    Path propertyPath
  ) {
    super.addProperty(
      searchBuilder,
      beanTreePath,
      beanTreePath.getTypeDef().getPropertyDef(propertyPath)
    );
  }

  @Override
  JsonObject findWebLogicSearchResults(
    WebLogicRestBeanRepoSearchResults searchResults,
    BeanTreePath beanTreePath,
    boolean haveExpandedValues
  ) {
    if (haveExpandedValues) {
      throw new AssertionError("The server runtime tree never uses expanded values");
    }
    if (beanTreePath.isCollection()) {
      return getCollectionResults(searchResults, beanTreePath);
    } else {
      return getBeanResults(searchResults, beanTreePath);
    }
  }

  private JsonObject getCollectionResults(
    WebLogicRestBeanRepoSearchResults searchResults,
    BeanTreePath beanTreePath
  ) {
    JsonObject slcrt =
      super.findWebLogicSearchResults(searchResults, getServerLifeCycleRuntimePath(beanTreePath), false);
    if (slcrt == null) {
      return null;
    }
    JsonArray items = slcrt.getJsonArray("items");
    JsonArrayBuilder itemsBuilder = Json.createArrayBuilder();
    for (int i = 0; i < items.size(); i++) {
      // e.g. [ "serverLifeCycleRuntimes", "AdminServer" ] :
      String server = items.getJsonObject(i).getJsonArray("identity").getString(1);
      BeanTreePath combinedServerBeanTreePath =
        BeanTreePath.create(beanTreePath.getBeanRepo(), beanTreePath.getPath().childPath(server));
      JsonObject item = getBeanResults(searchResults, combinedServerBeanTreePath);
      itemsBuilder.add(item);
    }
    return Json.createObjectBuilder().add("items", itemsBuilder).build();
  }

  private JsonObject getBeanResults(
    WebLogicRestBeanRepoSearchResults searchResults,
    BeanTreePath beanTreePath
  ) {
    JsonObjectBuilder rtn = Json.createObjectBuilder();
    JsonObject slcrt = 
      super.findWebLogicSearchResults(searchResults, getServerLifeCycleRuntimePath(beanTreePath), false);
    if (slcrt == null) {
      // The server doesn't exist
      return null;
    }
    rtn.add("serverLifeCycleRuntime", slcrt);
    JsonArray slcrtIdentity = slcrt.getJsonArray("identity");
    String name = slcrtIdentity.getString(1); // [ "serverLifeCycleRuntimes", "AdminServer" ]
    rtn.add("name", name);
    JsonArrayBuilder identity = Json.createArrayBuilder();
    identity.add("combinedServerRuntimes");
    identity.add(name);
    rtn.add("identity", identity);
    JsonObject srt =
      super.findWebLogicSearchResults(searchResults, getServerRuntimePath(beanTreePath), false);
    if (srt != null) {
      rtn.add("serverRuntime", srt);
      rtn.add("type", "RunningServerRuntime");
      rtn.add("state", srt.get("state"));
    } else {
      rtn.add("type", "NotRunningServerRuntime");
      rtn.add("state", "NOT_RUNNING");
    }

    // TBD - need to update all the identities from
    // serverRuntimes / <server> -> servers / <server> / serverRuntime
    // serverLifeCycleRuntimes / <server> -> servers / <server> / serverLifeCycleRuntime
    // (refs and containment)

    // How do I make this happen for the sub-resources too?
    // Or is there something I can put into the nav tree child stuff
    // so that they're handled via the normal urls?
  
    return rtn.build();
  }

  private BeanTreePath getServerLifeCycleRuntimePath(BeanTreePath beanTreePath) {
    return getCorrespondingBeanTreePath("DomainRuntime.ServerLifeCycleRuntimes", beanTreePath);
  }

  private BeanTreePath getServerRuntimePath(BeanTreePath beanTreePath) {
    return getCorrespondingBeanTreePath("DomainRuntime.ServerRuntimes", beanTreePath);
  }

  private BeanTreePath getCorrespondingBeanTreePath(String collectionPath, BeanTreePath beanTreePath) {
    Path path = new Path(collectionPath);
    if (beanTreePath.getLastSegment().isKeySet()) {
      path.addComponent(beanTreePath.getLastSegment().getKey());
    }
    return BeanTreePath.create(beanTreePath.getBeanRepo(), path);
  }
}
