// Copyright (c) 2025, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.customizers;

import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.Page;

/**
 * Custom code for processing the PluginDeploymentMBean
 */
public class PluginDeploymentMBeanCustomizer {

  private PluginDeploymentMBeanCustomizer() {
  }

  public static void customizeTable(InvocationContext ic, Page page) {
    DeploymentMBeanCustomizer.customizeTable(ic, page);
  }
}
