// Copyright (c) 2021, Oracle and/or its affiliates.
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

  // Create a new slice form path
  public static SliceFormPagePath newSliceFormPagePath(PagesPath pagesPath, Path slicePath) {
    return new SliceFormPagePath(pagesPath, slicePath);
  }

  // Create a new create form page path
  public static CreateFormPagePath newCreateFormPagePath(PagesPath pagesPath) {
    return new CreateFormPagePath(pagesPath);
  }

  // get the relative URI from api/<provider>/<tree>/pages to this page's PDJ.
  // e.g. DomainMBean?view=Security.General for the domain's security general slice form.
  public String getURI() {
    return getPagesPath().getTypeDef().getTypeName();
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

  // Returns whether this page path is a slice form page path.
  public boolean isSliceFormPagePath() {
    return (this instanceof SliceFormPagePath);
  }

  // Converts this page path to a slice form page path.
  // Throws a ClassCastException if this page path is not a SliceFormPagePath.
  public SliceFormPagePath asSliceFormPagePath() {
    return (SliceFormPagePath)this;
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
