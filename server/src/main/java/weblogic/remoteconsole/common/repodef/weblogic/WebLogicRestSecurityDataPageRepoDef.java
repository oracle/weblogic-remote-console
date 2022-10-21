// Copyright (c) 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.weblogic;

import weblogic.remoteconsole.common.utils.WebLogicMBeansVersion;
import weblogic.remoteconsole.server.providers.Root;

/**
 * Defines the pages for the admin server connection's security data tree.
 *
 * They're used to manage the data the domain's security providers store in embedded ldap.
 */
public class WebLogicRestSecurityDataPageRepoDef extends WebLogicPageRepoDef {
  public WebLogicRestSecurityDataPageRepoDef(WebLogicMBeansVersion mbeansVersion) {
    super(
      Root.SECURITY_DATA_NAME,
      mbeansVersion,
      mbeansVersion.findOrCreate(WebLogicRuntimeTreeBeanRepoDef.class),
      Root.SECURITY_DATA_ROOT
    );
  }
}
