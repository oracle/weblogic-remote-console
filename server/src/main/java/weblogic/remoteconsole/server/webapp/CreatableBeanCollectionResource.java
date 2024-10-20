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
 * Handles JAXRS methods for a creatable collection of beans.
 */
public class CreatableBeanCollectionResource extends BeanResource {

  // The JAXRS GET method can be used to get either the collection's
  // table RDJ or the collection's create form RDJ.
  // The caller needs to send in a query parameter to choose which one.
  // These constants match the values the caller can use.
  //
  // I'd prefer to use an enum, but that's tricky with @QueryParam and @DefaultValue annotations
  private static final String VIEW_TABLE = "table";
  private static final String VIEW_CREATE_FORM = "createForm";

  /**
   * Handles the JAXRS GET method for this collection.
   * <p>
   * If view is table, returns the RDJ for the collection's table.
   * If view is createForm, returns the RDJ for creating a new child in the collection.
   */
  @GET
  @Produces(MediaType.APPLICATION_JSON)
  public Response get(
    @QueryParam("view") @DefaultValue(VIEW_TABLE) String view,
    @QueryParam("reload") @DefaultValue("false") boolean reload
  ) {
    getInvocationContext().setReload(reload);
    if (VIEW_TABLE.equals(view)) {
      setTablePagePath();
      return getTable();
    } else if (VIEW_CREATE_FORM.equals(view)) {
      setCreateFormPagePath();
      return getCreateForm();
    } else {
      throw
        new AssertionError(
          "Invalid view:" + view + ", collection=" + getPageRepoRelativeUri() + "."
          + " Valid views are " + VIEW_TABLE + " and " + VIEW_CREATE_FORM + "."
        );
    }
  }

  /**
   * Handles customizing slice tables, creating child beans and invoking actions.
   */
  @POST
  @Consumes(MediaType.APPLICATION_JSON)
  @Produces(MediaType.APPLICATION_JSON)
  public Response post(
    @QueryParam("action") @DefaultValue(CREATE) String action,
    @QueryParam("actionForm") @DefaultValue("") String actionForm,
    JsonObject requestBody
  ) {
    return internalPost(action, actionForm, requestBody, null);
  }

  @POST
  @Consumes(MediaType.MULTIPART_FORM_DATA)
  @Produces(MediaType.APPLICATION_JSON)
  public javax.ws.rs.core.Response post(
    @QueryParam("action") @DefaultValue(CREATE) String action,
    @QueryParam("actionForm") @DefaultValue("") String actionForm,
    @FormDataParam("requestBody") JsonObject requestBody,
    FormDataMultiPart parts
  ) {
    return internalPost(action, actionForm, requestBody, parts);
  }

  protected Response internalPost(
    String action,
    String actionForm,
    JsonObject requestBody,
    FormDataMultiPart parts
  ) {
    if (CREATE.equals(action)) {
      setCreateFormPagePath();
      return createCollectionChild(requestBody, parts);
    }
    setTablePagePath();
    if (CUSTOMIZE_TABLE.equals(action)) {
      return customizeTable(requestBody);
    }
    if (INPUT_FORM.equals(actionForm)) {
      return getActionInputForm(action, requestBody);
    }
    return invokeAction(action, requestBody, parts);
  }

  protected Response createCollectionChild(JsonObject requestBody, FormDataMultiPart parts) {
    if (parts == null) {
      return createCollectionChild(requestBody);
    } else {
      return CreateHelper.create(getInvocationContext(), requestBody, parts);
    }
  }

  protected Response createCollectionChild(JsonObject requestBody) {
    return CreateHelper.create(getInvocationContext(), requestBody);
  }

  protected Response getCreateForm() {
    return getPage();
  }

  protected Response getCreateFormActionInputForm() {
    return getPage();
  }

  protected Response getTable() {
    return getPage();
  }
}
