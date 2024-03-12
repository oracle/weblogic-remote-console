// Copyright (c) 2023, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.webapp;

import java.util.List;

import weblogic.remoteconsole.customizers.HostnameVerifierCustomizer;
import weblogic.remoteconsole.server.repo.FormProperty;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.Response;

/**
 * Customizes updating a NetworkAccessPointMBean's ChannelSecurity slice form
 */
public class NetworkAccessPointMBeanSSLUpdateHelper extends UpdateHelper {

  public NetworkAccessPointMBeanSSLUpdateHelper() {
    super();
  }

  @Override
  protected Response<List<FormProperty>> customizeFormProperties(
    InvocationContext ic,
    List<FormProperty> formProperties
  ) {
    return HostnameVerifierCustomizer.customizeFormProperties(ic, formProperties);
  }
}
