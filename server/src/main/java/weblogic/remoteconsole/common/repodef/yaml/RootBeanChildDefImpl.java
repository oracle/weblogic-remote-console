// Copyright (c) 2021, 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.yaml;

import weblogic.remoteconsole.common.repodef.LocalizableString;
import weblogic.remoteconsole.common.utils.Path;
import weblogic.remoteconsole.common.utils.StringUtils;

/**
 * Implementation of the BeanChildDef interface for the immediate children
 * of the root bean in a yaml-based repo.
 * <p>
 * For example, the WebLogicRuntimeTreeBeanRepoDef has two trees of mbeans
 * (Domain and DomainRuntime).  These trees of mbean are defined in sets of yaml files.
 * <p>
 * However, the repo also has an implicit 'root' that parents these two trees.
 * It has two children, one for each tree.  This class implements these children
 * (v.s. defining the root in a yaml file).
 */
class RootBeanChildDefImpl extends BaseBeanChildDefImpl {
  private BaseBeanTypeDefImpl childTypeDefImpl;
  private LocalizableString label;

  RootBeanChildDefImpl(BaseBeanTypeDefImpl typeDefImpl, String childTypeName) {
    super(typeDefImpl);
    this.childTypeDefImpl =
      getTypeDefImpl().getBeanRepoDefImpl().getTypeDefImpl(StringUtils.getLeafClassName(childTypeName));
    this.label =
      new LocalizableString(
        getLocalizationKey("label"),
        StringUtils.camelCaseToUpperCaseWords(getChildName())
      );
  }

  @Override
  public String getChildName() {
    return getChildTypeDef().getInstanceName();
  }

  @Override
  public String getOnlineChildName() {
    return getChildName(); // they never show up in the WLS REST api since they're implied by the root URL
  }

  @Override
  public String getOfflineChildName() {
    return getChildName();
  }

  @Override
  BaseBeanTypeDefImpl getChildTypeDefImpl() {
    return this.childTypeDefImpl;
  }

  @Override
  public Path getParentPath() {
    return new Path();
  }

  @Override
  public boolean isCollection() {
    return false;
  }

  @Override
  public boolean isRoot() {
    return true;
  }

  @Override
  public boolean isCreatable() {
    return false;
  }

  @Override
  public boolean isDeletable() {
    return false;
  }

  @Override
  public boolean isAsyncCreate() {
    return false;
  }

  @Override
  public boolean isAsyncDelete() {
    return false;
  }

  @Override 
  public boolean isOptional() {
    return false;
  }

  @Override
  public boolean isEditable() {
    return getTypeDefImpl().getBeanRepoDefImpl().isEditable();
  }

  @Override
  public LocalizableString getLabel() {
    return this.label;
  }

  @Override
  public LocalizableString getSingularLabel() {
    return getLabel();
  }

  @Override
  public boolean isRestartNeeded() {
    return false;
  }

  @Override
  public boolean isCollapsedInWDT() {
    return false;
  }
}
