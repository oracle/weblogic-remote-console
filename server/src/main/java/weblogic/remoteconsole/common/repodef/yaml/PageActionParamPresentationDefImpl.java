// Copyright (c) 2023, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.yaml;

import weblogic.remoteconsole.common.repodef.LocalizableString;
import weblogic.remoteconsole.common.repodef.PageFieldDef;
import weblogic.remoteconsole.common.repodef.PageFieldPresentationDef;
import weblogic.remoteconsole.common.repodef.schema.BeanFieldPresentationDefSource;

/**
 * yaml-based implemetation of the PageFieldPresentationDef interface when parented by an action parameter
 */
class PageActionParamPresentationDefImpl implements PageFieldPresentationDef {
  private BeanFieldPresentationDefSource source;
  private PageActionParamDefImpl pageActionParamDefImpl;
  private LocalizableString inlineFieldHelp;

  public PageActionParamPresentationDefImpl(
    PageActionParamDefImpl pageActionParamDefImpl,
    BeanFieldPresentationDefSource source
  ) {
    this.pageActionParamDefImpl = pageActionParamDefImpl;
    this.source = source;
    inlineFieldHelp =
      new LocalizableString(
        getActionParamDefImpl().getInlineFieldHelpLocalizationKey(),
        source.getInlineFieldHelp()
      );
  }

  PageActionParamDefImpl getActionParamDefImpl() {
    return pageActionParamDefImpl;
  }

  @Override
  public PageFieldDef getFieldDef() {
    return getActionParamDefImpl();
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
      "PageActionParamPresentationDef: "
      + " fieldDef " + getFieldDef()
      + " inlineFieldHelp " + getInlineFieldHelp()
      + " displayasHex " + isDisplayAsHex()
      + " width " + getWidth();
  }
}
