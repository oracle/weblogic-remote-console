// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.yaml;

import java.lang.reflect.Type;

import com.fasterxml.jackson.core.type.TypeReference;
import weblogic.remoteconsole.common.repodef.DeleteBeanCustomizerDef;
import weblogic.remoteconsole.common.utils.CustomizerInvocationUtils;
import weblogic.remoteconsole.common.utils.Path;
import weblogic.remoteconsole.server.repo.Response;

/**
 * yaml-based implementation of the DeleteBeanCustomizerDef interface.
 */
class DeleteBeanCustomizerDefImpl extends SourceAnnotatedCustomizerDefImpl implements DeleteBeanCustomizerDef {

  private static final Type CUSTOMIZER_RETURN_TYPE =
    (new TypeReference<Response<Void>>() {}).getType();

  DeleteBeanCustomizerDefImpl(BaseBeanTypeDefImpl typeDefImpl, String deleteMethod) {
    super(
      typeDefImpl,
      new Path(), // Source annotations on delete customizers are always relative to the top level bean being deleted
      deleteMethod
    );
    CustomizerInvocationUtils.checkReturnType(getMethod(), CUSTOMIZER_RETURN_TYPE);
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
