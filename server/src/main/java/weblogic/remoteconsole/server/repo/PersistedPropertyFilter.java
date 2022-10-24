// Copyright (c) 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * POJO for persisting a property filter.
 * Used for filtering beans based on their property values.
 */
@JsonInclude(JsonInclude.Include.NON_DEFAULT)
public class PersistedPropertyFilter {
  private Object equals;
  private Object notEquals;
  private String contains;
  private Object lessThan;
  private Object lessThanOrEquals;
  private Object greaterThan;
  private Object greaterThanOrEquals;

  @JsonProperty("==")
  public Object getEquals() {
    return equals;
  }

  @JsonProperty("==")
  public void setEquals(Object val) {
    validateNotMultipleConditions();
    equals = val;
  }

  @JsonProperty("!=")
  public Object getNotEquals() {
    return notEquals;
  }

  @JsonProperty("!=")
  public void setNotEquals(Object val) {
    validateNotMultipleConditions();
    notEquals = val;
  }

  public String getContains() {
    return contains;
  }

  public void setContains(String val) {
    validateNotMultipleConditions();
    contains = val;
  }

  @JsonProperty("<")
  public Object getLessThan() {
    return lessThan;
  }

  @JsonProperty("<")
  public void setLessThan(Object val) {
    validateNotMultipleConditions();
    lessThan = val;
  }

  @JsonProperty("<=")
  public Object getLessThanOrEquals() {
    return lessThanOrEquals;
  }

  @JsonProperty("<=")
  public void setLessThanOrEquals(Object val) {
    validateNotMultipleConditions();
    lessThanOrEquals = val;
  }

  @JsonProperty(">")
  public Object getGreaterThan() {
    return greaterThan;
  }

  @JsonProperty(">")
  public void setGreaterThan(Object val) {
    validateNotMultipleConditions();
    greaterThan = val;
  }

  @JsonProperty(">=")
  public Object getGreaterThanOrEquals() {
    return greaterThanOrEquals;
  }

  @JsonProperty(">=")
  public void setGreaterThanOrEquals(Object val) {
    validateNotMultipleConditions();
    greaterThanOrEquals = val;
  }

  private void validateNotMultipleConditions() {
    int conditions = 0;
    if (equals != null) {
      conditions++;
    }
    if (notEquals != null) {
      conditions++;
    }
    if (contains != null) {
      conditions++;
    }
    if (lessThan != null) {
      conditions++;
    }
    if (lessThanOrEquals != null) {
      conditions++;
    }
    if (greaterThan != null) {
      conditions++;
    }
    if (greaterThanOrEquals != null) {
      conditions++;
    }
    if (conditions > 0) {
      throw new IllegalArgumentException(
        "Only set one of:"
        + " '=='"
        + ", '!='"
        + ", 'contains'"
        + ", '<'"
        + ", '<='"
        + ", '>'"
        + ", '>='"
      );
    }
  }
}
