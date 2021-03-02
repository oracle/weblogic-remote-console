// Copyright (c) 2020, 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.driver;

import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

import weblogic.console.backend.pagedesc.PagePath;

/** */
public class WeblogicPages {

  // pageKey -> page:
  private Map<String, Optional<WeblogicPage>> pages = new ConcurrentHashMap<>();

  private Map<String, Optional<WeblogicPage>> getPages() {
    return this.pages;
  }

  public WeblogicPages() {
  }

  public WeblogicPage getPage(PagePath pagePath) {
    Optional<WeblogicPage> opt = getPages().get(pagePath.getKey());
    return (opt != null && opt.isPresent()) ? opt.get() : null;
  }

  public void putPage(PagePath pagePath, WeblogicPage page) {
    getPages().put(pagePath.getKey(), Optional.ofNullable(page));
  }
}
