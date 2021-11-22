// Copyright (c) 2020, 2021, Oracle and/or its affiliates.
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
 * Custom code for processing the ServerLifeCycleRuntimeMBean 
 */
public class ServerLifeCycleRuntimeMBeanCustomizer {

  private ServerLifeCycleRuntimeMBeanCustomizer() {
  }

  /**
   * Customize the ServerLifeCycleRuntimeMBean's restartSSL action
   */
  public static Response<Value> restartSSL(InvocationContext ic) {
    // invoke restartSSLChannels on the corresponding server runtime mbean

    // The bean path for the server runtime mbean is DomainRuntime/ServerRuntimes/serverName
    BeanTreePath serverRuntimeBeanPath =
      BeanTreePath.create(
        ic.getBeanTreePath().getBeanRepo(),
        new Path("DomainRuntime.ServerRuntimes." + getServerName(ic))
      );

    // This will 404 if the server runtime doesn't exist.
    // It's either because the server doesn't exist or the server isn't running.
    // Ideally, we should return a 404 if the server doesn't exist and
    // a 400 if the server isn't running.
    // That requires an extra call to see if the server exists.
    // Not worth it at this point.
    return
      ic.getPageRepo().getBeanRepo().asBeanReaderRepo().invokeAction(
        ic,
        serverRuntimeBeanPath,
        serverRuntimeBeanPath.getTypeDef().getActionDef(new Path("restartSSLChannels")),
        new ArrayList<BeanActionArg>() // no args
      );
  }

  /**
   * Customize the ServerLifeCycleRuntimeMBean's shutdown action
   */
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
    BeanActionDef actionDef =
      ic.getBeanTreePath().getTypeDef().getActionDef(new Path("shutdown_timeout_ignoreSessions"));
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
    response = ic.getPageRepo().getBeanRepo().asBeanReaderRepo().invokeAction(ic, actionDef, args);
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

  /*
   * Get the name of the server
   */
  private static String getServerName(InvocationContext ic) {
    // The bean path the user invoked is DomainRuntime/ServerLifeCycleRuntimes/serverName
    // Extract the server name from it
    return ic.getBeanTreePath().getSegments().get(1).getKey();
  }
}
