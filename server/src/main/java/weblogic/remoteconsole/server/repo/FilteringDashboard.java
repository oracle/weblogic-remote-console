// Copyright (c) 2022, 2023, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

import java.util.Date;
import java.util.List;

/**
 * POJO that holds information about a filtering dashboard:
 * - its config (i.e. the filtering rules for selecting matching beans)
 * - its results (i.e. the beans matching the filters and the results' age)
 */
public abstract class FilteringDashboard extends Dashboard {
  private FilteringDashboardConfig config;
  private List<SearchBeanResults> results;
  private Date resultsDate;
  private Date expirationDate;

  protected FilteringDashboard(FilteringDashboardConfig config) {
    this(config, null, null, null);
  }

  protected FilteringDashboard(
    FilteringDashboardConfig config,
    List<SearchBeanResults> results,
    Date resultsDate,
    Date expirationDate
  ) {
    this.config = config;
    this.results = results;
    this.resultsDate = resultsDate;
    this.expirationDate = expirationDate;
  }

  abstract FilteringDashboard clone(
    List<SearchBeanResults> results,
    Date resultsDate,
    Date expirationDate
  );

  @Override
  public String getName() {
    return config.getName();
  }

  @Override
  public String getDescription() {
    return config.getDescription();
  }

  @Override
  public Response<String> copy(InvocationContext ic, String name) {
    // TBD - copy the table customizations too?
    return
      ic
        .getPageRepo()
        .asPageReaderRepo()
        .getDashboardManager(ic)
        .createCustomFilteringDashboard(
          ic,
          new FilteringDashboardConfig(name, config)
        );
  }

  public FilteringDashboardConfig getConfig() {
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
