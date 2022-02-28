// Copyright (c) 2021, 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef;

/**
 * This class contains the path needed to identify the table page.
 */
public class TablePagePath extends PagePath {

  TablePagePath(PagesPath pagesPath) {
    super(pagesPath);
  }

  @Override
  public String getPDJURI() {
    return super.getPDJURI() + "?view=table";
  }

  @Override
  protected String computeKey() {
    return super.computeKey() + "kind=<table>";
  }
}
