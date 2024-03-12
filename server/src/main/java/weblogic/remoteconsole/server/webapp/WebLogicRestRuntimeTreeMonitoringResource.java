// Copyright (c) 2024, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.webapp;

import javax.ws.rs.Path;

import weblogic.remoteconsole.customizers.NodeManagerLogDownloadResource;

/**
 * Top level JAXRS resource for the monitoring tree
 */
public class WebLogicRestRuntimeTreeMonitoringResource extends PageRepoResource {
  @Path("downloads/NodeManagerLogs/{machine}")
  public NodeManagerLogDownloadResource getNodeManagerLogDownloadResource() {
    NodeManagerLogDownloadResource resource = new NodeManagerLogDownloadResource();
    copyContext(resource);
    return resource;
  }
}
