// Copyright (c) 2021, 2023, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.yaml;

import weblogic.remoteconsole.common.repodef.LocalizableString;
import weblogic.remoteconsole.common.repodef.PageFieldDef;
import weblogic.remoteconsole.common.repodef.PageFieldPresentationDef;
import weblogic.remoteconsole.common.repodef.schema.BeanFieldPresentationDefSource;

/**
 * yaml-based implemetation of the PageFieldPresentationDef interface when parented by a property
 */
class PagePropertyPresentationDefImpl implements PageFieldPresentationDef {
  private BeanFieldPresentationDefSource source;
  private PagePropertyDefImpl pagePropertyDefImpl;
  private LocalizableString inlineFieldHelp;

  public PagePropertyPresentationDefImpl(
    PagePropertyDefImpl pagePropertyDefImpl,
    BeanFieldPresentationDefSource source
  ) {
    this.pagePropertyDefImpl = pagePropertyDefImpl;
    this.source = source;
    inlineFieldHelp =
      new LocalizableString(
        getPropertyDefImpl().getInlineFieldHelpLocalizationKey(),
        source.getInlineFieldHelp()
      );
  }

  PagePropertyDefImpl getPropertyDefImpl() {
    return pagePropertyDefImpl;
  }

  @Override
  public PageFieldDef getFieldDef() {
    return getPropertyDefImpl();
  }

  @Override
  public LocalizableString getInlineFieldHelp() {
    return inlineFieldHelp;
  }

  @Override
  public boolean isDisplayAsHex() {
    return source.isDisplayAsHex();
  }

  @Override
  public String getWidth() {
    return (source.getWidth() == null) ? null : source.getWidth().toString();
  }

  public String toString() {
    return
      "PagePropertyPresentationDef: "
      + " fieldDef " + getFieldDef()
      + " inlineFieldHelp " + getInlineFieldHelp()
      + " displayasHex " + isDisplayAsHex()
      + " width " + getWidth();
  }
}
