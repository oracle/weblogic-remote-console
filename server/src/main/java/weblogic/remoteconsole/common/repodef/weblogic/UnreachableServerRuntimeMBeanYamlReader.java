// Copyright (c) 2022, 2023, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.weblogic;

/**
 * Dynamically creates the yaml that describes the pages and types for a
 * fabricated UnreachableServerRuntimeMBean for a server that is not
 * currently running.
 * 
 * It parents a DelegatedServerLifeCycleRuntimeServerLifeCycleRuntimeMBean.
 */
class UnreachableServerRuntimeMBeanYamlReader extends CombinedServerRuntimeMBeanYamlReader {

  UnreachableServerRuntimeMBeanYamlReader(WebLogicYamlReader yamlReader) {
    super(yamlReader);
  }

  @Override
  protected String getDelegatedType() {
    return "ServerLifeCycleRuntimeMBean";
  }

  @Override
  protected String getDelegatedProperty() {
    return "ServerLifeCycleRuntime";
  }
}
