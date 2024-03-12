// Copyright (c) 2022, 2023, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonTypeName;
import weblogic.remoteconsole.common.utils.StringUtils;

/**
 * POJO for persisting a filtering dashboard
 */
@JsonInclude(JsonInclude.Include.NON_DEFAULT)
@JsonTypeName("FilteringDashboard")
public class PersistedFilteringDashboard extends PersistedDashboard {
  private String beanTreePathTemplate = "";
  private Map<String,PersistedBeanKeyFilter> beanFilters = Map.of();
  private Map<String,PersistedPropertyFilter> propertyFilters = Map.of();
  private String description = null;
  private List<String> defaultColumns = List.of();

  @JsonProperty("path")
  public String getBeanTreePathTemplate() {
    return beanTreePathTemplate;
  }

  @JsonProperty("path")
  public void setBeanTreePathTemplate(String val) {
    beanTreePathTemplate = StringUtils.nonNull(val);
  }

  public Map<String,PersistedBeanKeyFilter> getBeanFilters() {
    return beanFilters;
  }

  public void setBeanFilters(Map<String,PersistedBeanKeyFilter> val) {
    beanFilters = (val != null) ? val : Map.of();
  }

  public Map<String,PersistedPropertyFilter> getPropertyFilters() {
    return propertyFilters;
  }

  public void setPropertyFilters(Map<String,PersistedPropertyFilter> val) {
    propertyFilters = (val != null) ? val : Map.of();
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String val) {
    description = val;
  }

  public List<String> getDefaultColumns() {
    return defaultColumns;
  }

  public void setDefaultColumns(List<String> val) {
    defaultColumns = (val != null) ? val : List.of();
  }
}
