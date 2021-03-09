// Copyright (c) 2020, 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.wls.rest.extension;

import org.codehaus.jettison.json.JSONObject;
import org.glassfish.admin.rest.utils.JsonFilter;
import weblogic.management.rest.lib.bean.resources.CustomSingletonChildResource;

/**
 * The remote console provides the tree of resources that the console needs
 * for managing weblogic configuration transactions that the WLS REST
 * changeManager tree of resources doesn't provide.
 *
 * Long term, this functionality should be moved into the WLS REST api.
 *
 * Currently, it just adds one endpoint:
 *   management/weblogic/<version>/edit/consoleChangeManager/changes
 *
 * This endpoint is only visible if the client specifies the
 * enableConsoleRestExtension query parameter.
 */
public class ConsoleChangeManagerResource extends CustomSingletonChildResource {

  @Override
  protected JSONObject getModel(JsonFilter.Scope filter) throws Exception {
    return new JSONObject();
  }

  @Override
  protected Object _getSubResource(String subResourceName, JSONObject childrenQuery) throws Exception {
    if (ConsoleUtils.isConsoleRestExtensionEnabled(invocationContext())) {
      Class clz = null;
      if ("changes".equals(subResourceName)) {
        clz = ChangesResource.class;
      }
      if (clz != null) {
        return getSubResource(clz, subResourceName, childrenQuery);
      }
    }
    // i.e. not found
    return null;
  }
}
