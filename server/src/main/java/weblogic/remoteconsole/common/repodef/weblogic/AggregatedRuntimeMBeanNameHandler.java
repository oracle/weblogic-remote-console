// Copyright (c) 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.weblogic;

import weblogic.remoteconsole.common.utils.Path;
import weblogic.remoteconsole.server.repo.BeanTreePath;

/**
 * Used for dealing with fabricated runtime mbeans that aggregate their
 * corresponding per-server runtime mbeans.
 */
public class AggregatedRuntimeMBeanNameHandler extends FabricatedRuntimeMBeanNameHandler {

  public static final AggregatedRuntimeMBeanNameHandler INSTANCE = new AggregatedRuntimeMBeanNameHandler();

  private AggregatedRuntimeMBeanNameHandler() {
    super("Aggregated");
  }

  public boolean isAggregatedBeanTreePath(BeanTreePath btp) {
    Path path = btp.getPath();
    return
      path.length() > 1
        && AggregatedRuntimeMBeanNameHandler.INSTANCE.isFabricatedName(path.getComponents().get(1));
  }

  public BeanTreePath getUnaggregatedBeanTreePath(BeanTreePath btp) {
    Path path = btp.getPath(); // DomainRuntime.AggregatedFoo.Bar.Bazz
    if (path.length() < 2 || !isFabricatedName(path.getComponents().get(1))) {
      // not aggregated - return it as-is
      return btp;
    }
    String aggChild = path.getComponents().get(1); // AggregatedFoo
    Path restOfAggPath = path.subPath(2, path.length()); // Bar.Bazz
    String unaggChild = getUnfabricatedName(aggChild); // Foo
    Path serverRelativeUnaggPath = (new Path(unaggChild)).childPath(restOfAggPath); // Foo.Bar.Bazz
    return
      BeanTreePath.create(
        btp.getBeanRepo(),
        new Path("DomainRuntime.CombinedServerRuntimes") // Domain.CombinedServerRuntimes.*
      )
        .childPath(new Path("ServerRuntime"))            // Domain.CombinedServerRuntimes.*.ServerRuntime
        .childPath(serverRelativeUnaggPath);             // Domain.CombinedServerRuntimes.*.ServerRuntime.Foo.Bar.Bazz
  }

  public BeanTreePath getUnfabricatedBeanTreePath(BeanTreePath aggBeanTreePath) {
    Path aggPath = aggBeanTreePath.getPath(); // DomainRuntime.AggregatedFoo.Bar.Bazz
    String aggChild = aggPath.getComponents().get(1); // AggregatedFoo
    Path restOfAggPath = aggPath.subPath(2, aggPath.length()); // Bar.Bazz
    String unaggChild = getUnfabricatedName(aggChild); // Foo
    Path serverRelativeUnaggPath = (new Path(unaggChild)).childPath(restOfAggPath); // Foo.Bar.Bazz
    return
      BeanTreePath.create(
        aggBeanTreePath.getBeanRepo(),
        new Path("DomainRuntime.ServerRuntimes") // Domain.ServerRuntimes.*
      )
        .childPath(serverRelativeUnaggPath);     // Domain.ServerRuntimes.*.Foo.Bar.Bazz
  }
}
