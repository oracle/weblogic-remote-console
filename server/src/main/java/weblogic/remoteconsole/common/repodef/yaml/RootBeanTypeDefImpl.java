// Copyright (c) 2021, 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.yaml;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import weblogic.remoteconsole.common.repodef.BeanTypeDef;
import weblogic.remoteconsole.common.repodef.DeleteBeanCustomizerDef;
import weblogic.remoteconsole.common.repodef.LocalizableString;
import weblogic.remoteconsole.common.utils.Path;

/**
 * Implementation of the BeanTypeDef interface for the root type of a repo.
 * <p>
 * For example, the WebLogicRuntimeTreeBeanRepoDef has two trees of mbeans
 * (Domain and DomainRuntime).  These trees of mbean are defined in sets of yaml files.
 * <p>
 * However, the repo also has an implicit 'root' that parents these two trees.
 * This class implements that root (v.s. defining it in a yaml file).
 */
class RootBeanTypeDefImpl extends BaseBeanTypeDefImpl {

  private Map<String,BaseBeanChildDefImpl> childPathToChildDefImplMap = new HashMap<>();

  private List<BaseBeanTypeDefImpl> inheritedTypeDefImpls = List.of();

  RootBeanTypeDefImpl(BeanRepoDefImpl beanRepoDefImpl, String... rootChildBeanTypeNames) {
    super(beanRepoDefImpl, "root");
    for (String rootChildBeanTypeName : rootChildBeanTypeNames) {
      BaseBeanChildDefImpl childDefImpl = new RootBeanChildDefImpl(this, rootChildBeanTypeName);
      childPathToChildDefImplMap.put(pathKey(childDefImpl.getChildPath()), childDefImpl);
    }
    initializeContainedDefsAndImpls(
      new ArrayList<>(), // no properties
      childPathToChildDefImplMap.values(),
      new ArrayList<>() // no actions
    );
  }

  @Override
  public String getInstanceName() {
    return null;
  }

  @Override
  public LocalizableString getInstanceNameLabel() {
    return LocalizableString.NULL;
  }

  @Override
  LocalizableString getDescriptionHTML() {
    return LocalizableString.NULL;
  }

  @Override
  BeanPropertyDefImpl getKeyPropertyDefImpl() {
    return null;
  }

  @Override
  BeanPropertyDefImpl getIdentityPropertyDefImpl() {
    return null;
  }

  @Override
  public boolean isHomogeneous() {
    return true;
  }

  @Override
  List<BaseBeanTypeDefImpl> getInheritedTypeDefImpls() {
    return inheritedTypeDefImpls;
  }

  @Override
  BeanPropertyDefImpl getSubTypeDiscriminatorPropertyDefImpl() {
    return null;
  }

  @Override
  public List<String> getSubTypeDiscriminatorLegalValues() {
    return null;
  }

  @Override
  BaseBeanTypeDefImpl getSubTypeDefImpl(String subTypeDiscriminator) {
    return null;
  }

  @Override
  BeanPropertyDefImpl findPropertyDefImpl(Path path) {
    return null;
  }

  @Override
  BaseBeanChildDefImpl findChildDefImpl(Path path) {
    return childPathToChildDefImplMap.get(pathKey(path));
  }

  @Override
  BeanActionDefImpl findActionDefImpl(Path path) {
    return null;
  }

  @Override
  public boolean isReferenceable() {
    return false;
  }

  @Override
  public boolean isOrdered() {
    return false;
  }

  @Override
  public boolean isSupportsCustomFilteringDashboards() {
    return false;
  }

  @Override
  public boolean isSettable() {
    return false;
  }

  @Override
  public boolean isTypeDef(BeanTypeDef otherTypeDef) {
    return getTypeName().equals(otherTypeDef.getTypeName());
  }

  @Override
  public DeleteBeanCustomizerDef getDeleteCustomizerDef() {
    return null;
  }

  @Override
  public String getCreateResourceMethod() {
    return null;
  }

  @Override
  public String getGetCollectionMethod() {
    return null;
  }

  @Override
  boolean isDisableMBeanJavadoc() {
    return false;
  }

  @Override
  boolean isEditable() {
    return false;
  }

  private String pathKey(Path path) {
    return path.toString();
  }
}
