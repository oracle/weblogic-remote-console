// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.yaml;

import weblogic.remoteconsole.common.repodef.BeanPropertyCustomizerDef;
import weblogic.remoteconsole.common.repodef.BeanPropertyDef;
import weblogic.remoteconsole.common.utils.Path;

/**
 * yaml-based implementation of the BeanPropertyCustomizerDef interface.
 */
abstract class BeanPropertyCustomizerDefImpl extends SourceAnnotatedCustomizerDefImpl
  implements BeanPropertyCustomizerDef {

  private BeanPropertyDefImpl propertyDefImpl;

  BeanPropertyCustomizerDefImpl(
    BeanPropertyDefImpl propertyDefImpl,
    Path containedBeanPath,
    String methodName
  ) {
    super(propertyDefImpl.getTypeDefImpl(), containedBeanPath, methodName);
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
