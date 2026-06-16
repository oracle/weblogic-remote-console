// Copyright (c) 2023, 2026, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.customizers;

import weblogic.remoteconsole.server.webapp.DeletableCollectionChildBeanResource;
import weblogic.remoteconsole.server.webapp.ServerMBeanSSLUpdateHelper;
import weblogic.remoteconsole.server.webapp.UpdateHelper;

/**
 * Custom JAXRS resource for the writable ServerMBean instances
 */
public class ServerMBeanDeletableCollectionChildBeanResource extends DeletableCollectionChildBeanResource {
  @Override
  protected UpdateHelper createUpdateHelper() {
    String slicePath = getInvocationContext().getPagePath().asSlicePagePath().getSlicePath().getDotSeparatedPath();
    if ("Security.SSL".equals(slicePath)) {
      return new ServerMBeanSSLUpdateHelper();
    }
    return super.createUpdateHelper();
  }
}
