// Copyright (c) 2023, 2024, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo.weblogic;
 
import java.util.HashSet;
import java.util.Set;

import weblogic.remoteconsole.common.utils.WebLogicVersion;
import weblogic.remoteconsole.common.utils.WebLogicVersions;

/**
 * Supported WDT mbean capabilities that page yamls check for
 */
public class WDTCapabilities {
  // This needs to be aligned with the config mbean based capabilities
  // specified in weblogic.remoteconsole.server.connection.ConnectionManager.
  //
  // WDT 3.2.2 doesn't support DomainMBean.AllowList.
  // Once WDT does, add that capability.
  //
  // Also, since we don't know whether the user intends to use this model
  // to create a JRF or normal WLS domain, assume not JRF (i.e.
  // don't include the 'JRFSecurityProviders' capability).
  private static final Set<String> CAPABILITIES =
    Set.of(
      // "AllowList",
      "WDT"
    );

  public static Set<String> getCapabilities(WebLogicVersion weblogicVersion) {
    Set<String> capabilities = new HashSet<>();
    capabilities.addAll(CAPABILITIES);
    capabilities.addAll(WebLogicVersions.getVersionCapabilities(weblogicVersion));
    return capabilities;
  }
}
