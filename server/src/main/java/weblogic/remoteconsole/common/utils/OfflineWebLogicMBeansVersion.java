// Copyright (c) 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.utils;

import java.util.List;
import java.util.Set;
import java.util.logging.Logger;

/**
 * Contains overall information a version of the WebLogic MBeans when working offline (e.g. WDT)
 */
public class OfflineWebLogicMBeansVersion extends WebLogicMBeansVersion {

  private static final Logger LOGGER = Logger.getLogger(OfflineWebLogicMBeansVersion.class.getName());

  // Describes the overall WebLogic version
  private WebLogicVersion weblogicVersion;

  // The set of console extension capabilities this version supports
  private Set<String> capabilities;

  @Override
  public WebLogicVersion getWebLogicVersion() {
    return weblogicVersion;
  }

  @Override
  public Set<String> getRoles() {
    return WebLogicRoles.ADMIN_ROLES; // Offline always grants admin access
  }

  @Override
  public Set<String> getCapabilities() {
    return capabilities;
  }

  @Override
  public List<RemoteConsoleExtension> getExtensions() {
    return List.of(); // Offline does not support extensions.
  }

  OfflineWebLogicMBeansVersion(WebLogicVersion weblogicVersion, Set<String> capabilities) {
    LOGGER.finest("new OfflineWebLogicMBeansVersion " + weblogicVersion + " " + capabilities);
    this.weblogicVersion = weblogicVersion;
    this.capabilities = capabilities;
  }
}
