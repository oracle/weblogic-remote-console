// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

/**
 * This class holds an unsuccessful response.
 * 
 * Used for throwing unsuccessful responses that will eventually
 * be caught by the CBE and turned into JAXRS responses.
 */
public class UnsuccessfulResponseException extends RuntimeException {
  private Response<Void> unsuccessfulResponse = new Response<Void>();

  public UnsuccessfulResponseException(Response<?> unsuccessfulResponse) {
    if (unsuccessfulResponse.isSuccess()) {
      throw new AssertionError("Can't create an UnsuccessfulResponseException from a successful response");
    }
    this.unsuccessfulResponse.copyUnsuccessfulResponse(unsuccessfulResponse);
  }

  public Response<Void> getUnsuccessfulResponse() {
    return unsuccessfulResponse;
  }
}
