// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

import weblogic.remoteconsole.common.repodef.BeanChildNavTreeNodeDef;
import weblogic.remoteconsole.common.repodef.GroupNavTreeNodeDef;
import weblogic.remoteconsole.common.repodef.NavTreeNodeDef;

/**
 * This class holds information about a segment of the path identitying
 * a node in the navigation tree.
 */
public class NavTreePathSegment {
  private NavTreePath navTreePath;
  private NavTreeNodeDef nodeDef;
  private BeanTreePath beanTreePath;

  NavTreePathSegment(
    NavTreePath navTreePath,
    GroupNavTreeNodeDef groupNodeDef
  ) {
    this.navTreePath = navTreePath;
    this.nodeDef = groupNodeDef;
    this.beanTreePath = null;
  }

  NavTreePathSegment(
    NavTreePath identity,
    BeanChildNavTreeNodeDef nodeDef,
    BeanTreePath beanTreePath
  ) {
    this.navTreePath = identity;
    this.nodeDef = nodeDef;
    this.beanTreePath = beanTreePath;
  }

  // The nav tree path of this segment of the nav tree path.
  public NavTreePath getNavTreePath() {
    return this.navTreePath;
  }

  // The definition of this segment of the nav tree path
  public NavTreeNodeDef getNavTreeNodeDef() {
    return this.nodeDef;
  }

  // The bean tree path of this segment of the nav tree path.
  // Returns null if this segment identifies a group
  // (v.s. identifies a bean or a collection of beans)
  public BeanTreePath getBeanTreePath() {
    return this.beanTreePath;
  }
}
