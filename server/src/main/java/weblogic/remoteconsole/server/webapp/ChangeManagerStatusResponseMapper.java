// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.webapp;

import javax.json.Json;
import javax.json.JsonObjectBuilder;

import weblogic.remoteconsole.server.repo.ChangeManagerStatus;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.Response;

/**
 * Converts a Response<ChangeManagerStatus> to a JAXRS Response.
 */
public class ChangeManagerStatusResponseMapper extends ResponseMapper<ChangeManagerStatus> {

  public static javax.ws.rs.core.Response toResponse(
    InvocationContext invocationContext,
    Response<ChangeManagerStatus> response
  ) {
    return new ChangeManagerStatusResponseMapper(invocationContext, response).toResponse();
  }

  private ChangeManagerStatusResponseMapper(
    InvocationContext invocationContext,
    Response<ChangeManagerStatus> response
  ) {
    super(invocationContext, response);
  }

  @Override
  protected void addResults() {
    addChangeManagerStatus(getEntityBuilder(), getResponse().getResults());
  }

  public static void addChangeManagerStatus(JsonObjectBuilder entityBldr, ChangeManagerStatus status) {
    if (status == null) {
      return;
    }
    JsonObjectBuilder statusBldr = Json.createObjectBuilder();
    statusBldr.add("locked", status.isLocked());
    if (status.isLocked()) {
      statusBldr.add("lockOwner", status.getLockOwner());
      statusBldr.add("hasChanges", status.isHasChanges());
    }
    statusBldr.add("mergeNeeded", status.isMergeNeeded());
    statusBldr.add("supportsChanges", status.isSupportsChanges());
    entityBldr.add("changeManager", statusBldr);
  }
}
