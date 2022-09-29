// Copyright (c) 2021, 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.weblogic;

import weblogic.remoteconsole.common.utils.WebLogicMBeansVersion;
import weblogic.remoteconsole.server.providers.Root;

/**
 * Defines the pages for WDT composite
 */
public class WDTCompositePageRepoDef extends WebLogicPageRepoDef {
  public WDTCompositePageRepoDef(WebLogicMBeansVersion mbeansVersion) {
    super(
      Root.COMPOSITE_CONFIGURATION_NAME,
      mbeansVersion,
      mbeansVersion.findOrCreate(WDTCompositeBeanRepoDef.class),
      Root.CONFIGURATION_ROOT
    );
  }
}
