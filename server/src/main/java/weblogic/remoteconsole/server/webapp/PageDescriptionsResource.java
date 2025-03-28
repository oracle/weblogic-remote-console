// Copyright (c) 2021, 2025, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.webapp;

import java.util.logging.Logger;
import javax.json.JsonObject;
import javax.ws.rs.DefaultValue;
import javax.ws.rs.GET;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import weblogic.console.utils.Path;
import weblogic.console.utils.StringUtils;
import weblogic.remoteconsole.common.repodef.BeanTypeDef;
import weblogic.remoteconsole.common.repodef.PageDef;
import weblogic.remoteconsole.common.repodef.PagePath;
import weblogic.remoteconsole.common.repodef.PageRepoDef;
import weblogic.remoteconsole.common.repodef.PagesPath;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.PageDescription;
import weblogic.remoteconsole.server.repo.PageRepo;
import weblogic.remoteconsole.server.repo.Response;

/**
 * Gets the PDJs for pages in a page repo
 */
public class PageDescriptionsResource extends BaseResource {

  private static final Logger LOGGER = Logger.getLogger(PageDescriptionsResource.class.getName());

  /**
   * Get the PDJ for a bean type and view in this perspective
   *
   * @param mbeanType - the mbean type's name, e.g. DomainRuntime
   * @param view - which of the type's PDJs to return
   */
  @GET
  @javax.ws.rs.Path("{typeName}")
  @Produces(MediaType.APPLICATION_JSON)
  public javax.ws.rs.core.Response getPageDescription(
    @PathParam("typeName") String typeName,
    @QueryParam("view") @DefaultValue("") String view,
    @QueryParam("actionForm") @DefaultValue("") String actionForm,
    @QueryParam("action") @DefaultValue("") String action
  ) {
    // FortifyIssueSuppression Log Forging
    // The values are scrubbed by cleanStringForLogging
    LOGGER.fine("getPageDescription"
      + " typeName=" + StringUtils.cleanStringForLogging(typeName)
      + " view=" + StringUtils.cleanStringForLogging(view)
      + " actionForm=" + StringUtils.cleanStringForLogging(actionForm)
      + " action=" + StringUtils.cleanStringForLogging(action)
    );
    return
      GetPageDescResponseMapper.toResponse(
        getInvocationContext(),
        getResponse(typeName, view, actionForm, action)
      );
  }

  private Response<JsonObject> getResponse(String typeName, String view, String actionForm, String action) {
    InvocationContext ic = getInvocationContext();
    Response<JsonObject> response = new Response<>();
    PageRepo pageRepo = ic.getPageRepo();
    PagePath pagePath = computePagePath(typeName, view, actionForm, action);
    if (pagePath == null) {
      return response.setNotFound();
    }
    ic.setPagePath(pagePath);
    Response<PageDef> pageDefResponse =
      pageRepo.asPageReaderRepo().getPageDef(ic);
    if (!pageDefResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(pageDefResponse);
    }
    PageDef pageDef = pageDefResponse.getResults();
    JsonObject pageDesc = PageDescription.getPageDescription(pageDef, ic);
    return response.setSuccess(pageDesc);
  }

  private PagePath computePagePath(String typeName, String view, String actionForm, String action) {
    PagePath basePagePath = computeBasePagePath(typeName, view);
    if (basePagePath != null && "inputForm".equals(actionForm)) {
      if (StringUtils.isEmpty(action)) {
        throw new AssertionError("Action must be specified for input forms: type=" + typeName + " view=" + view);
      }
      return PagePath.newActionInputFormPagePath(basePagePath, action);
    } else {
      return basePagePath;
    }
  }

  private PagePath computeBasePagePath(String typeName, String view) {
    PageRepoDef pageRepoDef = getInvocationContext().getPageRepo().getPageRepoDef();
    BeanTypeDef typeDef = pageRepoDef.getBeanRepoDef().getTypeDef(typeName);
    if (typeDef == null) {
      return null; // not found
    }
    PagesPath pagesPath = new PagesPath(pageRepoDef, typeDef);
    if ("table".equals(view)) {
      return PagePath.newTablePagePath(pagesPath);
    }
    if ("createForm".equals(view)) {
      return PagePath.newCreateFormPagePath(pagesPath);
    }
    String slicePath = view;
    return PagePath.newSlicePagePath(pagesPath, new Path(slicePath));
  }
}
