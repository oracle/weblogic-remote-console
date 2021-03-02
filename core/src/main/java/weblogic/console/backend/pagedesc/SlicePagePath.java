// Copyright (c) 2020, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.pagedesc;

import weblogic.console.backend.utils.Path;

/** This class contains the path needed to a slice page for an mbean type. */
public class SlicePagePath extends PagePath {

  private Path slicePath;

  public Path getSlicePath() {
    return this.slicePath;
  }

  SlicePagePath(PagesPath pagesPath, Path slicePath) {
    super(pagesPath);
    this.slicePath = slicePath;
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
    return super.computeKey() + "type=<slice>slicePath=<" + getSlicePath() + ">";
  }
}
