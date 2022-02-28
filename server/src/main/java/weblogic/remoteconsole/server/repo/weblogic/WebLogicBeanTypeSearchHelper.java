// Copyright (c) 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo.weblogic;

import javax.json.JsonObject;

import weblogic.remoteconsole.common.repodef.BeanPropertyDef;
import weblogic.remoteconsole.common.repodef.weblogic.AggregatedRuntimeMBeanNameHandler;
import weblogic.remoteconsole.common.repodef.weblogic.DelegatedServerLifeCycleRuntimeMBeanNameHandler;
import weblogic.remoteconsole.common.repodef.weblogic.DelegatedServerRuntimeMBeanNameHandler;
import weblogic.remoteconsole.server.repo.BeanTreePath;

/**
 * Helps conduct searches for a WebLogic bean type.
 * 
 * It has the default behavior.  Derived classes can customize
 * the behavior, e.g. for logical beans that aggregate results
 * across all of the running servers.
 */
class WebLogicBeanTypeSearchHelper {

  public static WebLogicBeanTypeSearchHelper getHelper(BeanTreePath beanTreePath) {
    return getHelper(beanTreePath.getTypeDef().getTypeName());
  }

  public static WebLogicBeanTypeSearchHelper getHelper(String type) {
    if ("CombinedServerRuntimeMBean".equals(type)
         || "RunningServerRuntimeMBean".equals(type)
         || "NotRunningServerRuntimeMBean".equals(type)
    ) {
      return new CombinedServerRuntimeMBeanWebLogicSearchHelper();
    }
    if (AggregatedRuntimeMBeanNameHandler.INSTANCE.isFabricatedName(type)) {
      return new AggregatedRuntimeMBeanWebLogicSearchHelper();
    }
    if (DelegatedServerRuntimeMBeanNameHandler.INSTANCE.isFabricatedName(type)) {
      return new DelegatedServerRuntimeMBeanWebLogicSearchHelper();
    }
    if (DelegatedServerLifeCycleRuntimeMBeanNameHandler.INSTANCE.isFabricatedName(type)) {
      return new DelegatedServerLifeCycleRuntimeMBeanWebLogicSearchHelper();
    }
    return new WebLogicBeanTypeSearchHelper();
  }

  void addProperty(
    WebLogicRestBeanRepoSearchBuilder searchBuilder,
    BeanTreePath beanTreePath,
    BeanPropertyDef propertyDef
  ) {
    searchBuilder.defaultAddProperty(beanTreePath, propertyDef);
  }

  JsonObject findWebLogicSearchResults(
    WebLogicRestBeanRepoSearchResults searchResults,
    BeanTreePath beanTreePath,
    boolean haveExpandedValues
  ) {
    return searchResults.findDefaultWebLogicSearchResults(beanTreePath, haveExpandedValues);
  }
}
