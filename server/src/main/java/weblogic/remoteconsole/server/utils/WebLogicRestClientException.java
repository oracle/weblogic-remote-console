// Copyright (c) 2020, 2021, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.utils;

public class WebLogicRestClientException extends Exception {
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
