// Copyright (c) 2020, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package com.oracle.weblogic.console.backend.services;

import java.util.logging.Logger;

import weblogic.console.backend.typedesc.WeblogicBeanIdentity;
import weblogic.console.backend.utils.Path;

/** Base resource for resources that manage a bean or a collection of weblogic beans. */
public class WeblogicBeanResource extends BaseResource {

  private static final Logger LOGGER = Logger.getLogger(WeblogicBeanResource.class.getName());

  /**
   * get this bean's or collection of beans' relative url (e.g. below api/configuration/Domain)
   * used to identify the bean/beans in log and exception messages
   */
  protected String getIdentityRelativeUri() throws Exception {
    return getInvocationContext().getIdentity().getFoldedBeanPathWithIdentities().getRelativeUri();
  }

  /** Get the identity of a bean in this bean tree from its folded bean path with identities */
  protected WeblogicBeanIdentity createIdentity(
    Path foldedBeanPathWithIdentities
  ) throws Exception {
    return
      getInvocationContext()
        .getVersionedWeblogicPages()
        .getWeblogicBeanTypes()
        .getWeblogicBeanIdentityFromFoldedBeanPathWithIdentities(
            getInvocationContext().getRootPagesPath().getPerspectivePath().getRootBeanType(),
            foldedBeanPathWithIdentities
        );
  }
}
