// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo.weblogic;

import java.util.Set;

import weblogic.remoteconsole.common.repodef.weblogic.WebLogicRestEditPageRepoDef;
import weblogic.remoteconsole.common.utils.WebLogicVersions;
import weblogic.remoteconsole.server.repo.ChangeManagerPageRepo;

/**
 * This class manages the admin server's edit tree's configuration mbeans' pages
 * via the WebLogic REST api.
 */
public class WebLogicRestEditPageRepo extends ChangeManagerPageRepo {
  public WebLogicRestEditPageRepo(String domainVersion, Set<String> roles) {
    super(
      WebLogicVersions.getWeblogicVersion(domainVersion).findOrCreate(
        WebLogicRestEditPageRepoDef.class,
        roles
      ),
      new WebLogicRestEditTreeBeanRepo(WebLogicVersions.getWeblogicVersion(domainVersion), roles)
    );
  }
}
