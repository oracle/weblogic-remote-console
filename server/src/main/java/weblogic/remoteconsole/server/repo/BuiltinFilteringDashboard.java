// Copyright (c) 2023, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

import java.util.Date;
import java.util.List;

import weblogic.remoteconsole.common.repodef.LocalizableString;
import weblogic.remoteconsole.common.repodef.LocalizedConstants;

/**
 * POJO that holds information about a builtin filtering dashboard
 */
public class BuiltinFilteringDashboard extends FilteringDashboard {

  BuiltinFilteringDashboard(FilteringDashboardConfig config) {
    super(config);
  }

  BuiltinFilteringDashboard(
    FilteringDashboardConfig config,
    List<SearchBeanResults> results,
    Date resultsDate,
    Date expirationDate
  ) {
    super(config, results, resultsDate, expirationDate);
  }

  @Override
  public FilteringDashboard clone(
    List<SearchBeanResults> results,
    Date resultsDate,
    Date expirationDate
  ) {
    return new BuiltinFilteringDashboard(getConfig(), results, resultsDate, expirationDate);
  }

  @Override
  public String getType() {
    return "Builtin Filtering Dashboard";
  }

  @Override
  public String getTypeLabel(InvocationContext ic) {
    return ic.getLocalizer().localizeString(LocalizedConstants.BUILTIN_FILTERING_DASHBOARD_TYPE_LABEL);
  }

  @Override
  public boolean isBuiltin() {
    return true;
  }

  @Override
  public LocalizableString getNameLabel() {
    return getNameLabel(getName());
  }

  public String getNameLabel(InvocationContext ic) {
    return ic.getLocalizer().localizeString(getNameLabel());
  }

  public static LocalizableString getNameLabel(String name) {
    return new LocalizableString("builtinFilteringDashboard." + name + ".name", name);
  }

  public LocalizableString getDescriptionLabel() {
    return getDescriptionLabel(getName(), getDescription());
  }

  public static LocalizableString getDescriptionLabel(String name, String description) {
    return new LocalizableString("builtinFilteringDashboard." + name + ".description", description);
  }
}
