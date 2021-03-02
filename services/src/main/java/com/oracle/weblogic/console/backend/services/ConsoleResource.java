// Copyright (c) 2020, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package com.oracle.weblogic.console.backend.services;

import javax.ws.rs.Path;
import javax.ws.rs.container.ResourceContext;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.HttpHeaders;

import com.oracle.weblogic.console.backend.services.about.AboutResource;
import com.oracle.weblogic.console.backend.services.configuration.ConfigurationResource;
import com.oracle.weblogic.console.backend.services.connection.ConnectionResource;
import com.oracle.weblogic.console.backend.services.runtime.MonitoringResource;
import weblogic.console.backend.driver.InvocationContext;

/**
 * This class is the console's root JAXRS resource. All resources are children of this resource.
 * <p>
 * This resource, and all its children, are request scoped.
 * <p>
 * They all reference a request-specific InvocationContext instance that holds information that
 * is needed to process this request:
 * <ul>
 *   <li>the connection (to a weblogic domain)</li>
 *   <li>the locale (the client's preferred language, used for i18n)</li>
 *   <li>the set of pages for this domain's version and the preferred locale</li>
 * </ul>
 */
@Path("api")
public class ConsoleResource extends BaseResource {

  @Context ResourceContext resourceContext;
  @Context HttpHeaders headers;

  @Path("about")
  public AboutResource getAboutResource() throws Exception {
    return new AboutResource();
  }

  @Path("connection")
  public ConnectionResource getConnectionResource() {
    return new ConnectionResource();
  }

  @Path("configuration")
  public ConfigurationResource getConfigurationResource() throws Exception {
    return copyContext(new ConfigurationResource());
  }

  @Path("monitoring")
  public MonitoringResource getMonitoringRessource() throws Exception {
    return copyContext(new MonitoringResource());
  }

  // Uncomment when we add control resources
  /*
    @Path("control")
    public ControlResource getControlResource() throws Exception {
      return copyContext(new ControlResource());
    }
  */

  // Uncomment when we add searching
  /*
    @Path("search")
    public SearchResource getSearchRessource() throws Exception {
      return copyContext(new SearchResource());
    }
  */

  /**
   * Ideally, we'd initialize the invocation context in the constructor. But we need
   * the resource context and headers to do that, and they're injected after the constructor.
   * <p>
   * So, initialize the invocation context the first time someone tries to get it.
   * Unfortunately, this forces us to use synchronization.
   */
  @Override
  protected synchronized InvocationContext getInvocationContext() throws Exception {
    if (super.getInvocationContext() == null) {
      synchronized (this) {
        try {
          setInvocationContext(new InvocationContext(resourceContext, headers));
        } catch (Throwable t) {
          throw toServiceException(t);
        }
      }
    }
    return super.getInvocationContext();
  }
}
