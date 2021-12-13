// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.webapp;

import javax.ws.rs.DELETE;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

/**
 * Handles the JAXRS methods for a deletable collection child bean's pages.
 */
public class DeletableCollectionChildBeanResource  extends EditableCollectionChildBeanResource {

  /**
   * Deletes the collection child.
   */
  @DELETE
  @Produces(MediaType.APPLICATION_JSON)
  public Response delete() {
    return deleteCollectionChild();
  }

  protected Response getSliceForm() {
    return
      GetPageResponseMapper.toResponse(
        getInvocationContext(),
        getInvocationContext()
          .getPageRepo().asPageReaderRepo()
          .getPage(getInvocationContext())
      );
  }

  protected Response deleteCollectionChild() {
    return DeleteHelper.delete(getInvocationContext());
  }
}
