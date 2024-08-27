// Copyright (c) 2024, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.customizers;

import javax.json.JsonObject;
import javax.ws.rs.core.Response;

import weblogic.remoteconsole.server.webapp.AggregatedMBeanInvokeActionHelper;
import weblogic.remoteconsole.server.webapp.ReadOnlyMandatorySingletonBeanResource;

/**
 * Custom JAXRS resource for aggregated mandatory singletonruntime mbean,
 * e.g. the JTARuntimeMBean across servers
 */
public class AggregatedMBeanMandatorySingletonBeanResource extends ReadOnlyMandatorySingletonBeanResource {
  @Override
  protected Response getActionInputForm(String action, JsonObject requestBody) {
    return (new AggregatedMBeanInvokeActionHelper(getInvocationContext(), action, requestBody)).getActionInputForm();
  }

  @Override
  protected Response invokeAction(String action, JsonObject requestBody) {
    return (new AggregatedMBeanInvokeActionHelper(getInvocationContext(), action, requestBody)).invokeAction();
  }
}
