// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.yaml;

import weblogic.remoteconsole.common.repodef.BeanPropertyDef;
import weblogic.remoteconsole.common.repodef.LocalizableString;
import weblogic.remoteconsole.common.repodef.LocalizedConstants;
import weblogic.remoteconsole.common.repodef.PagePropertyDef;
import weblogic.remoteconsole.common.repodef.PagePropertyExternalHelpDef;
import weblogic.remoteconsole.common.utils.Path;

/**
 * yaml-based implementation of the PagePropertyExternalHelpDef interface.
 */
class PagePropertyExternalHelpDefImpl implements PagePropertyExternalHelpDef {

  private PagePropertyDefImpl pagePropertyDefImpl;
  private LocalizableString label;
  private String href;

  PagePropertyExternalHelpDefImpl(PagePropertyDefImpl pagePropertyDefImpl) {
    this.pagePropertyDefImpl = pagePropertyDefImpl;
    BeanPropertyDef leafPropertyDef = getLeafPropertyDef();
    String type = leafPropertyDef.getTypeDef().getTypeName();
    String attribute = leafPropertyDef.getPropertyName();
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

  private BeanPropertyDef getLeafPropertyDef() {
    Path parentPath = getPagePropertyDef().getParentPath();
    if (parentPath.isEmpty()) {
      // The property lives directly on the bean for the page
      // e.g. ServerMBean's ListenPort property on the Server General page.
      return getPagePropertyDef();
    }
    // The property lives in a child bean of the bean for the page
    // e.g. SSLMBean's Enabled property on the Server General page.
    // Convert ServerMBean's SSL.Enabled property to SSLMBean's Enabled property.
    boolean searchSubTypes = true;
    return
      getPagePropertyDef()
        .getTypeDef() // e.g. ServerMBean
        .getChildDef(parentPath, searchSubTypes) // e.g. SSL
        .getChildTypeDef() // e.g. SSLMBean
        .getPropertyDef(
          new Path(getPagePropertyDef().getPropertyName()), // e.g. Enabled
          searchSubTypes
        );
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
