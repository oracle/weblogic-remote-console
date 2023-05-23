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
    @QueryParam("reload") @DefaultValue("false") boolean reload,
    @QueryParam("actionForm") @DefaultValue("") String actionForm,
    @QueryParam("action") @DefaultValue("") String action
  ) {
    getInvocationContext().setReload(reload);
    if (VIEW_SLICE.equals(view)) {
      setSlicePagePath(slice, actionForm, action);
      return getSlicePage();
    } else if (VIEW_CREATE_FORM.equals(view)) {
      setCreateFormPagePath(actionForm, action);
      return getCreateFormPage();
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
    @QueryParam("identifier") @DefaultValue("") String identifier,
    JsonObject requestBody
  ) {
    getInvocationContext().setIdentifier(identifier);
    if (CUSTOMIZE_TABLE.equals(action)) {
      setSlicePagePath(slice);
      return customizeTable(requestBody);      
    }
    if (UPDATE.equals(action)) {
      setSlicePagePath(slice);
      return updateSliceForm(requestBody);
    } else if (CREATE.equals(action)) {
      setCreateFormPagePath();
      return createOptionalSingleton(requestBody);
    } else {
      return invokeAction(action, requestBody);
    }
  }

  /**
   * Deletes the singleton.
   */
  @DELETE
  @Produces(MediaType.APPLICATION_JSON)
  public Response delete() {
    return deleteOptionalSingleton();
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

  protected Response getCreateFormPage() {
    if (getInvocationContext().getPagePath().isActionInputFormPagePath()) {
      return getCreateFormActionInputForm();
    } else {
      return getCreateForm();
    }
  }

  protected Response getCreateForm() {
    return getPage();
  }

  protected Response getCreateFormActionInputForm() {
    return getPage();
  }

  protected Response updateSliceForm(JsonObject requestBody) {
    return UpdateHelper.update(getInvocationContext(), requestBody);
  }

  protected Response createOptionalSingleton(JsonObject requestBody) {
    return CreateHelper.create(getInvocationContext(), requestBody);
  }

  protected Response deleteOptionalSingleton() {
    return DeleteHelper.delete(getInvocationContext());
  }
}
