// Copyright (c) 2023, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.yaml;

import weblogic.remoteconsole.common.repodef.LegalValueDef;
import weblogic.remoteconsole.common.repodef.LocalizableString;
import weblogic.remoteconsole.common.repodef.PageFieldDef;
import weblogic.remoteconsole.server.repo.Value;

/**
 * yaml-based implemetation of the LegalValueDef interface when parented by a PageActionParamDef
 */
class PageActionParamLegalValueDefImpl implements LegalValueDef {
  private PageActionParamDefImpl pageActionParamDefImpl;
  Value value;
  private LocalizableString label;
  private boolean omit;

  public PageActionParamLegalValueDefImpl(PageActionParamDefImpl pageActionParamDefImpl, Object value) {
    this.pageActionParamDefImpl = pageActionParamDefImpl;
    this.value = ValueUtils.createValue(value);
    initializeLabel(getValueAsString());
  }

  public PageActionParamLegalValueDefImpl(
    PageActionParamDefImpl pageActionParamDefImpl,
    Object value,
    String englishLabel
  ) {
    this(pageActionParamDefImpl, value);
    initializeLabel(englishLabel);
  }

  public PageActionParamLegalValueDefImpl(
    PageActionParamDefImpl pageActionParamDefImpl,
    Object value,
    String englishLabel,
    boolean omit
  ) {
    this(pageActionParamDefImpl, value);
    this.omit = omit;
    initializeLabel(englishLabel);
  }

  private void initializeLabel(String englishLabel) {
    label =
      new LocalizableString(
        getActionParamDefImpl().getLegalValueLocalizationKey(getValueAsString()),
        englishLabel
      );
  }

  PageActionParamDefImpl getActionParamDefImpl() {
    return pageActionParamDefImpl;
  }

  boolean isOmit() {
    return omit;
  }

  @Override
  public PageFieldDef getFieldDef() {
    return getActionParamDefImpl();
  }

  @Override
  public Value getValue() {
    return value;
  }

  @Override
  public LocalizableString getLabel() {
    return label;
  }

  String getValueAsString() {
    if (getValue().isString()) {
      return getValue().asString().getValue();
    }
    if (getValue().isInt()) {
      return "" + getValue().asInt().getValue();
    }
    if (getValue().isLong()) {
      return "" + getValue().asLong().getValue();
    }
    throw new AssertionError("Unsupport legal value: " + getValue());
  }

  @Override
  public String toString() {
    return "PageActionParamLegalValueDefImpl<" + getValueAsString() + "," + getLabel() + ">";
  }
}
