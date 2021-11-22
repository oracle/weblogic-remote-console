// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.webapp;

import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.Response;

/**
 * Utility code called by JAXRS resources to delete a bean.
 */
public class DeleteHelper {

  private DeleteHelper() {
  }

  public static javax.ws.rs.core.Response delete(InvocationContext ic) {
    Response<Void> response = new Response<>();
    // Make sure the bean exists
    Response<Void> existsResponse =
      ic.getPageRepo().asPageReaderRepo().verifyExists(ic, ic.getBeanTreePath());
    if (!existsResponse.isSuccess()) {
      response.copyUnsuccessfulResponse(existsResponse);
      return VoidResponseMapper.toResponse(ic, response);
    }
    // Delete the bean
    response = ic.getPageRepo().asPageEditorRepo().delete(ic);
    return VoidResponseMapper.toResponse(ic, response);
  }
}
