// Copyright (c) 2021, 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.yaml;

import java.util.Set;

import weblogic.remoteconsole.common.repodef.BeanChildDef;
import weblogic.remoteconsole.common.repodef.BeanTypeDef;
import weblogic.remoteconsole.common.utils.WebLogicRoles;

/**
 * Base implementation of the BeanChildDef interface for yaml-based repos.
 */
abstract class BaseBeanChildDefImpl implements BeanChildDef {
  private BaseBeanTypeDefImpl typeDefImpl;

  BaseBeanChildDefImpl(BaseBeanTypeDefImpl typeDefImpl) {
    this.typeDefImpl = typeDefImpl;
  }

  BaseBeanTypeDefImpl getTypeDefImpl() {
    return this.typeDefImpl;
  }

  BeanChildDefImpl asBeanChildDefImpl() {
    return BeanChildDefImpl.class.cast(this);
  }

  @Override
  public BeanTypeDef getTypeDef() {
    return getTypeDefImpl();
  }

  abstract BaseBeanTypeDefImpl getChildTypeDefImpl();

  @Override
  public BeanTypeDef getChildTypeDef() {
    return getChildTypeDefImpl();
  }

  @Override
  public Set<String> getGetRoles() {
    return WebLogicRoles.ALL;
  }

  @Override
  public Set<String> getSetRoles() {
    return WebLogicRoles.ALL;
  }

  @Override
  public Set<String> getCreateRoles() {
    return WebLogicRoles.ALL;
  }

  @Override
  public Set<String> getDeleteRoles() {
    return WebLogicRoles.ALL;
  }

  String getLocalizationKey(String key) {
    return
      getTypeDefImpl().getLocalizationKey(
        "children." + getChildPath().getDotSeparatedPath() + "." + key
      );
  }

  @Override
  public String toString() {
    return "BeanChildDef<" + getTypeDef() + "," + getChildPath() + ">";
  }
}
