// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.webapp;

import javax.json.JsonObject;
import javax.ws.rs.Consumes;
import javax.ws.rs.DefaultValue;
import javax.ws.rs.POST;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

/**
 * Handles HTTP methods for an editable mandatory singleton bean.
 */
public class EditableMandatorySingletonBeanResource extends ReadOnlyMandatorySingletonBeanResource {

  /**
   * Modifies a slice of the bean.
   */
  @POST
  @Consumes(MediaType.APPLICATION_JSON)
  @Produces(MediaType.APPLICATION_JSON)
  public Response post(@QueryParam("slice") @DefaultValue("") String slice, JsonObject requestBody) {
    setSlicePagePath(slice);
    return updateSliceForm(requestBody);
  }

  protected Response updateSliceForm(JsonObject requestBody) {
    return UpdateHelper.update(getInvocationContext(), requestBody);
  }
}
