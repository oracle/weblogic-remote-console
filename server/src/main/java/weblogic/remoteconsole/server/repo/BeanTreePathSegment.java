// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

import weblogic.remoteconsole.common.repodef.BeanChildDef;

/**
 * This class holds information about a segment of the path identitying a bean in a bean tree.
 */
public class BeanTreePathSegment {
  private BeanTreePath beanTreePath;
  private BeanChildDef childDef;
  private String key;
  private boolean keySet;

  BeanTreePathSegment(BeanTreePath beanTreePath, BeanChildDef childDef, String key) {
    this(beanTreePath, childDef);
    this.keySet = true;
    this.key = key;
  }

  BeanTreePathSegment(BeanTreePath beanTreePath, BeanChildDef childDef) {
    this.beanTreePath = beanTreePath;
    this.childDef = childDef;
  }

  // Returns the bean tree path of this segment.
  public BeanTreePath getBeanTreePath() {
    return this.beanTreePath;
  }

  // Returns the definition of the collection or singleton of this segment.
  public BeanChildDef getChildDef() {
    return this.childDef;
  }

  // If this segment is for a collection, returns whether it also
  // identifies a bean in that collection.
  // Returns false if the segment is for a singleton.
  public boolean isKeySet() {
    return this.keySet;
  }

  // If this segment is for a collection, and represents a bean
  // in that collection, returns the value of that collection's
  // key property for this bean.
  //
  // For example, if this segment identifies the Servers collection,
  // and the key is 'AdminServer', it means that it identifies the
  // server whose 'Name' property is 'AdminServer'.
  //
  // Returns null if this segment does not identify a bean in a collection.
  public String getKey() {
    return this.key;
  }
}
