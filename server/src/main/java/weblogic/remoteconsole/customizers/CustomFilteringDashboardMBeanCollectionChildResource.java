// Copyright (c) 2022, 2026, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.customizers;

import javax.json.JsonObject;
import javax.ws.rs.core.Response;

import org.glassfish.jersey.media.multipart.FormDataMultiPart;
import weblogic.remoteconsole.server.webapp.CustomFilteringDashboardUpdateHelper;

/**
 * Custom JAXRS resource for the CustomFilteringDashboardMBean collection children
 */
public class CustomFilteringDashboardMBeanCollectionChildResource
  extends FilteringDashboardMBeanCollectionChildResource {

  @Override
  protected Response updateSliceForm(JsonObject requestBody) {
    return CustomFilteringDashboardUpdateHelper.update(getInvocationContext(), requestBody);
  }

  @Override
  protected Response updateSliceForm(JsonObject requestBody, FormDataMultiPart parts) {
    return CustomFilteringDashboardUpdateHelper.update(getInvocationContext(), requestBody, parts);
  }

  @Override
  protected String getTypeName() {
    return "CustomFilteringDashboardMBean";
  }
}
