// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.yaml;

import weblogic.remoteconsole.common.repodef.CustomizerDef;
import weblogic.remoteconsole.common.repodef.ParamDef;

/**
 * yaml-based implementation of the ParamDef interface.
 */
class ParamDefImpl implements ParamDef {
  private CustomizerDefImpl customizerDefImpl;

  ParamDefImpl(CustomizerDefImpl customizerDefImpl) {
    this.customizerDefImpl = customizerDefImpl;
  }

  CustomizerDefImpl getCustomizerDefImpl() {
    return customizerDefImpl;
  }

  @Override
  public CustomizerDef getCustomizerDef() {
    return getCustomizerDefImpl();
  }
}
