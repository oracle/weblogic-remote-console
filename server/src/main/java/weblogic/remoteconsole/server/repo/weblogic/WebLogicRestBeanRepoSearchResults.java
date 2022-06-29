// Copyright (c) 2021, 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo.weblogic;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import javax.json.Json;
import javax.json.JsonArray;
import javax.json.JsonObject;

import weblogic.remoteconsole.common.repodef.BeanChildDef;
import weblogic.remoteconsole.server.repo.BeanReaderRepoSearchResults;
import weblogic.remoteconsole.server.repo.BeanSearchResults;
import weblogic.remoteconsole.server.repo.BeanTreePath;
import weblogic.remoteconsole.server.repo.BeanTreePathSegment;

/**
 * Returns the results of a search on a WebLogic REST-based bean repo.
 */
class WebLogicRestBeanRepoSearchResults implements BeanReaderRepoSearchResults {
  private WebLogicRestBeanRepoSearchBuilder builder;
  private Map<String,JsonObject> rootBeanNameToSearchResultsMap;

  public WebLogicRestBeanRepoSearchResults(
    WebLogicRestBeanRepoSearchBuilder builder,
    Map<String,JsonObject> rootBeanNameToSearchResultsMap
  ) {
    this.builder = builder;
    this.rootBeanNameToSearchResultsMap = rootBeanNameToSearchResultsMap;
  }

  WebLogicRestBeanRepoSearchBuilder getBuilder() {
    return this.builder;
  }

  protected Map<String,JsonObject> getRootBeanNameToSearchResultsMap() {
    return this.rootBeanNameToSearchResultsMap;
  }

  @Override
  public BeanSearchResults getBean(BeanTreePath beanPath) {
    if (beanPath.isCollection()) {
      throw new AssertionError("getBean can't return collections " + beanPath);
    }
    boolean haveExpandedValues = isHaveExpandedValues(beanPath);
    JsonObject weblogicBeanResults = findWebLogicSearchResults(beanPath, haveExpandedValues);
    if (weblogicBeanResults == null) {
      return null;
    }
    return new WebLogicRestBeanSearchResults(this, beanPath, haveExpandedValues, weblogicBeanResults);
  }

  @Override
  public List<BeanSearchResults> getUnsortedCollection(BeanTreePath collectionPath) {
    if (!collectionPath.isCollection()) {
      throw new AssertionError("getBeanCollection can't return single beans " + collectionPath);
    }
    boolean haveExpandedValues = isHaveExpandedValues(collectionPath);
    JsonObject weblogicCollectionResults = findWebLogicSearchResults(collectionPath, haveExpandedValues);
    if (weblogicCollectionResults == null) {
      return null;
    }
    List<BeanSearchResults> rtn = new ArrayList<>();
    JsonArray items = weblogicCollectionResults.getJsonArray("items");
    for (int i = 0; i < items.size(); i++) {
      JsonObject weblogicBeanResults = items.getJsonObject(i);
      String key = getKey(collectionPath.getLastSegment(), weblogicBeanResults, haveExpandedValues);
      BeanTreePath collectionChildPath =
        BeanTreePath.create(collectionPath.getBeanRepo(), collectionPath.getPath().childPath(key));
      rtn.add(
        new WebLogicRestBeanSearchResults(this, collectionChildPath, haveExpandedValues, weblogicBeanResults)
      );
    }
    return rtn;
  }

  private JsonObject findWebLogicSearchResults(BeanTreePath beanTreePath, boolean haveExpandedValues) {
    return
      WebLogicBeanTypeSearchHelper.getHelper(beanTreePath)
        .findWebLogicSearchResults(this, beanTreePath, haveExpandedValues);
  }

  JsonObject findDefaultWebLogicSearchResults(BeanTreePath beanTreePath, boolean haveExpandedValues) {
    if (beanTreePath.isRoot()) {
      // This is the implied bean that parents the WLS DomainMBean and DomainRuntimeMBean.
      // It's always implicitly available and has no properties.
      return Json.createObjectBuilder().build();
    }
    String rootBeanName = getBuilder().getBeanRepo().getRootBeanName(beanTreePath);
    JsonObject searchResults = getRootBeanNameToSearchResultsMap().get(rootBeanName);
    JsonObject childResults = searchResults;
    // The first segment identifies the root WLS bean tree and
    // is not included in the WLS REST search results
    for (int i = 1; i < beanTreePath.getSegments().size(); i++) {
      BeanTreePathSegment segment = beanTreePath.getSegments().get(i);
      JsonObject segmentResults = findSegmentResults(childResults, segment, haveExpandedValues);
      if (segmentResults == null) {
        return null; // not found
      } else {
        childResults = segmentResults; // keep going
      }
    }
    return childResults;
  }

  private JsonObject findSegmentResults(
    JsonObject parentResults,
    BeanTreePathSegment segment,
    boolean haveExpandedValues
  ) {
    if (parentResults == null) {
      return null; // not found
    }
    BeanChildDef childDef = segment.getChildDef();
    String childRestName = childDef.getOnlineChildName();
    if (!parentResults.containsKey(childRestName)) {
      return null; // not found
    }
    if (parentResults.isNull(childRestName)) {
      return null; // not found
    }
    JsonObject segmentResults = parentResults.getJsonObject(childRestName);
    if (segment.getChildDef().isCollection() && segment.isKeySet()) {
      return findCollectionChild(segmentResults, segment, haveExpandedValues);
    }
    return segmentResults;
  }

  private JsonObject findCollectionChild(
    JsonObject collectionSearchResults,
    BeanTreePathSegment segment,
    boolean haveExpandedValues
  ) {
    JsonArray items = collectionSearchResults.getJsonArray("items");
    for (int i = 0; i < items.size(); i++) {
      JsonObject beanResults = items.getJsonObject(i);
      if (segment.getKey().equals(getKey(segment, beanResults, haveExpandedValues))) {
        return beanResults;
      }
    }
    return null;
  }

  private String getKey(BeanTreePathSegment segment, JsonObject beanResults, boolean haveExpandedValues) {
    String restKeyProp = getRestKeyPropertyName(segment);
    if (haveExpandedValues) {
      return beanResults.getJsonObject(restKeyProp).getString("value");
    } else {
      return beanResults.getString(restKeyProp);
    }
  }

  private String getRestKeyPropertyName(BeanTreePathSegment segment) {
    return segment.getChildDef().getChildTypeDef().getKeyPropertyDef().getOnlinePropertyName();
  }

  public boolean isHaveExpandedValues(BeanTreePath beanTreePath) {
    if (!getBuilder().isIncludeIsSet()) {
      return false;
    } else {
      String rootBean = getBuilder().getBeanRepo().getRootBeanName(beanTreePath);
      return getBuilder().getRootBeanNameToQueryBuilderMap().get(rootBean).isReturnExpandedValues();
    }
  }
}
