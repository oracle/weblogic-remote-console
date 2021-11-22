// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.webapp;

import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.Response;

/**
 * Maps a Reponse<Void> to a JAXRS response
 */
public class VoidResponseMapper extends ResponseMapper<Void> {

  public static javax.ws.rs.core.Response toResponse(InvocationContext invocationContext, Response<Void> response) {
    return new VoidResponseMapper(invocationContext, response).toResponse();
  }

  private VoidResponseMapper(InvocationContext invocationContext, Response<Void> response) {
    super(invocationContext, response);
  }

  @Override
  protected void addResults() {
  }
}
