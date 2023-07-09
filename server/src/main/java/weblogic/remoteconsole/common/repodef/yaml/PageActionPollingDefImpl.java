// Copyright (c) 2023, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.yaml;

import weblogic.remoteconsole.common.repodef.PageActionDef;
import weblogic.remoteconsole.common.repodef.PageActionPollingDef;
import weblogic.remoteconsole.common.repodef.schema.BeanActionPollingDefSource;

/**
 * yaml-based implemetation of the PageActionPollingDef interface
 */
class PageActionPollingDefImpl implements PageActionPollingDef {
  private BeanActionPollingDefSource source;
  private PageActionDefImpl pageActionDefImpl;

  public PageActionPollingDefImpl(
    PageActionDefImpl pageActionDefImpl,
    BeanActionPollingDefSource source
  ) {
    this.pageActionDefImpl = pageActionDefImpl;
    this.source = source;
  }

  PageActionDefImpl getActionDefImpl() {
    return pageActionDefImpl;
  }

  @Override
  public PageActionDef getActionDef() {
    return getActionDefImpl();
  }

  @Override
  public int getReloadSeconds() {
    return source.getReloadSeconds();
  }

  @Override
  public int getMaxAttempts() {
    return source.getMaxAttempts();
  }

  public String toString() {
    return
      "PageActionPollingDef: "
      + " actionDef " + getActionDef()
      + " reloadSeconds " + getReloadSeconds()
      + " maxAttempts " + getMaxAttempts();
  }
}
