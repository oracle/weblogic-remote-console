// Copyright (c) 2020, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.pagedesc;

import java.util.List;

import weblogic.console.backend.typedesc.WeblogicBeanProperty;
import weblogic.console.backend.typedesc.WeblogicBeanType;

/**
 * This POJO holds information shared information from the yaml files that configure a weblogic
 * bean's form or table page, including:
  * <ul>
 *   <li>the path to this page's PDY</li>
 *   <li>the bean's type</li>
 * </ul>
 */
public abstract class WeblogicPageSource {

  private PagePath pagePath;

  public PagePath getPagePath() {
    return this.pagePath;
  }

  private WeblogicBeanType type;

  public WeblogicBeanType getType() {
    return this.type;
  }

  private BaseWeblogicPageSource basePageSource;

  // can't name it getBaseConfigPageSource because then snakeyaml thinks it's a property it can manage
  private BaseWeblogicPageSource do_getBaseConfigPageSource() {
    return this.basePageSource;
  }

  private LinksSource linksSource;

  // can't name it getLinksSource because then snakeyaml thinks it's a property it can manage
  public LinksSource do_getLinksSource() {
    return this.linksSource;
  }

  private NavigationSource navigationSource;

  // can't name it getNavigationSource because then snakeyaml thinks it's a property it can manage
  private NavigationSource do_getNavigationSource() {
    return this.navigationSource;
  }

  protected WeblogicPageSource(
    PagePath pagePath,
    WeblogicBeanType type,
    BaseWeblogicPageSource basePageSource,
    NavigationSource navigationSource,
    LinksSource linksSource
  ) {
    this.pagePath = pagePath;
    this.type = type;
    this.basePageSource = basePageSource;
    // If no navigation source was sent in, create an empty one
    this.navigationSource = (navigationSource != null) ? navigationSource : new NavigationSource();
    this.linksSource = (linksSource != null) ? linksSource : new LinksSource();
  }

  public String getIntroductionHTML() {
    return do_getBaseConfigPageSource().getIntroductionHTML();
  }

  public List<String> getHelpTasks() {
    return do_getBaseConfigPageSource().getHelpTasks();
  }

  public List<HelpTopicSource> getHelpTopics() {
    return do_getBaseConfigPageSource().getHelpTopics();
  }

  public List<LinkSource> getCollectionLinks() {
    return do_getLinksSource().getCollectionLinks();
  }

  public List<LinkSource> getInstanceLinks() {
    return do_getLinksSource().getInstanceLinks();
  }

  public List<NavigationNodeSource> getNavigationContents() {
    return do_getNavigationSource().getContents();
  }

  public String getCustomizePageDefinitionMethod() {
    return do_getBaseConfigPageSource().getCustomizePageDefinitionMethod();
  }

  public String getCustomizeEnglishResourceDefinitionsMethod() {
    return do_getBaseConfigPageSource().getCustomizeEnglishResourceDefinitionsMethod();
  }

  public boolean isTable() {
    return false;
  }

  public WeblogicTablePageSource asTable() {
    throw new AssertionError(getPagePath() + " it not a WeblogicTablePageSource");
  }

  public boolean isSliceForm() {
    return false;
  }

  public WeblogicSliceFormPageSource asSliceForm() {
    throw new AssertionError(getPagePath() + " it not a WeblogicSliceFormPageSource");
  }

  public boolean isCreateForm() {
    return false;
  }

  public WeblogicCreateFormPageSource asCreateForm() {
    throw new AssertionError(getPagePath() + " it not a WeblogicCreateFormPageSource");
  }

  public WeblogicBeanProperty getProperty(String property) throws Exception {
    String key = getPagePath().getKey();
    String context = "page " + key;
    return getType().getProperty(context, property);
  }
}
