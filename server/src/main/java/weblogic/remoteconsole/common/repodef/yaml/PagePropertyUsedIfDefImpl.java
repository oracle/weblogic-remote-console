// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.yaml;

import weblogic.remoteconsole.common.repodef.PagePropertyDef;
import weblogic.remoteconsole.common.repodef.PagePropertyUsedIfDef;
import weblogic.remoteconsole.common.repodef.schema.UsedIfDefSource;

/**
 * yaml-based implementation of the PagePropertyUsedIfDef interface
 */
class PagePropertyUsedIfDefImpl extends UsedIfDefImpl implements PagePropertyUsedIfDef {

  private PagePropertyDefImpl parentPropertyDefImpl;

  PagePropertyUsedIfDefImpl(PagePropertyDefImpl parentPropertyDefImpl, UsedIfDefSource source) {
    super(parentPropertyDefImpl.getPageDefImpl(), source);
    this.parentPropertyDefImpl = parentPropertyDefImpl;
  }

  PagePropertyDefImpl getParentPropertyDefImpl() {
    return parentPropertyDefImpl;
  }

  @Override
  public PagePropertyDef getParentPropertyDef() {
    return getParentPropertyDefImpl();
  }

  @Override
  public String toString() {
    return parentPropertyDefImpl.toString() + " usedIf";
  }
}
