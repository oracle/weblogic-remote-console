// Copyright (c) 2020, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.pagedesc;

import weblogic.console.backend.typedesc.WeblogicBeanType;

/**
 * This POJO contains all of the information from all of the yaml files that affect a weblogic
 * bean's configuration create form page, including:
 * <ul>
 *   <li>the path to this page's PDY</li>
 *   <li>the bean's type</li>
 *   <li> the contents of this form page's yaml source file, e.g. ServerMBean/createForm.yaml</li>
 * </ul>
 */
public class WeblogicCreateFormPageSource extends WeblogicPageSource {

  private WeblogicCreateFormSource createFormSource;

  public WeblogicCreateFormSource getCreateFormSource() {
    return this.createFormSource;
  }

  public WeblogicCreateFormPageSource(
    PagePath pagePath,
    WeblogicBeanType type,
    WeblogicCreateFormSource createFormSource
  ) {
    super(pagePath, type, createFormSource, null, null); // create forms don't have nav tree or links sources
    this.createFormSource = createFormSource;
  }

  @Override
  public boolean isCreateForm() {
    return true;
  }

  @Override
  public WeblogicCreateFormPageSource asCreateForm() {
    return this;
  }
}
