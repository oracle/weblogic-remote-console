// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.weblogic;

import java.util.Set;

import weblogic.remoteconsole.common.utils.WebLogicVersion;
import weblogic.remoteconsole.server.providers.Root;

/**
 * Defines the pages for the admin server connection's edit tree.
 *
 * They're used to modify the domain's configuration.
 */
public class WebLogicRestEditPageRepoDef extends WebLogicPageRepoDef {
  public WebLogicRestEditPageRepoDef(WebLogicVersion version, Set<String> roles) {
    super(
      Root.EDIT_NAME,
      version,
      version.findOrCreate(WebLogicEditTreeBeanRepoDef.class, roles),
      Root.CONFIGURATION_ROOT + "MBean"
    );
  }
}
