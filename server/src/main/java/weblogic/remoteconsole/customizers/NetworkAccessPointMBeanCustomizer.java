// Copyright (c) 2023, 2024, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.customizers;

import weblogic.remoteconsole.server.repo.BeanTreePath;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.SettableValue;
import weblogic.remoteconsole.server.webapp.BaseResource;

/** 
 * Custom code for processing the NetworkAccessPointMBean
 */
public class NetworkAccessPointMBeanCustomizer {

  private NetworkAccessPointMBeanCustomizer() {
  }

  // Customize the writable NetworkAccessPointMBean JAXRS resource
  public static BaseResource createResource(InvocationContext ic) {
    BeanTreePath btp = ic.getBeanTreePath();
    if (btp.isDeletable() && btp.isCollectionChild()) {
      return new NetworkAccessPointMBeanDeletableCollectionChildBeanResource();
    } else {
      return null;
    }
  }

  public static SettableValue getHostnameVerifierType(
    @Source(
      property = "HostnameVerifier"
    ) SettableValue hostnameVerifier
  ) {
    return HostnameVerifierCustomizer.getHostnameVerifierType(hostnameVerifier);
  }

  public static SettableValue getCustomHostnameVerifier(
    @Source(
      property = "HostnameVerifier"
    ) SettableValue hostnameVerifier
  ) {
    return HostnameVerifierCustomizer.getCustomHostnameVerifier(hostnameVerifier);
  }
}
