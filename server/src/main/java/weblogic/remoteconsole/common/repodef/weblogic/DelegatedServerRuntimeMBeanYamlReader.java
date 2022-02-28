// Copyright (c) 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.weblogic;

/**
/**
 * Dynamically creates the yaml that describes the pages and types
 * for a tree of beans that delegate to a ServerLifeRuntimeMBean
 * and its children.
 * 
 * For example, the underlying mbeans look like:
 * 
 * DomainRuntime
 *   ServerRuntimes
 *     Server1
 *       ApplicationRuntimes
 *         App1
 *
 * The bean tree that the user sees looks like:
 * 
 * DomainRuntime
 *   CombinedServerRuntimes
 *     Server1
 *       ServerRuntime
 *       - fabricated DelegatedServerRuntimeServerLifeCycleMBean
 *       - delegates to DomainRuntime.ServerRuntimes.Server1
 *         ApplicationRuntimes
 *           App1
 *            - fabricated DelegatedServerRuntimeApplicationRuntimeMBean
 *            - delegates to DomainRuntime.ServerRuntimes.Server1.ApplicationRuntimes.App1
 */
class DelegatedServerRuntimeMBeanYamlReader extends DelegatedRuntimeMBeanYamlReader {

  DelegatedServerRuntimeMBeanYamlReader(WebLogicYamlReader yamlReader) {
    super(yamlReader, DelegatedServerRuntimeMBeanNameHandler.INSTANCE);
  }

  // TBD - return the SRT plus SLCRT nav tree nodes
}
