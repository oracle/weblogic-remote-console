// Copyright (c) 2025, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.customizers;

import weblogic.remoteconsole.server.repo.IntValue;
import weblogic.remoteconsole.server.repo.SettableValue;

/**
 * Custom code for processing the ThreadPoolRuntimeMBean
 */
public class ThreadPoolRuntimeMBeanCustomizer {

  private ThreadPoolRuntimeMBeanCustomizer() {
  }

  public static SettableValue getExecuteThreadActiveCount(
    weblogic.remoteconsole.server.repo.InvocationContext ic,
    @Source(property = "ExecuteThreadTotalCount") SettableValue total,
    @Source(property = "ExecuteThreadIdleCount") SettableValue idle,
    @Source(property = "StandbyThreadCount") SettableValue standby,
    @Source(property = "StuckThreadCount") SettableValue stuck
  ) {
    if (total == null) {
      // Dashboards and searches can't handle custom properties.
      // We can detect this scenario because the values sent into
      // this method are null.
      return null;
    }
    int inactive = toInt(idle) + toInt(standby) + toInt(stuck);
    int active = toInt(total) - inactive;
    return new SettableValue(new IntValue(active));
  }

  private static int toInt(SettableValue value) {
    return value.getValue().asInt().getValue();
  }
}
