// Copyright (c) 2020, 2021, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package com.oracle.weblogic.console.backend.services;

import java.util.logging.Logger;
import javax.ws.rs.DefaultValue;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import weblogic.console.backend.driver.PageSourceNotFoundException;
import weblogic.console.backend.driver.WeblogicPageRepresenter;
import weblogic.console.backend.pagedesc.PagePath;
import weblogic.console.backend.pagedesc.PagesPath;
import weblogic.console.backend.typedesc.WeblogicBeanType;
import weblogic.console.backend.utils.StringUtils;

/** Gets the PDJs for the perspective (root pages path) in this request's invocation context */
public class PageDefinitionsResource extends ConnectionRequiredResource {

  private static final Logger LOGGER = Logger.getLogger(PageDefinitionsResource.class.getName());

  /**
   * Get the PDJ for a bean type and view in this perspective
   *
   * @param mbeanType - the mbean type's name, e.g. DomainRuntime
   * @param view - which of the type's PDJs to return
   */
  @GET
  @Path("{beanType}")
  @Produces(MediaType.APPLICATION_JSON)
  public Response getBeanTypeAndViewPageDefinition(
    @PathParam("beanType") String beanType,
    @QueryParam("view") @DefaultValue("") String view
  ) throws Exception {
    // FortifyIssueSuppression Log Forging
    // The values are scrubbed by cleanStringForLogging
    LOGGER.fine("getBeanTypeAndViewPageDefinition"
      + " mbeanType=" + StringUtils.cleanStringForLogging(beanType)
      + " view=" + StringUtils.cleanStringForLogging(view)
    );
    try {
      return
        Response
          .ok(
            getPageDefinitionAsString(
              getLocalizedBeanTypeAndViewPageDefinition(beanType, view)
            )
          )
          .build();
    } catch (Throwable t) {
      throw toServiceException(t);
    }
  }

  private Object getLocalizedBeanTypeAndViewPageDefinition(
    String beanType,
    String view
  ) throws Exception {
    PagePath pagePath = computePagePath(beanType, view);
    Object pdj =
      getInvocationContext()
        .getVersionedWeblogicPages()
        .getLocalizedWeblogicPages()
        .getPage(pagePath, getInvocationContext().getLocalizer());
    if (pdj != null) {
      return pdj;
    }
    throw new PageSourceNotFoundException(pagePath.getURI());
  }

  private PagePath computePagePath(String beanTypeName, String view) throws Exception {
    WeblogicBeanType beanType =
      getInvocationContext()
        .getVersionedWeblogicPages()
        .getWeblogicBeanTypes()
        .getType(beanTypeName);
    if (beanType == null) {
      throw new PageSourceNotFoundException(beanTypeName);
    }
    PagesPath pagesPath = getInvocationContext().getRootPagesPath().newPagesPath(beanType);
    if ("table".equals(view)) {
      return PagePath.newTablePagePath(pagesPath);
    }
    if ("createForm".equals(view)) {
      return PagePath.newCreateFormPagePath(pagesPath);
    }
    String slicePath = view;
    return PagePath.newSlicePagePath(pagesPath, new weblogic.console.backend.utils.Path(slicePath));
  }

  private String getPageDefinitionAsString(Object localizedPage) throws Exception {
    return WeblogicPageRepresenter.convertToJsonString(localizedPage);
  }
}
