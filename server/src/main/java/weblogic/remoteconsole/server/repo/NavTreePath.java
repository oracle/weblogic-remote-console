// Copyright (c) 2021, 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

import java.util.ArrayList;
import java.util.List;

import weblogic.remoteconsole.common.repodef.BeanChildDef;
import weblogic.remoteconsole.common.repodef.BeanChildNavTreeNodeDef;
import weblogic.remoteconsole.common.repodef.BeanTypeDef;
import weblogic.remoteconsole.common.repodef.NavTreeDef;
import weblogic.remoteconsole.common.repodef.NavTreeNodeDef;
import weblogic.remoteconsole.common.utils.Path;

/**
 * This class holds the identity of a node in the navigation tree.
 * 
 * It also contains information about nav tree nodes that parent this
 * node, starting from the root node in the nav tree.
 */
public class NavTreePath {
  private PageRepo pageRepo;
  private Path path;
  private List<NavTreePathSegment> segments = new ArrayList<>();

  // Construct a nav tree path for the bean identified by an invocation text.
  public NavTreePath(InvocationContext ic) {
    this(ic.getPageRepo(), ic.getBeanTreePath());
  }

  // Construct a nav tree path for a bean identified by a bean tree path
  // For example, if the bean tree path is Domain/Servers/Server1
  // the nav tree path is Environment/Servers/Server1
  public NavTreePath(PageRepo pageRepo, BeanTreePath beanTreePath) {
    this.pageRepo = pageRepo;
    this.path = computeNavTreePathFromBeanTreePath(beanTreePath);
    initialize();
  }

  // Construct a nav tree path from a path such as Environment/Servers/Server1
  public NavTreePath(PageRepo pageRepo, Path navTreePath) {
    this.pageRepo = pageRepo;
    this.path = navTreePath;
    initialize();
  }

  // Returns the page repo that this nav tree path is relative to
  public PageRepo getPageRepo() {
    return this.pageRepo;
  }

  // Return this nav tree path as Path (e.g. "Environment", "Servers", "Server1")
  public Path getPath() {
    return this.path;
  }

  // Return the segments that describe this nav tree path
  public List<NavTreePathSegment> getSegments() {
    return this.segments;
  }

  private void initialize() {
    BeanTypeDef typeDef = null; // selects the root nav tree def
    Path beanTreePath = new Path();
    Path typeRelativeNavTreePath = new Path();
    List<String> components = getPath().getComponents();
    for (int i = 0; i < components.size(); i++) {
      String component = components.get(i);
      typeRelativeNavTreePath.addComponent(component);
      NavTreeNodeDef nodeDef = findNodeByNavTreePathInTypeOrSubType(typeDef, typeRelativeNavTreePath);
      if (nodeDef.isChildNodeDef()) {
        // This nav tree node is for a child bean
        // Add all of the child beans from the nav tree node's type to the
        // this node to the bean path.
        List<BeanChildDef> childDefs = nodeDef.asChildNodeDef().getChildDefs();
        for (BeanChildDef childDef : childDefs) {
          beanTreePath.addPath(childDef.getChildPath());
        }
        BeanChildDef lastChildDef = childDefs.get(childDefs.size() - 1);
        if (lastChildDef.isCollection() && i < components.size() - 1) {
          // This is a collection child (and the next component is the child's key)
          // add the child's key to the bean path
          i++;
          String key = components.get(i);
          beanTreePath.addComponent(key);
        }
        // create a nav segment for the child bean
        getSegments().add(
          new NavTreePathSegment(
            this,
            nodeDef.asChildNodeDef(),
            BeanTreePath.create(getPageRepo().getBeanRepo(), beanTreePath)
          )
        );
        // keep going, starting at the child bean's type
        typeDef = lastChildDef.getChildTypeDef();
        typeRelativeNavTreePath = new Path();
      } else {
        // This nav tree node is for a group.  Create a nav segment for it.
        getSegments().add(new NavTreePathSegment(this, nodeDef.asGroupNodeDef()));
      }
    }
  }
  
  // Here's the basic idea.
  //
  // We start with a bean tree path and want to find its corresponding path in the nav tree.
  // For example:
  //   bean tree path                             nav tree path
  //   --------------                             -------------
  //   Domain                                     Environment.Domain
  //   Domain.Servers.S1                          Environment.Servers/S1
  //   Domain.Servers.S1.NetworkAccessPoints/C1   Environment.Servers.S1.NetworkAccessPoints.C1
  //
  // where nav-tree.yaml has:
  //   root type's nav-tree.yaml
  //      bean tree path        nav tree path
  //      --------------        -------------
  //      Domain                Environment.Domain
  //      Domain.Servers        Environment.Servers
  //   ServerMBean's nav-tree.yaml
  //      bean tree path        nav tree path
  //      --------------        -------------
  //      NetworkAccessPoints   NetworkAccessPoints
  //
  // We start off looking in the root type's nav-tree.yaml for the longest match we
  // can find with the bean tree path.
  //
  // For example, if the bean tree path is 'Domain.Servers.S1.NetworkAccessPoints.C1',
  // the longest match at the root level is Domain.Servers -> Environment.Servers
  //
  // And, if the bean tree path is 'Domain'
  // the longest match at the root level is Domain -> Environment.Domain
  //
  // We add that to the nav tree path, and if it's collection, we add the collection child's
  // name to the nav tree path too.  And, if there's anything left in the bean tree path
  // that we haven't processed, we repeat the process starting the root nav tree node's
  // type.
  //
  // So, for 'Domain.Servers.S1.NetworkAccessPoints.C1',
  // the root level nav tree info tells us to convert Domain.Servers to
  // Environment.Servers and to switch to the ServerMBean, which tells us to
  // convert NetworkAccessPoints to NetworkAccessPoints, giving us a final nav tree path of
  // Environment.Servers.S1.NetworkAccessPoints.C1.
  //
  // And, for just 'Domain', the root level tells to convert Domain to Environment.Domain,
  // giving us a final nav tree path of Environment.Domain.
  private Path computeNavTreePathFromBeanTreePath(BeanTreePath beanTreePath) {
    Path navTreePath = new Path();
    Path restOfBeanTreePath = beanTreePath.getPath();
    BeanTypeDef typeDef = null; // selects the root nav tree def
    while (!restOfBeanTreePath.isEmpty()) {
      BeanChildNavTreeNodeDef nodeDef =
        findMostSpecificMatchingNodeInTypeOrSubTypes(beanTreePath, typeDef, restOfBeanTreePath);
      // Add the nav tree node's relative nav tree path to the nav tree path
      navTreePath.addPath(nodeDef.getNodePath());
      // Remove the nav tree node's relative bean tree path from restOfBeanTreePath
      restOfBeanTreePath =
        restOfBeanTreePath.subPath(nodeDef.getChildNodePath().length(), restOfBeanTreePath.length());
      // If it's collection node and we have one or more components,
      // the next one is the child child's key.
      if (nodeDef.getLastChildDef().isCollection() && !restOfBeanTreePath.isEmpty()) {
        navTreePath.addComponent(restOfBeanTreePath.getFirstComponent());
        restOfBeanTreePath = restOfBeanTreePath.subPath(1, restOfBeanTreePath.length());
      }
      // Continue searching from this nav tree node's type
      typeDef = nodeDef.getLastChildDef().getChildTypeDef();
    }
    return navTreePath;
  }

  // Given a type, and a bean tree path that starts off relative to that type,
  // find the nav tree node for that type (or any of its sub types) that matches
  // as much of the bean tree path as relative.
  //
  // For example, for the root type's nav-tree.yaml, which maps
  //   Domain         -> Environment.Domain
  //   Domain.Servers -> Environement.Servers
  // if the bean tree path is just 'Domain', it will return the Environment.Domain node.
  // But if the bean tree path is Domain.Servers.blah.blah, it will return the Environment.Servers node.
  private BeanChildNavTreeNodeDef findMostSpecificMatchingNodeInTypeOrSubTypes(
    BeanTreePath beanTreePath,
    BeanTypeDef typeDef,
    Path restOfBeanTreePath
  ) {
    // Look in this type
    BeanChildNavTreeNodeDef nodeDef =
      findMostSpecificMatchingNodeInType(typeDef, restOfBeanTreePath);
    if (nodeDef != null) {
      return nodeDef;
    }
    if (typeDef != null && typeDef.isHeterogeneous()) {
      // Look in this type's sub types.
      for (String discriminator : typeDef.getSubTypeDiscriminatorLegalValues()) {
        BeanTypeDef subTypeDef = typeDef.getSubTypeDef(discriminator);
        // Make sure not to process this type again since some base types are instantiable.
        if (!subTypeDef.getTypeName().equals(typeDef.getTypeName())) {
          nodeDef = findMostSpecificMatchingNodeInType(subTypeDef, restOfBeanTreePath);
          if (nodeDef != null) {
            return nodeDef;
          }
        }
      }
    }
    throw
      new AssertionError(
        "Couldn't find navigation node:"
        + " " + typeDef
        + " " + restOfBeanTreePath
        + " " + beanTreePath
      );
  }

  private BeanChildNavTreeNodeDef findMostSpecificMatchingNodeInType(
    BeanTypeDef typeDef,
    Path restOfBeanTreePath
  ) {
    NavTreeDef navTreeDef = getNavTreeDef(typeDef);
    if (navTreeDef == null) {
      return null;
    }
    Path relativeChildPath = restOfBeanTreePath;
    while (!relativeChildPath.isEmpty()) {
      BeanChildNavTreeNodeDef nodeDef = navTreeDef.findNodeByChildPath(relativeChildPath);
      if (nodeDef != null) {
        return nodeDef;
      }
      relativeChildPath = relativeChildPath.getParent();
    }
    return null;
  }

  NavTreeNodeDef findNodeByNavTreePathInTypeOrSubType(
    BeanTypeDef typeDef,
    Path typeRelativeNavTreePath
  ) {
    // Look in this type
    NavTreeNodeDef nodeDef =
      findNodeByNavTreePathInType(typeDef, typeRelativeNavTreePath);
    if (nodeDef != null) {
      return nodeDef;
    }
    if (typeDef.isHeterogeneous()) {
      // Look in this type's sub types.
      for (String discriminator : typeDef.getSubTypeDiscriminatorLegalValues()) {
        BeanTypeDef subTypeDef = typeDef.getSubTypeDef(discriminator);
        // Make sure not to process this type again since some base types are instantiable.
        if (!subTypeDef.getTypeName().equals(typeDef.getTypeName())) {
          nodeDef = findNodeByNavTreePathInType(subTypeDef, typeRelativeNavTreePath);
          if (nodeDef != null) {
            return nodeDef;
          }
        }
      }
    }
    throw
      new AssertionError(
        "Couldn't find navigation node:"
        + " " + typeDef
        + " " + typeRelativeNavTreePath
      );
  }

  NavTreeNodeDef findNodeByNavTreePathInType(
    BeanTypeDef typeDef,
    Path typeRelativeNavTreePath
  ) {
    NavTreeDef navTreeDef = getNavTreeDef(typeDef);
    if (navTreeDef == null) {
      return null;
    }
    return navTreeDef.findNodeByNavTreePath(typeRelativeNavTreePath);
  }

  NavTreeDef getNavTreeDef(BeanTypeDef typeDef) {
    return
      (typeDef != null)
      ? getPageRepo().getPageRepoDef().getNavTreeDef(typeDef)
      : getPageRepo().getPageRepoDef().getRootNavTreeDef();
  }

  @Override
  public String toString() {
    return getPath().getRelativeUri();
  }

  // Convenience methods:
 
  public boolean isRoot() {
    return getSegments().isEmpty();
  }

  public NavTreePathSegment getLastSegment() {
    return isRoot() ? null : getSegments().get(getSegments().size() - 1);
  }
}
