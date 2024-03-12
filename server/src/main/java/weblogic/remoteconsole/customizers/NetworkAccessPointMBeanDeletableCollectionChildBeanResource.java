// Copyright (c) 2023, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.customizers;

import javax.json.JsonObject;
import javax.ws.rs.core.Response;

import weblogic.remoteconsole.server.webapp.DeletableCollectionChildBeanResource;
import weblogic.remoteconsole.server.webapp.NetworkAccessPointMBeanSSLUpdateHelper;

/**
 * Custom JAXRS resource for the writable NetworkAccessPointMBean instances
 */
public class NetworkAccessPointMBeanDeletableCollectionChildBeanResource extends DeletableCollectionChildBeanResource {
  @Override
  protected Response updateSliceForm(JsonObject requestBody) {
    String slicePath = getInvocationContext().getPagePath().asSlicePagePath().getSlicePath().getDotSeparatedPath();
    if ("ChannelSecurity".equals(slicePath)) {
      return (new NetworkAccessPointMBeanSSLUpdateHelper()).updateBean(getInvocationContext(), requestBody);
    } else {
      return super.updateSliceForm(requestBody);
    }
  }
}
