// Copyright (c) 2021, 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

import java.util.ArrayList;
import java.util.List;

import weblogic.remoteconsole.common.repodef.BeanChildDef;
import weblogic.remoteconsole.common.repodef.BeanTypeDef;
import weblogic.remoteconsole.common.utils.Path;

/**
 * This class holds the identity of a bean in a bean repo (i.e. 'refers to the bean').
 * 
 * It also contains information about the beans that parent this bean, starting
 * from the root bean in the bean repo.
 */
public class BeanTreePath extends Value {
  private BeanRepo beanRepo;
  private boolean resolved;
  private Path path = new Path();
  private List<BeanTreePathSegment> segments = new ArrayList<>();

  public static final String ALL_COLLECTION_CHILDREN = "*";

  // Construct a bean tree path for a bean given its repo and the path to that bean in the repo.
  // e.g.
  // BeanTreePath.create(
  //   beanRepo = WebLogicEditTree repo
  //   path = "Domain", "JMSSystemResources", "MyJMSSystemResource", "JMS", "ConnectionFactories", "MyConnectionFactory"
  // )
  // becomes:
  //  segments=
  //    child bean = DomainMBean's JMSSystemResources (collection), key = MyJMSSystemResource
  //    child bean = JMSSystemResourceMBean's JMS (singleton)
  //    child bean = JMSMBean's ConnectionFactories (collection), key = MyConnectionFactory
  // throws an AssertionError if any of the types in the path can't be found
  public static BeanTreePath create(BeanRepo beanRepo, Path path) {
    return new BeanTreePath(beanRepo, path, false);
  }

  // Construct a bean tree path for a bean given its repo and the path to that bean in the repo.
  // e.g.
  // BeanTreePath.create(
  //   beanRepo = WebLogicEditTree repo
  //   path = "Domain", "JMSSystemResources", "MyJMSSystemResource", "JMS", "ConnectionFactories", "MyConnectionFactory"
  // )
  // becomes:
  //  segments=
  //    child bean = DomainMBean's JMSSystemResources (collection), key = MyJMSSystemResource
  //    child bean = JMSSystemResourceMBean's JMS (singleton)
  //    child bean = JMSMBean's ConnectionFactories (collection), key = MyConnectionFactory
  // returns null if any of the types in the path can't be found
  public static BeanTreePath createAllowUnresolved(BeanRepo beanRepo, Path path) {
    BeanTreePath beanTreePath = new BeanTreePath(beanRepo, path, true);
    return (beanTreePath.resolved) ? beanTreePath : null;
  }

  // Construct a bean tree path for a bean that is a child of the bean identified
  // by this bean tree path.
  public BeanTreePath childPath(Path childPath) {
    // Clone me
    BeanTreePath beanTreePath = new BeanTreePath(beanRepo, path, false);
    // Then add the child path
    beanTreePath.addPath(childPath, false);
    return beanTreePath;
  }

  // Get the corresponding bean repo.
  public BeanRepo getBeanRepo() {
    return this.beanRepo;
  }

  // Get the path to this bean.
  // e.g. "Domain", "Servers", "AdminServer", "NetworkAccessPoints", "Channel7"
  public Path getPath() {
    return this.path;
  }

  // Get the segments that describe every bean, starting from the root bean
  // in the repo, to this bean.
  // e.g.
  //   Domain singleton
  //   Servers collection, key = AdminServer
  //   NetworkAccessPoints collection, key = Channel7
  public List<BeanTreePathSegment> getSegments() {
    return this.segments;
  }

  // e.g.
  // new BeanIdentity(
  //   beanTypes = WebLogicEditTree
  //   path = "Domain", "JMSSystemResources", "MyJMSSystemResource", "JMS", "ConnectionFactories", "MyConnectionFactory"
  // )
  // becomes:
  //  segments=
  //    child bean = DomainMBean's JMSSystemResources (collection), key = MyJMSSystemResource
  //    child bean = JMSSystemResourceMBean's JMS (singleton)
  //    child bean = JMSMBean's ConnectionFactories (collection), key = MyConnectionFactory
  private BeanTreePath(BeanRepo beanRepo, Path path, boolean allowUnresolved) {
    this.beanRepo = beanRepo;
    this.resolved = addPath(path, allowUnresolved);
  }

  private boolean addPath(Path pathToAdd, boolean allowUnresolved) {
    if (isCollection() && !pathToAdd.isEmpty()) {
      // Currently, the last segment is referring to a collection
      // (v.s. a child in the collection).  We want to add more segments.
      // So, this collection is going to change from being the last
      // segment to an intermediate segment.
      // Add * to the path to indicate that we want to identify this collection.
      // e.g. if we're currently /Domain/Servers and want to add NetworkAccessPoints,
      // then we need /Domain/Servers/*/NetworkAccessPoints.
      path.addComponent(ALL_COLLECTION_CHILDREN);
    }
    BeanTypeDef typeDef =
      getSegments().isEmpty()
        ? getBeanRepo().getBeanRepoDef().getRootTypeDef()
        : getLastSegment().getChildDef().getChildTypeDef();
    List<String> components = pathToAdd.getComponents();
    for (int i = 0; i < components.size();) {
      String childName = components.get(i);
      BeanChildDef childDef = findChild(typeDef, childName);
      if (childDef == null) {
        if (allowUnresolved) {
          return false;
        } else {
          throw new AssertionError(path + ": can't find " + childName + " in " + typeDef);
        }
      }
      i++;
      typeDef = childDef.getChildTypeDef();
      if (childDef.isCollection() && i < components.size()) {
        // We're in a collection and there are more components.
        // The next component identifies the child in the collection.
        // Add a segment for that child.
        String childKey = components.get(i);
        i++;
        if (ALL_COLLECTION_CHILDREN.equals(childKey)) {
          // Add a segment that identifies the entire collection.
          getSegments().add(new BeanTreePathSegment(this, childDef));
        } else {
          // Add a segment that identifies the specific child.
          getSegments().add(new BeanTreePathSegment(this, childDef, childKey));
        }
      } else {
        // Either this is a singleton or it's a collection and there are no more components.
        // Either way, add a segment for the singleton or the collection.
        getSegments().add(new BeanTreePathSegment(this, childDef));
      }
    }
    path.addPath(pathToAdd);
    return true;
  }

  private BeanChildDef findChild(BeanTypeDef typeDef, String childName) {
    Path childPath = new Path(childName);
    boolean searchSubTypes = true;
    if (typeDef.hasChildDef(childPath, searchSubTypes)) {
      return typeDef.getChildDef(childPath, searchSubTypes);
    }
    return null;
  }

  @Override
  public String toString() {
    return "BeanTreePath<" + getPath().getRelativeUri() + ">";
  }

  // Convenience methods:

  // Returns whether this bean tree path identifies the root bean in the repo.
  public boolean isRoot() {
    return getSegments().isEmpty();
  }

  // Returns whether this bean tree path identifies a collection of beans.
  public boolean isCollection() {
    if (isRoot()) {
      return false;
    }
    if (!getLastSegment().getChildDef().isCollection()) {
      return false;
    }
    return !getLastSegment().isKeySet();
  }

  // Returns whether this bean tree path identifies a bean in a collection.
  public boolean isCollectionChild() {
    if (isRoot()) {
      return false;
    }
    if (!getLastSegment().getChildDef().isCollection()) {
      return false;
    }
    return getLastSegment().isKeySet();
  }

  // Returns whether this bean tree path identifies an optional singleton bean.
  public boolean isOptionalSingleton() {
    if (isRoot()) {
      return false;
    }
    return getLastSegment().getChildDef().isOptionalSingleton();
  }

  // Returns whether this bean tree path identifies a bean that always exists
  // and may not be deleted.
  public boolean isMandatorySingleton() {
    if (isRoot()) {
      return false;
    }
    return getLastSegment().getChildDef().isMandatorySingleton();
  }

  // Returns whether this bean tree path identifies a collection
  // that supports creating children, or an optional singleton that
  // can be created.
  public boolean isCreatable() {
    if (isRoot()) {
      return false;
    }
    if (isCollection() || isOptionalSingleton()) {
      return getLastSegment().getChildDef().isCreatable();
    }
    return false;
  }

  // Returns whether the create operation is asynchronous.
  public boolean isAsyncCreate() {
    if (isRoot()) {
      return false;
    }
    if (isCollection() || isOptionalSingleton()) {
      return getLastSegment().getChildDef().isAsyncCreate();
    }
    return false;
  }

  // Returns whether the bean can be deleted.
  public boolean isDeletable() {
    if (isRoot()) {
      return false;
    }
    return getLastSegment().getChildDef().isDeletable();
  }

  // Returns whether the delete operation is asynchronous.
  public boolean isAsyncDelete() {
    if (isRoot()) {
      return false;
    }
    if (isCollectionChild() || isOptionalSingleton()) {
      return getLastSegment().getChildDef().isAsyncDelete();
    }
    return false;
  }

  // Returns whether the bean is editable.
  public boolean isEditable() {
    if (isRoot()) {
      return false;
    }
    if (isCollection()) {
      return false;
    }
    return getLastSegment().getChildDef().isEditable();
  }

  // Get the type definition of the bean or collection this bean tree path identifies.
  public BeanTypeDef getTypeDef() {
    if (isRoot()) {
      return getBeanRepo().getBeanRepoDef().getRootTypeDef();
    } else {
      return getLastSegment().getChildDef().getChildTypeDef();
    }
  }

  // Get info about the bean or collection that this bean tree path identifies
  // (v.s. about any of the beans that parent this bean).
  public BeanTreePathSegment getLastSegment() {
    return isRoot() ? null : getSegments().get(getSegments().size() - 1);
  }

  @Override
  public boolean equals(Object obj) {
    if (obj == this) {
      return true;
    }
    if (BeanTreePath.class.isInstance(obj)) {
      BeanTreePath bp = BeanTreePath.class.cast(obj);
      return getPath().equals(bp.getPath());
    }
    return false;
  }
}
