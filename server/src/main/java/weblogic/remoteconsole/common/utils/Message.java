// Copyright (c) 2021, 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.utils;

/**
 * This class holds a message that should be returned to the user.
 */
public class Message {
  public enum Severity {
    SUCCESS,
    WARNING,
    FAILURE
  }

  private Severity severity = Severity.SUCCESS;
  private String property;
  private String text;

  public static Message newSuccessMessage(String text) {
    return newSuccessMessage(null, text);
  }

  public static Message newSuccessMessage(String property, String text) {
    return new Message(Severity.SUCCESS, property, text);
  }

  public static Message newWarningMessage(String text) {
    return newWarningMessage(null, text);
  }

  public static Message newWarningMessage(String property, String text) {
    return new Message(Severity.WARNING, property, text);
  }

  public static Message newFailureMessage(String text) {
    return newFailureMessage(null, text);
  }

  public static Message newFailureMessage(String property, String text) {
    return new Message(Severity.FAILURE, property, text);
  }

  public Message(String severityAsString, String text) {
    this(severityAsString, null, text);
  }

  public Message(String severityAsString, String property, String text) {
    this(severityStringToSeverity(severityAsString), property, text);
  }

  public Message(Severity severity, String text) {
    this(severity, null, text);
  }

  public Message(Severity severity, String property, String text) {
    if ("java.lang.NullPointerException".equals(text)) {
      // convert random NPEs into more suitable messages
      text = "An unexpected exception has occurred processing your request";
    }
    this.severity = severity;
    this.property = property;
    this.text = text;
  }

  public Severity getSeverity() {
    return severity;
  }

  public boolean isSuccess() {
    return Severity.SUCCESS == getSeverity();
  }

  public boolean isWarning() {
    return Severity.WARNING == getSeverity();
  }

  public boolean isFailure() {
    return Severity.FAILURE == getSeverity();
  }

  public String getProperty() {
    return property;
  }

  public String getText() {
    return text;
  }

  private static Severity severityStringToSeverity(String severityAsString) {
    if (Severity.SUCCESS.toString().equals(severityAsString)) {
      return Severity.SUCCESS;
    }
    if (Severity.WARNING.toString().equals(severityAsString)) {
      return Severity.WARNING;
    }
    if (Severity.FAILURE.toString().equals(severityAsString)) {
      return Severity.FAILURE;
    }
    throw new AssertionError("Unexpected severity: " + severityAsString);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("Message<").append(getSeverity());
    if (StringUtils.notEmpty(getProperty())) {
      sb.append("," + getProperty());
    }
    sb.append(",").append(getText()).append(">");
    return sb.toString();
  }
}
