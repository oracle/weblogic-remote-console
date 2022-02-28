// Copyright (c) 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.weblogic;

import weblogic.remoteconsole.server.repo.BeanTreePath;

/**
 * Used for dealing with the fabricated per server runtime mbeans that are parented by
 * fabricated aggregated runtime mbeans.
 */
public class PerServerRuntimeMBeanNameHandler extends FabricatedRuntimeMBeanNameHandler {

  public static final PerServerRuntimeMBeanNameHandler PER_SERVER = new PerServerRuntimeMBeanNameHandler();

  private PerServerRuntimeMBeanNameHandler() {
    super("PerServer");
  }

  @Override
  public BeanTreePath getUnfabricatedBeanTreePath(BeanTreePath aggBeanTreePath) {
    throw new AssertionError("TBD");
  }
}
