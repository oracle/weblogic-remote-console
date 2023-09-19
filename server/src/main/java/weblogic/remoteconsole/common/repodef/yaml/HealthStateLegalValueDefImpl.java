// Copyright (c) 2023, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.yaml;

import weblogic.remoteconsole.common.repodef.LocalizableString;
import weblogic.remoteconsole.common.repodef.LocalizedConstants;

/**
 * implemetation of the LegalValueDef interface for HealthState
 */
class HealthStateLegalValueDefImpl extends PagePropertyLegalValueDefImpl {
  private LocalizableString label;

  public HealthStateLegalValueDefImpl(PagePropertyDefImpl pagePropertyDefImpl, String value) {
    super(pagePropertyDefImpl, value);
    this.label = findLabel();
  }

  private LocalizableString findLabel() {
    String val = getValueAsString();
    if ("ok".equals(val)) {
      return LocalizedConstants.HEALTH_STATE_OK;
    }
    if ("warn".equals(val)) {
      return LocalizedConstants.HEALTH_STATE_WARN;
    }
    if ("critical".equals(val)) {
      return LocalizedConstants.HEALTH_STATE_CRITICAL;
    }
    if ("failed".equals(val)) {
      return LocalizedConstants.HEALTH_STATE_FAILED;
    }
    if ("overloaded".equals(val)) {
      return LocalizedConstants.HEALTH_STATE_OVERLOADED;
    }
    if ("unknown".equals(val)) {
      return LocalizedConstants.HEALTH_STATE_UNKNOWN;
    }
    throw new AssertionError("Unknown health state: " + val);
  }

  @Override
  public LocalizableString getLabel() {
    return label;
  }

  @Override
  boolean isOmit() {
    return false;
  }

  @Override
  public String toString() {
    return "HealthStateLegalValueDefImpl<" + getValueAsString() + "," + getLabel() + ">";
  }
}
