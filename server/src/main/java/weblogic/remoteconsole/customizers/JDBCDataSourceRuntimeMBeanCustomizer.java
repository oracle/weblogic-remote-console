// Copyright (c) 2023, 2025, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.customizers;

import java.util.List;

import weblogic.console.utils.Path;
import weblogic.remoteconsole.common.repodef.LocalizedConstants;
import weblogic.remoteconsole.server.repo.BeanActionArg;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.SettableValue;
import weblogic.remoteconsole.server.repo.StringValue;

/**
 * Custom code for processing the JDBCDataSourceRuntimeMBean
 */
public class JDBCDataSourceRuntimeMBeanCustomizer {
  private JDBCDataSourceRuntimeMBeanCustomizer() {
  }

  public static SettableValue getTestResults(InvocationContext ic) {
    List<BeanActionArg> args = List.of();
    String testPoolResult =
      ic.getBeanTreePath().getBeanRepo().asBeanReaderRepo().invokeAction(
        ic,
        ic.getBeanTreePath().getTypeDef().getActionDef(new Path("testPool"), true),
        args
      ).getResults().asString().getValue();
    // e.g.
    //   0 DomainRuntime/
    //   1 CombinedServerRuntimes/
    //   2 AdminServer/
    //   3 ServerRuntime/
    //   4 JDBCServiceRuntime/
    //   5 JDBCDataSourceRuntimeMBeans/
    //   6 derbyds
    Path path = ic.getBeanTreePath().getPath();
    String displayedResult = null;
    String serverName = path.getComponents().get(2);
    String dataSourceName = path.getComponents().get(6);
    if (testPoolResult == null) {
      displayedResult =
        ic.getLocalizer().localizeString(
          LocalizedConstants.DATA_SOURCE_TEST_POOL_SUCCESS,
          dataSourceName,
          serverName
        );
    } else {
      displayedResult =
        ic.getLocalizer().localizeString(
          LocalizedConstants.DATA_SOURCE_TEST_POOL_FAILURE,
          dataSourceName,
          serverName,
          testPoolResult
        );
    }
    return new SettableValue(new StringValue(displayedResult), false);
  }
}
