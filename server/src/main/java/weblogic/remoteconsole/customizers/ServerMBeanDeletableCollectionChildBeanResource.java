// Copyright (c) 2023, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.customizers;

import javax.json.JsonObject;
import javax.ws.rs.core.Response;

import weblogic.remoteconsole.server.webapp.DeletableCollectionChildBeanResource;
import weblogic.remoteconsole.server.webapp.ServerMBeanSSLUpdateHelper;

/**
 * Custom JAXRS resource for the writable ServerMBean instances
 */
public class ServerMBeanDeletableCollectionChildBeanResource extends DeletableCollectionChildBeanResource {
  @Override
  protected Response updateSliceForm(JsonObject requestBody) {
    String slicePath = getInvocationContext().getPagePath().asSlicePagePath().getSlicePath().getDotSeparatedPath();
    if ("Security.SSL".equals(slicePath)) {
      return (new ServerMBeanSSLUpdateHelper()).updateBean(getInvocationContext(), requestBody);
    } else {
      return super.updateSliceForm(requestBody);
    }
  }
}
