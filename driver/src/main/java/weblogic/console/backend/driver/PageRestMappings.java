// Copyright (c) 2020, 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.driver;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.logging.Logger;

import weblogic.console.backend.pagedesc.PagePath;
import weblogic.console.backend.pagedesc.WeblogicColumnSource;
import weblogic.console.backend.pagedesc.WeblogicCreateFormPageSource;
import weblogic.console.backend.pagedesc.WeblogicPageSource;
import weblogic.console.backend.pagedesc.WeblogicPageSources;
import weblogic.console.backend.pagedesc.WeblogicPropertySource;
import weblogic.console.backend.pagedesc.WeblogicSliceFormPageSource;
import weblogic.console.backend.pagedesc.WeblogicTablePageSource;
import weblogic.console.backend.typedesc.WeblogicBeanProperty;
import weblogic.console.backend.typedesc.WeblogicBeanType;
import weblogic.console.backend.utils.Path;
import weblogic.console.backend.utils.StringUtils;

/**
 * Constructs, and caches, the PageRestMappings for the console pages that have been
 * used by the RDS o far.
 * <p>
 * PageRestMappings repackage static information about a page and its type so that
 * the RDS can efficiently convert between RDJ REST requests and WLS REST requests.
 * <p>
 * Think of it as pre-computing some of the mapping between the page's CBE REST interface
 * and the underlying WLS REST interface and caching it.
 */
public class PageRestMappings {

  public PageRestMappings(WeblogicPageSources pageSources) {
    this.pageSources = pageSources;
  }

  /**
   * @param pagePath page path
   *
   * @param foldedBeanPath folded bean path
   *
   * @return PageRestMapping
   *
   * @throws Exception if page rest mapping cannot be obtained
   */
  public PageRestMapping getPageRestMapping(
    PagePath pagePath,
    Path foldedBeanPath
  ) throws Exception {
    String key = "page<" + pagePath.getKey() + ">,foldedBeanPath<" + foldedBeanPath + ">";
    Optional<PageRestMapping> opt = this.pageRestMappings.get(key);
    if (opt == null) {
      PageRestMapping pageRestMapping = null;
      try {
        pageRestMapping = createPageRestMapping(pagePath, foldedBeanPath);
      } finally {
        // if successful, record the mapping so we can reuse it next time.
        // if not successful, record a null so that we don't waste time failing the next time.
        opt = Optional.ofNullable(pageRestMapping);
        this.pageRestMappings.put(key, opt);
      }
    }
    if (!opt.isPresent()) {
      throw new Exception("Could not get PageRestMapping for " + pagePath);
    }
    return opt.get();
  }

  private static final Logger LOGGER = Logger.getLogger(PageRestMappings.class.getName());

  private final WeblogicPageSources pageSources;

  // page path -> page rest mapping:
  private Map<String, Optional<PageRestMapping>> pageRestMappings = new ConcurrentHashMap<>();

  private PageRestMapping createPageRestMapping(
    PagePath pagePath,
    Path foldedBeanPath
  ) throws Exception {
    WeblogicPageSource pageSource = getPageRestMappingSource(pagePath);

    List<WeblogicBeanProperty> beanProperties =
      getBeanProperties(getPropertyNames(pageSource), pageSource);

    PageRestMapping pageRestMapping =
      PageRestMappingGenerator.generate(pageSource, foldedBeanPath, beanProperties);

    return pageRestMapping;
  }

  private WeblogicPageSource getPageRestMappingSource(PagePath pagePath) throws Exception {
    WeblogicPageSource pageSource;
    // Try to get the pageSource using the value assigned to the pagePath argument
    pageSource = this.pageSources.getPageSource(pagePath);
    if (pageSource == null) {
      throw new PageSourceNotFoundException("No page source found for " + pagePath.getKey());
    }
    return pageSource;
  }

  private Set<String> getPropertyNames(WeblogicPageSource pageSource) throws Exception {
    Set<String> propertyNames = new HashSet<>();
    if (pageSource.isSliceForm()) {
      getSliceFormPropertyNames(propertyNames, pageSource.asSliceForm());
    }
    if (pageSource.isCreateForm()) {
      getCreateFormPropertyNames(propertyNames, pageSource.asCreateForm());
    }
    if (pageSource.isTable()) {
      getTablePropertyNames(propertyNames, pageSource.asTable());
    }
    String keyPropertyName = getKeyPropertyName(pageSource);
    if (StringUtils.notEmpty(keyPropertyName)) {
      propertyNames.add(keyPropertyName);
    }
    String subTypeDiscriminatorPropertyName = getSubTypeDiscriminatorPropertyName(pageSource);
    if (StringUtils.notEmpty(subTypeDiscriminatorPropertyName)) {
      propertyNames.add(subTypeDiscriminatorPropertyName);
    }
    propertyNames.add("identity");
    return propertyNames;
  }

  private void getSliceFormPropertyNames(
    Set<String> propertyNames,
    WeblogicSliceFormPageSource pageSource
  ) throws Exception {
    for (WeblogicPropertySource propertySource : pageSource.getSliceFormSource().getProperties()) {
      propertyNames.add(propertySource.getName());
    }
    for (WeblogicPropertySource propertySource :
        pageSource.getSliceFormSource().getAdvancedProperties()) {
      propertyNames.add(propertySource.getName());
    }
  }

  private void getCreateFormPropertyNames(
    Set<String> propertyNames,
    WeblogicCreateFormPageSource pageSource
  ) throws Exception {
    for (WeblogicPropertySource propertySource : pageSource.getCreateFormSource().getProperties()) {
      propertyNames.add(propertySource.getName());
    }
  }

  private void getTablePropertyNames(
    Set<String> propertyNames,
    WeblogicTablePageSource pageSource
  ) throws Exception {
    for (WeblogicColumnSource columnSource : pageSource.getTableSource().getDisplayedColumns()) {
      propertyNames.add(columnSource.getName());
    }
    for (WeblogicColumnSource columnSource : pageSource.getTableSource().getHiddenColumns()) {
      propertyNames.add(columnSource.getName());
    }
  }

  private String getKeyPropertyName(WeblogicPageSource pageSource) throws Exception {
    WeblogicBeanProperty keyProperty = pageSource.getType().getKeyProperty();
    return (keyProperty != null) ? keyProperty.getName() : null;
  }

  private String getSubTypeDiscriminatorPropertyName(
    WeblogicPageSource pageSource
  ) throws Exception {
    WeblogicBeanType type = pageSource.getType();
    return type.isHomogeneous() ? null : type.getSubTypeDiscriminatorPropertyName();
  }

  private List<WeblogicBeanProperty> getBeanProperties(
    Set<String> propertyNames,
    WeblogicPageSource pageSource
  ) throws Exception {
    List<WeblogicBeanProperty> beanProperties = new ArrayList<>();
    for (String propertyName : propertyNames) {
      WeblogicBeanProperty beanProp = pageSource.getProperty(propertyName);
      if (beanProp != null) {
        beanProperties.add(beanProp);
      } else {
        LOGGER.info("Can't find property: " + pageSource.getPagePath() + "  " + propertyName);
      }
    }
    return beanProperties;
  }
}
