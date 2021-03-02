// Copyright (c) 2020, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.wls.rest.extension;

import org.glassfish.admin.rest.model.RestJsonResponseBody;
import weblogic.management.rest.lib.bean.utils.BeanType;
import weblogic.management.rest.lib.bean.utils.InvocationContext;

/** */
public class ProviderUtils {

  private static final String TYPE = "type";

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
    rb.getEntity().put(TYPE, ConsoleUtils.wrapExpandableValue(ic, type));
  }
}
