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
   * Creates a new child in the collection or customizes the table's display.
   */
  @POST
  @Consumes(MediaType.APPLICATION_JSON)
  @Produces(MediaType.APPLICATION_JSON)
  public Response post(
    @QueryParam("action") String action,
    JsonObject requestBody
  ) {
    if (CUSTOMIZE_TABLE.equals(action)) {
      setTablePagePath();
      return customizeTable(requestBody);
    }
    setCreateFormPagePath();
    return createCollectionChild(requestBody);
  }

  protected Response createCollectionChild(JsonObject requestBody) {
    return CreateHelper.create(getInvocationContext(), requestBody);
  }

  protected Response getCreateForm() {
    return
      GetPageResponseMapper.toResponse(
        getInvocationContext(),
        getInvocationContext()
          .getPageRepo().asPageReaderRepo()
          .getPage(getInvocationContext())
      );
  }

  protected Response getTable() {
    return
      GetPageResponseMapper.toResponse(
        getInvocationContext(),
        getInvocationContext()
          .getPageRepo().asPageReaderRepo()
          .getPage(getInvocationContext())
      );
  }
}
