// Copyright (c) 2021, 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.schema.beaninfo;

import java.util.List;

import weblogic.console.schema.BooleanValue;
import weblogic.console.schema.ListValue;
import weblogic.console.schema.YamlSource;

/**
 * This POJO mirrors the yaml file format for listing the roles that can access a bean, property or action.
 */
public class RolesDefSource extends YamlSource {
  private BooleanValue permitAll = BooleanValue.create();
  private ListValue<String> allowed = ListValue.create();

  // Whether all roles can access this feature
  public boolean isPermitAll() {
    return permitAll.getValue();
  }

  public void setPermitAll(boolean val) {
    permitAll = permitAll.setValue(val);
  }

  // The roles allowed to access this feature (if isPermitAll returns false)
  public List<String> getAllowed() {
    return allowed.getValue();
  }

  public void setAllowed(List<String> val) {
    allowed = allowed.setValue(val);
  }
}
