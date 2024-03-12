// Copyright (c) 2022, 2023, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

import java.util.Date;
import java.util.List;

import weblogic.remoteconsole.common.repodef.LocalizedConstants;

/**
 * POJO that holds information about a custom filtering dashboard
 */
public class CustomFilteringDashboard extends FilteringDashboard {

  CustomFilteringDashboard(FilteringDashboardConfig config) {
    super(config);
  }

  private CustomFilteringDashboard(
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
    return new CustomFilteringDashboard(getConfig(), results, resultsDate, expirationDate);
  }

  @Override
  public String getType() {
    return "Custom Filtering Dashboard";
  }

  @Override
  public String getTypeLabel(InvocationContext ic) {
    return ic.getLocalizer().localizeString(LocalizedConstants.CUSTOM_FILTERING_DASHBOARD_TYPE_LABEL);
  }

  @Override
  public boolean isBuiltin() {
    return false;
  }
}
