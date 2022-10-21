// Copyright (c) 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

import java.util.HashMap;
import java.util.Map;

/**
 * Holds the dashboards for a provider
 */
class Dashboards {
  private Map<String,Dashboard> dashboards = new HashMap<>();
  private Map<String,PersistedDashboard> unsupportedDashboards = new HashMap<>();

  Map<String,Dashboard> getDashboards() {
    return dashboards;
  }

  Map<String,PersistedDashboard> getUnsupportedDashboards() {
    return unsupportedDashboards;
  }
}
