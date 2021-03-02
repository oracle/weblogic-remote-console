// Copyright (c) 2020, 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.driver;

import java.util.logging.Logger;

import weblogic.console.backend.connection.Connection;
import weblogic.console.backend.pagedesc.Localizer;
import weblogic.console.backend.pagedesc.PerspectivePath;
import weblogic.console.backend.typedesc.WeblogicBeanIdentity;

/**
 * Base class for all REST mappers.  Basically holds the invocation context
 * and provides methods to quick access some of its data.
 */
public abstract class BaseRestMapper {

  private static final Logger LOGGER =
    Logger.getLogger(BaseRestMapper.class.getName());

  private InvocationContext invocationContext;

  protected InvocationContext getInvocationContext() {
    return this.invocationContext;
  }

  protected BaseRestMapper(InvocationContext invocationContext) {
    this.invocationContext = invocationContext;
  }

  protected Localizer getLocalizer() {
    return getInvocationContext().getLocalizer();
  }

  protected WeblogicBeanIdentity getIdentity() {
    return getInvocationContext().getIdentity();
  }

  protected Connection getConnection() {
    return getInvocationContext().getConnection();
  }

  protected PerspectivePath getPerspectivePath() {
    return getInvocationContext().getRootPagesPath().getPerspectivePath();
  }
}
