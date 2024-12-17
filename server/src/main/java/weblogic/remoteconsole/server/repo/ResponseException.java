// Copyright (c) 2024, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

/**
 * This class is used to throw a non-successful Response
 */
public class ResponseException extends RuntimeException {

  private Response response;

  public ResponseException(Response response) {
    super();
    this.response = response;
  }

  public Response getResponse() {
    return response;
  }

  public ResponseException addFailureMessage(String message) {
    response.addFailureMessage(message);
    return this;
  }
}
