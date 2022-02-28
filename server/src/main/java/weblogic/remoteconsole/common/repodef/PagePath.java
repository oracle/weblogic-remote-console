// Copyright (c) 2021, 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef;

import weblogic.remoteconsole.common.utils.Path;

/**
 * This class contains the path needed to identify a page.
 */
public abstract class PagePath {
  private PagesPath pagesPath;
  private String key;

  protected PagePath(PagesPath pagesPath) {
    this.pagesPath = pagesPath;
  }

  // Get the corresponding PagesPath
  public PagesPath getPagesPath() {
    return this.pagesPath;
  }

  // Get a string that identifies this page.
  public String getKey() {
    if (this.key == null) {
      this.key = computeKey();
    }
    return this.key;
  }

  // Create a new table page path
  public static TablePagePath newTablePagePath(PagesPath pagesPath) {
    return new TablePagePath(pagesPath);
  }

  // Create a new slice path
  public static SlicePagePath newSlicePagePath(PagesPath pagesPath, Path slicePath) {
    return new SlicePagePath(pagesPath, slicePath);
  }

  // Create a new create form page path
  public static CreateFormPagePath newCreateFormPagePath(PagesPath pagesPath) {
    return new CreateFormPagePath(pagesPath);
  }

  // get the query params that need to be added to PDJ and RDJ urls to identity this page.
  public String getQueryParams() {
    return "";
  }

  // get the query params to add to the RDJ url to identify this page
  public String getRDJQueryParams() {
    return "";
  }

  // get the relative URI from api/<provider>/<tree>/pages to this page's PDJ.
  // e.g. DomainMBean?view=Security.General for the domain's security general slice form.
  public String getPDJURI() {
    return getPagesPath().getTypeDef().getTypeName() + getQueryParams();
  }

  // Returns whether this page path is a table page path.
  public boolean isTablePagePath() {
    return (this instanceof TablePagePath);
  }

  // Converts this page path to a table page path.
  // Throws a ClassCastException if this page path is not a TablePagePath.
  public TablePagePath asTablePagePath() {
    return (TablePagePath)this;
  }

  // Returns whether this page path is a slice page path.
  public boolean isSlicePagePath() {
    return (this instanceof SlicePagePath);
  }

  // Converts this page path to a slice page path.
  // Throws a ClassCastException if this page path is not a SlicePagePath.
  public SlicePagePath asSlicePagePath() {
    return (SlicePagePath)this;
  }

  // Returns whether this page path is a create form page path.
  public boolean isCreateFormPagePath() {
    return (this instanceof CreateFormPagePath);
  }

  // Converts this page path to a create form page path.
  // Throws a ClassCastException if this page path is not a CreateFormPagePath.
  public CreateFormPagePath asCreateFormPagePath() {
    return (CreateFormPagePath)this;
  }

  @Override
  public String toString() {
    return getKey();
  }

  protected String computeKey() {
    return getPagesPath().getKey();
  }
}
