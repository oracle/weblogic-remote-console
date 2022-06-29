// Copyright (c) 2022, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

import java.util.List;

/**
 * Specify which beans and properties a general search should return
 */
public class SearchCriteria {
  private List<SearchBeanFilter> filters;
  private List<SearchProperty> properties;

  public List<SearchBeanFilter> getFilters() {
    return filters;
  }

  public void setFilters(List<SearchBeanFilter> val) {
    filters = val;
  }

  public List<SearchProperty> getProperties() {
    return properties;
  }

  public void setProperties(List<SearchProperty> val) {
    properties = val;
  }
}
