// Copyright (c) 2020, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package com.oracle.weblogic.console.backend.services.configuration;

import java.util.logging.Logger;
import javax.json.JsonObject;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
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

/** Handles the JAXRS methods for a creatable optional singleton child bean's configuration pages. */
public class ConfigurationCreatableOptionalSingletonResource extends WeblogicBeanResource {

  private static final Logger LOGGER =
    Logger.getLogger(ConfigurationCreatableOptionalSingletonResource.class.getName());

  // The GET  http method can be used to get either the singleton's RDJ
  // singleton's create form RDJ.
  // The caller needs to send in a query parameter to choose which one.
  // These constants match the values the caller can use.
  //
  // I'd prefer to use an enum, but that's tricky with @QueryParam and @DefaultValue annotations
  private static final String VIEW_SLICE = "view";
  private static final String VIEW_CREATE_FORM = "new"; // TBD rename this when the CFE can catch up

  // The POST  http method can be used to either update a slice of the optional singleton
  // or to create the optional singleton.
  // The caller needs to send in a query parameter to choose which one.
  // These constants match the values the caller can use.
  //
  // I'd prefer to use an enum, but that's tricky with @QueryParam and @DefaultValue annotations
  private static final String UPDATE = "update";
  private static final String CREATE = "create"; // TBD rename this when the CFE can catch up?

  /**
   * Get the RDJ for a slice of the bean
   *
   * @param action - which action ("view" or "new")
   *     TBD rename dataAction to something else when the CBE can catch up.
   *     Also, consider removing this parameter and automatically viewing the bean
   *     if it exists and automatically returning the create form if it doesn't exist.
   *
   * @param slice - which slice (empty or null means the default slice)
   *     only used if action is 'view'.
   *
   * @return an HTTP response.
   *     Response codes:
   *     <ul>
   *       <li>
   *         200 -
   *         the bean exists and the response contains the RDJ
   *       </li>
   *       <li>
   *         200 -
   *         the bean does not exist and the response contains the RDJ,
   *         minus the 'data' property that would have had the bean's properties
   *       </li>
   *       <li>
   *         400 -
   *         action isn't 'view' or 'new'
   *       <li>
   *         400 -
   *         action is 'view' and the bean doesn't exist
   *       </li>
   *       <li>
   *         400 -
   *         action is 'new' and the bean exists
   *       </li>
   *       <li>
   *         404 -
   *         one of this bean's parent beans, or the slice, does not exist
   *       </li>
   *       <li>
   *         503 -
   *         the CBE isn't connected to a WLS domain
   *       <li>
   *     </ul>
   */
  @GET
  @Produces(MediaType.APPLICATION_JSON)
  public Response get(
    @QueryParam("dataAction") @DefaultValue(VIEW_SLICE) String action,
    @QueryParam("slice") @DefaultValue("") String slice
  ) throws Exception {
    if (VIEW_SLICE.equals(action)) {
      return ConfigurationTreeManager.viewOptionalSingleton(getInvocationContext(), slice);
    } else if (VIEW_CREATE_FORM.equals(action)) {
      return ConfigurationTreeManager.viewCreateForm(getInvocationContext());
    } else {
      throw
        new BadRequestException(
          "Invalid dataAction:"
          + action
          + ", singleton="
          + getIdentityRelativeUri()
          + ", valid dataActions are "
          + VIEW_SLICE
          + " and "
          + VIEW_CREATE_FORM
          + "."
        );
    }
  }

  /**
   * Creates the bean or updates a slice of the bean
   *
   * @param action - which action ("update" or "create")
   *     TBD rename dataAction to something else when the CBE can catch up.
   *     Also, consider removing this parameter and automatically updating the bean
   *     if it exists and automatically creating it if it doesn't exist.
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
   * @param slice - which slice (empty or null means the default slice)
   *     only used if action is 'update'.
   * 
   * @param requestBody - the field/value pairs to set (in 'expanded values' format).
   * 
   * @return an HTTP response.
   *     Response codes:
   *     <ul>
   *       <li>
   *         200 -
   *         action is 'update' and the bean exists and was successfully updated.
   *       </li>
   *       <li>
   *         200 -
   *         action is 'create' and the bean was successfully created.
   *         <p>
   *         The request body can contain a combination of valid and invalid field values.
   *         This method writes out the valid ones and returns field-scoped error messages
   *         for the invalid ones (and still returns a 200).
   *         Even if all the values are invalid, it will return a 200
   *         (along with a corresponding set of field-scoped error messages).
   *         <p>
   *         This method only updates fields that appear on the page for the specified slice
   *         and ignores any fields that are not present on that page.
   *       </li>
   *       <li>
   *         400 -
   *         the specified weblogic configuration version is not up to date
   *         (this check is disabled for MVP)
   *       </li>
   *       <li>
   *         400 -
   *         action isn't 'update' or 'create'
   *       </li>
   *       <li>
   *         400 -
   *         action is 'update' and the bean doesn't exist
   *       </li>
   *       <li>
   *         400 -
   *         action is 'create' and the bean exists
   *       </li>
   *       <li>
   *         404 -
   *         one of its parent beans doesn't exist
   *       </li>
   *       <li>
   *         404 -
   *         action is 'update' and the slice doesn't exist
   *       </li>
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
    @QueryParam("dataAction") @DefaultValue(UPDATE) String action, // TBD - should there be a default value?
    @QueryParam("slice") @DefaultValue("") String slice,
    JsonObject requestBody
  ) throws Exception {
    if (UPDATE.equals(action)) {
      return
        ConfigurationTreeManager.updateBean(
          getInvocationContext(),
            slice,
            weblogicConfigurationVersion,
            requestBody
          );
    } else if (CREATE.equals(action)) {
      return
        ConfigurationTreeManager.createOptionalSingleton(
          getInvocationContext(),
          weblogicConfigurationVersion,
          requestBody
        );
    } else {
      throw
        new BadRequestException(
          "Invalid dataAction:"
          + action
          + ", singleton="
          + getIdentityRelativeUri()
          + ", valid dataActions are "
          + UPDATE
          + " and "
          + CREATE
          + "."
        );
    }
  }

  /**
   * Remove this creatable optional singlton
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
   * @return an HTTP response.
   *     Response codes:
   *     <ul>
   *       <li>
   *         200 -
   *         the bean exists and was successfully deleted
   *       </li>
   *       <li>
   *         400 -
   *         the specified weblogic configuration version is not up to date
   *         (this check is disabled for MVP)
   *       </li>
   *       <li>
   *         404 -
   *         the bean (or one of its parent beans) does not exist
   *       </li>
   *       <li>
   *         503 -
   *         the CBE isn't connected to a WLS domain
   *       </li>
   *     </ul>
   */
  @DELETE
  @Produces(MediaType.APPLICATION_JSON)
  public Response delete(
    @HeaderParam("X-Weblogic-Configuration-Version") String weblogicConfigurationVersion
  ) throws Exception {
    return
      ConfigurationTreeManager.deleteBean(
        getInvocationContext(),
        weblogicConfigurationVersion
      );
  }
}
