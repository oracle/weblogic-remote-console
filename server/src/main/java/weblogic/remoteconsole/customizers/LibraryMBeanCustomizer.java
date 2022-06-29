// Copyright (c) 2021, 2022, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.customizers;

import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.webapp.BaseResource;
import weblogic.remoteconsole.server.webapp.CreatableBeanCollectionResource;

/**
 * Custom code for processing the LibraryMBean
 */
public class LibraryMBeanCustomizer {

  private LibraryMBeanCustomizer() {
  }

  // Customize the LibraryMBean collection's JAXRS resource
  public static BaseResource createResource(InvocationContext ic) {
    if (ic.getBeanTreePath().isCollection() && ic.getPageRepo().isPageEditorRepo()) {
      if (ic.getPageRepo().isChangeManagerPageRepo()) {
        // The WLS REST api supports uploading and deploying a library.
        return new LibraryMBeanUploadableCreatableBeanCollectionResource();
      } else {
        // WDT only supports deploying a library that's already on the domain's file system.
        // It uses the normal mbean create protocols.
        //
        // Note: Since the DomainMBean's createLibrary method takes two args
        // (name + source path), it isn't tagged as a creator in the BeanInfo so our
        // harvester thinks the collection is read-only, even though it's creatable too
        // (both in the WLS REST api and WDT). Force it to be a creatable collection.
        return new CreatableBeanCollectionResource();
      }
    } else {
      return null;
    }
  }
}
