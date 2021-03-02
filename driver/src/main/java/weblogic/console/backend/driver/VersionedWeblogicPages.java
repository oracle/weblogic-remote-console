// Copyright (c) 2020, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.driver;

import weblogic.console.backend.pagedesc.WeblogicPageSources;
import weblogic.console.backend.typedesc.WeblogicBeanTypes;

/**
 * Caches info about the weblogic pages for a version of WLS
 * <ul>
 *   <li>page sources</li>
 *   <li>localized pages</li>
 *   <li>unlocalized pages</li>
 *   <li>rest mappings</li>
 * </ul>
 */
public class VersionedWeblogicPages {

  private final String weblogicVersion;

  public String getWeblogicVersion() {
    return this.weblogicVersion;
  }

  private final WeblogicPageSources weblogicPageSources;

  public WeblogicPageSources getWeblogicPageSources() {
    return this.weblogicPageSources;
  }

  private final UnlocalizedWeblogicPages unlocalizedWeblogicPages;

  public UnlocalizedWeblogicPages getUnlocalizedWeblogicPages() {
    return this.unlocalizedWeblogicPages;
  }

  private final LocalizedWeblogicPages localizedWeblogicPages;

  public LocalizedWeblogicPages getLocalizedWeblogicPages() {
    return this.localizedWeblogicPages;
  }

  private final PageRestMappings pageRestMappings;

  public PageRestMappings getPageRestMappings() {
    return this.pageRestMappings;
  }

  public WeblogicBeanTypes getWeblogicBeanTypes() {
    return getWeblogicPageSources().getTypes();
  }

  /*package*/ VersionedWeblogicPages(String weblogicVersion) {
    this.weblogicVersion = weblogicVersion;
    this.weblogicPageSources = new WeblogicPageSources(getWeblogicVersion());
    this.unlocalizedWeblogicPages = new UnlocalizedWeblogicPages(getWeblogicPageSources());
    this.localizedWeblogicPages = new LocalizedWeblogicPages(getUnlocalizedWeblogicPages());
    this.pageRestMappings = new PageRestMappings(getWeblogicPageSources());
  }
}
