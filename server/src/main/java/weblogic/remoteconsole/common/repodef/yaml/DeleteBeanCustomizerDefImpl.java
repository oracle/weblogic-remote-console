// Copyright (c) 2021, 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.yaml;

import weblogic.console.utils.Path;
import weblogic.remoteconsole.common.repodef.DeleteBeanCustomizerDef;
import weblogic.remoteconsole.common.utils.CustomizerInvocationUtils;

/**
 * yaml-based implementation of the DeleteBeanCustomizerDef interface.
 */
class DeleteBeanCustomizerDefImpl extends SourceAnnotatedCustomizerDefImpl implements DeleteBeanCustomizerDef {

  DeleteBeanCustomizerDefImpl(BaseBeanTypeDefImpl typeDefImpl, String deleteMethod) {
    super(
      typeDefImpl,
      new Path(), // Source annotations on delete customizers are always relative to the top level bean being deleted
      deleteMethod
    );
    CustomizerInvocationUtils.checkReturnType(getMethod(), Void.TYPE);
    initializeParamDefs();
  }

  @Override
  protected boolean isSettableParams() {
    return false;
  }

  public String toString() {
    return
      getTypeDefImpl().toString()
      + " deleteMethod " + getMethodName()
      + " args " + getParamDefImpls();
  }
}
