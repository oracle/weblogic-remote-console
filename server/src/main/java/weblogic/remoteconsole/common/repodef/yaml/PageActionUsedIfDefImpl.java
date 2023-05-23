// Copyright (c) 2021, 2023, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.yaml;

import weblogic.remoteconsole.common.repodef.PageActionDef;
import weblogic.remoteconsole.common.repodef.PageActionUsedIfDef;
import weblogic.remoteconsole.common.repodef.schema.UsedIfDefSource;

/**
 * yaml-based implementation of the PageActionUsedIfDef interface.
 */
class PageActionUsedIfDefImpl extends UsedIfDefImpl implements PageActionUsedIfDef {

  private PageActionDefImpl parentActionDefImpl;

  PageActionUsedIfDefImpl(PageActionDefImpl parentActionDefImpl, UsedIfDefSource source) {
    super(parentActionDefImpl.getPageDefImpl(), source);
    this.parentActionDefImpl = parentActionDefImpl;
  }

  PageActionDefImpl getParentActionDefImpl() {
    return parentActionDefImpl;
  }

  @Override
  public PageActionDef getParentActionDef() {
    return getParentActionDefImpl();
  }

  @Override
  public String toString() {
    return parentActionDefImpl.toString() + " usedIf";
  }
}
