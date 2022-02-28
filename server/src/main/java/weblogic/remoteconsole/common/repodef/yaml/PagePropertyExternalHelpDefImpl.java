// Copyright (c) 2021, 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.yaml;

import weblogic.remoteconsole.common.repodef.BeanPropertyDef;
import weblogic.remoteconsole.common.repodef.LocalizableString;
import weblogic.remoteconsole.common.repodef.LocalizedConstants;
import weblogic.remoteconsole.common.repodef.PagePropertyDef;
import weblogic.remoteconsole.common.repodef.PagePropertyExternalHelpDef;

/**
 * yaml-based implementation of the PagePropertyExternalHelpDef interface.
 */
class PagePropertyExternalHelpDefImpl implements PagePropertyExternalHelpDef {

  private PagePropertyDefImpl pagePropertyDefImpl;
  private LocalizableString label;
  private String href;

  PagePropertyExternalHelpDefImpl(PagePropertyDefImpl pagePropertyDefImpl, BeanPropertyDef mbeanAttributePropertyDef) {
    this.pagePropertyDefImpl = pagePropertyDefImpl;
    String type = mbeanAttributePropertyDef.getTypeDef().getTypeName();
    String attribute = mbeanAttributePropertyDef.getPropertyName();
    // Not localized.  e.g. SSLMBean.Enabled:
    this.label = new LocalizableString(type + "." + attribute);
    this.href =
      getPagePropertyDefImpl()
        .getPageDefImpl()
        .getPageRepoDefImpl()
        .getBeanRepoDefImpl()
        .getMBeansVersion()
        .getWebLogicVersion()
        .getMBeanAttributeJavadocUrl(type, attribute);
  }

  /*package*/ PagePropertyDefImpl getPagePropertyDefImpl() {
    return pagePropertyDefImpl;
  }

  @Override
  public PagePropertyDef getPagePropertyDef() {
    return getPagePropertyDefImpl();
  }

  @Override
  public LocalizableString getLabel() {
    return label;
  }

  @Override
  public LocalizableString getTitle() {
    return LocalizedConstants.MBEAN_INFO_TITLE;
  }

  @Override
  public String getHref() {
    return href;
  }
}
