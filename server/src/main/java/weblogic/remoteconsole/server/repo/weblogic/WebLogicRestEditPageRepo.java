// Copyright (c) 2021, 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo.weblogic;

import weblogic.remoteconsole.common.repodef.weblogic.WebLogicRestEditPageRepoDef;
import weblogic.remoteconsole.common.utils.WebLogicMBeansVersion;
import weblogic.remoteconsole.server.providers.Root;
import weblogic.remoteconsole.server.repo.ChangeManagerPageRepo;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.Page;
import weblogic.remoteconsole.server.repo.Response;

/**
 * This class manages the admin server's edit tree's configuration mbeans' pages
 * via the WebLogic REST api.
 */
public class WebLogicRestEditPageRepo extends ChangeManagerPageRepo {
  public WebLogicRestEditPageRepo(WebLogicMBeansVersion mbeansVersion) {
    super(
      mbeansVersion.findOrCreate(WebLogicRestEditPageRepoDef.class),
      new WebLogicRestEditTreeBeanRepo(mbeansVersion)
    );
  }

  @Override
  public Response<Page> getPage(InvocationContext ic) {
    return
      WebLogicRestConfigPageRepoUtils.addConfigLink(
        Root.SERVER_CONFIGURATION_NAME,
        ic,
        super.getPage(ic)
      );
  }
}
