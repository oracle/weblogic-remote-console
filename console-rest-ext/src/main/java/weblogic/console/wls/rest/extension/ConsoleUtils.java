// Copyright (c) 2020, 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.wls.rest.extension;

import org.codehaus.jettison.json.JSONObject;
import weblogic.management.rest.lib.bean.Constants;
import weblogic.management.rest.lib.bean.utils.InvocationContext;
import weblogic.management.rest.lib.bean.utils.QueryUtils;

/** General purpose utilities for the console WLS REST extension */
public class ConsoleUtils {

  // Determines whether the console rest extension's functionality should be visible
  // to the request (i.e. whether or not the client specified the enableConsoleRestExtension query param)
  public static boolean isConsoleRestExtensionEnabled(InvocationContext ic) {
    return Boolean.parseBoolean(ic.uriInfo().getQueryParameters().getFirst("enableConsoleRestExtension"));
  }

  // Determines whether a property should be included in a GET response
  // (based on whether the client used the standard WLS REST filtering query params)
  public static boolean includeProperty(InvocationContext ic, String property) throws Exception {
    return QueryUtils.getPropertiesFilter(ic.request(), ic.query()).newScope().include(property);
  }

  // Converts an unexpanded property value into an expanded value if the client asked
  // for expanded values. Otherwise returns the unexpanded value.
  public static Object wrapIfExpandedValuesEnabled(
    InvocationContext ic,
    Object unwrappedValue,
    boolean set
  ) throws Exception {
    if (ic.expandedValues()) {
      return createExpandedValue(unwrappedValue, set);
    } else {
      return unwrappedValue;
    }
  }

  // Converts an unexpanded property value into an expanded value if the client asked
  // for expanded values. Otherwise returns the unexpanded value.
  public static Object createExpandedValue(Object unwrappedValue, boolean set) throws Exception {
    JSONObject wrappedValue = new JSONObject();
    wrappedValue.put(Constants.PROP_VALUE, unwrappedValue);
    wrappedValue.put(Constants.PROP_SET, set);
    return wrappedValue;
  }
}
