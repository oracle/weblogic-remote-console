// Copyright (c) 2023, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo.weblogic;
 
import java.util.Set;

import weblogic.remoteconsole.common.utils.WebLogicMBeansVersion;

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
  public static final Set<String> CAPABILITIES =
    WebLogicMBeansVersion.NO_CAPABILITIES;
    // Set.of("AllowList");
}
