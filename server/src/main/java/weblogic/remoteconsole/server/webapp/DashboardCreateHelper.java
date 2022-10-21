// Copyright (c) 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.webapp;

import java.util.List;
import javax.json.JsonObject;

import weblogic.remoteconsole.server.repo.CustomFilteringDashboardConfig;
import weblogic.remoteconsole.server.repo.CustomFilteringDashboardConfigManager;
import weblogic.remoteconsole.server.repo.FormProperty;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.Response;

/**
 * Utility code called by the DashboardMBeanCollectionResource
 * JAXRS resource to create a dashboard.
 */
public class DashboardCreateHelper extends CreateHelper {

  public static javax.ws.rs.core.Response create(InvocationContext ic, JsonObject requestBody) {
    return (new DashboardCreateHelper()).createBean(ic, requestBody);
  }

  private DashboardCreateHelper() {
  }

  @Override
  protected Response<Void> createBean(InvocationContext ic, List<FormProperty> properties) {
    // Only can create CustomFilteringDashboards currently.
    // When we add support for other kinds of dashboards, look at properties
    // to see what kind to create.
    Response<Void> response = new Response<>();
    Response<CustomFilteringDashboardConfig> configResponse =
      CustomFilteringDashboardConfigManager.createConfig(ic, properties);
    if (!configResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(configResponse);
    }
    Response<String> createResponse =
      ic.getPageRepo().asPageReaderRepo().getDashboardManager().createCustomFilteringDashboard(
        ic,
        configResponse.getResults()
      );
    if (!createResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(createResponse);
    }
    return response.setSuccess(null);
  }
}
