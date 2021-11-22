// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo.weblogic;

import java.util.List;
import java.util.Map;
import java.util.Set;

import weblogic.remoteconsole.common.repodef.BeanChildDef;
import weblogic.remoteconsole.common.repodef.BeanPropertyDef;
import weblogic.remoteconsole.common.utils.Path;
import weblogic.remoteconsole.server.repo.BeanTreePath;

/**
 * BeanTreeEntry represent an entry in the bean tree of the WDT model.
 */
public class BeanTreeEntry {
  private String key;
  private boolean isProperty;
  private boolean isBean;
  private boolean isBeanCollection;
  private boolean containsReference = false;
  private boolean isTransient = false;
  private BeanTreePath identity;
  private BeanChildDef beanChildDef = null;
  private BeanPropertyDef beanPropertyDef = null;
  private Object propertyValue = null;
  private List<Object> referenceValue = null;
  private Map<String, BeanTreeEntry> beanValue = null;

  // Create a BeanTreeEntry for a bean or bean collection
  BeanTreeEntry(
    String key,
    Map<String, BeanTreeEntry> value,
    BeanTreePath identity,
    boolean collection,
    BeanChildDef childDef
  ) {
    this.key = key;
    this.isProperty = false;
    this.isBean = !collection;
    this.isBeanCollection = collection;
    this.identity = identity;
    this.beanChildDef = childDef;
    this.beanValue = value;
  }

  // Create a BeanTreeEntry for a property
  BeanTreeEntry(
    String key,
    Object value,
    BeanTreePath identity,
    BeanPropertyDef propertyDef
  ) {
    this.key = key;
    this.isProperty = true;
    this.isBean = false;
    this.isBeanCollection = false;
    this.identity = identity;
    this.beanPropertyDef = propertyDef;
    this.propertyValue = value;
  }

  // Entry is a property
  public boolean isProperty() {
    return isProperty;
  }

  // Entry is a collection item or a singleton
  public boolean isBean() {
    return isBean;
  }

  // Entry is a collection of beans
  public boolean isBeanCollection() {
    return isBeanCollection;
  }

  // Entry is a property that contains a reference to another bean
  public boolean containsReference() {
    return containsReference;
  }

  // Return NULL when not a property
  public BeanPropertyDef getBeanPropertyDef() {
    return beanPropertyDef;
  }

  // Return NULL when not a bean or bean collection
  public BeanChildDef getBeanChildDef() {
    return beanChildDef;
  }

  // Get the identity of this entry
  // If entry is a property, the parent's identity
  public BeanTreePath getBeanTreePath() {
    return identity;
  }

  // Get the Path to reach this entry
  public Path getPath() {
    Path result = getBeanTreePath().getPath();
    if (isProperty) {
      result = result.childPath(getKey());
    }
    return result;
  }

  // Get the key used to obtain this entry
  public String getKey() {
    return key;
  }

  // Return empty set when entry is a property
  public Set<String> getKeySet() {
    if (beanValue != null) {
      return beanValue.keySet();
    }
    return Set.of();
  }

  // Return NULL when entry is a property or does not contain the key
  public BeanTreeEntry getBeanTreeEntry(String key) {
    BeanTreeEntry result = null;
    if (beanValue != null) {
      result = beanValue.get(key);
    }
    return result;
  }

  // Return the Map that is the bean or bean collection
  // Always return NULL when entry is a property
  public Map<String, BeanTreeEntry> getBeanValue() {
    Map<String, BeanTreeEntry> result = null;
    if (!isProperty && (beanValue != null)) {
      result = beanValue;
    }
    return result;
  }

  // Return the property value which itself maybe NULL
  // Always return NULL when entry is a bean or bean collection
  public Object getPropertyValue() {
    Object result = null;
    if (isProperty && (propertyValue != null)) {
      result = propertyValue;
    }
    return result;
  }

  // Set (i.e. udpate) the value of the property
  // If this entry is a bean or bean collection, a false result is returned
  public boolean setPropertyValue(Object newPropertyValue) {
    boolean result = false;
    if (isProperty) {
      propertyValue = newPropertyValue;
      result = true;
    }
    return result;
  }

  // Add the value to the bean or bean collection for this entry
  // If this entry is a property, a false result is returned
  public boolean putBeanTreeEntry(String key, BeanTreeEntry value) {
    boolean result = false;
    if (beanValue != null) {
      beanValue.put(key, value);
      result = true;
    }
    return result;
  }

  // Return NULL if the reference has not been set
  // or when the entry is a bean or bean collection
  public List<Object> getPropertyReference() {
    List<Object> result = null;
    if (isProperty && containsReference) {
      result = referenceValue;
    }
    return result;
  }

  // Set the reference for this property, the reference is always a List
  // and may be one of several values, see ReferenceResolver for details!
  // If this entry is not a property, a false result is returned
  public boolean setPropertyReference(List<Object> references) {
    boolean result = false;
    if (isProperty && beanPropertyDef.isReference()) {
      referenceValue = references;
      containsReference = true;
      result = true;
    }
    return result;
  }

  // Clear the reference state when the entry is updated
  public void clearReference() {
    if (isProperty && beanPropertyDef.isReference()) {
      referenceValue = null;
      containsReference = false;
    }
  }

  // Check if the entry is to be persisted with model
  public boolean isTransient() {
    return isTransient;
  }

  // Set the entry as not for persistence with the model
  public void setTransient() {
    isTransient = true;
  }

  // Clear the persistence state when the entry is updated
  public void clearTransient() {
    isTransient = false;
  }

  @Override
  public String toString() {
    String strValue = "[" + getPath() + "] ";
    return strValue + (isProperty ? propertyValue : beanValue);
  }
}
