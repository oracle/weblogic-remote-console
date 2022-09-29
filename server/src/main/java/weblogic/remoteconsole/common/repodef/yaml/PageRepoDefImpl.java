// Copyright (c) 2021, 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.yaml;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

import weblogic.remoteconsole.common.repodef.BeanRepoDef;
import weblogic.remoteconsole.common.repodef.BeanTypeDef;
import weblogic.remoteconsole.common.repodef.CreateFormPagePath;
import weblogic.remoteconsole.common.repodef.LinksDef;
import weblogic.remoteconsole.common.repodef.NavTreeDef;
import weblogic.remoteconsole.common.repodef.PageDef;
import weblogic.remoteconsole.common.repodef.PagePath;
import weblogic.remoteconsole.common.repodef.PageRepoDef;
import weblogic.remoteconsole.common.repodef.PagesPath;
import weblogic.remoteconsole.common.repodef.SliceDef;
import weblogic.remoteconsole.common.repodef.SlicePagePath;
import weblogic.remoteconsole.common.repodef.SlicesDef;
import weblogic.remoteconsole.common.repodef.TablePagePath;
import weblogic.remoteconsole.common.repodef.schema.CreateFormDefSource;
import weblogic.remoteconsole.common.repodef.schema.NavTreeDefSource;
import weblogic.remoteconsole.common.repodef.schema.SliceFormDefSource;
import weblogic.remoteconsole.common.repodef.schema.SliceTableDefSource;
import weblogic.remoteconsole.common.repodef.schema.SlicesDefSource;
import weblogic.remoteconsole.common.repodef.schema.TableDefSource;
import weblogic.remoteconsole.common.utils.Path;

/**
 * yaml-based implemetation of the PageRepoDef interface
 */
public abstract class PageRepoDefImpl implements PageRepoDef {
  private String name;
  private BeanRepoDefImpl beanRepoDefImpl;
  private YamlReader yamlReader;
  private String rootName;
  private Optional<NavTreeDefImpl> rootNavTreeDefImpl;

  // Maps a page path's key  to the page definition (or null if the page doesn't exist)
  private Map<String, Optional<PageDefImpl>> pagePathToPageDefImplMap = new ConcurrentHashMap<>();

  // Maps a pages path's key  to a list of nav tree nodes
  // (or null if the page's type doesn't exist or
  // if it doesn't define any nav tree nodes)
  private Map<String, Optional<NavTreeDefImpl>> pagesPathToNavTreeDefImplMap = new ConcurrentHashMap<>();

  // Maps a pages path's key  to a list of links
  // (or null if the page's type doesn't exist
  // or if it doesn't define any links)
  private Map<String, Optional<LinksDefImpl>> pagesPathToLinksDefImplMap = new ConcurrentHashMap<>();

  // Maps a pages path's key  to the tree of slices for the type
  // (or null if the page's type doesn't exist
  // or if it doesn't define any slices)
  private Map<String, Optional<SlicesDefImpl>> pagesPathToSlicesDefImplMap = new ConcurrentHashMap<>();

  protected PageRepoDefImpl(
    String name,
    BeanRepoDefImpl beanRepoImpl,
    YamlReader yamlReader,
    String rootName
  ) {
    this.name = name;
    this.beanRepoDefImpl = beanRepoImpl;
    this.yamlReader = yamlReader;
    this.rootName = rootName;
  }

  @Override
  public String getName() {
    return this.name;
  }

  BeanRepoDefImpl getBeanRepoDefImpl() {
    return this.beanRepoDefImpl;
  }

  @Override
  public BeanRepoDef getBeanRepoDef() {
    return getBeanRepoDefImpl();
  }

  YamlReader getYamlReader() {
    return this.yamlReader;
  }

  private Map<String, Optional<PageDefImpl>> getPagePathToPageDefImplMap() {
    return this.pagePathToPageDefImplMap;
  }

  private Map<String, Optional<NavTreeDefImpl>> getPagesPathToNavTreeDefImplMap() {
    return this.pagesPathToNavTreeDefImplMap;
  }

  private Map<String, Optional<LinksDefImpl>> getPagesPathToLinksDefImplMap() {
    return this.pagesPathToLinksDefImplMap;
  }

  private Map<String, Optional<SlicesDefImpl>> getPagesPathToSlicesDefImplMap() {
    return this.pagesPathToSlicesDefImplMap;
  }

  PageDefImpl getPageDefImpl(PagePath pagePath) {
    String key = pagePath.getKey();
    Optional<PageDefImpl> opt = getPagePathToPageDefImplMap().get(key);
    if (opt == null) {
      opt = Optional.ofNullable(createPageDefImpl(pagePath));
      getPagePathToPageDefImplMap().put(key, opt);
    }
    return opt.isPresent() ? opt.get() : null;
  }

  @Override
  public PageDef getPageDef(PagePath pagePath) {
    return getPageDefImpl(pagePath);
  }

  private PageDefImpl createPageDefImpl(PagePath pagePath) {
    if (pagePath.isSlicePagePath()) {
      return createSliceDefImpl(pagePath.asSlicePagePath());
    } else if (pagePath.isCreateFormPagePath()) {
      return createCreateFormDefImpl(pagePath.asCreateFormPagePath());
    } else if (pagePath.isTablePagePath()) {
      return createTableDefImpl(pagePath.asTablePagePath());
    } else {
      throw new AssertionError("Not a table, slice form or create form : " + pagePath);
    }
  }

  private CreateFormDefImpl createCreateFormDefImpl(CreateFormPagePath pagePath) {
    CreateFormDefSource source = getYamlReader().getCreateFormDefSource(pagePath);
    return (source != null) ? new CreateFormDefImpl(this, pagePath, source) : null;
  }

  private TableDefImpl createTableDefImpl(TablePagePath pagePath) {
    TableDefSource source = getYamlReader().getTableDefSource(pagePath);
    return (source != null) ? new TableDefImpl(this, pagePath, source) : null;
  }

  private PageDefImpl createSliceDefImpl(SlicePagePath pagePath) {
    SlicesDefImpl slicesDefImpl = getSlicesDefImpl(pagePath.getPagesPath().getTypeDef());
    if (slicesDefImpl == null) {
      return null; // this type doesn't have any slices
    }
    SlicePagePath resolvedPagePath = resolveSlicePagePath(pagePath, slicesDefImpl);
    {
      SliceFormDefSource source = getYamlReader().getSliceFormDefSource(resolvedPagePath, slicesDefImpl);
      if (source != null) {
        return new SliceFormDefImpl(this, resolvedPagePath, source);
      }
    }
    {
      SliceTableDefSource source = getYamlReader().getSliceTableDefSource(resolvedPagePath, slicesDefImpl);
      if (source != null) {
        return new SliceTableDefImpl(this, resolvedPagePath, source);
      }
    }
    return null;
  }

  private SlicePagePath resolveSlicePagePath(SlicePagePath pagePath, SlicesDefImpl slicesDefImpl) {
    PagesPath pagesPath = pagePath.getPagesPath();
    Path actualSlicePath =
      computeActualSlicePath(
        pagesPath,
        new Path(), // parent slice path
        pagePath.getSlicePath(), // relative page path
        slicesDefImpl.getContentDefs()
      );
    return PagePath.newSlicePagePath(pagesPath, actualSlicePath);
  }

  private Path computeActualSlicePath(
    PagesPath pagesPath,
    Path parentSlicePath,
    Path relativeSlicePath,
    List<SliceDef> sliceDefs
  ) {
    if (relativeSlicePath.isEmpty()) {
      // The user didn't specify the slice name for this level.  Use the default one.
      if (sliceDefs.isEmpty()) {
        throw new AssertionError("Empty slices " + pagesPath + " " + parentSlicePath);
      }
      SliceDef sliceDef = sliceDefs.get(0); // i.e. the left-most slice at this level
      return computeActualSlicePath(pagesPath, parentSlicePath, relativeSlicePath, sliceDef);
    } else {
      // The user specified the slice name for this level. Find it and use it to keep going.
      String sliceName = relativeSlicePath.getFirstComponent();
      for (SliceDef sliceDef : sliceDefs) {
        if (sliceDef.getName().equals(sliceName)) {
          return computeActualSlicePath(pagesPath, parentSlicePath, relativeSlicePath, sliceDef);
        }
      }
      throw new AssertionError("Can't find slice " + pagesPath + " " + parentSlicePath + " " + sliceName); 
    }
  }

  private Path computeActualSlicePath(
    PagesPath pagesPath,
    Path parentSlicePath,
    Path relativeSlicePath,
    SliceDef sliceDef
  ) {
    Path slicePath = parentSlicePath.childPath(sliceDef.getName());
    List<SliceDef> nextSliceDefs = sliceDef.getContentDefs();
    if (nextSliceDefs.isEmpty()) {
      // leaf slice and no more components in the relative slice path.
      // Use this slice.
      return slicePath;
    } else {
      // not a leaf slice. keep going.
      Path nextParentSlicePath = slicePath;
      Path nextRelativeSlicePath =
        (relativeSlicePath.isEmpty()) ? new Path() : relativeSlicePath.subPath(1, -1);
      return
        computeActualSlicePath(
          pagesPath,
          nextParentSlicePath,
          nextRelativeSlicePath,
          nextSliceDefs
        );
    }
  }

  NavTreeDefImpl getNavTreeDefImpl(BeanTypeDef typeDef) {
    String key = typeDef.getTypeName();
    Optional<NavTreeDefImpl> opt = getPagesPathToNavTreeDefImplMap().get(key);
    if (opt == null) {
      opt = Optional.ofNullable(createNavTreeDefImpl(typeDef));
      getPagesPathToNavTreeDefImplMap().put(key, opt);
    }
    return opt.isPresent() ? opt.get() : null;
  }

  @Override
  public NavTreeDef getNavTreeDef(BeanTypeDef typeDef) {
    return getNavTreeDefImpl(typeDef);
  }

  synchronized NavTreeDefImpl getRootNavTreeDefImpl() {
    if (rootNavTreeDefImpl == null) {
      rootNavTreeDefImpl = Optional.ofNullable(createRootNavTreeDefImpl());
    }
    return  rootNavTreeDefImpl.isPresent() ? rootNavTreeDefImpl.get() : null;
  }

  @Override
  public NavTreeDef getRootNavTreeDef() {
    return getRootNavTreeDefImpl();
  }

  private NavTreeDefImpl createRootNavTreeDefImpl() {
    NavTreeDefSource source = getYamlReader().getRootNavTreeDefSource(rootName);
    if (source == null) {
      return null;
    }
    return new NavTreeDefImpl(this, source, getBeanRepoDefImpl().getRootTypeDefImpl());
  }

  private NavTreeDefImpl createNavTreeDefImpl(BeanTypeDef typeDef) {
    NavTreeDefSource source = getYamlReader().getNavTreeDefSource(typeDef.getTypeName());
    if (source == null) {
      return null;
    }
    return new NavTreeDefImpl(this, source, getTypeDefImpl(typeDef));
  }

  LinksDefImpl getLinksDefImpl(BeanTypeDef typeDef) {
    String key = typeDef.getTypeName();
    Optional<LinksDefImpl> opt = getPagesPathToLinksDefImplMap().get(key);
    if (opt == null) {
      opt = Optional.ofNullable(createLinksDefImpl(typeDef));
      getPagesPathToLinksDefImplMap().put(key, opt);
    }
    return opt.isPresent() ? opt.get() : null;
  }

  @Override
  public LinksDef getLinksDef(BeanTypeDef typeDef) {
    return getLinksDefImpl(typeDef);
  }

  private LinksDefImpl createLinksDefImpl(BeanTypeDef typeDef) {
    LinksDefImpl rtn = new LinksDefImpl(this, getYamlReader().getLinksDefSource(typeDef), getTypeDefImpl(typeDef));
    return (rtn.getInstanceLinkDefs().isEmpty() && rtn.getCollectionLinkDefs().isEmpty()) ? null : rtn;
  }

  SlicesDefImpl getSlicesDefImpl(BeanTypeDef typeDef) {
    String key = typeDef.getTypeName();
    Optional<SlicesDefImpl> opt = getPagesPathToSlicesDefImplMap().get(key);
    if (opt == null) {
      opt = Optional.ofNullable(createSlicesDefImpl(typeDef));
      getPagesPathToSlicesDefImplMap().put(key, opt);
    }
    return opt.isPresent() ? opt.get() : null;
  }

  @Override
  public SlicesDef getSlicesDef(BeanTypeDef typeDef) {
    return getSlicesDefImpl(typeDef);
  }

  private SlicesDefImpl createSlicesDefImpl(BeanTypeDef typeDef) {
    SlicesDefSource source = getYamlReader().getSlicesDefSource(typeDef);
    if (source == null) {
      return null;
    } else {
      return new SlicesDefImpl(this, source, getTypeDefImpl(typeDef));
    }
  }

  String getLocalizationKey(String key) {
    return key;
  }

  private BaseBeanTypeDefImpl getTypeDefImpl(BeanTypeDef typeDef) {
    return getBeanRepoDefImpl().getTypeDefImpl(typeDef.getTypeName());
  }
}
