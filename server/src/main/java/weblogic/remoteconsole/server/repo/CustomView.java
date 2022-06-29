// Copyright (c) 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

import java.util.Date;
import java.util.List;

/**
 * POJO that holds information about a custom view:
 * - its query (i.e. the filtering rules for selecting matching beans)
 * - its results (i.e. the beans matching the filters and the results' age)
 */
public class CustomView {
  private CustomViewQuery query;
  private List<SearchBeanResults> results;
  private Date resultsDate;
  private Date expirationDate;

  CustomView(
    CustomViewQuery query,
    List<SearchBeanResults> results,
    Date resultsDate,
    Date expirationDate
  ) {
    this.query = query;
    this.results = results;
    this.resultsDate = resultsDate;
    this.expirationDate = expirationDate;
  }

  public String getName() {
    return query.getName();
  }

  public CustomViewQuery getQuery() {
    return query;
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
