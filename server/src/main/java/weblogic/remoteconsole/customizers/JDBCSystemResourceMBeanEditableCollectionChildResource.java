// Copyright (c) 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.customizers;

import javax.json.JsonObject;
import javax.ws.rs.core.Response;

import weblogic.remoteconsole.server.webapp.DeletableCollectionChildBeanResource;
import weblogic.remoteconsole.server.webapp.JDBCSystemResourceMBeanUpdateHelper;

/**
 * Custom JAXRS resource for the writable JDBCSystemResourceMBean instances
 */
public class JDBCSystemResourceMBeanEditableCollectionChildResource extends DeletableCollectionChildBeanResource {
  @Override
  protected Response updateSliceForm(JsonObject requestBody) {
    return (new JDBCSystemResourceMBeanUpdateHelper()).updateBean(getInvocationContext(), requestBody);
  }
}
