// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.yaml;

import weblogic.remoteconsole.common.repodef.BeanActionDef;
import weblogic.remoteconsole.common.repodef.BeanActionParamDef;
import weblogic.remoteconsole.common.repodef.schema.BeanActionParamDefSource;
import weblogic.remoteconsole.common.repodef.schema.BeanValueDefCustomizerSource;

/**
 * yaml-based implemetation of the BeanActionParamDef interface
 */
class BeanActionParamDefImpl extends BeanValueDefImpl implements BeanActionParamDef {

  private BeanActionDefImpl actionDefImpl;
  private BeanActionParamDefSource source;

  BeanActionParamDefImpl(
    BeanActionDefImpl actionDefImpl,
    BeanActionParamDefSource source
  ) {
    // we don't support customizing action params in type.yaml yet:
    super(actionDefImpl.getTypeDefImpl(), source, new BeanValueDefCustomizerSource());
    this.actionDefImpl = actionDefImpl;
    this.source = source;
  }

  BeanActionDefImpl getActionDefImpl() {
    return actionDefImpl;
  }

  @Override
  public BeanActionDef getActionDef() {
    return getActionDefImpl();
  }

  @Override
  public String getParamName() {
    return source.getName();
  }

  String getLocalizationKey(String key) {
    return
      getActionDefImpl().getLocalizationKey(
        "params." + getParamName() + "." + key
      );
  }

  @Override
  public String toString() {
    return getActionDef() + ", param=" + getParamName();
  }
}
