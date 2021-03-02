// Copyright (c) 2020, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.pagedesc;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Stack;
import java.util.logging.Logger;

import weblogic.console.backend.typedesc.SubType;
import weblogic.console.backend.typedesc.WeblogicBeanProperty;
import weblogic.console.backend.typedesc.WeblogicBeanType;
import weblogic.console.backend.typedesc.WeblogicBeanTypes;
import weblogic.console.backend.utils.Path;
import weblogic.console.backend.utils.YamlUtils;

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
 * Its constructor calls this constructor, passing in the weblogic version and whether the walker
 * should stop when it sees the type again (v.s. when it sees the type again in the folded bean
 * path).
 * <p>
 * After the derived class is constructed, the caller should call the 'walk' method. This causes
 * this class to walk to each page of each perspective for the specified weblogic version, calling
 * 'processPage' for each page it finds.
 */
public class PageSourceWalker {

  private static final Logger LOGGER = Logger.getLogger(PageSourceWalker.class.getName());

  // The root pages path of the perspective currently being processed
  private PagesPath rootPagesPath;

  private PagesPath getRootPagesPath() {
    return this.rootPagesPath;
  }

  AbstractVisitedTypes visitedTypes;

  private AbstractVisitedTypes getVisitedTypes() {
    return this.visitedTypes;
  }

  private WeblogicPageSources weblogicPageSources;

  protected WeblogicPageSources getWeblogicPageSources() {
    return this.weblogicPageSources;
  }

  protected WeblogicBeanTypes getTypes() {
    return getWeblogicPageSources().getTypes();
  }

  // Constructor
  //
  // weblogicVersion, e.g. 14.1.1.0.0, specifies the name of the weblogic version
  // to walk (since each version can have different pages)
  //
  // oncePerType specifies how the walker should detect recursion.
  // if true, it stops walking a type if it has already visited that type
  // in the current perspective.
  // if false, it stops walking a type if it has already visited that type
  // in the current folded bean path.
  public PageSourceWalker(String weblogicVersion, boolean oncePerType) {
    this.weblogicPageSources = new WeblogicPageSources(weblogicVersion);
    this.visitedTypes =
      (oncePerType)
      ? new OncePerTypeVisitedTypes()
      : new OncePerPathVisitedTypes();
  }

  // Processes a visited page.  Derived classes should override this to add their per-page handling.
  //
  // pageSource describes the page (including its bean type and perspective)
  //
  // foldedBeanPath is the folded bean path to the page (minus identities)
  protected void processPage(WeblogicPageSource pageSource, Path foldedBeanPath) throws Exception {
  }

  // Walk all the pages.
  protected void walk() throws Exception {
    walkPerspective(PagesPath.newConfigurationRootPagesPath(getTypes()));
    walkPerspective(PagesPath.newMonitoringRootPagesPath(getTypes()));
    // Uncomment when we add the control perspective
    // walkPerspective(PagesPath.newControlRootPagesPath(getTypes()));
  }

  // Walk all the pages for a perspective
  private void walkPerspective(PagesPath rootPagesPath) throws Exception {

    // Get ready to walk this perspective
    this.rootPagesPath = rootPagesPath;
    getVisitedTypes().clear();

    // Walk all the pages starting at this perspective's root bean type
    walkType(getRootPagesPath(), new Path(), false); // not walking a sub walk
  }

  // Walk everything about this type/path
  private void walkType(
    PagesPath pagesPath,
    Path foldedBeanPath,
    boolean asSubType
  ) throws Exception {
    String beanTypeName = pagesPath.getBeanType().getName();

    // Find out if we need to visit this type and to what level
    VisitLevel level = getVisitedTypes().getVisitLevel(beanTypeName, asSubType);

    if (level == VisitLevel.Visited) {
      return; // we've already visited this type/path
    }

    getVisitedTypes().startVisiting(beanTypeName, asSubType);

    if (level == VisitLevel.VisitAsBaseType || level == VisitLevel.RevisitAsBaseType) {
      // table and create form pages are only on the base type
      // sub types use the base type's table & create form pages
      walkTable(pagesPath, foldedBeanPath);
      walkCreateForm(pagesPath, foldedBeanPath);
    }

    if (level != VisitLevel.RevisitAsBaseType) {
      // walk this type's slices
      walkSlices(
        pagesPath,
        new Path(),
        getWeblogicPageSources().getSlicesSource(pagesPath).getSlices(),
        foldedBeanPath
      );
      // walk this type's navigation contents
      walkNavigationContents(pagesPath, foldedBeanPath);
      // if this type is heterogeneous, visit its sub types too
      walkSubTypes(pagesPath.getBeanType(), foldedBeanPath);
    }

    getVisitedTypes().finishVisiting();
  }

  // If this type is heterogeneous, walk everything about this type's instantiable sub types
  private void walkSubTypes(WeblogicBeanType type, Path foldedBeanPath) throws Exception {
    if (type.isHomogeneous()) {
      return;
    }
    for (SubType subType : type.getSubTypes()) {
      String beanTypeName = subType.getType();
      WeblogicBeanType subBeanType = getTypes().getType(beanTypeName);
      if (subBeanType != null) {
        walkType(
          getRootPagesPath().newPagesPath(subBeanType),
          foldedBeanPath,
          true // walking a sub type
        );
      } else {
        if (!getTypes().isRemoveMissingPropertiesAndTypes()) {
          YamlUtils.configurationError("can't find type  " + beanTypeName);
        } else {
          // this sub type isn't supported buy this WLS version. that's OK - just skip it.
        }
      }
    }
  }

  // Walk this type's slices
  private void walkSlices(
    PagesPath pagesPath,
    Path slicePath,
    List<SliceSource> sliceSources,
    Path foldedBeanPath
  ) throws Exception {
    if (sliceSources.isEmpty()) {
      YamlUtils.configurationError("no slices for " + pagesPath + " " + foldedBeanPath);
    }
    for (SliceSource sliceSource : sliceSources) {
      Path childSlicePath = slicePath.childPath(sliceSource.getName());
      if (sliceSource.getSlices().isEmpty()) {
        // this is a form - walk it
        PagePath slicePagePath = PagePath.newSlicePagePath(pagesPath, childSlicePath);
        WeblogicPageSource slicePageSource = getWeblogicPageSources().getPageSource(slicePagePath);
        processPage(slicePageSource, foldedBeanPath);
      } else {
        // this is just a slice that organizes other slices - walk them
        walkSlices(pagesPath, childSlicePath, sliceSource.getSlices(), foldedBeanPath);
      }
    }
  }

  // Walk this type's table if needed
  private void walkTable(PagesPath pagesPath, Path foldedBeanPath) throws Exception {
    WeblogicBeanProperty property = getBeanProperty(foldedBeanPath);
    if (property == null) {
      return; // root type or a type/property not present in this WLS version
    }
    if (!property.isContainedCollection()) {
      return; // only collections have tables
    }
    PagePath pagePath = PagePath.newTablePagePath(pagesPath);
    WeblogicPageSource pageSource = getWeblogicPageSources().getPageSource(pagePath);
    processPage(pageSource, foldedBeanPath);
  }

  // Walk this type's create form if needed
  private void walkCreateForm(PagesPath pagesPath, Path foldedBeanPath) throws Exception {
    if (!"configuration".equals(pagesPath.getPerspectivePath().getPerspective())) {
      // this perspective doesn't support editing (therefore doesn't support create)
      return;
    }
    WeblogicBeanProperty property = getBeanProperty(foldedBeanPath);
    if (property == null) {
      return; // root type or a type/property that isn't supported in this WLS version
    }
    if (!property.isContainedCollection() && !property.isCreatableContainedOptionalSingleton()) {
      return; // this property doesn't support create (e.g. nonCreatableOptionalSingleton)
    }
    PagePath pagePath = PagePath.newCreateFormPagePath(pagesPath);
    WeblogicPageSource pageSource = getWeblogicPageSources().getPageSource(pagePath);
    processPage(pageSource, foldedBeanPath);
  }

  // Walk this type's nav tree nodes
  private void walkNavigationContents(PagesPath pagesPath, Path foldedBeanPath) throws Exception {
    for (
      NavigationNodeSource navigationNode :
      getWeblogicPageSources().getNavigationSource(pagesPath).getContents()
    ) {
      walkNavigationNode(navigationNode, pagesPath, foldedBeanPath);
    }
  }

  // Walk a nav tree node
  private void walkNavigationNode(
    NavigationNodeSource navigationNode,
    PagesPath pagesPath,
    Path foldedBeanPath
  ) throws Exception {
    NavigationNodeSource.Type type = navigationNode.getType();
    if (NavigationNodeSource.Type.group == type) {
      walkNavigationGroupNode(navigationNode, pagesPath, foldedBeanPath);
    } else if (NavigationNodeSource.Type.root == type) {
      walkNavigationRootNode(navigationNode, pagesPath, foldedBeanPath);
    } else if (NavigationNodeSource.Type.beanProperty == type) {
      walkNavigationBeanPropertyNode(navigationNode, pagesPath, foldedBeanPath);
    } else {
      throw new AssertionError("Impossible nav tree node type: " + type);
    }
  }

  // Walk a nav tree group node
  private void walkNavigationGroupNode(
    NavigationNodeSource navigationNode,
    PagesPath pagesPath,
    Path foldedBeanPath
  ) throws Exception {
    // Just process the group's child nav tree nodes
    for (NavigationNodeSource childNavigationNode : navigationNode.getContents()) {
      walkNavigationNode(childNavigationNode, pagesPath, foldedBeanPath);
    }
  }

  // Walk a nav tree root node
  private void walkNavigationRootNode(
    NavigationNodeSource navigationNode,
    PagesPath pagesPath,
    Path foldedBeanPath
  ) throws Exception {
    // We got here from processing the root type so
    // just process any child nav tree nodes
    for (NavigationNodeSource childNavigationNode : navigationNode.getContents()) {
      walkNavigationNode(childNavigationNode, pagesPath, foldedBeanPath);
    }
  }

  // Walk a nav tree bean property node
  private void walkNavigationBeanPropertyNode(
    NavigationNodeSource navigationNode,
    PagesPath pagesPath,
    Path foldedBeanPath
  ) throws Exception {
    // get the bean property
    Path propertyFoldedBeanPath = foldedBeanPath.childPath(navigationNode.getProperty());
    WeblogicBeanProperty beanProperty = getBeanProperty(propertyFoldedBeanPath);
    if (beanProperty == null) {
      // the nav tree references the property but this version of WLS doesn't have it.
      // that's ok - just skip it
      return;
    }
    // Walk the bean property node's pages
    walkType(
      getRootPagesPath().newPagesPath(beanProperty.getBeanType()),
      propertyFoldedBeanPath,
      false // not walking a sub type
    );

    // bean property nodes are not supposed to have any child nav tree nodes so just stop here
  }

  // Find the WeblogicBeanProperty for a contained bean/beans property from its folded bean path
  private WeblogicBeanProperty getBeanProperty(Path foldedBeanPath) throws Exception {

    if (foldedBeanPath.isEmpty()) {
      // This is the root bean type.  There is no property to get to it.
      return null;
    }

    // Figure out the property's name
    String propertyName = foldedBeanPath.getLastComponent();

    // Figure out the property's parent
    Path parentFoldedBeanPath = foldedBeanPath.subPath(0, foldedBeanPath.length() - 1);
    WeblogicBeanType rootType = getRootPagesPath().getPerspectivePath().getRootBeanType();
    WeblogicBeanType parentType =
      rootType.getTypes().getType(rootType.getName(), parentFoldedBeanPath);
    if (parentType == null) {
      YamlUtils.configurationError(
        "getBeanProperty: can't type "
        + rootType + " "
        + parentType
        + " " + foldedBeanPath
      );
      return null;
    }

    // Try to get the property from its parent
    WeblogicBeanProperty property = parentType.getProperty("getBeanProperty", propertyName);
    if (property == null) {
      // the nav tree references it, but the property doesn't exist in this version of WLS.
      // that's OK - just ignore it.
      return null;
    }

    // Make sure the property is a contained bean or collection of beans
    if (!property.isContainedCollection() && !property.isContainedOptionalSingleton()) {
      YamlUtils.configurationError(
        "not a contained collection or contained optional singleton "
        + foldedBeanPath
      );
      return null;
    }

    // The property's valid - send it back
    return property;
  }

  // Used to track types that can only be visited as a base type
  // once per perspective
  private class OncePerTypeVisitedTypes extends AbstractVisitedTypes {

    // Keep a map of the types we've already visited
    private Map<String, VisitedType> visitedTypes = new HashMap<>();

    private Map<String, VisitedType> getVisitedTypes() {
      return this.visitedTypes;
    }

    // See if a type has already been processed in this perspective
    @Override
    public VisitedType getVisitedType(String beanTypeName) {
      return getVisitedTypes().get(beanTypeName);
    }

    // Start visiting a type in this perspective
    @Override
    public void startVisiting(VisitedType visitedType) {
      getVisitedTypes().put(visitedType.getBeanTypeName(), visitedType);
    }

    // Finish visiting a type in this perspective
    @Override
    public void finishVisiting() {
    }

    // Clear out the visited types so we can start processing a new perspective
    @Override
    public void clear() {
      getVisitedTypes().clear();
    }
  }

  // Used to track types that can only be visited as a base type
  // once in a folded bean path
  private class OncePerPathVisitedTypes extends AbstractVisitedTypes {

    // Keep a stack of the types we've visited in the current fold bean path
    private Stack<VisitedType> visitedTypes = new Stack<>();

    private Stack<VisitedType> getVisitedTypes() {
      return this.visitedTypes;
    }

    // See if a type is already in the current folded bean path
    @Override
    public VisitedType getVisitedType(String beanTypeName) {
      VisitedType rtn = null;
      for (VisitedType visitedType : getVisitedTypes()) {
        if (beanTypeName.equals(visitedType.getBeanTypeName())) {
          if (visitedType.isVisitedAsBaseType()) {
            // The type matches and the type has been fully visited.  Return it.
            return visitedType;
          } else {
            // The type matches but has only been visited as a sub type.
            // Hold on to it to return if we can't find a match
            // that has been fully visited.
            rtn = visitedType;
          }
        }
      }
      return rtn;
    }

    // Push a type to the current folded bean path
    @Override
    public void startVisiting(VisitedType visitedType) {
      getVisitedTypes().push(visitedType);
    }

    // Pop the current type from the current folded bean path
    @Override
    public void finishVisiting() {
      getVisitedTypes().pop();
    }

    // Clear out the stack so we can start processing a new perspective
    @Override
    public void clear() {
      getVisitedTypes().clear();
    }
  }

  // Tells the walker what level of visiting to do
  private enum VisitLevel {
    Visited,
    RevisitAsBaseType,
    VisitAsBaseType,
    VisitAsSubType
  }

  // Abstract class used by the walker to decide that
  // types have already been visited and how they were
  // processed (i.e. as a sub type or as a base type)
  private abstract class AbstractVisitedTypes {

    // Find out what level of visting the walker should do.
    VisitLevel getVisitLevel(String beanTypeName, boolean asSubType) {
      VisitedType visitedType = getVisitedType(beanTypeName);
      if (visitedType == null) {
        // We haven't seen this type yet.
        if (asSubType) {
          // Process it as a sub type.
          // i.e. slices, nav contents, sub types, no tables or create forms
          return VisitLevel.VisitAsSubType;
        } else {
          // Process it as a base type.
          // i.e. slices, nav contents, sub types, tables, create forms
          return VisitLevel.VisitAsBaseType;
        }
      } else {
        // We've already seen this type.
        if (asSubType) {
          // We've already at least processed it as a sub type,
          // so we don't have to do anything more.
          return VisitLevel.Visited;
        } else {
          if (visitedType.isVisitedAsBaseType()) {
            // We've already processed it fully,
            // so we don't have to do anything more.
            return VisitLevel.Visited;
          } else {
            // We previously processed it as a sub type
            // (i.e. slices, nav contents, sub types)
            // so we have to finish processing it
            // (i.e. tables, create forms)
            return VisitLevel.RevisitAsBaseType;
          }
        }
      }
    }

    // Record that we've started visiting this type
    void startVisiting(String beanTypeName, boolean asSubType) {
      startVisiting(new VisitedType(beanTypeName, !asSubType));
    }

    abstract void startVisiting(VisitedType visitedType);

    // Find out how much we've processed this type already
    abstract VisitedType getVisitedType(String beanTypeName);

    // Record that we've started visiting this type at this level
    // Record that we're done visiting this type at this level
    abstract void finishVisiting();

    // Clear out all the visiting state so that we can start
    // walking another perspective
    abstract void clear();

    // Just a POJO that holds the name of a visited type
    // and whether it was visited as a base type (v.s. as a sub type)
    protected class VisitedType {
      String beanTypeName;

      private String getBeanTypeName() {
        return this.beanTypeName;
      }

      boolean visitedAsBaseType;

      private boolean isVisitedAsBaseType() {
        return this.visitedAsBaseType;
      }

      private VisitedType(String beanTypeName, boolean visitedAsBaseType) {
        this.beanTypeName = beanTypeName;
        this.visitedAsBaseType = visitedAsBaseType;
      }
    }
  }
}
