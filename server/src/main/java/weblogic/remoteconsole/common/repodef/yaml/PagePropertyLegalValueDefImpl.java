// Copyright (c) 2021, 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.yaml;

import weblogic.remoteconsole.common.repodef.LegalValueDef;
import weblogic.remoteconsole.common.repodef.PageFieldDef;
import weblogic.remoteconsole.server.repo.Value;

/**
 * base implemetation of the LegalValueDef interface for properties on pages
 * (v.s. action input forms)
 */
abstract class PagePropertyLegalValueDefImpl implements LegalValueDef {
  private PagePropertyDefImpl pagePropertyDefImpl;
  Value value;

  protected PagePropertyLegalValueDefImpl(PagePropertyDefImpl pagePropertyDefImpl, Object value) {
    this.pagePropertyDefImpl = pagePropertyDefImpl;
    this.value = ValueUtils.createValue(value);
  }

  PagePropertyDefImpl getPropertyDefImpl() {
    return pagePropertyDefImpl;
  }

  @Override
  public PageFieldDef getFieldDef() {
    return getPropertyDefImpl();
  }

  @Override
  public Value getValue() {
    return value;
  }

  abstract boolean isOmit();

  String getValueAsString() {
    return ValueUtils.getValueAsString(getValue());
  }
}
