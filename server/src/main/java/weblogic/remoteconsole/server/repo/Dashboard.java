// Copyright (c) 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

/**
 * Base abstract POJO that holds information about a dashboard
 * (typically its configuration and current information)
 */
public abstract class Dashboard {

  public abstract String getName();

  public abstract String getType();

  public abstract String getTypeLabel(InvocationContext ic);

  public boolean isCustomFilteringDashboard() {
    return this instanceof CustomFilteringDashboard;
  }

  public CustomFilteringDashboard asCustomFilteringDashboard() {
    return (CustomFilteringDashboard)this;
  }
}
