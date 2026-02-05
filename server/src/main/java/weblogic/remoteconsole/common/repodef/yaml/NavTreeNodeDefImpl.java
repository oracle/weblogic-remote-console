// Copyright (c) 2021, 2025, Oracle and/or its affiliates.
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
    // Include the type to ensure uniqueness across different nav trees
    // since nodes with the same name may have different descriptions.
    // For root-level trees, disambiguate by using the page repo's root name
    // (e.g. DomainConfiguration, DomainRuntimeMonitoring) instead of the
    // root type name "root" to avoid cross-root key collisions.
    String typeOrRoot = getNavTreeDef().getTypeDef().getTypeName();
    if ("root".equals(typeOrRoot)) {
      typeOrRoot = getNavTreeDefImpl().getPageRepoDefImpl().getRootName();
    }
    return "navigation." + typeOrRoot + "." + getNodeName() + "." + key;
  }

  BeanChildNavTreeNodeDefImpl asChildNodeDefImpl() {
    return BeanChildNavTreeNodeDefImpl.class.cast(this);
  }
}
