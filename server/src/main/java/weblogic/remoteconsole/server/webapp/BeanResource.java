// Copyright (c) 2021, 2023, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.webapp;

import javax.json.JsonObject;
import javax.ws.rs.core.Response;

import weblogic.remoteconsole.common.repodef.PagePath;
import weblogic.remoteconsole.common.utils.Path;
import weblogic.remoteconsole.common.utils.StringUtils;
 
/** Base resource for resources that manage a bean or a collection of beans. */
public class BeanResource extends BaseResource {

  protected static final String CUSTOMIZE_TABLE = "customizeTable";
  protected static final String UPDATE = "update";
  protected static final String CREATE = "create";
  protected static final String INPUT_FORM = "inputForm";

  /**
   * Get the relate url of this bean or collection of beans.
   * It's used to identify the bean/beans in log and exception messages.
   */
  protected String getPageRepoRelativeUri() {
    return getInvocationContext().getBeanTreePath().getPath().getRelativeUri();
  }

  protected void setSlicePagePath(String slice) {
    setSlicePagePath(slice, "", "");
  }

  protected void setSlicePagePath(String slice, String actionForm, String action) {
    setPagePath(
      getInvocationContext().getPageRepo().getPageRepoDef().newSlicePagePath(
        getInvocationContext().getBeanTreePath().getTypeDef(),
        new Path(slice)
      ),
      actionForm,
      action
    );
  }

  protected void setCreateFormPagePath() {
    setCreateFormPagePath("", "");
  }

  protected void setCreateFormPagePath(String actionForm, String action) {
    setPagePath(
      getInvocationContext().getPageRepo().getPageRepoDef().newCreateFormPagePath(
        getInvocationContext().getBeanTreePath().getTypeDef()
      ),
      actionForm,
      action
    );
  }

  protected void setTablePagePath() {
    setTablePagePath("", "");
  }

  protected void setTablePagePath(String actionForm, String action) {
    setPagePath(
      getInvocationContext().getPageRepo().getPageRepoDef().newTablePagePath(
        getInvocationContext().getBeanTreePath().getTypeDef()
      ),
      actionForm,
      action
    );
  }

  private void setPagePath(PagePath pagePath, String actionForm, String action) {
    if (INPUT_FORM.equals(actionForm)) {
      if (StringUtils.isEmpty(action)) {
        throw new AssertionError("Action must be specified for input form: " + pagePath);
      }
      pagePath = PagePath.newActionInputFormPagePath(pagePath, action);
    }
    getInvocationContext().setPagePath(pagePath);
  }

  protected Response customizeTable(JsonObject requestBody) {
    return CustomizeTableHelper.customizeTable(getInvocationContext(), requestBody);
  }

  protected Response invokeAction(String action, JsonObject requestBody) {
    return InvokeActionHelper.invokeAction(getInvocationContext(), action, requestBody);
  }

  protected Response methodNotAllowed(JsonObject requestBody) {
    return Response.status(Response.Status.METHOD_NOT_ALLOWED).build();
  }

  protected Response getPage() {
    return
      GetPageResponseMapper.toResponse(
        getInvocationContext(),
        getInvocationContext()
          .getPageRepo().asPageReaderRepo()
          .getPage(getInvocationContext())
      );
  }
}
