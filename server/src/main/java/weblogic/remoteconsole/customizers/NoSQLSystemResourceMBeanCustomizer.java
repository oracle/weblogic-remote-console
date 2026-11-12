// Copyright (c) 2026, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.customizers;

import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.webapp.BaseResource;

/**
 * Custom code for processing NoSQLSystemResourceMBeans.
 */
public class NoSQLSystemResourceMBeanCustomizer {

  private NoSQLSystemResourceMBeanCustomizer() {
  }

  /**
   * Customizes the NoSQLSystemResourceMBean collection's JAXRS resource.
   */
  public static BaseResource createResource(InvocationContext ic) {
    if (ic.getBeanTreePath().isCollection() && ic.getBeanTreePath().isCreatable()) {
      return new NoSQLSystemResourceMBeanCreatableCollectionResource();
    }
    return null;
  }
}
