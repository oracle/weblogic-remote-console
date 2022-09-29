// Copyright (c) 2021, 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.weblogic;

import weblogic.remoteconsole.common.utils.WebLogicMBeansVersion;
import weblogic.remoteconsole.server.providers.Root;

/**
 * Defines the pages for WDT
 */
public class WDTPageRepoDef extends WebLogicPageRepoDef {
  public WDTPageRepoDef(WebLogicMBeansVersion mbeansVersion) {
    super(
      Root.EDIT_NAME,
      mbeansVersion,
      mbeansVersion.findOrCreate(WDTBeanRepoDef.class),
      "DomainConfiguration"
    );
  }
}
