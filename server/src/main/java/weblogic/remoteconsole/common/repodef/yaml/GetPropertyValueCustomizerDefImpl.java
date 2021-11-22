// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.yaml;

import java.lang.reflect.Type;

import com.fasterxml.jackson.core.type.TypeReference;
import weblogic.remoteconsole.common.repodef.GetPropertyValueCustomizerDef;
import weblogic.remoteconsole.common.utils.CustomizerInvocationUtils;
import weblogic.remoteconsole.server.repo.Response;
import weblogic.remoteconsole.server.repo.SettableValue;

/**
 * yaml-based implementation of the GetPropertyValueCustomizerDef interface.
 */
class GetPropertyValueCustomizerDefImpl extends BeanPropertyCustomizerDefImpl
  implements GetPropertyValueCustomizerDef {

  private static final Type CUSTOMIZER_RETURN_TYPE =
    (new TypeReference<Response<SettableValue>>() {}).getType();

  GetPropertyValueCustomizerDefImpl(BeanPropertyDefImpl propertyDefImpl) {
    super(
      propertyDefImpl,
      propertyDefImpl.getCustomizerSource().getGetMethodContainedBeanPath(),
      propertyDefImpl.getCustomizerSource().getGetMethod()
    );
    CustomizerInvocationUtils.checkReturnType(getMethod(), CUSTOMIZER_RETURN_TYPE);
    initializeParamDefs();
  }

  @Override
  protected boolean isSettableParams() {
    return true;
  }

  public String toString() {
    return
      getPropertyDefImpl().toString()
      + " getMethod " + getMethodName()
      + " args " + getParamDefImpls();
  }
}
