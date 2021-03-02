// Copyright (c) 2020, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.integration;

import weblogic.console.backend.BaseException;

public class WebLogicRestRequestException extends BaseException {
  public WebLogicRestRequestException(String message) {
    super(message);
  }

  public WebLogicRestRequestException(Throwable cause) {
    super(cause);
  }

  public WebLogicRestRequestException(String message, Throwable cause) {
    super(message, cause);
  }
}
