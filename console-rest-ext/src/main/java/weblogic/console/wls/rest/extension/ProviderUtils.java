// Copyright (c) 2020, 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.wls.rest.extension;

import org.glassfish.admin.rest.model.RestJsonResponseBody;
import weblogic.management.rest.lib.bean.utils.BeanType;
import weblogic.management.rest.lib.bean.utils.InvocationContext;

/** 
 * General purpose utilities for adding the 'type' property to security provider mbeans.
 *
 * The remote console needs to be able to determine the type of any mbean so that it
 * can select an appropriate set of pages for it.
 *
 * All of the standard WLS mbeans have a type property.  Unfortunately, the
 * security providers, which are implemented using a different technology, don't.
 *
 * The WLS REST api should have done something to address this but didn't.
 * So, the console REST extension needs to do this instead.
 * Long term, this functionality should be moved into the WLS REST extension.
 *
 * This code only adds the 'type' property if the client specifies the
 * enableConsoleRestExtension query parameter.
 */
public class ProviderUtils {

  private static final String TYPE = "type";

  // Add the 'type' property to a security provider mbean
  public static void addBeanType(RestJsonResponseBody rb, InvocationContext ic) throws Exception {
    if (!ConsoleUtils.isConsoleRestExtensionEnabled(ic)) {
      return;
    }
    if (ic.bean() == null) {
      // the bean doesn't exist
      return;
    }
    if (!ConsoleUtils.includeProperty(ic, TYPE)) {
      return;
    }
    String beanType = BeanType.getBeanType(ic.request(), ic.bean()).getName();
    String type = StringUtils.removeSuffix(beanType, "MBean", "Bean");
    rb.getEntity().put(TYPE, ConsoleUtils.wrapIfExpandedValuesEnabled(ic, type, false));
  }
}
