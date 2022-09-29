// Copyright (c) 2021, 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.weblogic;

import weblogic.remoteconsole.common.utils.WebLogicMBeansVersion;
import weblogic.remoteconsole.server.providers.Root;

/**
 * Defines the pages for the admin server connection's domain runtime bean tree.
 *
 * They're used to monitor and manage all of the servers in the domain.
 */
public class WebLogicRestDomainRuntimePageRepoDef extends WebLogicPageRepoDef {
  public WebLogicRestDomainRuntimePageRepoDef(WebLogicMBeansVersion mbeansVersion) {
    super(
      Root.DOMAIN_RUNTIME_NAME,
      mbeansVersion,
      mbeansVersion.findOrCreate(WebLogicRuntimeTreeBeanRepoDef.class),
      Root.MONITORING_ROOT
    );
  }

  @Override
  public boolean isSupportsCustomFilteringDashboards() {
    // The monitoring tree supports custom filtering dashboards
    return true;
  }
}
