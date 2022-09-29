// Copyright (c) 2020, 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import weblogic.remoteconsole.common.utils.Path;

/**
 * This abstract class walks over all the pages.
 * <p>
 * Derived classes that need to process all the pages extend this class (e.g. for generating the
 * resource bundles and search indexes) so that they only need to focus on processing each page,
 * instead of walking to each page.
 * <p>
 * Usage pattern:
 * <p>
 * The derived class extends this class and implements the processPage method.
 * <p>
 * Its constructor calls this constructor, passing in the page repo def
 * that contains the pages to walk.
 * <p>
 * After the derived class is constructed, the caller should call the 'walk' method. This causes
 * this class to walk to each page of each perspective for the specified weblogic version, calling
 * 'processPage' for each page it finds.
 */
public abstract class PageDefWalker {

  private PageRepoDef pageRepoDef;
  private Set<String> visitedTypeNames = new HashSet<>();

  private PageRepoDef getPageRepoDef() {
    return this.pageRepoDef;
  }

  private Set<String> getVisitedTypeNames() {
    return this.visitedTypeNames;
  }

  // Methods that are called for various defs.
  // Derived classes should override the ones they're interested in.

  protected void processPageDef(PageDef def) {
  }

  protected void processTypeDef(BeanTypeDef def) {
  }

  protected void processSlicesDef(SlicesDef def) {
  }

  protected void processSliceDef(SliceDef def) {
  }

  protected void processNavTreeDef(NavTreeDef def) {
  }

  protected void processNavTreeNodeDef(NavTreeNodeDef def) {
  }

  protected void processGroupNavTreeNodeDef(GroupNavTreeNodeDef def) {
  }

  protected void processChildNavTreeNodeDef(BeanChildNavTreeNodeDef def) {
  }

  protected void processLinksDef(LinksDef def) {
  }

  protected void processLinkDef(LinkDef def) {
  }

  // Walk all the pages in the repo (single threaded!)
  protected void walk(PageRepoDef pageRepoDef) {
    this.pageRepoDef = pageRepoDef;
    getVisitedTypeNames().clear();
    walkNavTreeDef(getPageRepoDef().getRootNavTreeDef());
    walkTypeDef(getPageRepoDef().getBeanRepoDef().getRootTypeDef());
  }

  protected void walkTypeDef(BeanTypeDef typeDef) {
    String typeName = typeDef.getTypeName();
    if (getVisitedTypeNames().contains(typeName)) {
      return; // already visited this type
    }
    getVisitedTypeNames().add(typeName);
    processTypeDef(typeDef);
    walkNavTreeDef(getPageRepoDef().getNavTreeDef(typeDef));
    walkSlicesDef(getPageRepoDef().getSlicesDef(typeDef));
    walkLinksDef(getPageRepoDef().getLinksDef(typeDef));
    walkPageDef(getPageRepoDef().newTablePagePath(typeDef));
    walkPageDef(getPageRepoDef().newCreateFormPagePath(typeDef));
    walkProperties(typeDef);
    walkChildren(typeDef);
    walkSubTypes(typeDef);
  }

  protected void walkProperties(BeanTypeDef typeDef) {
    for (BeanPropertyDef propertyDef : typeDef.getPropertyDefs()) {
      walkChildTypeDef(typeDef, propertyDef.getParentPath());
    }
  }

  protected void walkChildren(BeanTypeDef typeDef) {
    for (BeanChildDef childDef : typeDef.getChildDefs()) {
      walkChildTypeDef(typeDef, childDef.getParentPath());
    }
  }

  protected void walkChildTypeDef(BeanTypeDef parentTypeDef, Path childPath) {
    if (!childPath.isEmpty()) {
      walkTypeDef(parentTypeDef.getChildDef(childPath).getChildTypeDef());
    }
  }

  protected void walkNavTreeDef(NavTreeDef navTreeDef) {
    if (navTreeDef == null) {
      return; // no child nav tree nodes for this type
    }
    processNavTreeDef(navTreeDef);
    for (NavTreeNodeDef nodeDef : navTreeDef.getContentDefs()) {
      walkNavTreeNodeDef(nodeDef);
    }
  }

  protected void walkNavTreeNodeDef(NavTreeNodeDef nodeDef) {
    processNavTreeNodeDef(nodeDef);
    if (nodeDef.isGroupNodeDef()) {
      walkGroupNodeDef(nodeDef.asGroupNodeDef());
    } else if (nodeDef.isChildNodeDef()) {
      walkChildNodeDef(nodeDef.asChildNodeDef());
    }
  }

  protected void walkGroupNodeDef(GroupNavTreeNodeDef groupNodeDef) {
    processGroupNavTreeNodeDef(groupNodeDef);
    for (NavTreeNodeDef nodeDef : groupNodeDef.getContentDefs()) {
      walkNavTreeNodeDef(nodeDef);
    }
  }

  protected void walkChildNodeDef(BeanChildNavTreeNodeDef childNodeDef) {
    processChildNavTreeNodeDef(childNodeDef);
    walkTypeDef(childNodeDef.getLastChildDef().getChildTypeDef());
  }

  protected void walkSlicesDef(SlicesDef slicesDef) {
    if (slicesDef != null) {
      processSlicesDef(slicesDef);
      walkSliceDefs(slicesDef.getContentDefs());
    }
  }

  protected void walkSliceDefs(List<SliceDef> contentDefs) {
    for (SliceDef sliceDef : contentDefs) {
      walkSliceDef(sliceDef);
    }
  }

  protected void walkSliceDef(SliceDef sliceDef) {
    processSliceDef(sliceDef);
    List<SliceDef> contentDefs = sliceDef.getContentDefs();
    if (contentDefs.isEmpty()) {
      // this is a slice
      walkPageDef(
        getPageRepoDef().newSlicePagePath(
          sliceDef.getSlicesDef().getTypeDef(),
          sliceDef.getPath()
        )
      );
    } else {
      // this is just a container for child slices
      walkSliceDefs(contentDefs);
    }
  }

  protected void walkLinksDef(LinksDef linksDef) {
    if (linksDef != null) {
      processLinksDef(linksDef);
      walkLinkDefs(linksDef.getInstanceLinkDefs());
      walkLinkDefs(linksDef.getCollectionLinkDefs());
    }
  }

  protected void walkLinkDefs(List<LinkDef> linkDefs) {
    for (LinkDef linkDef : linkDefs) {
      processLinkDef(linkDef);
    }
  }

  protected void walkSubTypes(BeanTypeDef typeDef) {
    if (typeDef.isHomogeneous()) {
      return;
    }
    for (String discriminator : typeDef.getSubTypeDiscriminatorLegalValues()) {
      walkTypeDef(typeDef.getSubTypeDef(discriminator));
    }
  }

  protected void walkPageDef(PagePath pagePath) {
    PageDef pageDef = getPageRepoDef().getPageDef(pagePath);
    if (pageDef != null) {
      processPageDef(pageDef);
    } else {
      // the page doesn't exist
      // e.g. the type doesn't have a create form since it doesn't support writing
    }
  }
}