// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.yaml;

import weblogic.remoteconsole.common.repodef.FormSectionDef;
import weblogic.remoteconsole.common.repodef.FormSectionUsedIfDef;
import weblogic.remoteconsole.common.repodef.schema.UsedIfDefSource;

/**
 * yaml-based implementation of the FormSectionUsedIfDef interface.
 */
class FormSectionUsedIfDefImpl extends UsedIfDefImpl implements FormSectionUsedIfDef {

  private FormSectionDefImpl formSectionDefImpl;

  FormSectionUsedIfDefImpl(
    FormSectionDefImpl formSectionDefImpl,
    UsedIfDefSource source
  ) {
    super(formSectionDefImpl.getFormDefImpl(), source);
    this.formSectionDefImpl = formSectionDefImpl;
  }

  FormSectionDefImpl getFormSectionDefImpl() {
    return formSectionDefImpl;
  }

  @Override
  public FormSectionDef getFormSectionDef() {
    return getFormSectionDefImpl();
  }
}
