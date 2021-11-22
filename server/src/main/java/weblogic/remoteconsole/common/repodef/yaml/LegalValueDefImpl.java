// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.yaml;

import weblogic.remoteconsole.common.repodef.LegalValueDef;
import weblogic.remoteconsole.common.repodef.LocalizableString;
import weblogic.remoteconsole.common.repodef.PagePropertyDef;
import weblogic.remoteconsole.server.repo.Value;

/**
 * yaml-based implemetation of the LegalValueDef interface
 */
class LegalValueDefImpl implements LegalValueDef {
  private PagePropertyDefImpl pagePropertyDefImpl;
  Value value;
  private LocalizableString label;
  private boolean omit;

  public LegalValueDefImpl(PagePropertyDefImpl pagePropertyDefImpl, Object value) {
    this.pagePropertyDefImpl = pagePropertyDefImpl;
    this.value = ValueUtils.createValue(value);
    initializeLabel(getValueAsString());
  }

  public LegalValueDefImpl(PagePropertyDefImpl pagePropertyDefImpl, Object value, String englishLabel) {
    this(pagePropertyDefImpl, value);
    initializeLabel(englishLabel);
  }

  public LegalValueDefImpl(
    PagePropertyDefImpl pagePropertyDefImpl,
    Object value,
    String englishLabel,
    boolean omit
  ) {
    this(pagePropertyDefImpl, value);
    this.omit = omit;
    initializeLabel(englishLabel);
  }

  private void initializeLabel(String englishLabel) {
    label =
      new LocalizableString(
        getPropertyDefImpl().getLegalValueLocalizationKey(getValueAsString()),
        englishLabel
      );
  }

  PagePropertyDefImpl getPropertyDefImpl() {
    return pagePropertyDefImpl;
  }

  boolean isOmit() {
    return omit;
  }

  @Override
  public PagePropertyDef getPropertyDef() {
    return getPropertyDefImpl();
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
    return "LegalValueDefImpl<" + getValueAsString() + "," + getLabel() + ">";
  }
}
