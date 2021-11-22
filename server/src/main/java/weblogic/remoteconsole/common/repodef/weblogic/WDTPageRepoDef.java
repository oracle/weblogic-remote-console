// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.weblogic;

import java.util.Set;

import weblogic.remoteconsole.common.utils.WebLogicVersion;
import weblogic.remoteconsole.server.providers.Root;

/**
 * Defines the pages for WDT
 */
public class WDTPageRepoDef extends WebLogicPageRepoDef {
  public WDTPageRepoDef(WebLogicVersion weblogicVersion, Set<String> roles) {
    super(
      Root.EDIT_NAME,
      weblogicVersion,
      weblogicVersion.findOrCreate(WDTBeanRepoDef.class, roles),
      Root.CONFIGURATION_ROOT + "MBean"
    );
  }
}
