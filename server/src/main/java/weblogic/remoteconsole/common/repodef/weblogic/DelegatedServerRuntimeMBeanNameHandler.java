// Copyright (c) 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.weblogic;

import weblogic.remoteconsole.common.utils.Path;
import weblogic.remoteconsole.server.repo.BeanTreePath;

/**
 * Used for dealing with fabricated runtime mbeans that delegate to a corresponding
 * ServerRuntimeMBean or one of its children.
 */
public class DelegatedServerRuntimeMBeanNameHandler extends FabricatedRuntimeMBeanNameHandler {

  public static final DelegatedServerRuntimeMBeanNameHandler INSTANCE =
    new DelegatedServerRuntimeMBeanNameHandler();

  private DelegatedServerRuntimeMBeanNameHandler() {
    super("DelegatedServerRuntime");
  }

  public BeanTreePath getUnfabricatedBeanTreePath(BeanTreePath delBeanTreePath) {
    Path delPath = delBeanTreePath.getPath(); // DomainRuntime.CombinedServerRuntimes.A.ServerRuntime.B.C
    String server = delPath.getComponents().get(2); // A
    Path restOfDelPath = delPath.subPath(4, delPath.length()); // B.C
    Path undelPath = new Path("DomainRuntime.ServerRuntimes"); // DomainRuntime.ServerRuntimes
    undelPath.addComponent(server); // DomainRuntime.ServerRuntimes.A
    undelPath.addPath(restOfDelPath); // DomainRuntime.ServerRuntimes.A.B.C
    return BeanTreePath.create(delBeanTreePath.getBeanRepo(), undelPath);
  }
}
