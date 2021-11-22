// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo.weblogic;

import java.util.Set;

import weblogic.remoteconsole.common.repodef.weblogic.WebLogicRestDomainRuntimePageRepoDef;
import weblogic.remoteconsole.common.utils.WebLogicVersions;
import weblogic.remoteconsole.server.repo.PageReaderRepo;

/**
 * This class manages the admin server's runtime tree's runtime mbeans' pages
 * via the WebLogic REST api.
 */
public class WebLogicRestDomainRuntimePageRepo extends PageReaderRepo {
  public WebLogicRestDomainRuntimePageRepo(String domainVersion, Set<String> roles) {
    super(
      WebLogicVersions.getWeblogicVersion(domainVersion).findOrCreate(
        WebLogicRestDomainRuntimePageRepoDef.class,
        roles
      ),
      new WebLogicRestRuntimeTreeBeanRepo(WebLogicVersions.getWeblogicVersion(domainVersion), roles)
    );
  }
}
