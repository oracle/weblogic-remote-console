// Copyright (c) 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

import java.util.HashMap;
import java.util.Map;

import weblogic.remoteconsole.common.repodef.BeanPropertyDef;

/**
 * This class returns information about bean in a collection that
 * was found via a getCollection customizer.
 */
public class CustomBeanSearchResults implements BeanSearchResults {

  private BeanReaderRepoSearchResults searchResults;
  private BeanTreePath beanTreePath;
  private Map<String,PropertyResults> propertiesResults = new HashMap<>();

  public CustomBeanSearchResults(BeanReaderRepoSearchResults searchResults, BeanTreePath beanTreePath) {
    this.searchResults = searchResults;
    this.beanTreePath = beanTreePath;
  }

  @Override
  public BeanReaderRepoSearchResults getSearchResults() {
    return searchResults;
  }

  @Override
  public BeanTreePath getBeanTreePath() {
    return beanTreePath;
  }

  public void addPropertyResults(BeanPropertyDef propertyDef, Value value) {
    PropertyResults propertyResults = new PropertyResults(propertyDef, value);
    propertiesResults.put(getPropertyResultsKey(propertyDef), propertyResults);
  }

  @Override
  public Value getUnsortedValue(BeanPropertyDef propertyDef) {
    PropertyResults propertyResults = propertiesResults.get(getPropertyResultsKey(propertyDef));
    return (propertyResults != null) ? propertyResults.getValue() : null;
  }

  private String getPropertyResultsKey(BeanPropertyDef propertyDef) {
    return propertyDef.getPropertyPath().getDotSeparatedPath();
  }

  private static class PropertyResults {
    private BeanPropertyDef propertyDef;
    private Value value;

    private PropertyResults(BeanPropertyDef propertyDef, Value value) {
      this.propertyDef = propertyDef;
      this.value = value;
    }
    
    private BeanPropertyDef getPropertyDef() {
      return propertyDef;
    }

    private Value getValue() {
      return value;
    }
  }
}
