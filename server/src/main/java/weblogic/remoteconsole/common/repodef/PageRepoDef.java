// Copyright (c) 2021, 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef;

import weblogic.remoteconsole.common.utils.Path;

/**
 * This interface describes a set of pages.
 *
 * It contains all of the information about the pages that the different
 * parts of the backend needs (e.g. english resource bundle, PDJ, RDJ).
 */
public interface PageRepoDef {

  // Returns this repo's name
  public String getName();

  // Returns the corresponding repo that contains information
  // describing the types, properties and actions.
  public BeanRepoDef getBeanRepoDef();

  public default String getKey() {
    return "pages<" + getName() + ">";
  }

  // This the name of the resource bundle that
  // will contain info for localizing the strings
  // on these pages.
  public String getResourceBundleName();

  // Looks up the definition of a page in this repo.
  // Returns null if the page doesn't exist.
  public PageDef getPageDef(PagePath pagePath);

  // Looks up the nav tree contents for the root of this repo.
  public NavTreeDef getRootNavTreeDef();

  // Looks up the nav tree contents for a type in this repo.
  public NavTreeDef getNavTreeDef(BeanTypeDef typeDef);

  // Looks up the link definitions for a type in this repo.
  public LinksDef getLinksDef(BeanTypeDef typeDef);

  // Looks up the slice definitions for a type in this repo.
  public SlicesDef getSlicesDef(BeanTypeDef typeDef);

  // Create a pages path for a type in this repo (used to identify
  // pages related to that type).
  public default PagesPath newPagesPath(BeanTypeDef type) {
    return new PagesPath(this, type);
  }

  // Create a page path for a slice of a type in this repo.
  public default SlicePagePath newSlicePagePath(BeanTypeDef typeDef, Path slice) {
    return PagePath.newSlicePagePath(newPagesPath(typeDef), slice);
  }

  // Create a page path for the create form of a type in this repo.
  public default CreateFormPagePath newCreateFormPagePath(BeanTypeDef typeDef) {
    return PagePath.newCreateFormPagePath(newPagesPath(typeDef));
  }

  // Create a page path for a table of instances of a type in this repo.
  public default TablePagePath newTablePagePath(BeanTypeDef typeDef) {
    return PagePath.newTablePagePath(newPagesPath(typeDef));
  }

  public default boolean isSupportsDashboards() {
    // By default, dashboards are supported only if custom filtering dashboards are supported.
    // This may change when support for other kinds of dashboards is added.
    return isSupportsCustomFilteringDashboards();
  }

  public default boolean isSupportsCustomFilteringDashboards() {
    // By default custom filtering dashboards are not supported.
    // i.e. only the monitoring tree supports custom filtering dashboards,
    // the config trees don't.
    return false;
  }
}
