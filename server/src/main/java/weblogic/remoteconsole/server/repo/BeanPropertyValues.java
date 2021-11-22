// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

import java.util.ArrayList;
import java.util.List;

/**
 * This class holds a set of property values on a bean
 * that should be created or updated.
 */
public class BeanPropertyValues {
  private BeanTreePath beanTreePath;
  private List<BeanPropertyValue> propertyValues = new ArrayList<>();

  // Create a BeanPropertyValues from the path that identifies the bean.
  public BeanPropertyValues(BeanTreePath beanTreePath) {
    this.beanTreePath = beanTreePath;
  }

  // Add a property value
  public void addPropertyValue(BeanPropertyValue propertyValue) {
    propertyValues.add(propertyValue);
  }

  public BeanTreePath getBeanTreePath() {
    return beanTreePath;
  }

  public List<BeanPropertyValue> getPropertyValues() {
    return propertyValues;
  }

  @Override
  public String toString() {
    return "BeanPropertyValues<" + getBeanTreePath() + "," + getPropertyValues() + ">";
  }
}
