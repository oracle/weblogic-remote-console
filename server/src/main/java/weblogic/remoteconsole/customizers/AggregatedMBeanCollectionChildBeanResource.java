// Copyright (c) 2024, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.customizers;

import javax.json.JsonObject;
import javax.ws.rs.core.Response;

import weblogic.remoteconsole.server.webapp.AggregatedMBeanInvokeActionHelper;
import weblogic.remoteconsole.server.webapp.ReadOnlyCollectionChildBeanResource;

/**
 * Custom JAXRS resource for an aggregated runtime mbean collection child,
 * e.g. an ApplicationRuntimeMBean across servers
 */
public class AggregatedMBeanCollectionChildBeanResource extends ReadOnlyCollectionChildBeanResource {
  @Override
  protected Response getActionInputForm(String action, JsonObject requestBody) {
    return (new AggregatedMBeanInvokeActionHelper(getInvocationContext(), action, requestBody)).getActionInputForm();
  }

  @Override
  protected Response invokeAction(String action, JsonObject requestBody) {
    return (new AggregatedMBeanInvokeActionHelper(getInvocationContext(), action, requestBody)).invokeAction();
  }
}
