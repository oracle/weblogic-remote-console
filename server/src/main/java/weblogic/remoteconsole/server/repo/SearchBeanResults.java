// Copyright (c) 2022, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

import java.util.ArrayList;
import java.util.List;

import weblogic.remoteconsole.common.repodef.BeanTypeDef;

/**
 * Return the results about a matching bean from a general search
 */
public class SearchBeanResults {
  private BeanTreePath beanTreePath;
  private BeanTypeDef typeDef;
  private List<SearchBeanPropertyResults> propertiesResults = new ArrayList<>();

  public SearchBeanResults(BeanTreePath beanTreePath, BeanTypeDef typeDef) {
    this.beanTreePath = beanTreePath;
    this.typeDef = typeDef;
  }

  public BeanTreePath getBeanTreePath() {
    return beanTreePath;
  }

  public BeanTypeDef getTypeDef() {
    return typeDef;
  }

  public List<SearchBeanPropertyResults> getPropertiesResults() {
    return propertiesResults;
  }
}
