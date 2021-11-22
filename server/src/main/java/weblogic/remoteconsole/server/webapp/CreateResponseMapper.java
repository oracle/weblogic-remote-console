// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.webapp;

import weblogic.remoteconsole.server.repo.BeanTreePath;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.Response;

/**
 * Converts a Response<BeanTreePath> from creating a new bean to a JAXRS Response.
 */
public class CreateResponseMapper extends ResponseMapper<BeanTreePath> {

  public static javax.ws.rs.core.Response toResponse(
    InvocationContext invocationContext,
    Response<BeanTreePath> response
  ) {
    return new CreateResponseMapper(invocationContext, response).toResponse();
  }

  private CreateResponseMapper(InvocationContext invocationContext, Response<BeanTreePath> response) {
    super(invocationContext, response);
  }

  @Override
  protected void addResults() {
    getEntityBuilder().add("resourceData", beanTreePathToJson(getResponse().getResults()));
  }
}
