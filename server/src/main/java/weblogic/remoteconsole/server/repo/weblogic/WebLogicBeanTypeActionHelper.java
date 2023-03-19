// Copyright (c) 2023, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo.weblogic;

import weblogic.remoteconsole.common.repodef.weblogic.DelegatedServerRuntimeMBeanNameHandler;
import weblogic.remoteconsole.server.repo.BeanTreePath;

/**
 * Helps invoke actions for a WebLogic bean type.
 * 
 * It has the default behavior.  Derived classes can customize the behavior.
 */
class WebLogicBeanTypeActionHelper {

  public static WebLogicBeanTypeActionHelper getHelper(BeanTreePath beanTreePath) {
    return getHelper(beanTreePath.getTypeDef().getTypeName());
  }

  public static WebLogicBeanTypeActionHelper getHelper(String type) {
    if (DelegatedServerRuntimeMBeanNameHandler.INSTANCE.isFabricatedName(type)) {
      return new DelegatedServerRuntimeMBeanActionHelper();
    }
    return new WebLogicBeanTypeActionHelper();
  }

  BeanTreePath getActionBeanPath(BeanTreePath beanPath) {
    return beanPath;
  }
}
