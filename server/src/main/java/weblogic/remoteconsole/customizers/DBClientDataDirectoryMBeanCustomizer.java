// Copyright (c) 2024, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.customizers;

import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.webapp.BaseResource;

/**
 * Custom code for processing the DBClientDataDirectoryMBean
 */
public class DBClientDataDirectoryMBeanCustomizer {

  private DBClientDataDirectoryMBeanCustomizer() {
  }

  // Customize the DBClientDataDirectoryMBean collection's JAXRS resource
  public static BaseResource createResource(InvocationContext ic) {
    if (ic.getBeanTreePath().isCollection() && ic.getBeanTreePath().isCreatable()) {
      // WDT only supports non-upload AppDeployments and Libraries so their customizers
      // need to not add upload support for WDT.
      // WDT doesn't support DBClientDataDirectories at all so we'll never get here for WDT.
      // Therefore we can always add upload support.
      return new DBClientDataDirectoryMBeanUploadableCreatableBeanCollectionResource();
    } else {
      return null;
    }
  }
}
