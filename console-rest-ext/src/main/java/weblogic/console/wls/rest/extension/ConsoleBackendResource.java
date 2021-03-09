// Copyright (c) 2020, 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.wls.rest.extension;

import org.codehaus.jettison.json.JSONObject;
import org.glassfish.admin.rest.utils.JsonFilter;
import weblogic.management.rest.lib.bean.resources.CustomSingletonChildResource;

/**
 * The console backend resource returns information the console backend's
 * Weblogic REST extension.
 *
 * Currently the remote console does not call this endpoint.
 * Longer term, the CBE will use it to check whether the domain has a
 * compatible version of the console REST extension installed.
 *
 * The endpoint is
 *   management/weblogic/<version>/edit/consoleBackend
 *
 * This endpoint is only visible if the client specifies the
 * enableConsoleRestExtension query parameter.
 */
public class ConsoleBackendResource extends CustomSingletonChildResource {

  private static final String VERSION = "CBE_WLS_REST_EXTENSION_V1";

  // Return the version of the console REST extension.
  @Override
  protected JSONObject getModel(JsonFilter.Scope filter) throws Exception {
    JSONObject item = new JSONObject();
    if (filter.include("version")) {
      item.put("version", VERSION);
    }
    return item;
  }
}
