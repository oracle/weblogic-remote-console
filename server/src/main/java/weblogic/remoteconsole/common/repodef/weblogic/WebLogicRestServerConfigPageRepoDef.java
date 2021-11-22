// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.weblogic;

import java.util.Set;

import weblogic.remoteconsole.common.utils.WebLogicVersion;
import weblogic.remoteconsole.server.providers.Root;

/**
 * Defines the pages for the admin server connection's server configuration tree.
 *
 * They're used to view the configuration that the admin server is currently running with.
 */
public class WebLogicRestServerConfigPageRepoDef extends WebLogicPageRepoDef {
  public WebLogicRestServerConfigPageRepoDef(WebLogicVersion weblogicVersion, Set<String> roles) {
    super(
      Root.SERVER_CONFIGURATION_NAME,
      weblogicVersion,
      weblogicVersion.findOrCreate(WebLogicRuntimeTreeBeanRepoDef.class, roles),
      "DomainMBean"
    );
  }
}
