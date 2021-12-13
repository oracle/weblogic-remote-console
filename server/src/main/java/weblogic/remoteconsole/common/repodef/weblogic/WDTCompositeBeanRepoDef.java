// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.weblogic;

import weblogic.remoteconsole.common.utils.WebLogicMBeansVersion;

/**
 * Defines the bean types for WDT composite
 */
public class WDTCompositeBeanRepoDef extends WDTBeanRepoDef {

  @Override
  protected boolean isEditable() {
    return false;
  }

  public WDTCompositeBeanRepoDef(WebLogicMBeansVersion mbeansVersion) {
    super(mbeansVersion);
  }
}
