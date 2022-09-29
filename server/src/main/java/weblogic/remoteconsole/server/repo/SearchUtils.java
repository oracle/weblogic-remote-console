// Copyright (c) 2022, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import weblogic.remoteconsole.common.repodef.BeanTypeDef;
import weblogic.remoteconsole.common.repodef.PageDef;
import weblogic.remoteconsole.common.repodef.PagePath;
import weblogic.remoteconsole.common.repodef.PagePropertyDef;
import weblogic.remoteconsole.common.repodef.PageRepoDef;
import weblogic.remoteconsole.common.repodef.SliceDef;
import weblogic.remoteconsole.common.repodef.SliceFormDef;
import weblogic.remoteconsole.common.repodef.SlicesDef;
import weblogic.remoteconsole.common.utils.Path;

/**
 * General purpose utilities for performing searches.
 */
public class SearchUtils {

  // Find all of the basic properties of a type - i.e. the
  // ones for the default displayed columns for searches on the type.
  public static List<PagePropertyDef> getBasicPagePropertyDefs(
    PageRepoDef pageRepoDef,
    BeanTypeDef typeDef
  ) {
    PageDef pageDef = pageRepoDef.getPageDef(pageRepoDef.newTablePagePath(typeDef));
    if (pageDef != null) {
      return pageDef.asTableDef().getDisplayedColumnDefs();
    }
    SliceFormDef formDef = getDefaultSliceFormDef(pageRepoDef, typeDef);
    if (formDef != null) {
      return formDef.getPropertyDefs();
    }
    throw new AssertionError(typeDef + " is not a table and does not have a slice form");
  }

  private static SliceFormDef getDefaultSliceFormDef(PageRepoDef pageRepoDef, BeanTypeDef typeDef) {
    PageDef pageDef = pageRepoDef.getPageDef(pageRepoDef.newSlicePagePath(typeDef, new Path()));
    if (pageDef != null && pageDef.isSliceFormDef()) {
      return pageDef.asSliceFormDef();
    }
    // Need to look walk through all of the type's slices and return the 'first'
    // one that is a slice form.
    return null;
  }

  // Find all of the properties on all of the pages of a type.
  public static Map<String,PagePropertyDef> getPagePropertyDefs(
    PageRepoDef pageRepoDef,
    BeanTypeDef baseTypeDef
  ) {
    Map<String,PagePropertyDef> propertyDefs = new HashMap<>();
    for (BeanTypeDef typeDef : getTypeDefs(baseTypeDef)) {
      addTablePropertyDefs(pageRepoDef, typeDef, propertyDefs);
      addSlicesPropertyDefs(pageRepoDef, typeDef, propertyDefs);
    }
    return propertyDefs;
  }

  // Finds all of the types that can have pages for a type
  // and its derived types.
  public static List<BeanTypeDef> getTypeDefs(BeanTypeDef baseTypeDef) {
    if (baseTypeDef.isHomogeneous()) {
      return List.of(baseTypeDef);
    }
    List<BeanTypeDef> typeDefs = new ArrayList<>();
    typeDefs.add(baseTypeDef);
    for (String disc : baseTypeDef.getSubTypeDiscriminatorLegalValues()) {
      typeDefs.add(baseTypeDef.getSubTypeDef(disc));
    }
    return typeDefs;
  }

  private static void addTablePropertyDefs(
    PageRepoDef pageRepoDef,
    BeanTypeDef typeDef,
    Map<String,PagePropertyDef> propertyDefs
  ) {
    addPagePathPropertyDefs(pageRepoDef, pageRepoDef.newTablePagePath(typeDef), propertyDefs);
  }

  private static void addSlicesPropertyDefs(
    PageRepoDef pageRepoDef,
    BeanTypeDef typeDef,
    Map<String,PagePropertyDef> propertyDefs
  ) {
    SlicesDef slicesDef = pageRepoDef.getSlicesDef(typeDef);
    if (slicesDef != null) {
      addSlicesPropertyDefs(pageRepoDef, typeDef, new Path(), slicesDef.getContentDefs(), propertyDefs);
    }
  }

  private static void addSlicesPropertyDefs(
    PageRepoDef pageRepoDef,
    BeanTypeDef typeDef,
    Path parentPath,
    List<SliceDef> sliceDefs,
    Map<String,PagePropertyDef> propertyDefs
  ) {
    if (sliceDefs != null) {
      for (SliceDef sliceDef : sliceDefs) {
        Path slicePath = parentPath.childPath(sliceDef.getName());
        addPagePathPropertyDefs(
          pageRepoDef,
          pageRepoDef.newSlicePagePath(typeDef, slicePath),
          propertyDefs
        );
        addSlicesPropertyDefs(pageRepoDef, typeDef, slicePath, sliceDef.getContentDefs(), propertyDefs);
      }
    }
  }

  private static void addPagePathPropertyDefs(
    PageRepoDef pageRepoDef,
    PagePath pagePath,
    Map<String,PagePropertyDef> propertyDefs
  ) {
    // Should call pageRepo.getPageDef(ic) so that it can call the page def's customizer.
    // But that returns a Response<Void>, which needs to bubble up many layers.
    // For now, since none of the pages that are searched customize their page defs,
    // just use the page repo def to get the uncustomize page def.
    PageDef pageDef = pageRepoDef.getPageDef(pagePath);
    if (pageDef != null) {
      // weed out page-specific properties?
      for (PagePropertyDef propertyDef : pageDef.getAllPropertyDefs()) {
        String propertyName = propertyDef.getFormPropertyName();
        if (!propertyDefs.containsKey(propertyName)) {
          propertyDefs.put(propertyName, propertyDef);
        }
      }
    }
  }
}
