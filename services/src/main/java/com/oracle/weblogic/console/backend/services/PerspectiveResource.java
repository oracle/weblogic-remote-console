// Copyright (c) 2020, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package com.oracle.weblogic.console.backend.services;

import java.util.logging.Logger;
import javax.json.Json;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import weblogic.console.backend.driver.InvocationContext;
import weblogic.console.backend.driver.ResponseIdentityBuilder;
import weblogic.console.backend.driver.ResponseNavigationContentsBuilder;
import weblogic.console.backend.pagedesc.PagePath;
import weblogic.console.backend.pagedesc.PagesPath;
import weblogic.console.backend.pagedesc.WeblogicPageSource;

/**
 * Abstract base class that creates the JAXRS resources for managing a perspective of
 * the WLS domain (e.g. configuration, monitoring, control).
 * <p>
 * The derived classes need to implement a method that tells it which perspective to use
 * (i.e. root pages path for the perspective).
 */
public abstract class PerspectiveResource extends ConnectionRequiredResource {

  private static final Logger LOGGER = Logger.getLogger(PerspectiveResource.class.getName());

  /**
   * The derived classes must override this to provide the root pages path
   * for their perspective (e.g. configuration, monitoring, control)
   */
  protected abstract PagesPath newRootPagesPath() throws Exception;

  /** Creates a JAXRS resource that handles all this perspective's PDJs */
  @Path("pages")
  public PageDefinitionsResource getPageDefinitionsResource() throws Exception {
    return copyContext(new PageDefinitionsResource());
  }

  /**
   * Get the root resource definition for this perspective,
   * i.e. its top level navigation structure.
   */
  @GET
  @Path("data")
  @Produces(MediaType.APPLICATION_JSON)
  public Response getRootResourceDefinition() throws Exception {
    LOGGER.fine("getRootResourceDefinition");
    try {
      return Response.ok(createRDJ()).build();
    } catch (Throwable t) {
      throw toServiceException(t);
    }
  }

  /**
   * Get the RDJ for this perspective's root resource, e.g. api/configuration/data
   * <p>
   * Currently, it only includes this perspective's root navigation contents.
   */
  private JsonObject createRDJ() throws Exception {
    // Create a page path for this perspective's root bean's default slice
    PagePath pagePath =
      PagePath.newSlicePagePath(
        getInvocationContext().getRootPagesPath(),
        new weblogic.console.backend.utils.Path()
      );

    // Create a page source for this perspective's root bean's default slice
    WeblogicPageSource pageSource =
      getInvocationContext()
        .getVersionedWeblogicPages()
        .getWeblogicPageSources()
        .getPageSource(pagePath);

    // Create an RDJ identity for this perspective's root bean
    JsonObject pageBeanIdentity =
      (new ResponseIdentityBuilder(
        pageSource.getPagePath().getPagesPath().getPerspectivePath(),
        getInvocationContext().getLocalizer())
      )
      .build();

    // Create a response body that contains this perspective's root bean's
    // navigation contents
    JsonObjectBuilder bldr = Json.createObjectBuilder();
    (new ResponseNavigationContentsBuilder(
      bldr,
      pageSource,
      pageBeanIdentity,
      getInvocationContext().getLocalizer())
    )
    .addNavigationContentsToResponse();
    return bldr.build();
  }

  /**
   * Set the invocation context's root pages path to the one for this perspective so that all JAXRS
   * resources in this perspective access use it.
   */
  @Override
  protected void setInvocationContext(InvocationContext invocationContext) throws Exception {
    super.setInvocationContext(invocationContext);
    getInvocationContext().setRootPagesPath(newRootPagesPath());
  }
}
