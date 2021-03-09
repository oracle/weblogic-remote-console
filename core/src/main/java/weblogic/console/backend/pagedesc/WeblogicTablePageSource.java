// Copyright (c) 2020, 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.pagedesc;

import weblogic.console.backend.typedesc.WeblogicBeanType;

/**
 * This POJO contains all of the information from all of the yaml files that affect a weblogic
 * bean's table page, including:
 * <ul>
 *   <li>the path to this table's pdy</li>
 *   <li>the bean's type</li>
 *   <li>the contents of this table page's yaml source file, e.g. NetworkAccessPoints/table.yaml</li>
 * </ul>
 */
public class WeblogicTablePageSource extends WeblogicPageSource {

  private TablePagePath typedPagePath;

  public TablePagePath getTablePagePath() {
    return this.typedPagePath;
  }

  private WeblogicTableSource tableSource;

  public WeblogicTableSource getTableSource() {
    return this.tableSource;
  }

  public WeblogicTablePageSource(
    TablePagePath pagePath,
    WeblogicBeanType type,
    WeblogicTableSource tableSource,
    LinksSource linksSource
  ) {
    super(
      pagePath,
      type,
      tableSource,
      null, // tables don't have nav tree sources
      linksSource
    );
    this.typedPagePath = pagePath;
    this.tableSource = tableSource;
  }

  @Override
  public boolean isTable() {
    return true;
  }

  @Override
  public WeblogicTablePageSource asTable() {
    return this;
  }
}
