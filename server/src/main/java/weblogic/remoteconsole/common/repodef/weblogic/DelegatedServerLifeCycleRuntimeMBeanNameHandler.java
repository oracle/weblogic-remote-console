// Copyright (c) 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.weblogic;

import weblogic.remoteconsole.common.utils.Path;
import weblogic.remoteconsole.server.repo.BeanTreePath;

/**
 * Used for dealing with fabricated runtime mbeans that delegate to a corresponding
 * ServerLifeCycleRuntimeMBean or one of its children.
 */
public class DelegatedServerLifeCycleRuntimeMBeanNameHandler extends FabricatedRuntimeMBeanNameHandler {

  public static final DelegatedServerLifeCycleRuntimeMBeanNameHandler INSTANCE =
    new DelegatedServerLifeCycleRuntimeMBeanNameHandler();

  private DelegatedServerLifeCycleRuntimeMBeanNameHandler() {
    super("DelegatedServerLifeCycleRuntime");
  }

  public BeanTreePath getUnfabricatedBeanTreePath(BeanTreePath delBeanTreePath) {
    Path delPath = delBeanTreePath.getPath(); // DomainRuntime.CombinedServerRuntimes.A.ServerLifeCycleRuntime.B.C
    String server = delPath.getComponents().get(2); // A
    Path restOfDelPath = delPath.subPath(4, delPath.length()); // B.C
    Path undelPath = new Path("DomainRuntime.ServerLifeCycleRuntimes"); // DomainRuntime.ServerLifeCyceRuntimes
    undelPath.addComponent(server); // DomainRuntime.ServerLifeCycleRuntimes.A
    undelPath.addPath(restOfDelPath); // DomainRuntime.ServerLifeCycleRuntimes.A.B.C
    return BeanTreePath.create(delBeanTreePath.getBeanRepo(), undelPath);
  }
}
