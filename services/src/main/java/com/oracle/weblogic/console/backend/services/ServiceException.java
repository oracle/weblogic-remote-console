// Copyright (c) 2020, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package com.oracle.weblogic.console.backend.services;

import java.util.logging.Logger;

import weblogic.console.backend.MessagesException;
import weblogic.console.backend.MessagesException.HttpStatus;
import weblogic.console.backend.MessagesException.Severity;
import weblogic.console.backend.driver.BadRequestException;
import weblogic.console.backend.driver.MethodNotAllowedException;
import weblogic.console.backend.driver.NoDataFoundException;
import weblogic.console.backend.driver.PageSourceNotFoundException;

/**
 * Holds data about an exception that needs to be converted into an HTTP response and sent back to
 * the client.
 */
public class ServiceException extends MessagesException {

  private static final Logger LOGGER = Logger.getLogger(ServiceException.class.getName());

  public ServiceException(String message) {
    super(message);
  }

  public ServiceException(String message, Throwable cause) {
    super(cause);
  }

  public ServiceException(String message, HttpStatus httpStatus) {
    super(message, httpStatus);
  }

  public ServiceException(String message, Severity severity) {
    super(message, severity);
  }

  public ServiceException(String message, Throwable cause, HttpStatus httpStatus) {
    super(message, cause, httpStatus);
  }

  public ServiceException(String message, Throwable cause, Severity severity) {
    super(message, cause, severity);
  }

  public ServiceException(Throwable cause) {
    super(cause);
  }

  public ServiceException(Throwable cause, HttpStatus httpStatus) {
    super(cause, httpStatus);
  }

  public ServiceException(Throwable cause, Severity severity) {
    super(cause, severity);
  }

  /**
   * Convert an exception thrown by the backend into one that can be converted into an HTTP response
   * that can send back to the client.
   * <p>
   * Also logs the original exception.
   */
  public static ServiceException toServiceException(Throwable t) {
    HttpStatus status = null;
    boolean severe = true;
    if (t instanceof BadRequestException) {
      severe = false;
      status = HttpStatus.BAD_REQUEST;
    } else if (t instanceof NoDataFoundException) {
      severe = false;
      status = HttpStatus.NOT_FOUND;
    } else if (t instanceof PageSourceNotFoundException) {
      severe = false;
      status = HttpStatus.NOT_FOUND;
    } else if (t instanceof MethodNotAllowedException) {
      severe = false;
      status = HttpStatus.METHOD_NOT_ALLOWED;
    }

    String msg = t.getLocalizedMessage();
    if (!severe) {
      LOGGER.fine(msg);
    } else {
      LOGGER.severe(msg);
      t.printStackTrace();
    }
    if (status != null) {
      return new ServiceException(t, status);
    } else {
      return new ServiceException(t);
    }
  }
}
