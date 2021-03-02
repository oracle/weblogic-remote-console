// Copyright (c) 2020, 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.driver;

import javax.json.JsonArray;

public class MethodNotAllowedException extends DriverException {

  public MethodNotAllowedException(JsonArray messages) {
    super(messages);
  }

  public MethodNotAllowedException(String message) {
    super(message);
  }

  public MethodNotAllowedException(Throwable cause) {
    super(cause);
  }

  public MethodNotAllowedException(String message, Throwable cause) {
    super(message, cause);
  }
}
