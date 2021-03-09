// Copyright (c) 2020, 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package com.oracle.weblogic.console.backend.services.runtime;

import java.util.logging.Logger;
import javax.json.JsonObject;
import javax.ws.rs.Consumes;
import javax.ws.rs.DefaultValue;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import com.oracle.weblogic.console.backend.services.WeblogicBeanResource;

/** Handles the JAXRS methods for a collection child bean's monitoring pages. */
public class MonitoringCollectionChildResource extends WeblogicBeanResource {

  private static final Logger LOGGER =
    Logger.getLogger(MonitoringCollectionChildResource.class.getName());

  /**
   * Get the PDJ for a slice of the bean
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
    return RuntimeTreeManager.viewBean(getInvocationContext(), slice);
  }

  /**
   * Invokes one the bean's actions
   *
   * @param requestBody - the arguments to pass into the action, in RDJ terms
   *
   * @return an HTTP response.
   *     Response codes:
   *     <ul>
   *       <li>
   *         200 -
   *         if synchronous, the action was successfully completed
   *         if asynchronous, the action was successfully launched
   *       </li>
   *       <li>
   *         400 -
   *         the action failed, e.g. the request body was wrong,
   *         the action couldn't be invoked because the bean is
   *         in the wrong state (you can't start a running server)
   *       </li>
   *       <li>
   *         404 -
   *         the bean (or one of its parent beans) or action does not exist
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
    @QueryParam("action") String action,
    JsonObject arguments
  ) throws Exception {
    return
      RuntimeTreeManager.invokeAction(
        getInvocationContext(),
        action,
        arguments
      );
  }
}
