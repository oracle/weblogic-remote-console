// Copyright (c) 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

import java.util.Date;
import java.util.List;

/**
 * This POJO holds the results, and definition, of a simple search.
 */
public class SimpleSearch {
  private SimpleSearchCriteria criteria;
  private String language;
  private List<SearchBeanResults> results;
  private Date resultsDate;
  private Date expirationDate;

  SimpleSearch(
    SimpleSearchCriteria criteria,
    String language,
    List<SearchBeanResults> results,
    Date resultsDate,
    Date expirationDate
  ) {
    this.criteria = criteria;
    this.language = language;
    this.results = results;
    this.resultsDate = resultsDate;
    this.expirationDate = expirationDate;
  }

  public String getName() {
    return criteria.getContains(); // Use the search criteria as the search name
  }

  public SimpleSearchCriteria getCriteria() {
    return criteria;
  }
  
  public String getLanguage() {
    return language;
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

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb
      .append("SimpleSearch<")
      .append("criteria=")
      .append(criteria.getContains());
    if (results != null) {
      sb
        .append(", resultsDate=")
        .append(resultsDate)
        .append(", numberOfMatches=")
        .append(results.size());
      if (expirationDate != null) {
        sb
          .append(", expirationDate=")
          .append(expirationDate);
      }
    }
    sb.append(">");
    return sb.toString();
  }
}
