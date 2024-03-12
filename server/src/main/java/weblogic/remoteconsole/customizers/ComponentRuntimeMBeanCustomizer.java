// Copyright (c) 2024, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.customizers;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import weblogic.remoteconsole.common.repodef.BeanActionDef;
import weblogic.remoteconsole.common.utils.Path;
import weblogic.remoteconsole.server.repo.BeanActionArg;
import weblogic.remoteconsole.server.repo.BeanTreePath;
import weblogic.remoteconsole.server.repo.BooleanValue;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.Response;
import weblogic.remoteconsole.server.repo.SettableValue;
import weblogic.remoteconsole.server.repo.StringValue;
import weblogic.remoteconsole.server.repo.Value;

/*
 * Custom code for processing ComponentRuntimeMBean
 */
public class ComponentRuntimeMBeanCustomizer {

  private static final String SERVERNAME_TO_SERVERHTTPURL = "ServerNameToServerHttpURL";

  private ComponentRuntimeMBeanCustomizer() {
  }

  public static Response<SettableValue> getContextRootURL(
    InvocationContext ic,
    @Source(property = "ContextRoot") SettableValue contextRootAsSettable
  ) {
    Response<SettableValue> response = new Response<>();
    if (contextRootAsSettable == null) {
      return response.setSuccess(null);
    }
    String server = ic.getBeanTreePath().getSegments().get(1).getKey();
    String contextRoot = contextRootAsSettable.getValue().asString().getValue();
    Response<String> getResponse = getServerHttpURL(ic, server);
    if (!getResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(getResponse);
    }
    String serverHttpURL = getResponse.getResults();
    String contextRootURL = getServerChildHttpURL(serverHttpURL, contextRoot);
    SettableValue rtn = new SettableValue(new StringValue(contextRootURL));
    return response.setSuccess(rtn);
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
  private static Response<String> getServerHttpURL(InvocationContext ic, String serverName) {
    Response<String> response = new Response<>();
    if (!ic.getCache().containsKey(SERVERNAME_TO_SERVERHTTPURL)) {

      ic.getCache().put(SERVERNAME_TO_SERVERHTTPURL, new ConcurrentHashMap<String,String>());
    }
    Map<String,String> serverNameToServerHttpURL =
      (Map<String,String>)ic.getCache().get(SERVERNAME_TO_SERVERHTTPURL);
    if (!serverNameToServerHttpURL.containsKey(serverName)) {
      Response<String> computeResponse = computeServerHttpURL(ic, serverName);
      if (!computeResponse.isSuccess()) {
        return response.copyUnsuccessfulResponse(computeResponse);
      }
      String serverHttpURL = computeResponse.getResults();
      serverNameToServerHttpURL.put(serverName, serverHttpURL);
    }
    String serverHttpURL = serverNameToServerHttpURL.get(serverName);
    return response.setSuccess(serverHttpURL);
  }

  private static Response<String> computeServerHttpURL(InvocationContext ic, String serverName) {
    Response<String> response = new Response<>();
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
    Response<Value> getResponse =
      domainRtIC.getPageRepo().getBeanRepo().asBeanReaderRepo().invokeAction(
        domainRtIC,
        actionDef,
        args
      );
    if (!getResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(getResponse);
    }
    String serverHttpURL = getResponse.getResults().asString().getValue();
    return response.setSuccess(serverHttpURL);
  }
}
