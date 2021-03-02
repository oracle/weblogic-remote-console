// Copyright (c) 2020, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.driver;

import java.util.HashMap;
import java.util.Map;

/**
 * Maintains a cache that maps a weblogic version to information
 * about the pages for that version.
 */
public class VersionedWeblogicPagesFactory {

  private final Map<String, VersionedWeblogicPages> versionToPages = new HashMap<>();

  public static final VersionedWeblogicPagesFactory INSTANCE = new VersionedWeblogicPagesFactory();

  public VersionedWeblogicPages getVersionedWeblogicPages(String weblogicVersion) {
    VersionedWeblogicPages pages = this.versionToPages.get(weblogicVersion);
    if (pages == null) {
      synchronized (this.versionToPages) {
        pages = new VersionedWeblogicPages(weblogicVersion);
        this.versionToPages.put(weblogicVersion, pages);
      }
    }
    return pages;
  }

  private VersionedWeblogicPagesFactory() {
  }
}
