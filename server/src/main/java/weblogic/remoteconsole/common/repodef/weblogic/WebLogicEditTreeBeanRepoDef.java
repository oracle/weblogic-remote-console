// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.weblogic;

import weblogic.remoteconsole.common.utils.WebLogicMBeansVersion;

/**
 * Defines the bean types for an admin server connection's edit mbean tree.
 * It has one root.
 * 
 * The DomainMBean is a tree of editable mbeans that can be used to
 * change the domain's configuration.
 */
public class WebLogicEditTreeBeanRepoDef extends WebLogicBeanRepoDef {
  @Override
  protected boolean isEditable() {
    return true;
  }

  @Override
  protected String[] getRootChildNames() {
    return new String[] { "DomainMBean" };
  }

  public WebLogicEditTreeBeanRepoDef(WebLogicMBeansVersion mbeansVersion) {
    super(mbeansVersion);
    createRootTypeDefImpl();
  }
}
