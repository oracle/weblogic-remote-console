// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef;

import weblogic.remoteconsole.common.utils.Path;

/**
 * This interface describes a nav tree node.
 *
 * It contains all of the information about the type that the different
 * parts of the backend needs (e.g. english resource bundle, PDJ, RDJ).
 */
public interface NavTreeNodeDef {

  // Returns the correponding nav tree for the type
  public NavTreeDef getNavTreeDef();

  // Returns the group that contains this node.
  // returns null if this node is directly parented by the type.
  public GroupNavTreeNodeDef getGroupNodeDef();

  // Returns the label to display for this node.
  public LocalizableString getLabel();

  // Returns the name to use when referring to this node in the
  // requests and responses for getting the nav tree contents based
  // on what nodes the user has opened.
  public String getNodeName();

  // Returns the path from the type to this node.
  public default Path getNodePath() {
    Path path = new Path();
    for (NavTreeNodeDef node = this; node != null; node = node.getGroupNodeDef()) {
      path = new Path(node.getNodeName()).childPath(path);
    }
    return path;
  }

  // Returns whether this is a child node (e.g. a Server or a collection of Servers)
  public default boolean isChildNodeDef() {
    return (this instanceof BeanChildNavTreeNodeDef);
  }

  // Converts this node to a child node.
  // Throws a ClassCastException if this node is not a BeanChildNavTreeNodeDef.
  public default BeanChildNavTreeNodeDef asChildNodeDef() {
    return (BeanChildNavTreeNodeDef)this;
  }

  // Returns whether this is a group node (e.g. a Domain's Services group)
  public default boolean isGroupNodeDef() {
    return (this instanceof GroupNavTreeNodeDef);
  }

  // Converts this node to a group node.
  // Throws a ClassCastException if this node is not a GroupNavTreeNodeDef.
  public default GroupNavTreeNodeDef asGroupNodeDef() {
    return (GroupNavTreeNodeDef)this;
  }
}
