// Copyright (c) 2020, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package com.oracle.weblogic.console.backend.services.control;


import com.oracle.weblogic.console.backend.services.PerspectiveResource;
import weblogic.console.backend.pagedesc.PagesPath;

/** Creates the domain's 'control' perspective's JAXRS resources. */
public class ControlResource extends PerspectiveResource {

  // Uncomment when we add the control perspective
  /*
    @Path("data")
    public ControlDataResource getControlDataResource() throws Exception {
      return copyContext(new ControlDataResource());
    }
  */

  /** This tree of JAXRS resources uses the control perspective's root pages path */
  @Override
  protected PagesPath newRootPagesPath() throws Exception {
    return PagesPath.newControlRootPagesPath(getInvocationContext().getWeblogicBeanTypes());
  }
}
