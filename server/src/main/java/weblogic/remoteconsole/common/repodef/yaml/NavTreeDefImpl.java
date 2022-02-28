// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.yaml;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import weblogic.remoteconsole.common.repodef.BeanChildNavTreeNodeDef;
import weblogic.remoteconsole.common.repodef.BeanTypeDef;
import weblogic.remoteconsole.common.repodef.NavTreeDef;
import weblogic.remoteconsole.common.repodef.NavTreeNodeDef;
import weblogic.remoteconsole.common.repodef.PageRepoDef;
import weblogic.remoteconsole.common.repodef.schema.NavTreeDefSource;
import weblogic.remoteconsole.common.repodef.schema.NavTreeNodeDefSource;
import weblogic.remoteconsole.common.utils.Path;

/**
 * yaml-based implementation of the NavTreeDef interface.
 */
class NavTreeDefImpl implements NavTreeDef {
  private PageRepoDefImpl pageRepoDefImpl;
  private BaseBeanTypeDefImpl typeDefImpl;
  private NavTreeDefSource source;
  private List<NavTreeNodeDefImpl> contentDefImpls = new ArrayList<>();
  private List<NavTreeNodeDef> contentDefs;
  private Map<String,BeanChildNavTreeNodeDefImpl> childPathToNodeDefImplMap = new HashMap<>();
  private Map<String,NavTreeNodeDefImpl> navTreePathToNodeDefImplMap = new HashMap<>();

  NavTreeDefImpl(
    PageRepoDefImpl pageRepoDefImpl,
    NavTreeDefSource source,
    BaseBeanTypeDefImpl typeDefImpl
  ) {
    this.pageRepoDefImpl = pageRepoDefImpl;
    this.source = source;
    this.typeDefImpl = typeDefImpl;
    createNodeDefImpls();
  }

  PageRepoDefImpl getPageRepoDefImpl() {
    return this.pageRepoDefImpl;
  }

  @Override
  public PageRepoDef getPageRepoDef() {
    return getPageRepoDefImpl();
  }

  BaseBeanTypeDefImpl getTypeDefImpl() {
    return this.typeDefImpl;
  }

  @Override
  public BeanTypeDef getTypeDef() {
    return getTypeDefImpl();
  }
  
  private Map<String,BeanChildNavTreeNodeDefImpl> getChildPathToNodeDefImplMap() {
    return this.childPathToNodeDefImplMap;
  }

  private Map<String,NavTreeNodeDefImpl> getNavTreePathToNodeDefImplMap() {
    return this.navTreePathToNodeDefImplMap;
  }

  private NavTreeDefSource getSource() {
    return this.source;
  }

  List<NavTreeNodeDefImpl> getContentDefImpls() {
    return this.contentDefImpls;
  }

  @Override
  public List<NavTreeNodeDef> getContentDefs() {
    return this.contentDefs;
  }

  BeanChildNavTreeNodeDefImpl findNodeDefImplByChildPath(Path relativeChildPath) {
    return getChildPathToNodeDefImplMap().get(relativeChildPath.getDotSeparatedPath());
  }

  @Override
  public BeanChildNavTreeNodeDef findNodeByChildPath(Path relativeChildPath) {
    return findNodeDefImplByChildPath(relativeChildPath);
  }

  NavTreeNodeDefImpl findNodeDefImplByNavTreePath(Path relativeNavTreePath) {
    return getNavTreePathToNodeDefImplMap().get(relativeNavTreePath.getDotSeparatedPath());
  }

  @Override
  public NavTreeNodeDef findNodeByNavTreePath(Path relativeNavTreePath) {
    return findNodeDefImplByNavTreePath(relativeNavTreePath);
  }

  private void createNodeDefImpls() {
    GroupNavTreeNodeDefImpl groupNodeDefImpl = null; // since we're top level, there's no group parent us
    this.contentDefImpls = createNavTreeNodeDefImpls(getSource().getContents(), groupNodeDefImpl);
    this.contentDefs = Collections.unmodifiableList(getContentDefImpls());
  }

  List<NavTreeNodeDefImpl> createNavTreeNodeDefImpls(
    List<NavTreeNodeDefSource> sources,
    GroupNavTreeNodeDefImpl groupNodeDefImpl
  ) {
    if (sources.isEmpty()) {
      throw new AssertionError("No nav tree nodes for " + getTypeDefImpl());
    }
    List<NavTreeNodeDefImpl> nodeDefImpls = new ArrayList<>();
    for (NavTreeNodeDefSource source : sources) {
      NavTreeNodeDefImpl nodeDefImpl = createNavTreeNodeDefImpl(source, groupNodeDefImpl);
      if (nodeDefImpl != null) {
        nodeDefImpls.add(nodeDefImpl);
        if (nodeDefImpl.isChildNodeDef()) {
          BeanChildNavTreeNodeDefImpl childNodeDefImpl = nodeDefImpl.asChildNodeDefImpl();
          getChildPathToNodeDefImplMap().put(
            childNodeDefImpl.getChildNodePath().getDotSeparatedPath(),
            childNodeDefImpl
          );
        }
        getNavTreePathToNodeDefImplMap().put(getNavTreePath(nodeDefImpl).getDotSeparatedPath(), nodeDefImpl);
      } else {
        // omit it from the nav tree
      }
    }
    return nodeDefImpls;
  }

  private Path getNavTreePath(NavTreeNodeDefImpl nodeDefImpl) {
    Path navTreePath = new Path(nodeDefImpl.getNodeName());
    for (
      GroupNavTreeNodeDefImpl groupNodeDefImpl = nodeDefImpl.getGroupNodeDefImpl();
      groupNodeDefImpl != null;
      groupNodeDefImpl = groupNodeDefImpl.getGroupNodeDefImpl()
    ) {
      navTreePath = (new Path(groupNodeDefImpl.getNodeName())).childPath(navTreePath);
    }
    return navTreePath;
  }

  private NavTreeNodeDefImpl createNavTreeNodeDefImpl(
    NavTreeNodeDefSource source,
    GroupNavTreeNodeDefImpl groupNodeDefImpl
  ) {
    if (!getPageRepoDefImpl().getBeanRepoDefImpl().isAccessAllowed(RoleUtils.computeNavTreeNodeRoles(source))) {
      // The user isn't allowed to view this node
      return null;
    }
    NavTreeNodeDefSource.Type type = source.getType();
    if (NavTreeNodeDefSource.Type.child == type) {
      return BeanChildNavTreeNodeDefImpl.newNode(this, source, groupNodeDefImpl);
    }
    if (NavTreeNodeDefSource.Type.group == type) {
      return new GroupNavTreeNodeDefImpl(this, source, groupNodeDefImpl);
    }
    throw new AssertionError("Not a group or child nav tree node: " + type + " " + getTypeDef());
  }
}
