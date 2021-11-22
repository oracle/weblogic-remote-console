// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

import java.util.ArrayList;
import java.util.List;

import weblogic.remoteconsole.common.utils.ListUtils;

/**
 * This class holds info about a node in the nav tree (and its child nodes).
 * 
 * It is used both to return the nav tree nodes from the CBE to the CFE
 * and to let the CFE specify which nav tree nodes should be expanded or collapsed.
 */
public class NavTreeNode {

  public enum Type {
    GROUP,
    ROOT,
    COLLECTION,
    COLLECTION_CHILD,
    SINGLETON,
  }

  private String name;
  private String label;
  private boolean expanded;
  private boolean expandable;
  private boolean selectable;
  private Type type;
  private BeanTreePath resourceData;
  private List<NavTreeNode> contents = new ArrayList<>();

  // The name of the nav tree node (used to identify the node when
  // CFE wants to expand it later)
  public String getName() {
    return name;
  }

  public void setName(String val) {
    name = val;
  }

  // The localized label to display for the node.
  public String getLabel() {
    return label;
  }

  public void setLabel(String val) {
    label = val;
  }

  // Whether the node is expanded
  public boolean isExpanded() {
    return expanded;
  }

  public void setExpanded(boolean val) {
    expanded = val;
  }

  // Whether the node can be expanded
  public boolean isExpandable() {
    return expandable;
  }

  public void setExpandable(boolean val) {
    expandable = val;
  }

  // Whether the node can be selected (i.e. whether the user can click on it to go to a page).
  // For example, group nodes are not selectable because there are no group-level pages
  // in the remote console.
  public boolean isSelectable() {
    return selectable;
  }

  public void setSelectable(boolean val) {
    selectable = val;
  }

  // The node's type
  public Type getType() {
    return type;
  }

  public void setType(Type val) {
    type = val;
  }

  // The relative url of the node's PDJ (if the link is selectable).
  // It's relative to the data provider.
  // e.g. domainRuntime/data/DomainRuntime/ServerRuntimes/AdminServer
  public BeanTreePath getResourceData() {
    return resourceData;
  }

  public void setResourceData(BeanTreePath val) {
    resourceData = val;
  }

  // The nodes this node directly parents.
  public List<NavTreeNode> getContents() {
    return contents;
  }

  public void setContents(List<NavTreeNode> val) {
    contents = ListUtils.nonNull(val);
  }
}
