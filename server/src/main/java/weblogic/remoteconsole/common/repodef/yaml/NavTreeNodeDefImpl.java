// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.yaml;

import weblogic.remoteconsole.common.repodef.GroupNavTreeNodeDef;
import weblogic.remoteconsole.common.repodef.NavTreeDef;
import weblogic.remoteconsole.common.repodef.NavTreeNodeDef;
import weblogic.remoteconsole.common.repodef.schema.NavTreeNodeDefSource;

/**
 * yaml-based implementation of the NavTreeNodeDef interface.
 */
abstract class NavTreeNodeDefImpl implements NavTreeNodeDef {
  private NavTreeDefImpl navTreeDefImpl;
  private NavTreeNodeDefSource source;
  private GroupNavTreeNodeDefImpl groupNodeDefImpl;

  NavTreeNodeDefImpl(
    NavTreeDefImpl navTreeDefImpl,
    NavTreeNodeDefSource source,
    GroupNavTreeNodeDefImpl groupNodeDefImpl
  ) {
    this.navTreeDefImpl = navTreeDefImpl;
    this.source = source;
    this.groupNodeDefImpl = groupNodeDefImpl;
  }

  @Override
  public NavTreeDef getNavTreeDef() {
    return getNavTreeDefImpl();
  }

  protected NavTreeDefImpl getNavTreeDefImpl() {
    return this.navTreeDefImpl;
  }

  protected NavTreeNodeDefSource getSource() {
    return this.source;
  }

  GroupNavTreeNodeDefImpl getGroupNodeDefImpl() {
    return this.groupNodeDefImpl;
  }

  @Override
  public GroupNavTreeNodeDef getGroupNodeDef() {
    return getGroupNodeDefImpl();
  }

  protected String getLocalizationKey(String key) {
    // Don't include the type since the strings should be shared
    // across nodes if they happen to have the same text.
    return "navigation." + getNodeName() + "." + key;
  }

  BeanChildNavTreeNodeDefImpl asChildNodeDefImpl() {
    return BeanChildNavTreeNodeDefImpl.class.cast(this);
  }
}
