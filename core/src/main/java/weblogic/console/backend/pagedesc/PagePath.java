// Copyright (c) 2020, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.pagedesc;

import weblogic.console.backend.utils.Path;
import weblogic.console.backend.utils.StringUtils;

/** This class contains the path needed to identify a page in the console. */
public abstract class PagePath {

  private PagesPath pagesPath;

  public PagesPath getPagesPath() {
    return this.pagesPath;
  }

  private String key;

  public String getKey() {
    if (this.key == null) {
      this.key = computeKey();
    }
    return this.key;
  }

  public static TablePagePath newTablePagePath(PagesPath pagesPath) {
    return new TablePagePath(pagesPath);
  }

  public static SlicePagePath newSlicePagePath(PagesPath pagesPath, Path slicePath) {
    return new SlicePagePath(pagesPath, slicePath);
  }

  public static CreateFormPagePath newCreateFormPagePath(PagesPath pagesPath) {
    return new CreateFormPagePath(pagesPath);
  }

  public String getURI() {
    return StringUtils.getLeafClassName(getPagesPath().getBeanType().getName());
  }

  protected PagePath(PagesPath pagesPath) {
    this.pagesPath = pagesPath;
  }

  @Override
  public String toString() {
    return getKey();
  }

  protected String computeKey() {
    return pagesPath.getKey();
  }
}
