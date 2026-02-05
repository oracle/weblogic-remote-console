// Copyright (c) 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.yaml;

import weblogic.remoteconsole.common.repodef.ActionInputFormDef;
import weblogic.remoteconsole.common.repodef.ActionInputFormPresentationDef;
import weblogic.remoteconsole.common.repodef.schema.ActionInputFormPresentationDefSource;

/**
 * yaml-based implementation of the ActionInputFormPresentationDef interface.
 */
class ActionInputFormPresentationDefImpl implements ActionInputFormPresentationDef {
  private ActionInputFormPresentationDefSource source;
  private ActionInputFormDefImpl actionInputFormDefImpl;

  public ActionInputFormPresentationDefImpl(
    ActionInputFormDefImpl actionInputFormDefImpl,
    ActionInputFormPresentationDefSource source
  ) {
    this.actionInputFormDefImpl = actionInputFormDefImpl;
    this.source = source;
  }

  ActionInputFormDefImpl getActionInputFormDefImpl() {
    return actionInputFormDefImpl;
  }

  @Override
  public ActionInputFormDef getActionInputFormDef() {
    return getActionInputFormDefImpl();
  }

  @Override
  public boolean isSingleColumn() {
    return source.isSingleColumn();
  }
}
