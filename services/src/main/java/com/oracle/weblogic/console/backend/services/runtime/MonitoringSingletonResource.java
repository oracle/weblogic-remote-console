// Copyright (c) 2020, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package com.oracle.weblogic.console.backend.services.runtime;

import java.util.logging.Logger;
import javax.ws.rs.DefaultValue;
import javax.ws.rs.GET;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import com.oracle.weblogic.console.backend.services.WeblogicBeanResource;

/** Handles the JAXRS methods for singleton child bean's monitoring pages. */
public class MonitoringSingletonResource extends WeblogicBeanResource {

  private static final Logger LOGGER =
    Logger.getLogger(MonitoringSingletonResource.class.getName());

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
   *         the bean exists and the response contains the RDJ
   *       </li>
   *       <li>
   *         200 -
   *         the bean does not exist and the response contains the RDJ,
   *         minus the 'data' property that would have had the bean's properties
   *       </li>
   *       <li>
   *         404 -
   *         one of this bean's parent beans, or the slice, does not exist
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
    return RuntimeTreeManager.viewOptionalSingleton(getInvocationContext(), slice);
  }
}
