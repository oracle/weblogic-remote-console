// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo.weblogic;

import weblogic.remoteconsole.common.repodef.weblogic.WDTBeanRepoDef;
import weblogic.remoteconsole.common.utils.WebLogicMBeansVersion;

/**
 * This class manages a WDT model.
 */
public class WDTBeanRepo extends WebLogicBeanRepo {
  public WDTBeanRepo(WebLogicMBeansVersion mbeansVersion) {
    super(mbeansVersion.findOrCreate(WDTBeanRepoDef.class));
  }
}
