// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo.weblogic;

import weblogic.remoteconsole.common.repodef.weblogic.WDTCompositeBeanRepoDef;
import weblogic.remoteconsole.common.utils.WebLogicMBeansVersion;

/**
 * This class manages a composite WDT model.
 */
public class WDTCompositeBeanRepo extends WebLogicBeanRepo {
  public WDTCompositeBeanRepo(WebLogicMBeansVersion mbeansVersion) {
    super(mbeansVersion.findOrCreate(WDTCompositeBeanRepoDef.class));
  }
}
