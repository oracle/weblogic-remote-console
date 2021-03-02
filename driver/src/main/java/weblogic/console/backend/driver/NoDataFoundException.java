// Copyright (c) 2020, 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.driver;

import javax.json.JsonArray;

public class NoDataFoundException extends DriverException {

  public NoDataFoundException(JsonArray messages) {
    super(messages);
  }

  public NoDataFoundException(String message) {
    super(message);
  }

  public NoDataFoundException(Throwable cause) {
    super(cause);
  }

  public NoDataFoundException(String message, Throwable cause) {
    super(message, cause);
  }
}
