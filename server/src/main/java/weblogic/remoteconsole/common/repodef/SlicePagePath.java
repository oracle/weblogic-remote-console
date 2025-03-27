// Copyright (c) 2021, 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef;

import weblogic.console.utils.Path;

/**
 * This class contains the path needed to identify a slice page.
 */
public class SlicePagePath extends PagePath {
  private Path slicePath;

  SlicePagePath(PagesPath pagesPath, Path slicePath) {
    super(pagesPath);
    this.slicePath = slicePath;
  }

  // Returns the path from the type to this slice,
  // e.g. DomainMBean's Security.General slice.
  public Path getSlicePath() {
    return this.slicePath;
  }

  @Override
  public String getPDJQueryParams() {
    return getSlicePath().isEmpty() ? "" : "?view=" + getSlicePath().getDotSeparatedPath();
  }

  @Override
  public String getRDJQueryParams() {
    return getSlicePath().isEmpty() ? "" : "?slice=" + getSlicePath().getDotSeparatedPath();
  }

  @Override
  public String computeKey() {
    return super.computeKey() + "kind=<slice>slicePath=<" + getSlicePath() + ">";
  }
}
