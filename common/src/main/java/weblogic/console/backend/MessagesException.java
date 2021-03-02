// Copyright (c) 2020, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend;

/**
 * The is a general-purpose class for generating an exception, which will be used during the
 * creation of a Messages-only REST response.
 *
 * @see BaseException
 */
public class MessagesException extends BaseException {
  public enum HttpStatus {
    INTERNAL_ERROR(500),
    SERVICE_NOT_AVAILABLE(503),
    BAD_REQUEST(400),
    NOT_FOUND(404),
    METHOD_NOT_ALLOWED(405);

    public int getCode() {
      return this.code;
    }

    private final int code;

    private HttpStatus(int code) {
      this.code = code;
    }
  }

  public enum Severity {
    OK("OK"),
    WARNING("WARNING"),
    ERROR("ERROR");

    public String getLevel() {
      return this.level;
    }

    private final String level;

    private Severity(String level) {
      this.level = level;
    }
  }

  public MessagesException(String message) {
    super(message);
    this.httpStatus = HttpStatus.SERVICE_NOT_AVAILABLE;
    this.severity = Severity.ERROR;
  }

  public MessagesException(String message, Severity severity) {
    super(message);
    this.httpStatus = HttpStatus.SERVICE_NOT_AVAILABLE;
    this.severity = severity;
  }

  public MessagesException(String message, HttpStatus httpStatus) {
    super(message);
    this.httpStatus = httpStatus;
    this.severity = Severity.ERROR;
  }

  public MessagesException(String message, HttpStatus httpStatus, Severity severity) {
    super(message);
    this.httpStatus = httpStatus;
    this.severity = severity;
  }

  public MessagesException(String message, Throwable cause, Severity severity) {
    super(message, cause);
    this.httpStatus = HttpStatus.SERVICE_NOT_AVAILABLE;
    this.severity = severity;
  }

  public MessagesException(String message, Throwable cause, HttpStatus httpStatus) {
    super(message, cause);
    this.httpStatus = httpStatus;
    this.severity = Severity.ERROR;
  }

  public MessagesException(
      String message, Throwable cause, HttpStatus httpStatus, Severity severity) {
    super(message, cause);
    this.httpStatus = httpStatus;
    this.severity = severity;
  }

  public MessagesException(Throwable cause) {
    super(null, cause);
    this.httpStatus = HttpStatus.SERVICE_NOT_AVAILABLE;
    this.severity = Severity.ERROR;
  }

  public MessagesException(Throwable cause, HttpStatus httpStatus) {
    super(null, cause);
    this.httpStatus = httpStatus;
    this.severity = Severity.ERROR;
  }

  public MessagesException(Throwable cause, Severity severity) {
    super(null, cause);
    this.httpStatus = HttpStatus.SERVICE_NOT_AVAILABLE;
    this.severity = severity;
  }

  public HttpStatus getHttpStatus() {
    return this.httpStatus;
  }

  public Severity getSeverity() {
    return this.severity;
  }

  // private:
  private final HttpStatus httpStatus;
  private final Severity severity;
}
