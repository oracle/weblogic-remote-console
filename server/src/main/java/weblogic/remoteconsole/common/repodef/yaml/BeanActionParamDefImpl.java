// Copyright (c) 2021, 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.yaml;

import weblogic.console.schema.beaninfo.BeanActionParamDefSource;
import weblogic.console.utils.StringUtils;
import weblogic.remoteconsole.common.repodef.BeanActionDef;
import weblogic.remoteconsole.common.repodef.BeanActionParamDef;
import weblogic.remoteconsole.common.repodef.schema.BeanActionParamDefCustomizerSource;
import weblogic.remoteconsole.server.repo.Value;

/**
 * yaml-based implemetation of the BeanActionParamDef interface
 */
class BeanActionParamDefImpl extends BeanValueDefImpl implements BeanActionParamDef {

  private BeanActionDefImpl actionDefImpl;
  private BeanActionParamDefSource source;
  private BeanActionParamDefCustomizerSource customizerSource;

  BeanActionParamDefImpl(
    BeanActionDefImpl actionDefImpl,
    BeanActionParamDefSource source,
    BeanActionParamDefCustomizerSource customizerSource
  ) {
    super(actionDefImpl.getTypeDefImpl(), source, customizerSource);
    this.actionDefImpl = actionDefImpl;
    this.source = source;
    this.customizerSource = customizerSource;
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

  @Override
  public String getFormFieldName() {
    String formName = getCustomizerSource().getFormName();
    return (StringUtils.isEmpty(formName)) ? getParamName() : formName;
  }

  @Override
  public String getOnlineParamName() {
    String onlineName = getCustomizerSource().getOnlineName();
    return (StringUtils.isEmpty(onlineName)) ? getParamName() : onlineName;
  }

  @Override
  public boolean isRequired() {
    return getCustomizerSource().isRequired();
  }

  @Override
  public Value getDefaultValue() {
    return getDefaultValueForType();
  }

  protected BeanActionParamDefSource getSource() {
    return source;
  }

  protected BeanActionParamDefCustomizerSource getCustomizerSource() {
    return customizerSource;
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
