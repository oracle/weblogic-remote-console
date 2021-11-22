// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.yaml;

import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import weblogic.remoteconsole.common.repodef.CustomizerDef;
import weblogic.remoteconsole.common.repodef.ParamDef;
import weblogic.remoteconsole.common.utils.CustomizerInvocationUtils;

/**
 * yaml-based implemetation of the CustomizerDef interface
 */
abstract class CustomizerDefImpl implements CustomizerDef {
  private String methodName;
  private Method method;
  private List<ParamDefImpl> paramDefImpls = new ArrayList<>();
  private List<ParamDef> paramDefs;

  CustomizerDefImpl(String methodName) {
    this.methodName = methodName;
    this.method = CustomizerInvocationUtils.getMethod(getMethodName());
  }

  protected String getMethodName() {
    return methodName;
  }

  @Override
  public Method getMethod() {
    return method;
  }

  List<ParamDefImpl> getParamDefImpls() {
    return paramDefImpls;
  }

  @Override
  public List<ParamDef> getParamDefs() {
    return paramDefs;
  }

  protected abstract List<ParamDefImpl> createParamDefImpls();

  // instantiable derived classes' constructors must call this:
  protected void initializeParamDefs() {
    paramDefImpls = createParamDefImpls();
    paramDefs = Collections.unmodifiableList(getParamDefImpls());
  }
}
