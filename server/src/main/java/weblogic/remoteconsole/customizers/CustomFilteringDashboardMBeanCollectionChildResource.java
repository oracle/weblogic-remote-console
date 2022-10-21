// Copyright (c) 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.customizers;

import javax.json.JsonObject;
import javax.ws.rs.core.Response;

import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.webapp.CustomFilteringDashboardUpdateHelper;
import weblogic.remoteconsole.server.webapp.DeletableCollectionChildBeanResource;
import weblogic.remoteconsole.server.webapp.VoidResponseMapper;

/**
 * Custom JAXRS resource for the CustomFilteringDashboardMBean collection children
 */
public class CustomFilteringDashboardMBeanCollectionChildResource extends DeletableCollectionChildBeanResource {

  @Override
  protected Response updateSliceForm(JsonObject requestBody) {
    return CustomFilteringDashboardUpdateHelper.update(getInvocationContext(), requestBody);
  }

  @Override
  protected Response deleteCollectionChild() {
    InvocationContext ic = getInvocationContext();
    String dashboardName = ic.getBeanTreePath().getLastSegment().getKey();
    return
      VoidResponseMapper.toResponse(
        ic,
        ic.getPageRepo().asPageReaderRepo().getDashboardManager().deleteDashboard(ic, dashboardName)
      );
  }
}
