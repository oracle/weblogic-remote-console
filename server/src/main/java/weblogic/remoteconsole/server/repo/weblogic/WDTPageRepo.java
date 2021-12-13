// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo.weblogic;

import java.util.Map;

import weblogic.remoteconsole.common.repodef.weblogic.WDTPageRepoDef;
import weblogic.remoteconsole.common.utils.WebLogicMBeansVersion;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.PageEditorRepo;

/**
 * This class manages a WDT model.
 */
public class WDTPageRepo extends PageEditorRepo {
  public WDTPageRepo(WebLogicMBeansVersion mbeansVersion, Map<String, Object> model, InvocationContext ic) {
    super(
      mbeansVersion.findOrCreate(WDTPageRepoDef.class),
      new WDTEditTreeBeanRepo(mbeansVersion, model, ic)
    );
  }
}
