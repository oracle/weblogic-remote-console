// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.yaml;

import weblogic.remoteconsole.common.repodef.InvocationContextParamDef;

/**
 * yaml-based implementation of the InviocationContextParamDef interface.
 */
class InvocationContextParamDefImpl extends ParamDefImpl implements InvocationContextParamDef {
  InvocationContextParamDefImpl(CustomizerDefImpl customizerDefImpl) {
    super(customizerDefImpl);
  }
}
