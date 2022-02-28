// Copyright (c) 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.weblogic;

import weblogic.remoteconsole.common.repodef.schema.NavTreeDefSource;

/**
 * Dynamically creates the yaml that describes the pages and types for a
 * fabricated RunningServerRuntimeMBean for a server that is currently
 * running.
 * 
 * It parents a DelegatedServerLifeCycleRuntimeServerLifeCycleRuntimeMBean
 * and a DelegatedServerRuntimeServerRuntimeMBean, that it, it pulls togther
 * the ServerLifeCycleRuntimeMBean and ServerRuntimeMBean for a running server.
 */
class RunningServerRuntimeMBeanYamlReader extends CombinedServerRuntimeMBeanYamlReader {

  RunningServerRuntimeMBeanYamlReader(WebLogicYamlReader yamlReader) {
    super(yamlReader);
  }

  @Override
  protected String getDelegatedType() {
    return "ServerRuntimeMBean";
  }

  @Override
  protected String getDelegatedProperty() {
    return "ServerRuntime";
  }

  @Override
  NavTreeDefSource getNavTreeDefSource(String type) {
    // Get just the delegated running server nodes
    NavTreeDefSource runningSource = super.getNavTreeDefSource(type);
    // Get just the delegated non-server nodes
    NavTreeDefSource notRunningSource = getYamlReader().getNavTreeDefSource("NotRunningServerRuntimeMBean");
    if (runningSource == null && notRunningSource == null) {
      // no nav tree nodes
      return null;
    }
    NavTreeDefSource source = new NavTreeDefSource();
    // add the delegated non-running server nodes first
    if (notRunningSource != null) {
      source.getContents().addAll(notRunningSource.getContents());
    }
    // then add the delegated running server nodes
    if (runningSource != null) {
      source.getContents().addAll(runningSource.getContents());
    }
    return source;
  }
}
