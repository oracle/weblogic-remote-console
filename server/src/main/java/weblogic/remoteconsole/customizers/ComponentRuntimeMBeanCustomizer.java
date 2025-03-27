// Copyright (c) 2024, 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.customizers;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import weblogic.console.utils.Path;
import weblogic.remoteconsole.common.repodef.BeanActionDef;
import weblogic.remoteconsole.server.repo.BeanActionArg;
import weblogic.remoteconsole.server.repo.BeanTreePath;
import weblogic.remoteconsole.server.repo.BooleanValue;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.SettableValue;
import weblogic.remoteconsole.server.repo.StringValue;

/*
 * Custom code for processing ComponentRuntimeMBean
 */
public class ComponentRuntimeMBeanCustomizer {

  private static final String SERVERNAME_TO_SERVERHTTPURL = "ServerNameToServerHttpURL";

  private ComponentRuntimeMBeanCustomizer() {
  }

  public static SettableValue getContextRootURL(
    InvocationContext ic,
    @Source(property = "ContextRoot") SettableValue contextRootAsSettable
  ) {
    if (contextRootAsSettable == null) {
      return null;
    }
    String server = ic.getBeanTreePath().getSegments().get(1).getKey();
    String contextRoot = contextRootAsSettable.getValue().asString().getValue();
    String serverHttpURL = getServerHttpURL(ic, server);
    String contextRootURL = getServerChildHttpURL(serverHttpURL, contextRoot);
    return new SettableValue(new StringValue(contextRootURL));
  }

  private static String getServerChildHttpURL(String serverHttpURL, String childURI) {
    // The server url might include a uri prefix, and so might the child uri. That won't do.
    String uriPrefix = getURIPrefix(serverHttpURL);
    if (uriPrefix != null) {
      if (childURI.startsWith(uriPrefix)) {
        childURI = childURI.substring(uriPrefix.length());
      }
    }
    return serverHttpURL + childURI;
  }

  private static String getURIPrefix(String url) {
    String uriPrefix = null;
    int startIdx = url.indexOf("://");
    if (startIdx > 0) {
      int uriStartIdx = 0;
      if (url.length() > startIdx + 3) {
        uriStartIdx = url.indexOf("/", startIdx + 3);
      }
      if (uriStartIdx > startIdx + 3) {
        uriPrefix = url.substring(uriStartIdx);
      }
    }
    return uriPrefix;
  }

  @SuppressWarnings("unchecked")
  private static String getServerHttpURL(InvocationContext ic, String serverName) {
    if (!ic.getCache().containsKey(SERVERNAME_TO_SERVERHTTPURL)) {
      ic.getCache().put(SERVERNAME_TO_SERVERHTTPURL, new ConcurrentHashMap<String,String>());
    }
    Map<String,String> serverNameToServerHttpURL =
      (Map<String,String>)ic.getCache().get(SERVERNAME_TO_SERVERHTTPURL);
    if (!serverNameToServerHttpURL.containsKey(serverName)) {
      String serverHttpURL = computeServerHttpURL(ic, serverName);
      serverNameToServerHttpURL.put(serverName, serverHttpURL);
    }
    return serverNameToServerHttpURL.get(serverName);
  }

  private static String computeServerHttpURL(InvocationContext ic, String serverName) {
    BeanTreePath domainRtBTP =
      BeanTreePath.create(ic.getBeanTreePath().getBeanRepo(), new Path("DomainRuntime"));
    InvocationContext domainRtIC = new InvocationContext(ic, domainRtBTP);
    BeanActionDef actionDef =
      domainRtIC.getBeanTreePath().getTypeDef().getActionDef(new Path("getServerHttpURL"));
    List<BeanActionArg> args =
      List.of(
        new BeanActionArg(actionDef.getParamDef("serverName"), new StringValue(serverName)),
        new BeanActionArg(actionDef.getParamDef("admin"), new BooleanValue(false))
      );
    return
      domainRtIC.getPageRepo().getBeanRepo().asBeanReaderRepo().invokeAction(
        domainRtIC,
        actionDef,
        args
      )
      .getResults().asString().getValue();
  }
}
