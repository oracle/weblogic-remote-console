// Copyright (c) 2020, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package com.oracle.weblogic.console.backend.services.runtime;

import java.util.logging.Logger;
import javax.ws.rs.GET;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import com.oracle.weblogic.console.backend.services.WeblogicBeanResource;

/** Handles JAXRS methods for a collection of beans' monitoring pages. */
public class MonitoringCollectionResource extends WeblogicBeanResource {

  private static final Logger LOGGER =
    Logger.getLogger(MonitoringCollectionResource.class.getName());

  /**
   * Get the RDJ for the collection's table
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
   *         the collection (or one of its parent beans)
   *       </li>
   *       <li>
   *         503 -
   *         the CBE isn't connected to a WLS domain
   *       </li>
   *     </ul>
   */
  @GET
  @Produces(MediaType.APPLICATION_JSON)
  public Response get() throws Exception {
    return RuntimeTreeManager.viewCollection(getInvocationContext());
  }
}
