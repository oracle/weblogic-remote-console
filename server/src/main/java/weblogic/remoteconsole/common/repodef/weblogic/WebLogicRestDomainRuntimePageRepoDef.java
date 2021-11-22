// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.weblogic;

import java.util.Set;

import weblogic.remoteconsole.common.utils.WebLogicVersion;
import weblogic.remoteconsole.server.providers.Root;

/**
 * Defines the pages for the admin server connection's domain runtime bean tree.
 *
 * They're used to monitor and manage all of the servers in the domain.
 */
public class WebLogicRestDomainRuntimePageRepoDef extends WebLogicPageRepoDef {
  public WebLogicRestDomainRuntimePageRepoDef(WebLogicVersion version, Set<String> roles) {
    super(
      Root.DOMAIN_RUNTIME_NAME,
      version,
      version.findOrCreate(WebLogicRuntimeTreeBeanRepoDef.class, roles),
      Root.MONITORING_ROOT + "MBean"
    );
  }
}
