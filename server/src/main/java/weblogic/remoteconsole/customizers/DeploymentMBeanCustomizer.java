// Copyright (c) 2021, 2025, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.customizers;

import java.util.List;

import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.Page;

/**
 * Custom code for processing the various deployment mbeans
 */
class DeploymentMBeanCustomizer {

  private DeploymentMBeanCustomizer() {
  }

  // Since this is not a normal collection, we had to specify creatable=true in DomainMBean/type.yaml
  // But this forces the collection to be creatable and deletable everywhere (i.e. edit & server config trees)
  // This customizer forces it back to read-only in the server config tree.
  static void customizeTable(InvocationContext ic, Page page) {
    boolean isChangeManager = ic.getPageRepo().isChangeManagerPageRepo();
    boolean isWDT = ic.getPageRepo().getBeanRepo().getBeanRepoDef().supportsCapabilities(List.of("WDT"));
    if (!isChangeManager && !isWDT) {
      page.forceReadOnly();
    }
  }
}
