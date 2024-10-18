// Copyright (c) 2023, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.customizers;

import javax.json.JsonObject;
import javax.ws.rs.core.Response;

import weblogic.remoteconsole.server.webapp.EditableCollectionChildBeanResource;
import weblogic.remoteconsole.server.webapp.JMSMessageManagementRuntimeMBeanInvokeActionHelper;
import weblogic.remoteconsole.server.webapp.JMSMessageManagementRuntimeMBeanUpdateHelper;

/**
 * Custom JAXRS resource for the JMSMessageManagementRuntimeMBean collection children
 */
public class JMSMessageManagementRuntimeMBeanCollectionChildResource extends EditableCollectionChildBeanResource {

  @Override
  protected Response updateSliceForm(JsonObject requestBody) {
    return
      JMSMessageManagementRuntimeMBeanUpdateHelper.update(
        getInvocationContext(),
        requestBody
      );
  }

  @Override
  protected Response invokeAction(String action, JsonObject requestBody) {
    return
      JMSMessageManagementRuntimeMBeanInvokeActionHelper.invokeMessagesAction(
        getInvocationContext(),
        action,
        requestBody
      );
  }
}
