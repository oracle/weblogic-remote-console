// Copyright (c) 2020, 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.driver;

import javax.json.JsonArray;

public class DriverException extends Exception {

  private JsonArray messages;

  public JsonArray getMessages() {
    return this.messages;
  }

  public DriverException(JsonArray messages) {
    super((messages != null) ? messages.toString() : null);
    this.messages = messages;
  }

  public DriverException(String message) {
    super(message);
  }

  public DriverException(Throwable cause) {
    super(cause);
  }

  public DriverException(String message, Throwable cause) {
    super(message, cause);
  }
}
