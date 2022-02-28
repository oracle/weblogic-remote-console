// Copyright (c) 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.customizers;

import java.util.ArrayList;

import weblogic.remoteconsole.common.utils.Path;
import weblogic.remoteconsole.server.repo.BeanActionArg;
import weblogic.remoteconsole.server.repo.BeanTreePath;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.Response;
import weblogic.remoteconsole.server.repo.Value;

/** 
 * Custom code for processing the CombinedServerRuntimeMBean 
 */
public class CombinedServerRuntimeMBeanCustomizer {

  private CombinedServerRuntimeMBeanCustomizer() {
  }

  public static Response<Value> start(InvocationContext ic) {
    return delegateToServerLifeCycleRuntimeAction(ic, "start");
  }

  public static Response<Value> resume(InvocationContext ic) {
    return delegateToServerLifeCycleRuntimeAction(ic, "resume");
  }

  public static Response<Value> suspend(InvocationContext ic) {
    return delegateToServerLifeCycleRuntimeAction(ic, "suspend");
  }

  public static Response<Value> forceSuspend(InvocationContext ic) {
    return delegateToServerLifeCycleRuntimeAction(ic, "forceSuspend");
  }

  public static Response<Value> gracefulShutdown(InvocationContext ic) {
    return delegateToServerLifeCycleRuntimeAction(ic, "gracefulShutdown");
  }

  public static Response<Value> forceShutdown(InvocationContext ic) {
    return delegateToServerLifeCycleRuntimeAction(ic, "forceShutdown");
  }

  public static Response<Value> restartSSL(InvocationContext ic) {
    return delegateToServerRuntimeAction(ic, "restartSSLChannels");
  }

  private static Response<Value> delegateToServerLifeCycleRuntimeAction(
    InvocationContext ic,
    String action
  ) {
    return delegateAction(ic, "DomainRuntime.ServerLifeCycleRuntimes", action);
  }

  private static Response<Value> delegateToServerRuntimeAction(
    InvocationContext ic,
    String action
  ) {
    return delegateAction(ic, "DomainRuntime.ServerRuntimes", action);
  }

  private static Response<Value> delegateAction(
    InvocationContext ic,
    String realCollection,
    String action
  ) {
    // invoke the action on the corresponding ServerLifeCycleRuntimeMBean

    // The bean path the user invoked is DomainRuntime/CombinedServerRuntimes/serverName
    // Extract the server name from it
    String server = ic.getBeanTreePath().getSegments().get(1).getKey();

    // The bean path for the server runtime mbean is DomainRuntime/ServerRuntimes/serverName
    BeanTreePath realPath =
      BeanTreePath.create(
        ic.getBeanTreePath().getBeanRepo(),
        new Path(realCollection + "." + server)
      );

    return
      ic.getPageRepo().getBeanRepo().asBeanReaderRepo().invokeAction(
        ic,
        realPath,
        realPath.getTypeDef().getActionDef(new Path(action)),
        new ArrayList<BeanActionArg>() // no args
      );
  }
}
