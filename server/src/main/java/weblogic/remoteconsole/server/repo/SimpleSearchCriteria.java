// Copyright (c) 2022, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

/**
 * Specify which beans a simple search should return
 */
public class SimpleSearchCriteria {
  private String contains;

  public String getContains() {
    return contains;
  }

  public void setContains(String val) {
    contains = val;
  }
}
