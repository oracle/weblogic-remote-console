// Copyright (c) 2022, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

import java.util.List;

/**
 * Specifies the conditions when a property's value passes a filter for a general search.
 * 
 * Only one of the conditions may be specified.
 */
public class SearchValueFilter {

  // The value must match this value to pass:
  private Value equals;

  // The value must be numeric and less than this value to pass:
  private Value lessThan;

  // The value must be numeric and less than or equal to this value to pass:
  private Value lessThanOrEquals;

  // The value must be numeric and greater than this value to pass:
  private Value greaterThan;

  // The value must be numeric and greater than or equal to this value to pass:
  private Value greaterThanOrEquals;

  // The value, converted to a string form, must be one of a list of values to pass:
  private List<Value> oneOf;

  // The value, converted to a string form, must contain this string (any case) to pass:
  private String contains;

  public Value getEquals() {
    return equals;
  }

  public void setEquals(Value val) {
    equals = val;
  }

  public Value getLessThan() {
    return lessThan;
  }

  public void setLessThan(Value val) {
    lessThan = val;
  }

  public Value getLessThanOrEquals() {
    return lessThanOrEquals;
  }

  public void setLessThanOrEquals(Value val) {
    lessThanOrEquals = val;
  }

  public Value getGreaterThan() {
    return greaterThan;
  }

  public void setGreaterThan(Value val) {
    greaterThan = val;
  }

  public Value getGreaterThanOrEquals() {
    return greaterThanOrEquals;
  }

  public void setGreaterThanOrEquals(Value val) {
    greaterThanOrEquals = val;
  }

  public List<Value> getOneOf() {
    return oneOf;
  }

  public void setOneOf(List<Value> val) {
    oneOf = val;
  }

  public String getContains() {
    return contains;
  }

  public void setContains(String val) {
    contains = val;
  }
}
