// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.yaml;

import weblogic.remoteconsole.common.repodef.BeanPropertyDef;
import weblogic.remoteconsole.common.repodef.PropertyParamDef;

/**
 * yaml-based implementation of the PropertyParamDef interface
 */
class PropertyParamDefImpl extends ParamDefImpl implements PropertyParamDef {
  private BeanPropertyDefImpl propertyDefImpl;

  PropertyParamDefImpl(CustomizerDefImpl customizerDefImpl, BeanPropertyDefImpl propertyDefImpl) {
    super(customizerDefImpl);
    this.propertyDefImpl = propertyDefImpl;
  }

  BeanPropertyDefImpl getPropertyDefImpl() {
    return propertyDefImpl;
  }

  @Override
  public BeanPropertyDef getPropertyDef() {
    return getPropertyDefImpl();
  }
}
