// Copyright (c) 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * POJO for persisting a bean key filter.
 * Used for filtering beans based on their keys (names).
 */
@JsonInclude(JsonInclude.Include.NON_DEFAULT)
public class PersistedBeanKeyFilter {
  private String equals;
  private String contains;

  @JsonProperty("==")
  public String getEquals() {
    return equals;
  }

  @JsonProperty("==")
  public void setEquals(String val) {
    validateNotMultipleConditions();
    equals = val;
  }

  public String getContains() {
    return contains;
  }

  public void setContains(String val) {
    validateNotMultipleConditions();
    contains = val;
  }

  private void validateNotMultipleConditions() {
    int conditions = 0;
    if (equals != null) {
      conditions++;
    }
    if (contains != null) {
      conditions++;
    }
    if (conditions > 0) {
      throw new IllegalArgumentException("Only set '==' or 'contains'");
    }
  }
}
