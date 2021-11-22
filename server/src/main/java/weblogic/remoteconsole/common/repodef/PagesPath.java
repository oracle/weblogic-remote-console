// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef;

/**
 * his class contains the path needed to identify the pages for a type in a page repo def
 */
public class PagesPath {
  private PageRepoDef pageRepoDef;
  private BeanTypeDef typeDef;
  private String key;

  // Construct a pages path.
  public PagesPath(PageRepoDef pageRepoDef, BeanTypeDef typeDef) {
    this.pageRepoDef = pageRepoDef;
    this.typeDef = typeDef;
    this.key = getPageRepoDef().getKey() + "type=<" + getTypeDef().getTypeName() + ">";
  }

  // Returns the corresponding repo
  public PageRepoDef getPageRepoDef() {
    return this.pageRepoDef;
  }

  // Returns the corresponding type
  public BeanTypeDef getTypeDef() {
    return this.typeDef;
  }

  // Returns a string identifying this pages path.
  public String getKey() {
    return this.key;
  }

  @Override
  public String toString() {
    return getKey();
  }
}
