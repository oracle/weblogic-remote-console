// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo.weblogic;

import java.util.Map;

import weblogic.remoteconsole.common.repodef.weblogic.WDTPageRepoDef;
import weblogic.remoteconsole.common.utils.WebLogicVersions;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.PageEditorRepo;

/**
 * This class manages a WDT model.
 */
public class WDTPageRepo extends PageEditorRepo {
  public WDTPageRepo(String domainVersion, Map<String, Object> model, InvocationContext ic) {
    super(
      WebLogicVersions.getWeblogicVersion(domainVersion).findOrCreate(WDTPageRepoDef.class),
      new WDTEditTreeBeanRepo(WebLogicVersions.getWeblogicVersion(domainVersion), model, ic)
    );
  }
}
