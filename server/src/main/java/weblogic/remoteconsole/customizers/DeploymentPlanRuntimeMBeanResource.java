// Copyright (c) 2023, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.customizers;

import javax.json.JsonObject;
import javax.ws.rs.core.Response;

import weblogic.remoteconsole.server.webapp.DeploymentPlanRuntimeMBeanUpdateHelper;
import weblogic.remoteconsole.server.webapp.EditableMandatorySingletonBeanResource;

/**
 * Custom JAXRS resource for the DeploymentPlanRuntimeMBean
 */
public class DeploymentPlanRuntimeMBeanResource extends EditableMandatorySingletonBeanResource {
  @Override
  protected Response updateSliceForm(JsonObject requestBody) {
    return DeploymentPlanRuntimeMBeanUpdateHelper.update(getInvocationContext(), requestBody);
  }
}