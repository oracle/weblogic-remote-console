// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

import weblogic.remoteconsole.common.repodef.BeanPropertyDef;

/**
 * This interface lets the caller specify which beans and properties in the bean repo
 * a search request should return, then perform the search.
 */
public interface BeanReaderRepoSearchBuilder {

  // Add a bean / property to the search, that is, tell the search
  // that it should include info about this property of this bean in the results.
  //
  // If the bean tree path identifies a collection (v.s. a specific bean),
  // then the search will return the value of this property for every item in the collection.
  public void addProperty(BeanTreePath beanTreePath, BeanPropertyDef propertyDef);

  // Perform the search and return the results.
  // This must be done after calling addProperty to construct the search.
  public Response<BeanReaderRepoSearchResults> search();

  // Specifies whether this builder is a change manager search builder
  // (since that one lets the caller ask for more info).
  public default boolean isChangeManagerBeanRepoSearchBuilder() {
    return this instanceof ChangeManagerBeanRepoSearchBuilder;
  }

  // Convert this builder into a change manager search builder.
  // Throws a ClassCastException if this builder is not a ChangeManagetBeanRepoSearchBuilder.
  public default ChangeManagerBeanRepoSearchBuilder asChangeManagerBeanRepoSearchBuilder() {
    return (ChangeManagerBeanRepoSearchBuilder)this;
  }
}
