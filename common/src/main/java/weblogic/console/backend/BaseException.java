// Copyright (c) 2020, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend;

public class BaseException extends Exception {
  public BaseException(String message) {
    super(message);
  }

  public BaseException(Throwable cause) {
    super(cause);
  }

  public BaseException(String message, Throwable cause) {
    super(message, cause);
  }
}
