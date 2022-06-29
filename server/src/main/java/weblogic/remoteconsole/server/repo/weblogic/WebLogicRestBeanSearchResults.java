// Copyright (c) 2021, 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo.weblogic;

import javax.json.JsonObject;
import javax.json.JsonValue;

import weblogic.remoteconsole.common.repodef.BeanChildDef;
import weblogic.remoteconsole.common.repodef.BeanPropertyDef;
import weblogic.remoteconsole.common.repodef.BeanTypeDef;
import weblogic.remoteconsole.common.utils.Path;
import weblogic.remoteconsole.server.repo.BeanReaderRepoSearchResults;
import weblogic.remoteconsole.server.repo.BeanSearchResults;
import weblogic.remoteconsole.server.repo.BeanTreePath;
import weblogic.remoteconsole.server.repo.SettableValue;
import weblogic.remoteconsole.server.repo.Value;

/**
 * Base implementation for returning search results from
 * WebLogic REST-based bean repos.
 */
public class WebLogicRestBeanSearchResults implements BeanSearchResults {
  private WebLogicRestBeanRepoSearchResults results;
  private BeanTreePath beanPath;
  private boolean haveExpandedValues;
  private JsonObject weblogicBeanResults;

  public WebLogicRestBeanSearchResults(
    WebLogicRestBeanRepoSearchResults results,
    BeanTreePath beanPath,
    boolean haveExpandedValues,
    JsonObject weblogicBeanResults
  ) {
    this.results = results;
    this.beanPath = beanPath;
    this.haveExpandedValues = haveExpandedValues;
    this.weblogicBeanResults = weblogicBeanResults;
  }

  @Override
  public BeanReaderRepoSearchResults getSearchResults() {
    return results;
  }

  @Override
  public BeanTreePath getBeanTreePath() {
    return beanPath;
  }

  protected boolean isHaveExpandedValues() {
    return this.haveExpandedValues;
  }

  protected JsonObject getWebLogicBeanResults() {
    return this.weblogicBeanResults;
  }

  @Override
  public Value getUnsortedValue(BeanPropertyDef propertyDef) {
    JsonObject wlBeanResults = getWebLogicBeanResults();
    BeanTypeDef typeDef = getBeanTreePath().getTypeDef();
    for (String parent : propertyDef.getParentPath().getComponents()) {
      BeanChildDef childDef = typeDef.getChildDef(new Path(parent), true);
      String parentRestName = childDef.getOnlineChildName();
      if (!wlBeanResults.containsKey(parentRestName) || wlBeanResults.isNull(parentRestName)) {
        return null; // the containing bean isn't present
      }
      wlBeanResults = wlBeanResults.getJsonObject(parentRestName);
      typeDef = childDef.getChildTypeDef();
    }
    String restName = propertyDef.getOnlinePropertyName();
    if (!wlBeanResults.containsKey(restName)) {
      return null; // the value isn't present
    }
    if (isHaveExpandedValues()) {
      // We should have been sent back a JsonObject that includes the property value and whether it was set
      JsonValue unwrappedValue = null;
      boolean set = false;
      if (propertyDef.isIdentity()) {
        // the WLS REST api never wraps the identity property
        unwrappedValue = wlBeanResults.get(restName);
      } else {
        JsonObject wrappedValue = wlBeanResults.getJsonObject(restName);
        unwrappedValue = wrappedValue.get("value");
        set = wrappedValue.getBoolean("set");
      }
      return new SettableValue(getValue(propertyDef, unwrappedValue), set);
    } else {
      // We should have been sent back just the value
      JsonValue unwrappedValue = wlBeanResults.get(restName);
      return getValue(propertyDef, unwrappedValue);
    }
  }

  private Value getValue(BeanPropertyDef propertyDef, JsonValue jsonValue) {
    // The WLS REST identity is relative to the first level bean of the
    // search results (e.g. /Domain or /DomainRuntime)
    BeanChildDef rootChildBean = getBeanTreePath().getSegments().get(0).getChildDef();
    WebLogicRestValueBuilder builder =
      new WebLogicRestValueBuilder(getBeanTreePath().getBeanRepo(), rootChildBean);
    return builder.buildValue(propertyDef, jsonValue);
  }
}
