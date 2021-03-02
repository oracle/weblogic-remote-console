// Copyright (c) 2020, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package com.oracle.weblogic.console.backend.services.runtime;

import java.util.List;
import java.util.logging.Logger;
import javax.ws.rs.DefaultValue;
import javax.ws.rs.GET;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.PathSegment;
import javax.ws.rs.core.Response;

import com.oracle.weblogic.console.backend.services.WeblogicBeanResource;
import com.oracle.weblogic.console.backend.services.WeblogicRootBeanResource;
import weblogic.console.backend.typedesc.WeblogicBeanIdentity;

/**
 * Handles HTTP methods for the domain runtime mbean's monitoring pages,
 * and creates JAXRS resources for the domain runtime mbean's children.
 */
public class MonitoringDomainRuntimeResource extends WeblogicRootBeanResource {

  private static final Logger LOGGER =
    Logger.getLogger(MonitoringDomainRuntimeResource.class.getName());

  /**
   * Creates a JAXRS resource that handles the RDJ for a child mbean of the domain runtime mbean.
   * <p>
   * It uses the url path to figure out the child's type (collection, collection child,
   * creatable optional singleton, non-creatable optional singleton) and creates a
   * corresponding JAXRS resource.
   */
  @javax.ws.rs.Path("{pathSegments: .+}")
  public WeblogicBeanResource getChildResource(
    @PathParam("pathSegments") List<PathSegment> pathSegments
  ) throws Exception {
    WeblogicBeanIdentity identity = createIdentity(getPathFromPathSegments(pathSegments));
    WeblogicBeanResource resource = null;
    if (identity.isCollection()) {
      resource = createCustomResource(identity.getBeanType().getCollectionResourceClass());
      if (resource == null) {
        resource = new MonitoringCollectionResource();
      }
    } else {
      resource = createCustomResource(identity.getBeanType().getInstanceResourceClass());
      if (resource == null) {
        if (identity.isCollectionChild()) {
          resource = new MonitoringCollectionChildResource();
        } else if (identity.isNonCreatableOptionalUnfoldedSingleton()) {
          resource = new MonitoringSingletonResource();
        } else {
          throw
            new AssertionError(
              "Resource is not a collection, collection child or optional singleton: "
              + identity
            );
        }
      }
    }
    // store the identity in the this resource's invocation context
    // (which happens to be the invocation resource for all jaxrs resources
    // servicing this request)
    getInvocationContext().setIdentity(identity);
    return copyContext(resource);
  }

  /**
   * Get the RDJ for a slice of the domain runtime bean
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
}
