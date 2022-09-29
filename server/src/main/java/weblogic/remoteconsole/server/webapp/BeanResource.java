// Copyright (c) 2021, 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.webapp;

import javax.json.JsonObject;
import javax.ws.rs.core.Response;

import weblogic.remoteconsole.common.utils.Path;
 
/** Base resource for resources that manage a bean or a collection of beans. */
public class BeanResource extends BaseResource {

  protected static final String CUSTOMIZE_TABLE = "customizeTable";
  protected static final String UPDATE = "update";

  /**
   * Get the relate url of this bean or collection of beans.
   * It's used to identify the bean/beans in log and exception messages.
   */
  protected String getPageRepoRelativeUri() {
    return getInvocationContext().getBeanTreePath().getPath().getRelativeUri();
  }

  protected void setSlicePagePath(String slice) {
    getInvocationContext().setPagePath(
      getInvocationContext().getPageRepo().getPageRepoDef().newSlicePagePath(
        getInvocationContext().getBeanTreePath().getTypeDef(),
        new Path(slice)
      )
    );
  }

  protected void setCreateFormPagePath() {
    getInvocationContext().setPagePath(
      getInvocationContext().getPageRepo().getPageRepoDef().newCreateFormPagePath(
        getInvocationContext().getBeanTreePath().getTypeDef()
      )
    );
  }

  protected void setTablePagePath() {
    getInvocationContext().setPagePath(
      getInvocationContext().getPageRepo().getPageRepoDef().newTablePagePath(
        getInvocationContext().getBeanTreePath().getTypeDef()
      )
    );
  }

  protected Response customizeTable(JsonObject requestBody) {
    return CustomizeTableHelper.customizeTable(getInvocationContext(), requestBody);
  }

  protected Response defaultPost(JsonObject requestBody) {
    return Response.status(Response.Status.METHOD_NOT_ALLOWED).build();
  }
}
