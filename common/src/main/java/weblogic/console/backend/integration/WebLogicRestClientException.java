// Copyright (c) 2020, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.integration;

import weblogic.console.backend.BaseException;

public class WebLogicRestClientException extends BaseException {
  public WebLogicRestClientException(String message) {
    super(message);
  }

  public WebLogicRestClientException(Throwable cause) {
    super(cause);
  }

  public WebLogicRestClientException(String message, Throwable cause) {
    super(message, cause);
  }
}
