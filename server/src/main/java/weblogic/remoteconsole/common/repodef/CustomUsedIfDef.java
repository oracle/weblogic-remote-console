// Copyright (c) 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef;

import java.util.ArrayList;
import java.util.List;

import weblogic.remoteconsole.server.repo.Value;

/**
 * POJO used to help build implementations of interfaces that extend UsedIfDef.
 * 
 * Used for building custom pages.
 */
class CustomUsedIfDef {
  private PagePropertyDef propertyDef;
  private List<Value> values = new ArrayList<>();

  public CustomUsedIfDef() {
  }

  public CustomUsedIfDef(UsedIfDef toClone) {
    setPropertyDef(toClone.getPropertyDef());
    getValues().addAll(toClone.getValues());
  }

  PagePropertyDef getPropertyDef() {
    return propertyDef;
  }

  void setPropertyDef(PagePropertyDef val) {
    propertyDef = val;
  }

  List<Value> getValues() {
    return values;
  }

  void setValues(List<Value> val) {
    values = val;
  }
}
