// Copyright (c) 2022, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

import weblogic.remoteconsole.common.repodef.PagePropertyDef;

/**
 * Return the results about a matching bean property from a general search
 */
public class SearchBeanPropertyResults {
  private PagePropertyDef propertyDef;
  private Value value;
  
  public SearchBeanPropertyResults(PagePropertyDef propertyDef, Value value) {
    this.propertyDef = propertyDef;
    this.value = value;
  }

  public PagePropertyDef getPropertyDef() {
    return propertyDef;
  }

  public Value getValue() {
    return value;
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("PropertyResults<p:" + propertyDef + ", v:" + value + ">");
    return sb.toString();
  }
}
