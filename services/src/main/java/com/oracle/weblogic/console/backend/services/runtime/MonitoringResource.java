// Copyright (c) 2020, 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package com.oracle.weblogic.console.backend.services.runtime;

import javax.ws.rs.Path;
import javax.ws.rs.QueryParam;

import com.oracle.weblogic.console.backend.services.PerspectiveResource;
import weblogic.console.backend.pagedesc.PagesPath;

/** Creates the domain's 'monitoring' perspective's JAXRS resources. */
public class MonitoringResource extends PerspectiveResource {

  /**
   * Creates a JAXRS resource that handles the RDJ for the domain runtime mbean.
   *
   * @param properties is a comma-separated list of properties to return.
   * If null, then all properties for the form/table are returned.  Otherwise
   * only properties that are on the form/table AND in properties are returned.
   */
  @Path("data/DomainRuntime")
  public MonitoringDomainRuntimeResource getMonitoringDomainRuntimeResource(
     @QueryParam("properties") String properties
  ) throws Exception {
    // store which properties to return in the this resource's invocation context
    getInvocationContext().setProperties(properties);
    return copyContext(new MonitoringDomainRuntimeResource());
  }

  /** This tree of JAXRS resources uses the monitoring perspective's root pages path */
  @Override
  protected PagesPath newRootPagesPath() throws Exception {
    return PagesPath.newMonitoringRootPagesPath(getInvocationContext().getWeblogicBeanTypes());
  }
}
