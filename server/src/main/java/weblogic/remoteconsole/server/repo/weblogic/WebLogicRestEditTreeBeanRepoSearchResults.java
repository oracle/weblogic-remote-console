// Copyright (c) 2021, 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo.weblogic;

import java.util.Map;
import java.util.logging.Logger;
import javax.json.JsonArray;
import javax.json.JsonObject;
import javax.json.JsonValue;

import weblogic.remoteconsole.common.repodef.BeanChildDef;
import weblogic.remoteconsole.common.repodef.BeanPropertyDef;
import weblogic.remoteconsole.common.utils.Path;
import weblogic.remoteconsole.common.utils.StringUtils;
import weblogic.remoteconsole.server.repo.AddedBean;
import weblogic.remoteconsole.server.repo.BeanRepo;
import weblogic.remoteconsole.server.repo.BeanTreePath;
import weblogic.remoteconsole.server.repo.ChangeManagerBeanRepoSearchResults;
import weblogic.remoteconsole.server.repo.ChangeManagerStatus;
import weblogic.remoteconsole.server.repo.Changes;
import weblogic.remoteconsole.server.repo.ModifiedBeanProperty;
import weblogic.remoteconsole.server.repo.RemovedBean;
import weblogic.remoteconsole.server.repo.Value;

/**
 * Returns the results of a search an admin server's edit tree.
 */
class WebLogicRestEditTreeBeanRepoSearchResults
  extends WebLogicRestBeanRepoSearchResults
  implements ChangeManagerBeanRepoSearchResults {

  private static final Logger LOGGER = Logger.getLogger(WebLogicRestEditTreeBeanRepoSearchResults.class.getName());

  public WebLogicRestEditTreeBeanRepoSearchResults(
    WebLogicRestBeanRepoSearchBuilder builder,
    Map<String,JsonObject> rootBeanNameToSearchResultsMap
  ) {
    super(builder, rootBeanNameToSearchResultsMap);
  }

  @Override
  public ChangeManagerStatus getChangeManagerStatus() {
    JsonObject searchResults = getRootBeanNameToSearchResultsMap().get("Domain");
    if (searchResults == null) {
      return null;
    }
    JsonObject changeManager = searchResults.getJsonObject("changeManager");
    if (changeManager == null) {
      return null;
    }
    JsonObject consoleChangeManager = searchResults.getJsonObject("consoleChangeManager");
    return
      new ChangeManagerStatus(
        changeManager.getBoolean("locked"), // always present
        changeManager.getString("lockOwner", null), // not present if !locked
        changeManager.getBoolean("hasChanges", false), // not present if !locked
        changeManager.getBoolean("mergeNeeded"), // always present
        consoleChangeManager != null // its presence tells us that we support changes
      );
  }

  @Override
  public Changes getChanges() {
    Changes changes = new Changes(getChangeManagerStatus());
    ChangeManagerStatus status = changes.getChangeManagerStatus();
    if (status != null && status.isSupportsChanges()) {
      addChanges(changes);
    }
    return changes;
  }

  private void addChanges(Changes changes) {
    JsonObject weblogicChanges =
      getRootBeanNameToSearchResultsMap().get("Domain").getJsonObject("consoleChangeManager").getJsonObject("changes");
    new ChangesBuilder(weblogicChanges, changes).build();
  }

  private class ChangesBuilder {
    private JsonObject weblogicChanges;
    private Changes changes;
    private WebLogicRestValueBuilder valueBuilder;

    private ChangesBuilder(JsonObject weblogicChanges, Changes changes) {
      this.weblogicChanges = weblogicChanges;
      this.changes = changes;
      BeanRepo beanRepo = getBuilder().getBeanRepo();
      BeanChildDef rootChildDef =
        beanRepo.getBeanRepoDef().getRootTypeDef().getChildDef(new Path("Domain"));
      this.valueBuilder = new WebLogicRestValueBuilder(beanRepo, rootChildDef);
    }

    private void build() {
      buildModifications();
      buildAdditions();
      buildRemovals();
    }

    private void buildModifications() {
      JsonArray weblogicVals = weblogicChanges.getJsonArray("modifications");
      if (weblogicVals == null) {
        return;
      }
      for (int i = 0; i < weblogicVals.size(); i++) {
        buildModification(weblogicVals.getJsonObject(i));
      }
    }

    private void buildAdditions() {
      JsonArray weblogicVals = weblogicChanges.getJsonArray("additions");
      if (weblogicVals == null) {
        return;
      }
      for (int i = 0; i < weblogicVals.size(); i++) {
        buildAddition(weblogicVals.getJsonObject(i));
      }
    }

    private void buildRemovals() {
      JsonArray weblogicVals = weblogicChanges.getJsonArray("removals");
      if (weblogicVals == null) {
        return;
      }
      for (int i = 0; i < weblogicVals.size(); i++) {
        buildRemoval(weblogicVals.getJsonObject(i));
      }
    }

    private void buildModification(JsonObject weblogicVal) {
      BeanTreePath beanPath = getBeanTreePath(weblogicVal);
      String propertyRestName = weblogicVal.getString("property");
      Path propertyPath = new Path(StringUtils.getBeanName(propertyRestName));
      if (beanPath.getTypeDef().hasPropertyDef(propertyPath)) {
        BeanPropertyDef propertyDef = beanPath.getTypeDef().getPropertyDef(propertyPath);
        changes.getModifications().add(
          new ModifiedBeanProperty(
            beanPath,
            propertyDef,
            weblogicVal.getBoolean("unset"),
            getModificationValue(beanPath, propertyDef, weblogicVal.get("oldValue")),
            getModificationValue(beanPath, propertyDef, weblogicVal.get("newValue"))
          )
        );
      } else {
        LOGGER.finest("buildModification can't find property " + propertyPath + " " + beanPath);
      }
    }

    private Value getModificationValue(
      BeanTreePath beanPath,
      BeanPropertyDef propertyDef,
      JsonValue jsonVal
    ) {
      if (jsonVal == null) {
        return null;
      }
      // The WLS REST identity is relative to the first level bean of the
      // search results (e.g. /Domain or /DomainRuntime)
      BeanChildDef rootChildBean = beanPath.getSegments().get(0).getChildDef();
      WebLogicRestValueBuilder builder = new WebLogicRestValueBuilder(beanPath.getBeanRepo(), rootChildBean);
      if (isHaveExpandedValues(beanPath)) {
        // jsonVal should be an expanded value with a value property but without a set property
        jsonVal = jsonVal.asJsonObject().get("value");
      }
      return builder.buildValue(propertyDef, jsonVal);
    }

    private void buildAddition(JsonObject weblogicVal) {
      changes.getAdditions().add(
        new AddedBean(getBeanTreePath(weblogicVal))
      );
    }
  
    private void buildRemoval(JsonObject weblogicVal) {
      changes.getRemovals().add(
        new RemovedBean(getBeanTreePath(weblogicVal))
      );
    }

    private BeanTreePath getBeanTreePath(JsonObject weblogicVal) {
      BeanTreePath rtn = valueBuilder.buildReference(weblogicVal.get("identity")).asBeanTreePath();
      return rtn;
    }
  }
}
