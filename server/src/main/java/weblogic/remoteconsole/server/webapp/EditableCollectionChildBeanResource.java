// Copyright (c) 2021, 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.webapp;

import javax.json.JsonObject;
import javax.ws.rs.Consumes;
import javax.ws.rs.DefaultValue;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

/**
 * Handles the JAXRS methods for an editable collection child bean's pages.
 */
public class EditableCollectionChildBeanResource  extends BeanResource {

  /**
   * Get the RDJ for a slice of the collection child.
   */
  @GET
  @Produces(MediaType.APPLICATION_JSON)
  public Response get(
    @QueryParam("slice") @DefaultValue("") String slice,
    @QueryParam("reload") @DefaultValue("false") boolean reload
  ) {
    getInvocationContext().setReload(reload);
    setSlicePagePath(slice);
    return getSliceForm();
  }

  /**
   * Handles the JAXRS POST method for this collection child.
   * <p>
   * If action is update, it modifies a slice of the child.
   * If actioj is customizeTable, it customizes the slice table.
   * Otherwise, invokes an action on the child (e.g. start a server).
   */
  @POST
  @Consumes(MediaType.APPLICATION_JSON)
  @Produces(MediaType.APPLICATION_JSON)
  public Response post(
    @QueryParam("slice") @DefaultValue("") String slice,
    @QueryParam("action") @DefaultValue(UPDATE) String action,
    JsonObject requestBody
  ) {
    setSlicePagePath(slice);
    if (CUSTOMIZE_TABLE.equals(action)) {
      return customizeTable(requestBody);
    }
    if (UPDATE.equals(action)) {
      return updateSliceForm(requestBody);
    }
    return invokeAction(action, requestBody);
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
  
  protected Response updateSliceForm(JsonObject requestBody) {
    return UpdateHelper.update(getInvocationContext(), requestBody);
  }

  protected Response invokeAction(String action, JsonObject requestBody) {
    return InvokeActionHelper.invokeAction(getInvocationContext(), action, requestBody);
  }
}
