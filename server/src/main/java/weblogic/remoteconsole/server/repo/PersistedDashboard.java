// Copyright (c) 2022, 2023, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.annotation.JsonTypeInfo.As;

/**
 * POJO for persisting a dashboard
 */
@JsonInclude(JsonInclude.Include.NON_DEFAULT)
@JsonTypeInfo(
  use = JsonTypeInfo.Id.NAME, 
  include = As.PROPERTY,
  property = "type"
)
@JsonSubTypes(
  {
    @JsonSubTypes.Type(value = PersistedFilteringDashboard.class, name = "FilteringDashboard"),
    // To support old persisted dashboards customers might have:
    @JsonSubTypes.Type(value = PersistedFilteringDashboard.class, name = "CustomFilteringDashboard")
  }
)
public class PersistedDashboard {

  public boolean isFilteringDashboard() {
    return this instanceof PersistedFilteringDashboard;
  }

  public PersistedFilteringDashboard asFilteringDashboard() {
    return (PersistedFilteringDashboard)this;
  }
}
