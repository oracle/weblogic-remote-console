// Copyright (c) 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

import java.util.Map;

/**
 * POJO for persisting the remote console's dashboards
 */
public class PersistedDashboards {

  private Map<String,PersistedDashboard> dashboards = Map.of();

  public Map<String,PersistedDashboard> getDashboards() {
    return dashboards;
  }

  public void setDashboards(Map<String,PersistedDashboard> val) {
    dashboards = (val != null) ? val : Map.of();
  }
}
