// Copyright (c) 2023, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.customizers;

import java.util.List;

import weblogic.remoteconsole.common.repodef.LocalizedConstants;
import weblogic.remoteconsole.common.utils.Path;
import weblogic.remoteconsole.server.repo.BeanActionArg;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.Response;
import weblogic.remoteconsole.server.repo.SettableValue;
import weblogic.remoteconsole.server.repo.StringValue;
import weblogic.remoteconsole.server.repo.Value;

/**
 * Custom code for processing the JDBCDataSourceRuntimeMBean
 */
public class JDBCDataSourceRuntimeMBeanCustomizer {
  private JDBCDataSourceRuntimeMBeanCustomizer() {
  }

  public static Response<SettableValue> getTestResults(
    InvocationContext ic
  ) {
    Response<SettableValue> response = new Response<>();
    List<BeanActionArg> args = List.of();
    Response<Value> testResponse =
      ic.getBeanTreePath().getBeanRepo().asBeanReaderRepo().invokeAction(
        ic,
        ic.getBeanTreePath().getTypeDef().getActionDef(new Path("testPool"), true),
        args
      );
    if (!testResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(testResponse);
    }
    String testPoolResult = testResponse.getResults().asString().getValue();
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
    return response.setSuccess(new SettableValue(new StringValue(displayedResult), false));
  }
}
