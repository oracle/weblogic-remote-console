// Copyright (c) 2021, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.webapp;

import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

/**
 * JAXRS resource for mananging the change manager
 */
public class ChangeManagerResource extends BaseResource {

  // Get the current status of the change manager
  @GET
  @Produces(MediaType.APPLICATION_JSON)
  public Response getChangeManagerStatus() {
    return ChangeManagerStatusResponseMapper.toResponse(
      getInvocationContext(),
      getInvocationContext().getPageRepo().asChangeManagerPageRepo().getChangeManagerStatus(
        getInvocationContext()
      )
    );
  }

  // Get the list of mbean changes (i.e. shopping cart contents)
  @Path("changes")
  @GET
  @Produces(MediaType.APPLICATION_JSON)
  public Response getChanges() {
    return
      ChangesResponseMapper.toResponse(
        getInvocationContext(),
        getInvocationContext().getPageRepo().asChangeManagerPageRepo().getChanges(
          getInvocationContext()
        )
      );
  }

  // Commit the mbean changes (i.e. checkout the shopping cart contents)
  @Path("commitChanges")
  @POST
  @Produces(MediaType.APPLICATION_JSON)
  public Response commitChanges() {
    return
      VoidResponseMapper.toResponse(
        getInvocationContext(),
        getInvocationContext().getPageRepo().asChangeManagerPageRepo().commitChanges(
          getInvocationContext()
        )
      );
  }

  // Discard the mbean changes (i.e. discard the shopping cart contents)
  @Path("discardChanges")
  @POST
  @Produces(MediaType.APPLICATION_JSON)
  public Response discardChanges() {
    return
      VoidResponseMapper.toResponse(
        getInvocationContext(),
        getInvocationContext().getPageRepo().asChangeManagerPageRepo().discardChanges(
          getInvocationContext()
        )
      );
  }
}
