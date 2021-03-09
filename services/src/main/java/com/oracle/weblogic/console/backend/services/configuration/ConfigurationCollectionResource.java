// Copyright (c) 2020, 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package com.oracle.weblogic.console.backend.services.configuration;

import java.util.logging.Logger;
import javax.json.JsonObject;
import javax.ws.rs.Consumes;
import javax.ws.rs.DefaultValue;
import javax.ws.rs.GET;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.POST;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import com.oracle.weblogic.console.backend.services.WeblogicBeanResource;
import weblogic.console.backend.driver.BadRequestException;

/** Handles JAXRS methods for a collection of beans' configuration pages. */
public class ConfigurationCollectionResource extends WeblogicBeanResource {

  private static final Logger LOGGER =
    Logger.getLogger(ConfigurationCollectionResource.class.getName());

  // The GET  http method can be used to get either the collection's
  // table RDJ or the collection's create form RDJ.
  // The caller needs to send in a query parameter to choose which one.
  // These constants match the values the caller can use.
  //
  // I'd prefer to use an enum, but that's tricky with @QueryParam and @DefaultValue annotations
  private static final String VIEW_TABLE = "table";
  private static final String VIEW_CREATE_FORM = "new";

  /**
   * Get the RDJ for the collection's table or the collection's create form
   *
   * @param action - which action ("table" or "new")
   *
   * @return an HTTP response.
   *     Response codes:
   *     <ul>
   *       <li>
   *         200 -
   *         the operation succeeded and the response contains the RDJ
   *       </li>
   *       <li>
   *         404 -
   *         the collection (or one of its parent beans) does not exist
   *       </li>
   *       <li>
   *         503 -
   *         the CBE isn't connected to a WLS domain
   *       </li>
   *     </ul>
   */
  @GET
  @Produces(MediaType.APPLICATION_JSON)
  public Response get(
    @QueryParam("dataAction") @DefaultValue(VIEW_TABLE) String action
  ) throws Exception {
    if (VIEW_TABLE.equals(action)) {
      return ConfigurationTreeManager.viewCollection(getInvocationContext());
    } else if (VIEW_CREATE_FORM.equals(action)) {
      return ConfigurationTreeManager.viewCreateForm(getInvocationContext());
    } else {
      throw
        new BadRequestException(
          "Invalid dataAction:"
            + action
            + ", collection="
            + getIdentityRelativeUri()
            + ", valid dataActions are "
            + VIEW_TABLE
            + " and "
            + VIEW_CREATE_FORM
            + "."
        );
    }
  }

  /**
   * Create a new child bean in the collection
   *
   * @param weblogicConfigurationVersion -
   *     the version number of the domain's configuration (basically a hash of the config directory).
   *     <p>
   *     This version number should have been previously sent to the client via a GET request.
   *     The client should have stored it and sent it back in to this method.
   *     This is checked against the current version of the config.
   *     If it's different, it means that the weblogic configuration was modified but
   *     the client hasn't caught up yet. In this case, the method will not change the configuration
   *     and will return a 400.
   * 
   * @param requestBody - the field/value pairs to set on the new bean (in 'expanded values' format).
   * 
   * @return an HTTP response.
   *     Response codes:
   *     <ul>
   *       <li>
   *         201 -
   *         bean was successfully created.
   *         <p>
   *         Note:
   *         The request body can contain a combination of valid and invalid field values.
   *         This method writes out the valid ones and returns field-scoped error messages
   *         for the invalid ones (and still returns a 200).
   *         Even if all the values are invalid, it will return a 200
   *         (along with a corresponding set of field-scoped error messages).
   *         <p>
   *         This method only sets fields that appear on the create page and ignores any
   *         fields that are not present on that page.
   *       </li>
   *       <li>
   *         400 -
   *         the specified weblogic configuration version is not up to date
   *         (this check is disabled for MVP)
   *       </li>
   *       <li>
   *         400 -
   *         the bean already exists
   *       </li>
   *       <li>
   *         404 -
   *         the collection (or one of its parent beans) or slice does not exist
   *       <li>
   *         503 -
   *         the CBE isn't connected to a WLS domain
   *       </li>
   *     </ul>
   */
  @POST
  @Consumes(MediaType.APPLICATION_JSON)
  @Produces(MediaType.APPLICATION_JSON)
  public Response post(
    @HeaderParam("X-Weblogic-Configuration-Version") String weblogicConfigurationVersion,
    JsonObject requestBody
  ) throws Exception {
    return
      ConfigurationTreeManager.createCollectionChild(
        getInvocationContext(),
        weblogicConfigurationVersion,
        requestBody
      );
  }
}
