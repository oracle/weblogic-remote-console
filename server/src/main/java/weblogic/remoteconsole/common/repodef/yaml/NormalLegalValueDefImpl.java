// Copyright (c) 2021, 2023, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.yaml;

import weblogic.remoteconsole.common.repodef.LocalizableString;

/**
 * yaml-based implemetation of the LegalValueDef interface
 */
class NormalLegalValueDefImpl extends PagePropertyLegalValueDefImpl {
  private LocalizableString label;
  private boolean omit;

  public NormalLegalValueDefImpl(PagePropertyDefImpl pagePropertyDefImpl, Object value) {
    super(pagePropertyDefImpl, value);
    initializeLabel(getValueAsString());
  }

  public NormalLegalValueDefImpl(PagePropertyDefImpl pagePropertyDefImpl, Object value, String englishLabel) {
    this(pagePropertyDefImpl, value);
    initializeLabel(englishLabel);
  }

  public NormalLegalValueDefImpl(
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

  @Override
  boolean isOmit() {
    return omit;
  }

  @Override
  public LocalizableString getLabel() {
    return label;
  }

  @Override
  public String toString() {
    return "NormalLegalValueDefImpl<" + getValueAsString() + "," + getLabel() + ">";
  }
}
