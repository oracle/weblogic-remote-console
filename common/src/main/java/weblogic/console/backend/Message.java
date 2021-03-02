// Copyright (c) 2020, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend;

/** Represents a structure used to relay messages */
public class Message {
  public enum Severity {
    INFO,
    WARNING,
    ERROR,
    FATAL;
  }

  private final String text;

  public String getText() {
    return this.text;
  }

  private final Severity severity;

  public Severity getSeverity() {
    return this.severity;
  }

  private final String property;

  public String getProperty() {
    return this.property;
  }

  public Message(String text, Severity severity) {
    this(text, severity, null);
  }

  public Message(String text, Severity severity, String property) {
    if ("java.lang.NullPointerException".equals(text)) {
      // convert random NPEs into more suitable messages
      text = "An unexpected exception has occurred processing your request";
    }
    this.text = text;
    this.severity = severity;
    this.property = property;
  }
}
