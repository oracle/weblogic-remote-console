// Copyright (c) 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.customizers;

import java.util.ArrayList;
import java.util.List;

import weblogic.remoteconsole.common.repodef.BeanActionDef;
import weblogic.remoteconsole.common.repodef.BeanPropertyDef;
import weblogic.remoteconsole.common.repodef.BeanTypeDef;
import weblogic.remoteconsole.common.utils.Path;
import weblogic.remoteconsole.server.repo.BeanActionArg;
import weblogic.remoteconsole.server.repo.BeanReaderRepoSearchBuilder;
import weblogic.remoteconsole.server.repo.BeanReaderRepoSearchResults;
import weblogic.remoteconsole.server.repo.BeanSearchResults;
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

  public static Response<Value> forceShutdown(InvocationContext ic) {
    return delegateToServerLifeCycleRuntimeAction(ic, "forceShutdown");
  }

  public static Response<Value> restartSSL(InvocationContext ic) {
    return delegateToServerRuntimeAction(ic, "restartSSLChannels");
  }

  public static Response<Value> gracefulShutdown(InvocationContext ic) {
    // Get the configured timeout and whether to ignore sessions from the corresponding server mbean,
    // then invoke shutdown on the server lifecycle runtime mbean passing in those values.

    Response<Value> response = new Response<>();
    BeanTypeDef serverMBeanTypeDef =
      ic.getPageRepo().getBeanRepo().getBeanRepoDef().getTypeDef("ServerMBean");
    BeanPropertyDef timeoutPropertyDef =
      serverMBeanTypeDef.getPropertyDef(new Path("GracefulShutdownTimeout"));
    BeanPropertyDef ignoreSessionsPropertyDef =
      serverMBeanTypeDef.getPropertyDef(new Path("IgnoreSessionsDuringShutdown"));
    Response<BeanSearchResults> searchResponse =
      getServerConfigurationProperties(
        ic,
        timeoutPropertyDef,
        ignoreSessionsPropertyDef
      );
    if (!searchResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(searchResponse);
    }
    BeanSearchResults searchResults = searchResponse.getResults();
    BeanTreePath realPath = getRealBeanTreePath(ic, "DomainRuntime.ServerLifeCycleRuntimes");
    BeanActionDef actionDef =
      realPath.getTypeDef().getActionDef(new Path("shutdown_timeout_ignoreSessions"));
    List<BeanActionArg> args = new ArrayList<>();
    args.add(
      new BeanActionArg(
        actionDef.getParamDef("timeout"),
        getServerPropertyValue(searchResults, timeoutPropertyDef)
      )
    );
    args.add(
      new BeanActionArg(
        actionDef.getParamDef("ignoreSessions"),
        getServerPropertyValue(searchResults, ignoreSessionsPropertyDef)
      )
    );
    return ic.getPageRepo().getBeanRepo().asBeanReaderRepo().invokeAction(ic, realPath, actionDef, args);
  }

  /*
   * Get some configuration properties for the server corresponding to the
   * ServerLifeCycleRuntimeMBean the user invoked.
   * 404s if the server doesn't exist
   */
  private static Response<BeanSearchResults> getServerConfigurationProperties(
    InvocationContext ic,
    BeanPropertyDef... serverPropertyDefs
  ) {
    Response<BeanSearchResults> response = new Response<>();
    // Don't return whether properties are set.
    BeanReaderRepoSearchBuilder builder =
      ic.getPageRepo().getBeanRepo().asBeanReaderRepo().createSearchBuilder(ic, false);
    BeanTreePath serverBeanPath =
      BeanTreePath.create(
        ic.getBeanTreePath().getBeanRepo(),
        new Path("Domain.Servers." + getServerName(ic))
      );
    for (BeanPropertyDef serverPropertyDef : serverPropertyDefs) {
      builder.addProperty(serverBeanPath, serverPropertyDef);
    }
    Response<BeanReaderRepoSearchResults> searchResponse = builder.search();
    if (!searchResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(searchResponse);
    }
    BeanSearchResults serverResults = searchResponse.getResults().getBean(serverBeanPath);
    if (serverResults != null) {
      response.setSuccess(serverResults);
    } else {
      // the server doesn't exist
      response.setNotFound();
    }
    return response;
  }

  /**
   * Get a server mbean property value from the search results.
   */
  private static Value getServerPropertyValue(BeanSearchResults searchResults, BeanPropertyDef propertyDef) {
    Value value = searchResults.getValue(propertyDef);
    if (value == null) {
      throw new AssertionError("Couldn't find value for " + propertyDef.getPropertyPath());
    }
    return value;
  }

  private static Response<Value> delegateToServerLifeCycleRuntimeAction(InvocationContext ic, String action) {
    return delegateAction(ic, "DomainRuntime.ServerLifeCycleRuntimes", action);
  }

  private static Response<Value> delegateToServerRuntimeAction(InvocationContext ic, String action) {
    return delegateAction(ic, "DomainRuntime.ServerRuntimes", action);
  }

  private static Response<Value> delegateAction(InvocationContext ic, String realCollection, String action) {
    BeanTreePath realPath = getRealBeanTreePath(ic, realCollection);
    return
      ic.getPageRepo().getBeanRepo().asBeanReaderRepo().invokeAction(
        ic,
        realPath,
        realPath.getTypeDef().getActionDef(new Path(action)),
        new ArrayList<>() // no args
      );
  }

  private static BeanTreePath getRealBeanTreePath(InvocationContext ic, String realCollection) {
    // The bean path for the real runtime mbean to invoke is either
    // DomainRuntime/ServerRuntimes or ServerLifeCycleRuntimes/serverName
    return
      BeanTreePath.create(
        ic.getBeanTreePath().getBeanRepo(),
        new Path(realCollection + "." + getServerName(ic))
      );
  }

  private static String getServerName(InvocationContext ic) {
    // The bean path the user invoked is DomainRuntime/CombinedServerRuntimes/serverName
    // Extract the server name from it
    return ic.getBeanTreePath().getSegments().get(1).getKey();
  }
}
