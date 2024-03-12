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
 * Handles JAXRS methods for a readonly collection of beans.
 */
public class ReadOnlyBeanCollectionResource extends BeanResource {

  /**
   * Get the RDJ for a collection of beans.
   */
  @GET
  @Produces(MediaType.APPLICATION_JSON)
  public Response get(
    @QueryParam("reload") @DefaultValue("false") boolean reload
  ) {
    getInvocationContext().setReload(reload);
    setTablePagePath();
    return getTable();
  }

  /**
   * Handles customizing the table and invoking actions.
   */
  @POST
  @Consumes(MediaType.APPLICATION_JSON)
  @Produces(MediaType.APPLICATION_JSON)
  public Response post(
    @QueryParam("action") String action,
    @QueryParam("actionForm") @DefaultValue("") String actionForm,
    JsonObject requestBody
  ) {
    return internalPost(action, actionForm, requestBody, null);
  }

  @POST
  @Consumes(MediaType.MULTIPART_FORM_DATA)
  @Produces(MediaType.APPLICATION_JSON)
  public javax.ws.rs.core.Response post(
    @QueryParam("action") @DefaultValue("") String action,
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
    setTablePagePath();
    if (CUSTOMIZE_TABLE.equals(action)) {
      return customizeTable(requestBody);
    }
    if (INPUT_FORM.equals(actionForm)) {
      return getActionInputForm(action, requestBody);
    }
    return invokeAction(action, requestBody, parts);
  }

  protected Response getTable() {
    return getPage();
  }
}
