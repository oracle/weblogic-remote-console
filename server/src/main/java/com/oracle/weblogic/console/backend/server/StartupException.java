// Copyright (c) 2020, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package com.oracle.weblogic.console.backend.server;

import weblogic.console.backend.BaseException;

public class StartupException extends BaseException {
  public StartupException(String message) {
    super(message);
  }

  public StartupException(Throwable cause) {
    super(cause);
  }

  public StartupException(String message, Throwable cause) {
    super(message, cause);
  }
}
