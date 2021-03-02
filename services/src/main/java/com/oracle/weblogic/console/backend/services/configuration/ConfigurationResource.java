// Copyright (c) 2020, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package com.oracle.weblogic.console.backend.services.configuration;

import javax.ws.rs.Path;

import com.oracle.weblogic.console.backend.services.PerspectiveResource;
import weblogic.console.backend.pagedesc.PagesPath;

/** Creates the domain's 'configuration' perspective's JAXRS resources. */
public class ConfigurationResource extends PerspectiveResource {

  /** Creates a JAXRS resource that handles the RDJ for the domain mbean. */
  @Path("data/Domain")
  public ConfigurationDomainResource getConfigurationDomainResource() throws Exception {
    return copyContext(new ConfigurationDomainResource());
  }

  /** Creates a JAXRS resource for the change manager */
  @Path("changeManager")
  public ChangeManagerResource getChangeManagerResource() throws Exception {
    return copyContext(new ChangeManagerResource());
  }

  /** This tree of JAXRS resources uses the configuration perspective's root pages path */
  @Override
  protected PagesPath newRootPagesPath() throws Exception {
    return PagesPath.newConfigurationRootPagesPath(getInvocationContext().getWeblogicBeanTypes());
  }
}
