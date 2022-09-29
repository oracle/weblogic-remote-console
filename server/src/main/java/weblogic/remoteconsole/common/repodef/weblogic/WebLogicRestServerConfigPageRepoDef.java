// Copyright (c) 2021, 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.weblogic;

import weblogic.remoteconsole.common.utils.WebLogicMBeansVersion;
import weblogic.remoteconsole.server.providers.Root;

/**
 * Defines the pages for the admin server connection's server configuration tree.
 *
 * They're used to view the configuration that the admin server is currently running with.
 */
public class WebLogicRestServerConfigPageRepoDef extends WebLogicPageRepoDef {
  public WebLogicRestServerConfigPageRepoDef(WebLogicMBeansVersion mbeansVersion) {
    super(
      Root.SERVER_CONFIGURATION_NAME,
      mbeansVersion,
      mbeansVersion.findOrCreate(WebLogicRuntimeTreeBeanRepoDef.class),
      Root.CONFIGURATION_ROOT
    );
  }
}
