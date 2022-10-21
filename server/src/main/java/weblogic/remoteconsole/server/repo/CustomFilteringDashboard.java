// Copyright (c) 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

import java.util.Date;
import java.util.List;

import weblogic.remoteconsole.common.repodef.LocalizedConstants;

/**
 * POJO that holds information about a custom filtering dashboard:
 * - its config (i.e. the filtering rules for selecting matching beans)
 * - its results (i.e. the beans matching the filters and the results' age)
 */
public class CustomFilteringDashboard extends Dashboard {
  private CustomFilteringDashboardConfig config;
  private List<SearchBeanResults> results;
  private Date resultsDate;
  private Date expirationDate;

  CustomFilteringDashboard(CustomFilteringDashboardConfig config) {
    this(config, null, null, null);
  }

  CustomFilteringDashboard(
    CustomFilteringDashboardConfig config,
    List<SearchBeanResults> results,
    Date resultsDate,
    Date expirationDate
  ) {
    this.config = config;
    this.results = results;
    this.resultsDate = resultsDate;
    this.expirationDate = expirationDate;
  }

  @Override
  public String getName() {
    return config.getName();
  }

  @Override
  public String getType() {
    return "Custom Filtering Dashboard";
  }

  @Override
  public String getTypeLabel(InvocationContext ic) {
    return ic.getLocalizer().localizeString(LocalizedConstants.CUSTOM_FILTERING_DASHBOARD_TYPE_LABEL);
  }

  public CustomFilteringDashboardConfig getConfig() {
    return config;
  }
  
  public List<SearchBeanResults> getResults() {
    return results;
  }

  public Date getResultsDate() {
    return resultsDate;
  }

  public Date getExpirationDate() {
    return expirationDate;
  }

  public boolean isCurrent() {
    if (results == null) {
      // we don't have any results yet
      return false;
    }
    Date now = new Date(System.currentTimeMillis());
    return now.before(expirationDate);
  }
}
