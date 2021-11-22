// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.schema;

import java.util.List;

/**
 * This POJO mirrors the yaml file format for listing the roles that can access a bean, property or action.
 */
public class RolesDefSource {
  private BooleanValue permitAll = new BooleanValue();
  private ListValue<String> allowed = new ListValue<>();

  // Whether all roles can access this feature
  public boolean isPermitAll() {
    return permitAll.getValue();
  }

  public void setPermitAll(boolean val) {
    permitAll.setValue(val);
  }

  // The roles allowed to access this feature (if isPermitAll returns false)
  public List<String> getAllowed() {
    return allowed.getValue();
  }

  public void setAllowed(List<String> val) {
    allowed.setValue(val);
  }
}
