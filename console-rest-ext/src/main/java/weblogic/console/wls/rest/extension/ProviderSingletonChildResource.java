// Copyright (c) 2020, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.wls.rest.extension;

import org.glassfish.admin.rest.model.RestJsonResponseBody;
import weblogic.management.rest.lib.bean.resources.SingletonChildBeanResource;

/** */
public class ProviderSingletonChildResource extends SingletonChildBeanResource {
  @Override
  public RestJsonResponseBody getRB() throws Exception {
    RestJsonResponseBody rb = super.getRB();
    ProviderUtils.addBeanType(rb, invocationContext());
    return rb;
  }
}
