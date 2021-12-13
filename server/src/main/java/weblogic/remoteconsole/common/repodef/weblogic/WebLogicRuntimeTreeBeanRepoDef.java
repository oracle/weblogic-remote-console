// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.weblogic;

import weblogic.remoteconsole.common.utils.WebLogicMBeansVersion;

/**
 * Defines the bean types for an admin server connection's runtime mbean tree.
 * It has two roots.
 * 
 * The DomainMBean is a tree of read-only mbeans that describe the configuration
 * that the admin server is currently using.
 *
 * The DomainRuntimeMBean is a tree of runtime mbeans that describe and
 * manage the running state of all the servers in the domain.
 */
public class WebLogicRuntimeTreeBeanRepoDef extends WebLogicBeanRepoDef {

  @Override
  protected boolean isEditable() {
    return false;
  }

  @Override
  protected String[] getRootChildNames() {
    return new String[] { "DomainMBean", "DomainRuntimeMBean" };
  }

  public WebLogicRuntimeTreeBeanRepoDef(WebLogicMBeansVersion mbeansVersion) {
    super(mbeansVersion);
    createRootTypeDefImpl();
  }
}
