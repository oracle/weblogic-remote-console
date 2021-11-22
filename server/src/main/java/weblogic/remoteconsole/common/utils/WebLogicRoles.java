// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.utils;

import java.util.HashSet;
import java.util.Set;

/**
 * Contains information about the standarcx Weblogic roles that the remote console supports.
 */
public class WebLogicRoles {
  private WebLogicRoles() {
  }

  public static final String ADMIN = "Admin";
  public static final String OPERATOR = "Operator";
  public static final String DEPLOYER = "Deployer";
  public static final String MONITOR = "Monitor";
  public static final Set<String> ALL = new HashSet<>();
  public static final Set<String> ADMIN_ROLES = new HashSet<>();

  static {
    ALL.add(ADMIN);
    ALL.add(OPERATOR);
    ALL.add(DEPLOYER);
    ALL.add(MONITOR);
    ADMIN_ROLES.add(ADMIN);
  }
}
