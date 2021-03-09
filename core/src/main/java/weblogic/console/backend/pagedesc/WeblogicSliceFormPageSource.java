// Copyright (c) 2020, 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.pagedesc;

import java.util.List;

import weblogic.console.backend.typedesc.WeblogicBeanType;

/**
 * This POJO contains all of the information from all of the yaml files that affect a weblogic
 * bean's form page, including:
 * <ul>
 *   <li>
 *     the path to this page's PDY
 *   </li>
 *   <li>
 *     the bean's type the contents of this form page's yaml source file,
 *     e.g. ServerMBean/slices/General/form.yaml
 *   </li>
 *   <li>
 *     the entire hierarchy of slices for this bean,
 *     e.g. ServerMBean/slices.yaml
 *   </li>
 * </ul>
 */
public class WeblogicSliceFormPageSource extends WeblogicPageSource {

  private SlicePagePath typedPagePath;

  public SlicePagePath getSlicePagePath() {
    return this.typedPagePath;
  }

  private WeblogicSliceFormSource sliceFormSource;

  public WeblogicSliceFormSource getSliceFormSource() {
    return this.sliceFormSource;
  }

  private List<SliceSource> sliceSources;

  public List<SliceSource> getSliceSources() {
    return this.sliceSources;
  }

  public WeblogicSliceFormPageSource(
    SlicePagePath pagePath,
    WeblogicBeanType type,
    WeblogicSliceFormSource sliceFormSource,
    List<SliceSource> sliceSources,
    NavigationSource navigationSource,
    LinksSource allLinksSource
  ) {
    super(pagePath, type, sliceFormSource, navigationSource, allLinksSource);
    this.typedPagePath = pagePath;
    this.sliceFormSource = sliceFormSource;
    this.sliceSources = sliceSources;
  }

  @Override
  public boolean isSliceForm() {
    return true;
  }

  @Override
  public WeblogicSliceFormPageSource asSliceForm() {
    return this;
  }
}
