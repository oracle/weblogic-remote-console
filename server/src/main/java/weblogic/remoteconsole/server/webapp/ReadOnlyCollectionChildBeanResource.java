// Copyright (c) 2021, 2023, Oracle and/or its affiliates.
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
 * Handles the JAXRS methods for a readonly collection child bean's pages.
 */
public class ReadOnlyCollectionChildBeanResource extends BeanResource {

  /**
   * Get the RDJ for a slice of a bean.
   */
  @GET
  @Produces(MediaType.APPLICATION_JSON)
  public Response get(
    @QueryParam("slice") @DefaultValue("") String slice,
    @QueryParam("reload") @DefaultValue("false") boolean reload,
    @QueryParam("actionForm") @DefaultValue("") String actionForm,
    @QueryParam("action") @DefaultValue("") String action
  ) {
    getInvocationContext().setReload(reload);
    setSlicePagePath(slice, actionForm, action);
    return getSlicePage();
  }

  /**
   * Handles customizing slice tables and invoking actions.
   */
  @POST
  @Consumes(MediaType.APPLICATION_JSON)
  @Produces(MediaType.APPLICATION_JSON)
  public Response post(
    @QueryParam("slice") @DefaultValue("") String slice,
    @QueryParam("action") @DefaultValue("") String action,
    @QueryParam("identifier") @DefaultValue("") String identifier,
    JsonObject requestBody
  ) {
    getInvocationContext().setIdentifier(identifier);
    setSlicePagePath(slice);
    if (CUSTOMIZE_TABLE.equals(action)) {
      return customizeTable(requestBody);
    }
    return invokeAction(action, requestBody);
  }

  protected Response getSlicePage() {
    if (getInvocationContext().getPagePath().isActionInputFormPagePath()) {
      return getSliceActionInputForm();
    } else {
      return getSlice();
    }
  }

  protected Response getSlice() {
    return getPage();
  }

  protected Response getSliceActionInputForm() {
    return getPage();
  }
}
