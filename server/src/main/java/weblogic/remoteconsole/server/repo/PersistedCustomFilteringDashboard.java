// Copyright (c) 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

import java.util.Map;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonTypeName;
import weblogic.remoteconsole.common.utils.StringUtils;

/**
 * POJO for persisting a custom filtering dashboard
 */
@JsonInclude(JsonInclude.Include.NON_DEFAULT)
@JsonTypeName("CustomFilteringDashboard")
public class PersistedCustomFilteringDashboard extends PersistedDashboard {
  private String beanTreePathTemplate = "";
  private Map<String,PersistedBeanKeyFilter> beanFilters = Map.of();
  private Map<String,PersistedPropertyFilter> propertyFilters = Map.of();

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
}
