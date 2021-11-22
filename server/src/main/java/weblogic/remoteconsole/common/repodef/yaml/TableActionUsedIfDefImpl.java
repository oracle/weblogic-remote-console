// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.yaml;

import weblogic.remoteconsole.common.repodef.TableActionDef;
import weblogic.remoteconsole.common.repodef.TableActionUsedIfDef;
import weblogic.remoteconsole.common.repodef.schema.UsedIfDefSource;

/**
 * yaml-based implementation of the TableActionUsedIfDef interface.
 */
class TableActionUsedIfDefImpl extends UsedIfDefImpl implements TableActionUsedIfDef {

  private TableActionDefImpl parentActionDefImpl;

  TableActionUsedIfDefImpl(TableActionDefImpl parentActionDefImpl, UsedIfDefSource source) {
    super(parentActionDefImpl.getPageDefImpl(), source);
    this.parentActionDefImpl = parentActionDefImpl;
  }

  TableActionDefImpl getParentActionDefImpl() {
    return parentActionDefImpl;
  }

  @Override
  public TableActionDef getParentActionDef() {
    return getParentActionDefImpl();
  }

  @Override
  public String toString() {
    return parentActionDefImpl.toString() + " usedIf";
  }
}
