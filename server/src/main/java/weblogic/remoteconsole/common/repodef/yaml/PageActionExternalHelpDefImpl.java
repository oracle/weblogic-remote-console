// Copyright (c) 2023, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.yaml;

import weblogic.remoteconsole.common.repodef.BeanActionDef;
import weblogic.remoteconsole.common.repodef.LocalizableString;
import weblogic.remoteconsole.common.repodef.LocalizedConstants;
import weblogic.remoteconsole.common.repodef.PageActionDef;
import weblogic.remoteconsole.common.repodef.PageActionExternalHelpDef;

/**
 * yaml-based implementation of the PageActionExternalHelpDef interface.
 */
class PageActionExternalHelpDefImpl implements PageActionExternalHelpDef {

  private PageActionDefImpl pageActionDefImpl;
  private LocalizableString label;
  private String href;

  PageActionExternalHelpDefImpl(PageActionDefImpl pageActionDefImpl, BeanActionDef mbeanOperationActionDef) {
    this.pageActionDefImpl = pageActionDefImpl;
    String type = mbeanOperationActionDef.getTypeDef().getTypeName();
    String operation = mbeanOperationActionDef.getRemoteActionName();
    // Not localized, e.g. ServerRuntimeMBean.forceShutdown:
    this.label = new LocalizableString(type + "." + operation);
    this.href =
      getPageActionDefImpl()
        .getPageDefImpl()
        .getPageRepoDefImpl()
        .getBeanRepoDefImpl()
        .getMBeansVersion()
        .getWebLogicVersion()
        .getMBeanOperationJavadocUrl(type, operation);
  }

  /*package*/ PageActionDefImpl getPageActionDefImpl() {
    return pageActionDefImpl;
  }

  @Override
  public PageActionDef getPageActionDef() {
    return getPageActionDefImpl();
  }

  @Override
  public LocalizableString getLabel() {
    return label;
  }

  @Override
  public LocalizableString getIntroLabel() {
    return LocalizedConstants.MBEAN_OPERATION_EXTERNAL_HELP_INTRO_LABEL;
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
