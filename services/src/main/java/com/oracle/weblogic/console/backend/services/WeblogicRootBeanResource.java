// Copyright (c) 2020, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package com.oracle.weblogic.console.backend.services;

import java.util.logging.Logger;

import weblogic.console.backend.driver.InvocationContext;
import weblogic.console.backend.utils.Path;
import weblogic.console.backend.utils.PluginInvocationUtils;
import weblogic.console.backend.utils.StringUtils;

/** Base resource for resources that manage the root weblogic bean of a bean tree. */
public abstract class WeblogicRootBeanResource extends WeblogicBeanResource {

  private static final Logger LOGGER = Logger.getLogger(WeblogicRootBeanResource.class.getName());

  // this resource manages this perspective's root resource
  @Override
  protected void setInvocationContext(InvocationContext invocationContext) throws Exception {
    super.setInvocationContext(invocationContext);
    getInvocationContext().setIdentity(createIdentity(new Path()));
  }

  // Creates a custom resource if resourceClassName isn't empty or null.  Otherwise returns null.
  protected WeblogicBeanResource createCustomResource(String resourceClassName) throws Exception {
    if (StringUtils.isEmpty(resourceClassName)) {
      return null; // not customized
    }
    Class clazz = PluginInvocationUtils.findJavaClass("createCustomResource", resourceClassName);
    if (!WeblogicBeanResource.class.isAssignableFrom(clazz)) {
      throw new Exception(resourceClassName + " does not extend WeblogicBeanResource");
    }
    return (WeblogicBeanResource)clazz.newInstance();
  }
}
