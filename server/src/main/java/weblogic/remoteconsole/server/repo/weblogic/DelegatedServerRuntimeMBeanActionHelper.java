// Copyright (c) 2023, 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo.weblogic;

import java.util.List;

import weblogic.console.utils.Path;
import weblogic.remoteconsole.server.repo.BeanTreePath;

/**
 * Helps invoke actions for the mbeans that delegate
 * from DomainRuntime.CombinedServerRuntimes.<server>.ServerRuntime.<rest of path>
 * to   DomainRuntime.ServerRuntimes.<server>.<rest of path>
 */
class DelegatedServerRuntimeMBeanActionHelper extends WebLogicBeanTypeActionHelper {

  @Override
  BeanTreePath getActionBeanPath(BeanTreePath beanTreePath) {
    // beanTreePath = DomainRuntime.CombinedServerRuntimes.<server>.ServerRuntime.<rest of path>
    // unfabricated = DomainRuntime.ServerRuntimes.<server>.<rest of path>
    List<String> components = beanTreePath.getPath().getComponents();
    Path actionBeanPath = new Path();
    for (int i = 0; i < components.size(); i++) {
      String component = components.get(i);
      if (i == 1) {
        // ComponentRuntimes -> ServerRuntimes
        actionBeanPath.addComponent("ServerRuntimes");
      } else if (i == 3) {
        // Omit ServerRuntimes
      } else {
        // 0 = DomainRuntime, 2 = <server>, > 3 = <rest of path>
        // copy it over
        actionBeanPath.addComponent(component);
      }
    }
    return BeanTreePath.create(beanTreePath.getBeanRepo(), actionBeanPath);
  }
}
