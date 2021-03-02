// Copyright (c) 2020, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.search;

public class PageResults {
  private String pagePath;
  private String pageTitle;

  public void setPagePath(String pagePath) {
    this.pagePath = pagePath;
  }

  public String getPagePath() {
    return pagePath;
  }

  public String getPageTitle() {
    return pageTitle;
  }

  public void setPageTitle(String pageTitle) {
    this.pageTitle = pageTitle;
  }
}
