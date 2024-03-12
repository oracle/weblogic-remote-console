// Copyright (c) 2022, 2023, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

import weblogic.remoteconsole.common.repodef.LocalizableString;

/**
 * Base abstract POJO that holds information about a dashboard
 * (typically its configuration and current information)
 */
public abstract class Dashboard {

  public abstract String getName();

  // Default to the unlocalized name:
  public LocalizableString getNameLabel() {
    return new LocalizableString(getName());
  }

  public String getNameLabel(InvocationContext ic) {
    return ic.getLocalizer().localizeString(getNameLabel());
  }

  public abstract String getDescription();

  // Default to the unlocalized description:
  public LocalizableString getDescriptionLabel() {
    return new LocalizableString(getDescription());
  }

  public String getDescriptionLabel(InvocationContext ic) {
    return ic.getLocalizer().localizeString(getDescriptionLabel());
  }

  public abstract String getType();

  public abstract String getTypeLabel(InvocationContext ic);

  public abstract boolean isBuiltin();

  public abstract Response<String> copy(InvocationContext ic, String name);

  public boolean isFilteringDashboard() {
    return this instanceof FilteringDashboard;
  }

  public FilteringDashboard asFilteringDashboard() {
    return (FilteringDashboard)this;
  }

  public boolean isCustomFilteringDashboard() {
    return this instanceof CustomFilteringDashboard;
  }

  public CustomFilteringDashboard asCustomFilteringDashboard() {
    return (CustomFilteringDashboard)this;
  }

  public boolean isBuiltinFilteringDashboard() {
    return this instanceof BuiltinFilteringDashboard;
  }

  public BuiltinFilteringDashboard asBuiltinFilteringDashboard() {
    return (BuiltinFilteringDashboard)this;
  }
}
