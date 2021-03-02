// Copyright (c) 2020, 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.driver;

import javax.json.JsonArray;

public class PageSourceNotFoundException extends DriverException {

  public PageSourceNotFoundException(JsonArray messages) {
    super(messages);
  }

  public PageSourceNotFoundException(String message) {
    super(message);
  }

  public PageSourceNotFoundException(Throwable cause) {
    super(cause);
  }

  public PageSourceNotFoundException(String message, Throwable cause) {
    super(message, cause);
  }
}
