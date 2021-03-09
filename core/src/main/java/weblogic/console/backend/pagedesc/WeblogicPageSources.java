// Copyright (c) 2020, 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.pagedesc;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.logging.Logger;

import weblogic.console.backend.typedesc.WeblogicBeanType;
import weblogic.console.backend.typedesc.WeblogicBeanTypes;
import weblogic.console.backend.utils.Path;
import weblogic.console.backend.utils.StringUtils;
import weblogic.console.backend.utils.YamlUtils;

/**
 * This class returns all of the source information about a weblogic bean's
 * form / table pages for a specific weblogic version.
 * <p>
 * It does this by converting all of the relevant yaml configuration files to POJOS and return them.
 * <p>
 * For example, for the cluster config general page, it gathers information from:
 * <ul>
 *   <li>bean type information
 *     <ul>
 *       <li>harvestedWeblogicBeanTypes/14.1.1.0.0/ClusterMBean.yaml</li>
 *       <li>ClusterMBean/type.yaml (and inherited types)</li>
 *     </ul>
 *   </li>
 *   <li>slice information
 *     <ul>
 *       <li>ClusterMBean/slices.yaml</li>
 *     </ul>
 *   </li>
 *   <li>page information
 *     <ul>
 *       <li>ClusterMBean/slices/General/form.yaml</li>
 *     </ul>
 *   <li>
 * </ul>
 * <p>
 * And, for the clusters table, it gathers information from:
 * <ul>
 *   <li>bean type information
 *     <ul>
 *       <li>harvestedWeblogicBeanTypes/14.1.1.0.0/ClusterMBean.yaml</li>
 *       <li>ClusterMBean/type.yaml (and inherited types)</li>
 *     </ul>
 *   </li>
 *   <li>page information
 *     <ul>
 *       <li>ClusterMBean/table.yaml</li>
 *     </ul>
 *   </li>
 * </ul>
 * <p>
 * And, for the server's channels table, it gathers information from:
 * <ul>
 *   <li>bean type information
 *     <ul>
 *       <li>harvestedWeblogicBeanTypes/14.1.1.0.0/NetworkAccessPointMBean.yaml</li>
 *       <li>NetworkAccessPointMBean/type.yaml (and inherited types)</li>
 *     </ul>
 *   </li>
 *   <li>page information
 *     <ul>
 *       <li>NetworkAccessPointMBean/table.yaml</li>
 *     </ul>
 *   </li>
 * </ul>
 * <p>
 * This class gradually reads in the corresponding yaml files as information about different
 * types is requested, and caches the effective configurations so that subsequent access is fast.
 */
public class WeblogicPageSources {

  private static final Logger LOGGER = Logger.getLogger(WeblogicPageSources.class.getName());

  private WeblogicBeanTypes types;

  public WeblogicBeanTypes getTypes() {
    return this.types;
  }

  // pages path key -> slices source
  private Map<String, SlicesSource> slicesSources = new ConcurrentHashMap<>();

  private Map<String, SlicesSource> getSlicesSources() {
    return this.slicesSources;
  }

  // page path key -> page source (or null if the page doesn't exist)
  private Map<String, Optional<WeblogicPageSource>> pageSources = new ConcurrentHashMap<>();

  private Map<String, Optional<WeblogicPageSource>> getPageSources() {
    return this.pageSources;
  }

  // pages path key -> links source
  private Map<String, LinksSource> linksSourcesMap = new ConcurrentHashMap<>();

  private Map<String, LinksSource> getLinksSourcesMap() {
    return linksSourcesMap;
  }

  // pages path key -> navigation source
  private Map<String, NavigationSource> navigationSources = new ConcurrentHashMap<>();

  private Map<String, NavigationSource> getNavigationSources() {
    return this.navigationSources;
  }

  public String getWeblogicVersion() {
    return getTypes().getWeblogicVersion();
  }

  private static final String PDY_ROOT = "";

  public WeblogicPageSources(String weblogicVersion) {
    this.types = new WeblogicBeanTypes(weblogicVersion);
  }

  public LinksSource getLinksSource(PagesPath pagesPath) throws Exception {
    String key = pagesPath.getKey();
    LinksSource ret = getLinksSourcesMap().get(key);
    if (ret == null) {
      ret = createLinksSource(pagesPath);
      getLinksSourcesMap().put(key, ret);
    }
    return ret;
  }

  public NavigationSource getNavigationSource(PagesPath pagesPath) throws Exception {
    String key = pagesPath.getKey();
    NavigationSource navigationSource = getNavigationSources().get(key);
    if (navigationSource == null) {
      navigationSource = createNavigationSource(pagesPath);
      getNavigationSources().put(key, navigationSource);
    }
    return navigationSource;
  }

  private LinksSource createLinksSource(PagesPath pagesPath) throws Exception {
    String linksResourceName = getYamlResourceName(pagesPath, "links.yaml");
    LinksSource ret =
      YamlUtils.read(linksResourceName, LinksSource.class);
    if (ret == null) {
      ret = new LinksSource(); // create an empty one if we don't find one
    }
    return ret;
  }

  private NavigationSource createNavigationSource(PagesPath pagesPath) throws Exception {
    String navigationResourceName = getYamlResourceName(pagesPath, "navigation.yaml");
    NavigationSource navigationSource =
      YamlUtils.read(navigationResourceName, NavigationSource.class);
    if (navigationSource == null) {
      navigationSource = new NavigationSource(); // create an empty one if we don't find one
    }
    return navigationSource;
  }

  public SlicesSource getSlicesSource(PagesPath pagesPath) throws Exception {
    String key = pagesPath.getKey();
    SlicesSource slicesSource = getSlicesSources().get(key);
    if (slicesSource == null) {
      slicesSource = createSlicesSource(pagesPath);
      if (slicesSource == null) {
        // The type doesn't have any slices.
        slicesSource = new SlicesSource();
      }
      getSlicesSources().put(key, slicesSource);
    }
    return slicesSource;
  }

  private SlicesSource createSlicesSource(PagesPath pagesPath) throws Exception {
    String slicesSourceResourceName = getYamlResourceName(pagesPath, "slices.yaml");
    return YamlUtils.read(slicesSourceResourceName, SlicesSource.class);
  }

  public WeblogicPageSource getPageSource(PagePath pagePath) throws Exception {
    String key = pagePath.getKey();
    Optional<WeblogicPageSource> opt = getPageSources().get(key);
    if (opt == null) {
      WeblogicBeanType type = pagePath.getPagesPath().getBeanType();
      if (type == null) {
        LOGGER.warning("can't find type for " + pagePath);
        return null;
      }
      WeblogicPageSource pageSource = null;
      if (pagePath instanceof TablePagePath) {
        pageSource = createTablePageSource((TablePagePath) pagePath, type);
      } else if (pagePath instanceof SlicePagePath) {
        pageSource = createSlicePageSource((SlicePagePath) pagePath, type);
      } else if (pagePath instanceof CreateFormPagePath) {
        pageSource = createCreateFormPageSource((CreateFormPagePath) pagePath, type);
      }
      opt = Optional.ofNullable(pageSource);
      getPageSources().put(key, opt);
      // For forms, if the slice isn't specified in page path, then
      // we compute it and add it to the pageSource's page path.
      // Cache it under both the page path without the slice and
      // the page path with the slice name.
      if (pageSource != null) {
        getPageSources().put(pageSource.getPagePath().getKey(), opt);
      }
    }
    return (opt.isPresent()) ? opt.get() : null;
  }

  private WeblogicPageSource createSlicePageSource(
    SlicePagePath pagePath,
    WeblogicBeanType type
  ) throws Exception {
    return
      createActualSlicePageSource(
        getActualSlicePagePath(pagePath, pagePath.getSlicePath()),
        type
      );
  }

  private WeblogicPageSource createActualSlicePageSource(
    SlicePagePath actualPagePath,
    WeblogicBeanType type
  ) throws Exception {
    if (actualPagePath == null) {
      return null;
    }
    // Possible future - look at the slice to figure out whether it's a slice
    // of the mbean, i.e. a form slice, or a table of children, i.e. a table slice.
    // For now, we only support form slices.
    WeblogicSliceFormSource sliceFormSource = getWeblogicSliceFormSource(actualPagePath);
    if (sliceFormSource == null) {
      return null;
    }
    return new WeblogicSliceFormPageSource(
      actualPagePath,
      type,
      sliceFormSource,
      getSlicesSource(actualPagePath.getPagesPath()).getSlices(),
      getNavigationSource(actualPagePath.getPagesPath()),
      getLinksSource(actualPagePath.getPagesPath())
    );
  }

  private SlicePagePath getActualSlicePagePath(PagePath pagePath, Path slicePath) throws Exception {
    Path actualSlicePath = getActualSlicePath(pagePath, slicePath);
    if (actualSlicePath == null) {
      // couldn't find the slice
      return null;
    }
    return PagePath.newSlicePagePath(pagePath.getPagesPath(), actualSlicePath);
  }

  private Path getActualSlicePath(PagePath pagePath, Path slicePath) throws Exception {
    List<SliceSource> sliceSources = getSlicesSource(pagePath.getPagesPath()).getSlices();
    Path actualSlicePath = new Path();
    for (int i = 0; i < slicePath.length(); i++) {
      String component = slicePath.getComponents().get(i);
      SliceSource sliceSource = findSliceSource(sliceSources, component);
      if (sliceSource == null) {
        // slicePath is referring to a slice that does not exist
        return null;
      }
      boolean isLastComponent = (i == slicePath.length() - 1);
      List<SliceSource> nextSliceSources = sliceSource.getSlices();
      boolean isLeafSlice = nextSliceSources.isEmpty();
      actualSlicePath.addComponent(component);
      sliceSources = nextSliceSources;
      if (isLastComponent && isLeafSlice) {
        // slicePath refers to a leaf slice
        return actualSlicePath;
      }
      if (!isLastComponent && !isLeafSlice) {
        // the slice path and the slices still match - keep walking
      } else if (isLastComponent && !isLeafSlice) {
        // slicePath refers to an intermediate slice
        // return its default slice
        break;
      } else if (!isLastComponent && isLeafSlice) {
        // slicePath refers to a slice that doesn't exist
        return null;
      }
    }
    getDefaultSlicePath(sliceSources, actualSlicePath);
    return actualSlicePath;
  }

  private SliceSource findSliceSource(
    List<SliceSource> sliceSources,
    String slice
  ) throws Exception {
    for (SliceSource sliceSource : sliceSources) {
      if (sliceSource.getName().equals(slice)) {
        return sliceSource;
      }
    }
    return null;
  }

  private void getDefaultSlicePath(
    List<SliceSource> sliceSources,
    Path slicePath
  ) throws Exception {
    if (!sliceSources.isEmpty()) {
      SliceSource first = sliceSources.get(0);
      slicePath.addComponent(first.getName());
      getDefaultSlicePath(first.getSlices(), slicePath);
    }
  }

  WeblogicSliceFormSource getWeblogicSliceFormSource(SlicePagePath pagePath) throws Exception {
    PagesPath pagesPath = pagePath.getPagesPath();
    String localSliceSource = getYamlResourceName(pagePath.getPagesPath(), "slices");
    WeblogicSliceFormSource sliceFormSource =
      getWeblogicSliceFormSource(pagePath, localSliceSource);
    if (sliceFormSource != null) {
      return sliceFormSource;
    }
    for (String alternateSliceSource : getSlicesSource(pagesPath).getAlternateSliceSources()) {
      sliceFormSource = getWeblogicSliceFormSource(pagePath, alternateSliceSource);
      if (sliceFormSource != null) {
        return sliceFormSource;
      }
    }
    YamlUtils.configurationError("can't find slice page " + pagePath);
    return null;
  }

  WeblogicSliceFormSource getWeblogicSliceFormSource(
    SlicePagePath pagePath,
    String sliceSource
  ) throws Exception {
    String sliceFormSourceResourceName =
      sliceSource
      + "/" + pagePath.getSlicePath().getSlashSeparatedPath()
      + "/form.yaml";
    return YamlUtils.read(sliceFormSourceResourceName, WeblogicSliceFormSource.class);
  }

  private WeblogicTablePageSource createTablePageSource(
    TablePagePath pagePath,
    WeblogicBeanType type
  ) throws Exception {
    String tableSourceResourceName = getYamlResourceName(pagePath.getPagesPath(), "table.yaml");
    WeblogicTableSource tableSource =
      YamlUtils.read(tableSourceResourceName, WeblogicTableSource.class);
    if (tableSource == null) {
      YamlUtils.configurationError("can't find table page " + pagePath);
      return null;
    }
    return new WeblogicTablePageSource(pagePath, type, tableSource, getLinksSource(pagePath.getPagesPath()));
  }

  private WeblogicCreateFormPageSource createCreateFormPageSource(
    CreateFormPagePath pagePath,
    WeblogicBeanType type
  ) throws Exception {
    String createFormSourceResourceName =
      getYamlResourceName(pagePath.getPagesPath(), "createForm.yaml");
    WeblogicCreateFormSource createFormSource =
      YamlUtils.read(createFormSourceResourceName, WeblogicCreateFormSource.class);
    if (createFormSource == null) {
      throw new AssertionError("Missing createForm.yaml for " + type.getName());
    }
    return new WeblogicCreateFormPageSource(pagePath, type, createFormSource);
  }

  private String getYamlResourceName(PagesPath pagesPath, String resourceName) {
    StringBuilder sb = new StringBuilder();
    sb
      .append(PDY_ROOT)
      .append(StringUtils.getLeafClassName(pagesPath.getBeanType().getName()));
    // we only include the perspective name in the file path if it's not the default perspective
    // e.g DomainRuntimeMBean's default perspective is monitoring and it also supports a
    // control perspective, so:
    //   DomainRuntimeMBean/table.yaml is the monitoring table page and
    //   DomainRuntimeMBean/control/table.yaml is the control table page
    PerspectivePath perspectivePath = pagesPath.getPerspectivePath();
    if (!perspectivePath.isDefaultPerspective()) {
      sb
        .append("/")
        .append(perspectivePath.getPerspective());
    }
    sb.append("/").append(resourceName);
    return sb.toString();
  }
}
