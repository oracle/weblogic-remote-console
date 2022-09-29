// Copyright (c) 2021, 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.weblogic;

import weblogic.remoteconsole.common.repodef.PageDefWalker;
import weblogic.remoteconsole.common.utils.WebLogicMBeansVersion;

/**
 * This utility class walks all of the pages for a WebLogic version.
 */
public abstract class WebLogicPageDefWalker extends PageDefWalker {
  WebLogicMBeansVersion mbeansVersion;

  protected WebLogicMBeansVersion getMBeansVersion() {
    return this.mbeansVersion;
  }

  protected WebLogicPageDefWalker(WebLogicMBeansVersion mbeansVersion) {
    this.mbeansVersion = mbeansVersion;
  }

  protected void walk() {
    walk(mbeansVersion.findOrCreate(WebLogicRestEditPageRepoDef.class));
    walk(mbeansVersion.findOrCreate(WebLogicRestDomainRuntimePageRepoDef.class));
    walk(mbeansVersion.findOrCreate(WebLogicRestSecurityDataPageRepoDef.class));
    // Don't walk the server config and WDT page repos since they use the same
    // page definitions as the edit edit and domain runtime page repos.
  }
}
