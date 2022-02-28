// Copyright (c) 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo.weblogic;

import javax.json.Json;
import javax.json.JsonArray;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;

import weblogic.remoteconsole.common.repodef.BeanPropertyDef;
import weblogic.remoteconsole.common.repodef.BeanTypeDef;
import weblogic.remoteconsole.common.repodef.weblogic.FabricatedRuntimeMBeanNameHandler;
import weblogic.remoteconsole.server.repo.BeanTreePath;

/**
 * Helps conduct searches for a fabricated bean type that delegates to
 * a corresponding underlying weblogic runtime mbean.
 */
class DelegatedRuntimeMBeanWebLogicSearchHelper extends WebLogicBeanTypeSearchHelper {

  private FabricatedRuntimeMBeanNameHandler nameHandler;
  private DelegatedIdentityFixer identityFixer;

  protected DelegatedRuntimeMBeanWebLogicSearchHelper(
    FabricatedRuntimeMBeanNameHandler nameHandler,
    DelegatedIdentityFixer identityFixer
  ) {
    this.nameHandler = nameHandler;
    this.identityFixer = identityFixer;
  }

  @Override
  void addProperty(
    WebLogicRestBeanRepoSearchBuilder searchBuilder,
    BeanTreePath beanTreePath,
    BeanPropertyDef propertyDef
  ) {
    super.addProperty(searchBuilder, nameHandler.getUnfabricatedBeanTreePath(beanTreePath), propertyDef);
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
    JsonObject undelResults =
      super.findWebLogicSearchResults(
        searchResults,
        nameHandler.getUnfabricatedBeanTreePath(beanTreePath),
        false
      );
    if (undelResults == null) {
      return null;
    }
    JsonArrayBuilder items = Json.createArrayBuilder();
    JsonArray undelItems = undelResults.getJsonArray("items");
    for (int i = 0; i < undelItems.size(); i++) {
      items.add(
        undelegatedBeanResultsToDelegatedBeanResults(
          beanTreePath.getTypeDef(),
          undelItems.getJsonObject(i)
        )
      );
    }
    JsonObjectBuilder rtn = Json.createObjectBuilder();
    rtn.add("items", items);
    return rtn.build();
  }

  private JsonObject getBeanResults(
    WebLogicRestBeanRepoSearchResults searchResults,
    BeanTreePath beanTreePath
  ) {
    JsonObject undelResults =
      super.findWebLogicSearchResults(
        searchResults,
        nameHandler.getUnfabricatedBeanTreePath(beanTreePath),
        false
      );
    if (undelResults == null) {
      return null;
    }
    return
      undelegatedBeanResultsToDelegatedBeanResults(
        beanTreePath.getTypeDef(),
        undelResults
      );
  }

  private JsonObject undelegatedBeanResultsToDelegatedBeanResults(BeanTypeDef beanTypeDef, JsonObject undelResults) {
    return identityFixer.undelegatedResultsToDelegatedResults(beanTypeDef, undelResults);
  }
}
