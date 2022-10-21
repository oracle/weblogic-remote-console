// Copyright (c) 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo.weblogic;

import weblogic.remoteconsole.common.repodef.weblogic.WebLogicRestSecurityDataPageRepoDef;
import weblogic.remoteconsole.common.utils.WebLogicMBeansVersion;
import weblogic.remoteconsole.server.repo.PageEditorRepo;

/**
 * This class manages the admin server's runtime tree's pages for managing the
 * security data stored in embedded ldap.
 */
public class WebLogicRestSecurityDataPageRepo extends PageEditorRepo {
  public WebLogicRestSecurityDataPageRepo(WebLogicMBeansVersion mbeansVersion) {
    super(
      mbeansVersion.findOrCreate(WebLogicRestSecurityDataPageRepoDef.class),
      new WebLogicRestRuntimeTreeBeanRepo(mbeansVersion)
    );
  }
}
