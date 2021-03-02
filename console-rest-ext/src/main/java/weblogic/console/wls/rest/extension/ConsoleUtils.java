// Copyright (c) 2020, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.wls.rest.extension;

import org.codehaus.jettison.json.JSONObject;
import weblogic.management.rest.lib.bean.utils.InvocationContext;
import weblogic.management.rest.lib.bean.utils.QueryUtils;

/** */
public class ConsoleUtils {

  public static Object wrapExpandableValue(InvocationContext ic, Object unwrappedValue) throws Exception {
    if (ic.expandedValues()) {
      JSONObject wrappedValue = new JSONObject();
      wrappedValue.put("set", false);
      wrappedValue.put("value", unwrappedValue);
      return wrappedValue;
    } else {
      return unwrappedValue;
    }
  }

  public static boolean isConsoleRestExtensionEnabled(InvocationContext ic) {
    return Boolean.parseBoolean(ic.uriInfo().getQueryParameters().getFirst("enableConsoleRestExtension"));
  }

  public static boolean includeProperty(InvocationContext ic, String property) throws Exception {
    return QueryUtils.getPropertiesFilter(ic.request(), ic.query()).newScope().include(property);
  }
}
