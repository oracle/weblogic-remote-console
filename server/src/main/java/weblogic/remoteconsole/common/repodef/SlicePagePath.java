// Copyright (c) 2021, 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef;

import weblogic.remoteconsole.common.utils.Path;

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
  public String getRDJQueryParams() {
    if (!getSlicePath().isEmpty()) {
      return "?view=" + getSlicePath().getDotSeparatedPath();
    }
    return super.getRDJQueryParams();
  }

  @Override
  public String getPDJURI() {
    // PDJ & RDJ need the same query params:
    return super.getPDJURI() + getRDJQueryParams();
  }

  @Override
  protected String computeKey() {
    return super.computeKey() + "kind=<slice>slicePath=<" + getSlicePath() + ">";
  }
}
