// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.yaml;

import weblogic.remoteconsole.common.repodef.CreateFormDef;
import weblogic.remoteconsole.common.repodef.CreateFormPresentationDef;
import weblogic.remoteconsole.common.repodef.schema.CreateFormPresentationDefSource;

/**
 * yaml-based implementation of the CreateFormPresentationDef interface.
 */
class CreateFormPresentationDefImpl implements CreateFormPresentationDef {
  private CreateFormPresentationDefSource source;
  private CreateFormDefImpl createFormDefImpl;

  public CreateFormPresentationDefImpl(
    CreateFormDefImpl createFormDefImpl,
    CreateFormPresentationDefSource source
  ) {
    this.createFormDefImpl = createFormDefImpl;
    this.source = source;
  }

  CreateFormDefImpl getCreateFormDefImpl() {
    return createFormDefImpl;
  }

  @Override
  public CreateFormDef getCreateFormDef() {
    return getCreateFormDefImpl();
  }

  @Override
  public boolean isSingleColumn() {
    return source.isSingleColumn();
  }
}
