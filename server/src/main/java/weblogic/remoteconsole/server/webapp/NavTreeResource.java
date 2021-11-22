// Copyright (c) 2021, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.webapp;

import java.util.List;
import java.util.logging.Logger;
import javax.json.JsonObject;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import weblogic.remoteconsole.common.utils.StringUtils;
import weblogic.remoteconsole.server.repo.NavTreeNode;
import weblogic.remoteconsole.server.repo.Response;

/** 
 * Gets nav tree info for this page repo
 */
public class NavTreeResource extends BaseResource {

  private static final Logger LOGGER = Logger.getLogger(NavTreeResource.class.getName());

  /**
   * Get the nav tree info for a set of nav tree nodes
   *
   * @param navTreeNodes - the nav tree nodes that the caller wants nav tree info for
   * 
   * @return a Response containing the nav tree info for navTreeNodes
   */
  @POST
  @Consumes(MediaType.APPLICATION_JSON)
  @Produces(MediaType.APPLICATION_JSON)
  public javax.ws.rs.core.Response expandNavTreeNodes(JsonObject requestBody) {
    // FortifyIssueSuppression Log Forging
    // The values are scrubbed by cleanStringForLogging
    LOGGER.fine("expandNavTreeNodes" + StringUtils.cleanStringForLogging(requestBody.toString()));
    return NavTreeNodeResponseMapper.toResponse(getInvocationContext(), getResponse(requestBody));
  }

  private Response<List<NavTreeNode>> getResponse(JsonObject requestBody) {
    // Convert the request body into a List<NavTreeNode> (i.e. the nodes to expand)
    Response<List<NavTreeNode>> response =
      NavTreeNodeRequestBodyMapper.fromRequestBody(getInvocationContext(), requestBody);
    if (!response.isSuccess()) {
      return response;
    }
    // Expand the nodes and return them
    return
      getInvocationContext()
      .getPageRepo().asPageReaderRepo()
      .expandNavTreeNodes(getInvocationContext(), response.getResults());
  }
}
