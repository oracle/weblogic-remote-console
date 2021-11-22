// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.yaml;

import java.lang.reflect.Type;
import java.util.List;

import com.fasterxml.jackson.core.type.TypeReference;
import weblogic.remoteconsole.common.repodef.GetPropertyOptionsCustomizerDef;
import weblogic.remoteconsole.common.utils.CustomizerInvocationUtils;
import weblogic.remoteconsole.server.repo.Option;
import weblogic.remoteconsole.server.repo.Response;

/**
 * yaml-based implementation of the GetPropertyOptionsCustomizerDef interface.
 */
class GetPropertyOptionsCustomizerDefImpl extends BeanPropertyCustomizerDefImpl
  implements GetPropertyOptionsCustomizerDef {

  private static final Type CUSTOMIZER_RETURN_TYPE =
    (new TypeReference<Response<List<Option>>>() {}).getType();

  GetPropertyOptionsCustomizerDefImpl(BeanPropertyDefImpl propertyDefImpl) {
    super(
      propertyDefImpl,
      propertyDefImpl.getCustomizerSource().getGetMethodContainedBeanPath(),
      propertyDefImpl.getCustomizerSource().getOptionsMethod());
    CustomizerInvocationUtils.checkReturnType(getMethod(), CUSTOMIZER_RETURN_TYPE);
    initializeParamDefs();
  }

  @Override
  protected boolean isSettableParams() {
    return false;
  }

  public String toString() {
    return
      getPropertyDefImpl().toString()
      + " optionsMethod " + getMethodName()
      + " args " + getParamDefImpls();
  }
}
