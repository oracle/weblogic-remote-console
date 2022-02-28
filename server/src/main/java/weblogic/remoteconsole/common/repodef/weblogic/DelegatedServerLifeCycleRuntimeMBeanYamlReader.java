// Copyright (c) 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.weblogic;

/**
 * Dynamically creates the yaml that describes the pages and types
 * for a tree of beans that delegate to a ServerLifeCycleRuntimeMBean
 * and its children.
 * 
 * For example, the underlying mbeans look like:
 * 
 * DomainRuntime
 *   ServerLifeCycleRuntimes
 *     Server1
 *       Tasks
 *         Task1
 *
 * The bean tree that the user sees looks like:
 * 
 * DomainRuntime
 *   CombinedServerRuntimes
 *     Server1
 *       ServerLifeCycleRuntime
 *       - fabricated DelegatedServerLifeCycleRuntimeServerLifeCycleMBean
 *       - delegates to DomainRuntime.ServerLifeCycleRuntimes.Server1
 *         Tasks
 *           Task1
 *            - fabricated DelegatedServerLifeCycleRuntimeTaskRuntimeMBean
 *            - delegates to DomainRuntime.ServerLifeCycleRuntimes.Server1.Tasks
 */
class DelegatedServerLifeCycleRuntimeMBeanYamlReader extends DelegatedRuntimeMBeanYamlReader {

  DelegatedServerLifeCycleRuntimeMBeanYamlReader(WebLogicYamlReader yamlReader) {
    super(yamlReader, DelegatedServerLifeCycleRuntimeMBeanNameHandler.INSTANCE);
  }
}
