// Copyright (c) 2020, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package com.oracle.weblogic.console.backend.services;

import java.util.logging.Logger;

import weblogic.console.backend.driver.InvocationContext;

/**
 * Base class for all console JAXRS resources that can only operate if the request has a connection
 * to WLS.
 * <p>
 * Throws a 503 when it is initialized for the request if there is no connection to WLS
 * (so that derived classes can rely on only being called when connected).
 */
public abstract class ConnectionRequiredResource extends BaseResource {

  private static final Logger LOGGER = Logger.getLogger(ConnectionRequiredResource.class.getName());

  @Override
  protected void setInvocationContext(InvocationContext invocationContext) throws Exception {
    if (invocationContext.getConnection() == null) {
      throw new ServiceException("not connected to a Weblogic domain");
    }
    super.setInvocationContext(invocationContext);
  }
}
