// Copyright (c) 2024, 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.customizers;

import javax.json.Json;
import javax.ws.rs.GET;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import weblogic.console.utils.Path;
import weblogic.remoteconsole.common.utils.UrlUtils;
import weblogic.remoteconsole.server.utils.WebLogicRestClient;
import weblogic.remoteconsole.server.utils.WebLogicRestRequest;
import weblogic.remoteconsole.server.webapp.BaseResource;

public class NodeManagerLogDownloadResource extends BaseResource {
  @GET
  @Produces(MediaType.TEXT_PLAIN)
  public Response downloadNodeManagerLog(@PathParam("machine") String machine) {
    Path path = new Path("domainRuntime.nodeManagerRuntimes");
    path.addComponent(machine);
    path.addComponent("downloadLog");
    WebLogicRestRequest request =
      WebLogicRestRequest.builder()
        .root(WebLogicRestRequest.CURRENT_WEBLOGIC_REST_API_ROOT)
        .connection(getInvocationContext().getConnection())
        .path(UrlUtils.pathToRelativeUri(path))
        .build();
    return
      WebLogicRestClient.downloadAsInputStream(
        request,
        Json.createObjectBuilder().build(),
        MediaType.TEXT_PLAIN
      );
  }
}

