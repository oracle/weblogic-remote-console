// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package com.oracle.weblogic.console.backend.services.plugins;

import java.util.logging.Logger;
import javax.ws.rs.DELETE;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import com.oracle.weblogic.console.backend.services.configuration.ConfigurationCollectionChildResource;
import com.oracle.weblogic.console.backend.services.configuration.DeploymentManager;

/** Customizes the LibraryMBean collection child JAXRS resource */
public class LibraryMBeanCollectionChildResource extends ConfigurationCollectionChildResource {

  private static final Logger LOGGER = Logger.getLogger(LibraryMBeanCollectionChildResource.class.getName());

  // TBD - redeploy an app on the admin server's file system?

  // TBD - upload and redeploy an app

  @Override
  @DELETE
  @Produces(MediaType.APPLICATION_JSON)
  public Response delete(
    @HeaderParam("X-Weblogic-Configuration-Version") String weblogicConfigurationVersion
  ) throws Exception {
    return
      DeploymentManager.undeployLibrary(
        getInvocationContext(),
        weblogicConfigurationVersion
      );
  }
}
