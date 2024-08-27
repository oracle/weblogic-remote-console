// Copyright (c) 2024, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.customizers;

import weblogic.remoteconsole.server.repo.BeanTreePath;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.webapp.BaseResource;

/** 
 */
public class RealmMBeanCustomizer {

  private RealmMBeanCustomizer() {
  }

  public static BaseResource createResource(InvocationContext ic) {
    BeanTreePath btp = ic.getBeanTreePath();
    if (btp.isCollection()) {
      return new RealmMBeanCreatableBeanCollectionResource();
    }
    return null;
  }
}
