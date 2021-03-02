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

/** Handles the JAXRS methods for a collection child bean's configuration pages. */
public class ConfigurationCollectionChildResource extends WeblogicBeanResource {

  private static final Logger LOGGER =
    Logger.getLogger(ConfigurationCollectionChildResource.class.getName());

  /**
   * Get the RDJ for a slice of the bean
   *
   * @param slice - which slice (empty or null means the default slice)
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
   *         the bean (or one of its parent beans) or slice does not exist
   *       </li>
   *       <li>
   *         503 -
   *         the CBE isn't connected to a WLS domain
   *       </li>
   *     </ul>
   */
  @GET
  @Produces(MediaType.APPLICATION_JSON)
  public Response get(@QueryParam("slice") @DefaultValue("") String slice) throws Exception {
    return ConfigurationTreeManager.viewBean(getInvocationContext(), slice);
  }

  /**
   * Updates a slice of the collection child bean
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
   *
   * @param requestBody - the field/value pairs to set (in 'expanded values' format).
   *
   * @return an HTTP response.
   *     Response codes:
   *     <ul>
   *       <li>
   *         200 -
   *         the bean was successfully updated.
   *         Note:
   *         <p>
   *         The request body can contain a combination of valid and invalid field values. This
   *         method writes out the valid ones and returns field-scoped error messages for the invalid
   *         ones (and still returns a 200). Even if all the values are invalid, it will return a 200
   *         (along with a corresponding set of field-scoped error messages).
   *         <p>
   *         This method only updates fields that appear on the page for the specified slice and
   *         ignores any fields that are not present on that page.
   *       </li>
   *       <li>
   *         400 -
   *         the specified weblogic configuration version is not up to date
   *         (this check is disabled for MVP)
   *       </li>
   *       <li>
   *         404 -
   *         the bean (or one of its parent beans) or slice does not exist
   *       </li>
   *       <li>
   *         503 - the CBE isn't connected to a WLS domain
   *       </li>
   *     </ul>
   */
  @POST
  @Consumes(MediaType.APPLICATION_JSON)
  @Produces(MediaType.APPLICATION_JSON)
  public Response post(
    @HeaderParam("X-Weblogic-Configuration-Version") String weblogicConfigurationVersion,
    @QueryParam("slice") @DefaultValue("") String slice,
    JsonObject requestBody
  ) throws Exception {
    return
      ConfigurationTreeManager.updateBean(
        getInvocationContext(),
        slice,
        weblogicConfigurationVersion,
        requestBody
      );
  }

  /**
   * Remove this collection child bean
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
   *         the bean was successfully deleted
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
