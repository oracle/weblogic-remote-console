// Copyright (c) 2022, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import weblogic.remoteconsole.common.repodef.PagePropertyDef;
import weblogic.remoteconsole.common.utils.StringUtils;

/**
 * Handle adding property values to a general search's results
 */
public abstract class SearchPropertyHandler {

  private SearchBeanFinder finder;
  private SearchProperty property;
  private Map<String,List<PagePropertyDef>> typeNameToPropertyDefs = new HashMap<>();

  static SearchPropertyHandler getHandler(SearchBeanFinder finder, SearchProperty property) {
    if (StringUtils.notEmpty(property.getPropertyName())) {
      return new PropertyNameHandler(finder, property);
    }
    if (StringUtils.notEmpty(property.getPropertyLabelContains())) {
      return new PropertyLabelContainsHandler(finder, property);
    }
    throw new AssertionError("Unknown property type: " + property);
  }

  protected SearchPropertyHandler(SearchBeanFinder finder, SearchProperty property) {
    this.finder = finder;
    this.property = property;
  }

  protected SearchBeanFinder getFinder() {
    return finder;
  }

  protected SearchProperty getProperty() {
    return property;
  }

  List<PagePropertyDef> getPropertyDefs(BeanTreePath beanTreePath) {
    String typeName = beanTreePath.getTypeDef().getTypeName();
    List<PagePropertyDef> rtn = typeNameToPropertyDefs.get(typeName);
    if (rtn == null) {
      rtn = new ArrayList<>();
      findPropertyDefs(beanTreePath, rtn);
      typeNameToPropertyDefs.put(typeName, rtn);
    }
    return rtn;
  }

  protected abstract void findPropertyDefs(BeanTreePath beanTreePath, List<PagePropertyDef> propertyDefs);

  List<SearchBeanPropertyResults> getResults(BeanSearchResults beanResults) {
    List<SearchBeanPropertyResults> rtn = new ArrayList<>();
    for (PagePropertyDef propertyDef : getPropertyDefs(beanResults.getBeanTreePath())) {
      SearchBeanPropertyResults propertyResults = getFinder().findProperty(propertyDef, beanResults);
      if (propertyResults != null) {
        rtn.add(propertyResults);
      }
    }
    return rtn;
  }

  private static class PropertyNameHandler extends SearchPropertyHandler {
    private PropertyNameHandler(SearchBeanFinder finder, SearchProperty property) {
      super(finder, property);
    }

    @Override
    protected void findPropertyDefs(BeanTreePath beanTreePath, List<PagePropertyDef> propertyDefs) {
      getFinder().addPropertyDefMatchingPropertyName(
        beanTreePath,
        propertyDefs,
        getProperty().getPropertyName()
      );
    }
  }

  private static class PropertyLabelContainsHandler extends SearchPropertyHandler {
    private PropertyLabelContainsHandler(SearchBeanFinder finder, SearchProperty property) {
      super(finder, property);
    }

    @Override
    protected void findPropertyDefs(BeanTreePath beanTreePath, List<PagePropertyDef> propertyDefs) {
      getFinder().addPropertyDefsMatchingPropertyLabelContains(
        beanTreePath,
        propertyDefs,
        getProperty().getPropertyLabelContains()
      );
    }
  }
}
