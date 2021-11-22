// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.yaml;

import weblogic.remoteconsole.common.repodef.LocalizableString;
import weblogic.remoteconsole.common.repodef.PagePropertyDef;
import weblogic.remoteconsole.common.repodef.PagePropertyPresentationDef;
import weblogic.remoteconsole.common.repodef.schema.BeanPropertyPresentationDefSource;

/**
 * yaml-based implemetation of the PagePropertyPresentationDef interface
 */
class PagePropertyPresentationDefImpl implements PagePropertyPresentationDef {
  private BeanPropertyPresentationDefSource source;
  private PagePropertyDefImpl pagePropertyDefImpl;
  private LocalizableString inlineFieldHelp;

  public PagePropertyPresentationDefImpl(
    PagePropertyDefImpl pagePropertyDefImpl,
    BeanPropertyPresentationDefSource source
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
  public PagePropertyDef getPropertyDef() {
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

  public String toString() {
    return
      "PropertyPresentationDef: "
      + " propertyDef " + getPropertyDef()
      + " inlineFieldHelp " + getInlineFieldHelp()
      + " displayasHex " + isDisplayAsHex();
  }
}
