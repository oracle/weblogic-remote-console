// Copyright (c) 2020, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.wls.rest.extension;

import org.codehaus.jettison.json.JSONObject;
import org.glassfish.admin.rest.utils.JsonFilter;
import weblogic.management.rest.lib.bean.resources.CustomSingletonChildResource;

/**
 * The console backend resource returns information the console backend's
 * Weblogic REST extension.
 */
public class ConsoleBackendResource extends CustomSingletonChildResource {

  private static final String VERSION = "CBE_WLS_REST_EXTENSION_V1";

  @Override
  protected JSONObject getModel(JsonFilter.Scope filter) throws Exception {
    JSONObject item = new JSONObject();
    if (filter.include("version")) {
      item.put("version", VERSION);
    }
    return item;
  }
}
