// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef;

import weblogic.remoteconsole.common.utils.Path;

/**
 * This class contains the path needed to identify a slice page.
 */
public class SliceFormPagePath extends PagePath {
  private Path slicePath;

  SliceFormPagePath(PagesPath pagesPath, Path slicePath) {
    super(pagesPath);
    this.slicePath = slicePath;
  }

  // Returns the path from the type to this slice,
  // e.g. DomainMBean's Security.General slice.
  public Path getSlicePath() {
    return this.slicePath;
  }

  @Override
  public String getURI() {
    String uri = super.getURI();
    if (!getSlicePath().isEmpty()) {
      uri = uri + "?view=" + getSlicePath().getDotSeparatedPath();
    }
    return uri;
  }

  @Override
  protected String computeKey() {
    return super.computeKey() + "kind=<slice>slicePath=<" + getSlicePath() + ">";
  }
}
