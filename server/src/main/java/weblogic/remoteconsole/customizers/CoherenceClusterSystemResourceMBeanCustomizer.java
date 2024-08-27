// Copyright (c) 2024, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.customizers;

import java.util.List;

import weblogic.remoteconsole.common.repodef.CustomSliceFormDef;
import weblogic.remoteconsole.common.repodef.PageDef;
import weblogic.remoteconsole.common.repodef.SliceFormDef;
import weblogic.remoteconsole.common.repodef.weblogic.WebLogicRestEditPageRepoDef;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.Response;

/*
 * Custom code for processing the CoherenceClusterSystemResourceMBean.
 */
public class CoherenceClusterSystemResourceMBeanCustomizer {

  // Remove the importCustomClusterConfigurationFile action from the page's actions if we're not in the edit tree
  public static Response<PageDef> customizeSliceFormDef(InvocationContext ic, PageDef uncustomizedPageDef) {
    Response<PageDef> response = new Response<>();
    if (ic.getPagePath().getPagesPath().getPageRepoDef() instanceof WebLogicRestEditPageRepoDef) {
      return response.setSuccess(uncustomizedPageDef);
    } else {
      // Currently the form only has an 'importCustomClusterConfigurationFile' action.
      // Since we're not in the edit tree, just return an empty list of actions.
      SliceFormDef uncustomizedSliceFormDef = uncustomizedPageDef.asSliceFormDef();
      return response.setSuccess(new CustomSliceFormDef(uncustomizedSliceFormDef).actionDefs(List.of()));
    }
  }

  private CoherenceClusterSystemResourceMBeanCustomizer() {
  }
}
