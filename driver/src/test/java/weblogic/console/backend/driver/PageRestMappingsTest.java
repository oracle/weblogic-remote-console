// Copyright (c) 2020, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.driver;

import java.util.logging.Logger;

import org.junit.jupiter.api.Test;
import weblogic.console.backend.pagedesc.PageSourceWalker;
import weblogic.console.backend.pagedesc.WeblogicPageSource;
import weblogic.console.backend.typedesc.WeblogicVersions;
import weblogic.console.backend.utils.Path;

/**
 * Walks all the PDYs and tries to create a PageRestMapping for each.
 * <p>
 * It fails if it can't so that the console build fails if there are any invalid PDYs.
 */
public class PageRestMappingsTest extends PageSourceWalker {

  private static final Logger LOGGER = Logger.getLogger(PageRestMappingsTest.class.getName());

  @Test
  void validRestMappingsTest() throws Exception {
    this.mappings = new PageRestMappings(getWeblogicPageSources());
    walk();
  }

  private PageRestMappings mappings;

  public PageRestMappingsTest() {
    super(
      WeblogicVersions.getCurrentVersion().getDomainVersion(),
      false // visit types once per folded bean path (v.s. once per type)
    );
  }

  @Override
  protected void processPage(WeblogicPageSource pageSource, Path foldedBeanPath) throws Exception {
    this.mappings.getPageRestMapping(pageSource.getPagePath(), foldedBeanPath);
  }
}
