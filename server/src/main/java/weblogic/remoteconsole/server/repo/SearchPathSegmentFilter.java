// Copyright (c) 2022, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

/**
 * Specifies a filter that decides if a segment in nav tree or bean tree path's segment matches
 */
public class SearchPathSegmentFilter {

  // Whether any value matches:
  private boolean anyValue = false;

  // Whether the segment's must exactly match:
  private String equals;

  // Whether the segment's label must contain a string (any case):
  private String contains;

  public boolean isAnyValue() {
    return anyValue;
  }

  public void setAnyValue(boolean val) {
    anyValue = val;
  }

  public String getEquals() {
    return equals;
  }

  public void setEquals(String val) {
    equals = val;
  }

  public String getContains() {
    return contains;
  }

  public void setContains(String val) {
    contains = val;
  }
}
