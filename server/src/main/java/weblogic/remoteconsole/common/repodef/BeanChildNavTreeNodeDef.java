// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef;

import java.util.List;

import weblogic.remoteconsole.common.utils.Path;

/**
 * This interface describes a child bean navigation node underneath
 * a type in the bean tree for a perspective (e.g. the Servers node
 * in the DoainMBean's Services group node).
 *
 * It contains all of the information about the type that the different
 * parts of the backend needs (e.g. english resource bundle, PDJ, RDJ).
 */
public interface BeanChildNavTreeNodeDef extends NavTreeNodeDef {
  // Returns the list of child beans to get from the type in the bean
  // tree that's defining its nav tree nodes to this child node.
  // It's a list since there are cases where you have to walk through
  // some mandatory singletons to get to the child, for example
  // from the DomainMBean's SecurityConfiguration mandatory singleton
  // to the Realms collection.
  public List<BeanChildDef> getChildDefs();

  // Get the leaf child def - i.e. the child that you want to
  // display in the nav tree (v.s. the intermediate mandatory
  // singletons needed to get to the leaf child).
  public default BeanChildDef getLastChildDef() {
    List<BeanChildDef> childDefs = getChildDefs();
    return childDefs.get(childDefs.size() - 1);
  }

  // The path from the page-relative bean type to this
  // child collection, e.g. the DomainMBean's SecurityConfiguration.Realms collection.
  public default Path getChildNodePath() {
    Path path = new Path();
    for (BeanChildDef childDef : getChildDefs()) {
      path.addPath(childDef.getChildPath());
    }
    return path;
  }
}
