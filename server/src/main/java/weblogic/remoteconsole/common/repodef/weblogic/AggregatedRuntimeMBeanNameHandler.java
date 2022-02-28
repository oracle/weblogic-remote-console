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

  public BeanTreePath getUnfabricatedBeanTreePath(BeanTreePath aggBeanTreePath) {
    Path aggPath = aggBeanTreePath.getPath(); // DomainRuntime.FabricatedFoo.Bar.Bazz
    String aggChild = aggPath.getComponents().get(1); // FabricatedFoo
    Path restOfAggPath = aggPath.subPath(2, aggPath.length()); // Bar.Bazz
    String unaggChild = getUnfabricatedName(aggChild); // Foo
    Path serverRelativeUnaggPath = (new Path(unaggChild)).childPath(restOfAggPath); // Foo.Bar.Bazz
    BeanTreePath serverRuntimes =
      BeanTreePath.create(aggBeanTreePath.getBeanRepo(), new Path("DomainRuntime.ServerRuntimes"));
    return serverRuntimes.childPath(serverRelativeUnaggPath); // Domain.ServerRuntimes.*.Foo.Bar.Bazz
  }
}
