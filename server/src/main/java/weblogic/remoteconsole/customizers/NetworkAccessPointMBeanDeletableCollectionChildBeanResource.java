// Copyright (c) 2023, 2026, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.customizers;

import weblogic.remoteconsole.server.webapp.DeletableCollectionChildBeanResource;
import weblogic.remoteconsole.server.webapp.NetworkAccessPointMBeanSSLUpdateHelper;
import weblogic.remoteconsole.server.webapp.UpdateHelper;

/**
 * Custom JAXRS resource for the writable NetworkAccessPointMBean instances
 */
public class NetworkAccessPointMBeanDeletableCollectionChildBeanResource extends DeletableCollectionChildBeanResource {
  @Override
  protected UpdateHelper createUpdateHelper() {
    String slicePath = getInvocationContext().getPagePath().asSlicePagePath().getSlicePath().getDotSeparatedPath();
    if ("ChannelSecurity".equals(slicePath)) {
      return new NetworkAccessPointMBeanSSLUpdateHelper();
    }
    return super.createUpdateHelper();
  }
}
