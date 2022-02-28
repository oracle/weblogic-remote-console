// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.webapp;

import javax.ws.rs.DefaultValue;
import javax.ws.rs.GET;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

/**
 * Handles HTTP methods for a readonly optonal singleton bean.
 */
public class ReadOnlyOptionalSingletonBeanResource extends BeanResource {

  /**
   * Get a read-only optional singleton's RDJ.
   * 
   * Returns a 200 without a "data" property in the response
   * if the singleton does not exist.
   */
  @GET
  @Produces(MediaType.APPLICATION_JSON)
  public Response get(@QueryParam("slice") @DefaultValue("") String slice) {
    setSlicePagePath(slice);
    return getSliceForm();
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
}
