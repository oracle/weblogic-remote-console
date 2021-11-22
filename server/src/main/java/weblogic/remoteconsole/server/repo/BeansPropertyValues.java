// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

import weblogic.remoteconsole.common.repodef.BeanPropertyDef;
import weblogic.remoteconsole.common.utils.Path;

/**
 * When creating or updating a bean, the caller can specify which properties
 * to set on that bean and on its mandatory singleton child beans.
 * For example, when creating a server, the caller can set properties on
 * the Server bean and on its child SSL bean.
 *
 * This class sorts bean property values into lists of per-bean property values.
 * It sorts them by bean tree path so that the top level bean is always the first
 * one returned (useful for creating a new bean then setting properties on its children)
 */
public class BeansPropertyValues {
  private BeanTreePath beanTreePath;
  private Map<String,BeanPropertyValues> beanTreePathToBeanPropertyValuesMap = new TreeMap<>();

  // Construct a BeansPropertiesValue from the bean tree path of the top level
  // bean (e.g. the Server bean)
  public BeansPropertyValues(BeanTreePath beanTreePath) {
    this.beanTreePath = beanTreePath;
  }

  // Adds a property value to the list of property values.
  // e.g. 'set the Server bean's ListenPort property to 7003'
  // e.g. 'set the Server beans's SSL bean's Enabled property to true'
  public void addPropertyValue(BeanPropertyValue propertyValue) {
    BeanPropertyDef propertyDef = propertyValue.getPropertyDef();
    BeanTreePath propertyBeanTreePath = beanTreePath;
    Path parentPath = propertyDef.getParentPath();
    if (!parentPath.isEmpty()) {
      // switch from
      //   bean tree path = .../AdminServer, property = SSL.Enabled
      // to
      //   bean tree path = .../AdminServer/SSL, property = Enabled
      propertyBeanTreePath = propertyBeanTreePath.childPath(parentPath);
      // since a bean tree path's typedef is for the base type, search the sub types for the property
      propertyDef =
        propertyBeanTreePath.getTypeDef().getPropertyDef(
          new Path(propertyDef.getPropertyName()),
          true // search sub types
        );
    }
    // Make sure we have a BeanPropertyValues for this bean
    BeanPropertyValues propertyValues = getPropertyValues(propertyBeanTreePath);
    // Add this property value to it.
    propertyValues.addPropertyValue(
      new BeanPropertyValue(propertyDef, propertyValue.getValue())
    );
  }

  // Add a bean to the list without specify any values on it.
  // This is used for creating optional singletons that can be
  // constructed without specifying any properties on them.
  public void addBean(BeanTreePath beanTreePath) {
    // Make sure we have a BeanPropertyValues for this bean
    getPropertyValues(beanTreePath);
  }

  private BeanPropertyValues getPropertyValues(BeanTreePath beanTreePath) {
    String key = beanTreePath.getPath().getDotSeparatedPath();
    if (!beanTreePathToBeanPropertyValuesMap.containsKey(key)) {
      beanTreePathToBeanPropertyValuesMap.put(key, new BeanPropertyValues(beanTreePath));
    }
    return beanTreePathToBeanPropertyValuesMap.get(key);
  }

  // Sort the property values by bean and return them.
  // Tthe first one is always the top level bean.
  // This method must be called after all the property values have been added.
  public List<BeanPropertyValues> getSortedBeansPropertyValues() {
    List<BeanPropertyValues> sortedValues = new ArrayList<>();
    for (BeanPropertyValues beanPropertyValues : beanTreePathToBeanPropertyValuesMap.values()) {
      sortedValues.add(beanPropertyValues);
    }
    return sortedValues;
  }
}
