// Copyright (c) 2021, 2023, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.webapp;

import javax.json.JsonObject;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
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
 * Handles the JAXRS methods for a creatable optional singleton bean.
 */
public class CreatableOptionalSingletonBeanResource extends BeanResource {

  // The JAXRS GET method can be used to get either the singleton's RDJ
  // singleton's create form RDJ.
  // The caller needs to send in a query parameter to choose which one.
  // These constants match the values the caller can use.
  //
  // I'd prefer to use an enum, but that's tricky with @QueryParam and @DefaultValue annotations
  private static final String VIEW_SLICE = "slice";
  private static final String VIEW_CREATE_FORM = "createForm";

  /**
   * Handles the JAXRS GET method for this singleton.
   * <p>
   * If view is slice, it returns the RDJ of that slice.
   * If view is createForm, it return the RDJ for creating the singleton.
   */
  @GET
  @Produces(MediaType.APPLICATION_JSON)
  public Response get(
    @QueryParam("view") @DefaultValue(VIEW_SLICE) String view,
    @QueryParam("slice") @DefaultValue("") String slice,
    @QueryParam("reload") @DefaultValue("false") boolean reload
  ) {
    getInvocationContext().setReload(reload);
    if (VIEW_SLICE.equals(view)) {
      setSlicePagePath(slice);
      return getSlice();
    } else if (VIEW_CREATE_FORM.equals(view)) {
      setCreateFormPagePath();
      return getCreateForm();
    } else {
      throw
        new AssertionError(
          "Invalid view:" + view + ", singleton=" + getPageRepoRelativeUri() + "."
          + " Valid views are " + VIEW_SLICE + " and " + VIEW_CREATE_FORM + "."
        );
    }
  }

  /**
   * Handles customizing slice tables, creating the bean, modifying the bean and invoking actions.
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

  protected javax.ws.rs.core.Response internalPost(
    String slice,
    String action,
    String actionForm,
    String identifier,
    JsonObject requestBody,
    FormDataMultiPart parts
  ) {
    getInvocationContext().setIdentifier(identifier);
    if (CREATE.equals(action)) {
      setCreateFormPagePath();
      return createOptionalSingleton(requestBody, parts);
    }
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

  /**
   * Deletes the singleton.
   */
  @DELETE
  @Produces(MediaType.APPLICATION_JSON)
  public Response delete() {
    return deleteOptionalSingleton();
  }

  protected Response getSlice() {
    return getPage();
  }

  protected Response getCreateForm() {
    return getPage();
  }

  protected Response updateSliceForm(JsonObject requestBody) {
    return UpdateHelper.update(getInvocationContext(), requestBody);
  }

  protected Response createOptionalSingleton(JsonObject requestBody, FormDataMultiPart parts) {
    if (parts == null) {
      return createOptionalSingleton(requestBody);
    } else {
      return CreateHelper.create(getInvocationContext(), requestBody, parts);
    }
  }

  protected Response createOptionalSingleton(JsonObject requestBody) {
    return CreateHelper.create(getInvocationContext(), requestBody);
  }

  protected Response deleteOptionalSingleton() {
    return DeleteHelper.delete(getInvocationContext());
  }
}
