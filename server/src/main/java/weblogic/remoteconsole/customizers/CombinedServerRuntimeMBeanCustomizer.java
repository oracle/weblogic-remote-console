// Copyright (c) 2022, 2024, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.customizers;

import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;

import weblogic.remoteconsole.common.repodef.BeanActionDef;
import weblogic.remoteconsole.common.repodef.BeanPropertyDef;
import weblogic.remoteconsole.common.repodef.PageActionDef;
import weblogic.remoteconsole.common.utils.Path;
import weblogic.remoteconsole.common.utils.StringUtils;
import weblogic.remoteconsole.server.repo.BeanActionArg;
import weblogic.remoteconsole.server.repo.BeanReaderRepoSearchBuilder;
import weblogic.remoteconsole.server.repo.BeanReaderRepoSearchResults;
import weblogic.remoteconsole.server.repo.BeanSearchResults;
import weblogic.remoteconsole.server.repo.BeanTreePath;
import weblogic.remoteconsole.server.repo.FormProperty;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.Response;
import weblogic.remoteconsole.server.repo.Value;
import weblogic.remoteconsole.server.webapp.BaseResource;

/** 
 * Custom code for processing the CombinedServerRuntimeMBean 
 */
public class CombinedServerRuntimeMBeanCustomizer {

  private static final Logger LOGGER = Logger.getLogger(CombinedServerRuntimeMBeanCustomizer.class.getName());

  private CombinedServerRuntimeMBeanCustomizer() {
  }

  // Customize the collection's JAXRS resource
  public static BaseResource createResource(InvocationContext ic) {
    if (ic.getBeanTreePath().isCollection()) {
      return new CombinedServerRuntimeMBeanCollectionResource();
    } else {
      return null;
    }
  }

  public static Value start(
    InvocationContext ic,
    PageActionDef pageActionDef,
    List<FormProperty> formProperties
  ) {
    return delegateToServerLifeCycleRuntimeAction(ic, "start").getResults();
  }

  public static Value resume(
    InvocationContext ic,
    PageActionDef pageActionDef,
    List<FormProperty> formProperties
  ) {
    return delegateToServerLifeCycleRuntimeAction(ic, "resume").getResults();
  }

  public static Value suspend(
    InvocationContext ic,
    PageActionDef pageActionDef,
    List<FormProperty> formProperties
  ) {
    return delegateToServerLifeCycleRuntimeAction(ic, "suspend").getResults();
  }

  public static Value forceSuspend(
    InvocationContext ic,
    PageActionDef pageActionDef,
    List<FormProperty> formProperties
  ) {
    return delegateToServerLifeCycleRuntimeAction(ic, "forceSuspend").getResults();
  }

  public static Value restartSSL(
    InvocationContext ic,
    PageActionDef pageActionDef,
    List<FormProperty> formProperties
  ) {
    return delegateToServerRuntimeAction(ic, "restartSSLChannels").getResults();
  }

  public static Value publishSingleSignOnServices(
    InvocationContext ic,
    PageActionDef pageActionDef,
    List<FormProperty> formProperties
  ) {
    return
      delegateAction(ic,
      "DomainRuntime.ServerRuntimes",
      "SingleSignOnServicesRuntime",
      "publish",
      formProperties
    ).getResults();
  }

  public static Value forceShutdown(
    InvocationContext ic,
    PageActionDef pageActionDef,
    List<FormProperty> formProperties
  ) {
    boolean adminServer = isAdminServer(ic, getShutdownProperties(ic, true));
    return
      getShutdownResponse(
        delegateToServerLifeCycleRuntimeAction(ic, "forceShutdown"),
        adminServer
      );
  }

  public static Value shutdown(
    InvocationContext ic,
    PageActionDef pageActionDef,
    List<FormProperty> formProperties
  ) {
    // Get the configured timeout and whether to ignore sessions from the corresponding server mbean,
    // then invoke shutdown on the server lifecycle runtime mbean passing in those values.
    BeanReaderRepoSearchResults searchResults = getShutdownProperties(ic, false);
    BeanSearchResults serverResults = searchResults.getBean(getServerBeanPath(ic));
    if (serverResults == null) {
      throw Response.notFoundException();
    }
    boolean adminServer = isAdminServer(ic, searchResults);
    BeanTreePath realPath = getRealBeanTreePath(ic, "DomainRuntime.ServerLifeCycleRuntimes", "");
    BeanActionDef actionDef =
      realPath.getTypeDef().getActionDef(new Path("shutdown_timeout_ignoreSessions"));
    List<BeanActionArg> args = List.of(
      new BeanActionArg(
        actionDef.getParamDef("timeout"),
        getRequiredPropertyValue(serverResults, getGracefulShutdownTimeoutPropertyDef(ic))
      ),
      new BeanActionArg(
        actionDef.getParamDef("ignoreSessions"),
        getRequiredPropertyValue(serverResults, getIgnoreSessionsDuringShutdownPropertyDef(ic))
      )
    );
    return
      getShutdownResponse(
        ic.getPageRepo().getBeanRepo().asBeanReaderRepo().invokeAction(ic, realPath, actionDef, args),
        adminServer
      );
  }

  private static Value getShutdownResponse(Response<Value> invokeResponse, boolean adminServer) {
    if (adminServer) {
      // The basic flow is:
      // a) the CBE makes a REST API call to the admin server to shutdown the admin server
      // b) WLS calls the REST api impl
      // c) the REST api impl calls the mbean api to shutdown the admin server (it returns a task)
      // d) the REST api impl polls the returned task to see when it completes for up to 2 seconds
      // e) the REST api impl returns a response
      // f) the admin server sends the response to the client
      //
      // The admin server can shut down anytime after (c).
      // Various responses can come back depending on that timing, for example:
      // a) 200 with a warning message that the task is null
      // b) 200 with no messages
      // c) 400
      // d) 500
      // e) 503
      //
      // Just swallow the actual response and return a normal 200.
      if (!invokeResponse.isSuccess() || !invokeResponse.getMessages().isEmpty()) {
        LOGGER.finest(
          "Ignoring timing-related issues shutting down the admin server."
          + " status: " + invokeResponse.getStatus()
          + " messages: " + invokeResponse.getMessages()
        );
      }
      return null;
    }
    return invokeResponse.getResults();
  }

  private static BeanReaderRepoSearchResults getShutdownProperties(
    InvocationContext ic,
    boolean isForceShutdown
  ) {
    // Don't return whether properties are set.
    BeanReaderRepoSearchBuilder builder =
      ic.getPageRepo().getBeanRepo().asBeanReaderRepo().createSearchBuilder(ic, false);
    builder.addProperty(getDomainBeanPath(ic), getAdminServerNamePropertyDef(ic));
    if (!isForceShutdown) {
      builder.addProperty(getServerBeanPath(ic), getGracefulShutdownTimeoutPropertyDef(ic));
      builder.addProperty(getServerBeanPath(ic), getIgnoreSessionsDuringShutdownPropertyDef(ic));
    }
    return builder.search().getResults();
  }

  private static boolean isAdminServer(InvocationContext ic, BeanReaderRepoSearchResults searchResults) {
    BeanSearchResults domainResults = searchResults.getBean(getDomainBeanPath(ic));
    if (domainResults == null) {
      throw new AssertionError("Couldn't find domain bean results");
    }
    String adminServerName =
      getRequiredPropertyValue(domainResults, getAdminServerNamePropertyDef(ic)).asString().getValue();
    return getServerName(ic).equals(adminServerName);
  }

  private static BeanPropertyDef getAdminServerNamePropertyDef(InvocationContext ic) {
    return getDomainBeanPath(ic).getTypeDef().getPropertyDef(new Path("AdminServerName"));
  }

  private static BeanPropertyDef getGracefulShutdownTimeoutPropertyDef(InvocationContext ic) {
    return getServerBeanPath(ic).getTypeDef().getPropertyDef(new Path("GracefulShutdownTimeout"));
  }

  private static BeanPropertyDef getIgnoreSessionsDuringShutdownPropertyDef(InvocationContext ic) {
    return getServerBeanPath(ic).getTypeDef().getPropertyDef(new Path("IgnoreSessionsDuringShutdown"));
  }

  private static BeanTreePath getDomainBeanPath(InvocationContext ic) {
    return BeanTreePath.create(ic.getBeanTreePath().getBeanRepo(), new Path("Domain"));
  }

  private static BeanTreePath getServerBeanPath(InvocationContext ic) {
    return BeanTreePath.create(ic.getBeanTreePath().getBeanRepo(), new Path("Domain.Servers." + getServerName(ic)));
  }

  private static Value getRequiredPropertyValue(BeanSearchResults searchResults, BeanPropertyDef propertyDef) {
    Value value = searchResults.getValue(propertyDef);
    if (value == null) {
      throw new AssertionError("Couldn't find value for " + propertyDef.getPropertyPath());
    }
    return value;
  }

  private static Response<Value> delegateToServerLifeCycleRuntimeAction(InvocationContext ic, String action) {
    return delegateAction(ic, "DomainRuntime.ServerLifeCycleRuntimes", "", action, List.of());
  }

  private static Response<Value> delegateToServerRuntimeAction(InvocationContext ic, String action) {
    return delegateAction(ic, "DomainRuntime.ServerRuntimes", "", action, List.of());
  }

  private static Response<Value> delegateAction(
    InvocationContext ic,
    String realCollection,
    String singletonChild,
    String action,
    List<FormProperty> pageArgs
  ) {
    BeanTreePath realPath = getRealBeanTreePath(ic, realCollection, singletonChild);
    List<BeanActionArg> beanArgs = new ArrayList<>();
    for (FormProperty pageArg : pageArgs) {
      beanArgs.add(
        new BeanActionArg(
          pageArg.getFieldDef().asBeanActionParamDef(),
          pageArg.getValue().asSettable().getValue()
        )
      );
    }
    return
      ic.getPageRepo().getBeanRepo().asBeanReaderRepo().invokeAction(
        ic,
        realPath,
        realPath.getTypeDef().getActionDef(new Path(action)),
        beanArgs
      );
  }

  private static BeanTreePath getRealBeanTreePath(
    InvocationContext ic,
    String realCollection,
    String singletonChild
  ) {
    // The bean path for the real runtime mbean to invoke is either
    // DomainRuntime/ServerRuntimes or ServerLifeCycleRuntimes/serverName
    StringBuilder sb = new StringBuilder();
    sb.append(realCollection).append(".").append(getServerName(ic));
    if (!StringUtils.isEmpty(singletonChild)) {
      sb.append(".").append(singletonChild);
    }
    return BeanTreePath.create(ic.getBeanTreePath().getBeanRepo(),new Path(sb.toString()));
  }

  private static String getServerName(InvocationContext ic) {
    // The bean path the user invoked is DomainRuntime/CombinedServerRuntimes/serverName
    // Extract the server name from it
    return ic.getBeanTreePath().getSegments().get(1).getKey();
  }
}
