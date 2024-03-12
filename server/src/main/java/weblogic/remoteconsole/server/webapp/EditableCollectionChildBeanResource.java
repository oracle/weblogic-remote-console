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

import org.glassfish.jersey.media.multipart.FormDataMultiPart;
import org.glassfish.jersey.media.multipart.FormDataParam;

/**
 * Handles the JAXRS methods for an editable collection child bean's pages.
 */
public class EditableCollectionChildBeanResource extends BeanResource {

  /**
   * Get the RDJ for a slice of a bean.
   */
  @GET
  @Produces(MediaType.APPLICATION_JSON)
  public Response get(
    @QueryParam("slice") @DefaultValue("") String slice,
    @QueryParam("reload") @DefaultValue("false") boolean reload
  ) {
    getInvocationContext().setReload(reload);
    setSlicePagePath(slice);
    return getSlice();
  }

  /**
   * Handles customizing slice tables, modifying the bean and invoking actions.
   */
  @POST
  @Consumes(MediaType.APPLICATION_JSON)
  @Produces(MediaType.APPLICATION_JSON)
  public Response post(
    @QueryParam("slice") @DefaultValue("") String slice,
    @QueryParam("action") @DefaultValue(UPDATE) String action,
    @QueryParam("actionForm") @DefaultValue("") String actionForm,
    @QueryParam("identifier") @DefaultValue("") String identifier,
    JsonObject requestBody
  ) {
    return internalPost(slice, action, actionForm, identifier, requestBody, null);
  }

  @POST
  @Consumes(MediaType.MULTIPART_FORM_DATA)
  @Produces(MediaType.APPLICATION_JSON)
  public javax.ws.rs.core.Response post(
    @QueryParam("slice") @DefaultValue("") String slice,
    @QueryParam("action") @DefaultValue(UPDATE) String action,
    @QueryParam("actionForm") @DefaultValue("") String actionForm,
    @QueryParam("identifier") @DefaultValue("") String identifier,
    @FormDataParam("requestBody") JsonObject requestBody,
    FormDataMultiPart parts
  ) {
    return internalPost(slice, action, actionForm, identifier, requestBody, parts);
  }


  protected Response internalPost(
    String slice,
    String action,
    String actionForm,
    String identifier,
    JsonObject requestBody,
    FormDataMultiPart parts
  ) {
    getInvocationContext().setIdentifier(identifier);
    setSlicePagePath(slice);
    if (CUSTOMIZE_TABLE.equals(action)) {
      return customizeTable(requestBody);
    }
    if (INPUT_FORM.equals(actionForm)) {
      return getActionInputForm(action, requestBody);
    }
    if (UPDATE.equals(action)) {
      return updateSliceForm(requestBody); // TBD parts?
    }
    return invokeAction(action, requestBody, parts);
  }
  
  protected Response updateSliceForm(JsonObject requestBody) {
    return UpdateHelper.update(getInvocationContext(), requestBody);
  }

  protected Response getSlice() {
    return getPage();
  }
}
