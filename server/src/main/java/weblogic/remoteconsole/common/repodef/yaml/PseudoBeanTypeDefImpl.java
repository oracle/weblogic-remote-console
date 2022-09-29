// Copyright (c) 2021, 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.yaml;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import weblogic.remoteconsole.common.repodef.DeleteBeanCustomizerDef;
import weblogic.remoteconsole.common.repodef.LocalizableString;
import weblogic.remoteconsole.common.repodef.schema.BeanTypeDefSource;
import weblogic.remoteconsole.common.repodef.schema.PseudoBeanTypeDefSource;
import weblogic.remoteconsole.common.utils.Path;
import weblogic.remoteconsole.common.utils.StringUtils;

/**
 * yaml-based implementation of the BeanTypeDef interface for interfaces
 * defined in <BaseFooMBean>.yaml and <DerivedFooMBean>/pseudo-type.yaml
 * <p>
 * Some WebLogic mbeans, instead of having separate derived types,
 * each with different properties, lump all of the derived types' properties
 * into one mbean type which also has a property that indicates the type.
 * The type indicates which properties are meaningful.
 * <p>
 * The remote console converts each of them into a separate 'pseudo-types',
 * each with an appropriate set of properties.  These are pseudo-type.yaml files,
 * one for each logical type.
 */
public class PseudoBeanTypeDefImpl extends YamlBasedBeanTypeDefImpl {
  private PseudoBeanTypeDefSource source;
  private YamlBasedBeanTypeDefImpl baseTypeDefImpl;
  private List<BaseBeanTypeDefImpl> inheritedTypeDefImpls = new ArrayList<>();

  public PseudoBeanTypeDefImpl(BeanRepoDefImpl beanRepoDefImpl, PseudoBeanTypeDefSource source) {
    super(beanRepoDefImpl, source.getName());
    // can't customize a pseudo type's name since pseudo types should have good names to begin with:
    initializeInstanceName(null);
    this.source = source;
    baseTypeDefImpl =
      getBeanRepoDefImpl()
      .getTypeDefImpl(StringUtils.getLeafClassName(getSource().getBaseType()))
      .asYamlBasedBeanTypeDefImpl();
    if (getBaseTypeDefImpl() == null) {
      throw new AssertionError("Can't find base type " + getSource().getBaseType() + " for " + getTypeName());
    }
    inheritedTypeDefImpls.add(baseTypeDefImpl);
    copyPropertyDefImpls();
    copyChildDefImpls();
    initializeContainedDefsAndImpls();
  }

  private void copyPropertyDefImpls() {
    Set<String> include = new HashSet<>();
    Set<String> exclude = new HashSet<>();
    include.addAll(getSource().getInclude());
    exclude.addAll(getSource().getExclude());
    if (include.isEmpty() && exclude.isEmpty()) {
      throw new AssertionError("Neither include or exclude is specified for " + getTypeName());
    }
    if (!include.isEmpty() && !exclude.isEmpty()) {
      throw new AssertionError("Both include and exclude are specified for " + getTypeName());
    }
    for (BeanPropertyDefImpl propertyDefImpl : getBaseTypeDefImpl().getPropertyNameToPropertyDefImplMap().values()) {
      String propertyName = propertyDefImpl.getPropertyPath().getDotSeparatedPath();
      boolean copy = false;
      if (!include.isEmpty()) {
        if (include.contains(propertyName)) {
          // The pseudo type lists which properties to include, and this property is one of them.
          copy = true;
        }
      } else {
        if (!exclude.contains(propertyName)) {
          // The pseudo type lists which properties to exclude, and this property is not one of them.
          copy = true;
        }
      }
      if (copy) {
        addPropertyDefImpl(
          createBeanPropertyDefImpl(
            propertyDefImpl.getParentPath(),
            propertyDefImpl.getSource(),
            propertyDefImpl.getCustomizerSource()
          )
        );
      }
    }
  }

  private void copyChildDefImpls() {
    // Currently pseudo types can't trim down the base type's child beans, so copy them all.
    for (BaseBeanChildDefImpl baseChildDefImpl : getBaseTypeDefImpl().getChildNameToChildDefImplMap().values()) {
      BeanChildDefImpl childDefImpl = baseChildDefImpl.asBeanChildDefImpl();
      addChildDefImpl(
        createBeanChildDefImpl(
          childDefImpl.getParentPath(),
          childDefImpl.getSource(),
          childDefImpl.getCustomizerSource()
        )
      );
    }
  }

  @Override
  LocalizableString getDescriptionHTML() {
    return getBaseTypeDefImpl().getDescriptionHTML();
  }

  private PseudoBeanTypeDefSource getSource() {
    return source;
  }

  private YamlBasedBeanTypeDefImpl getBaseTypeDefImpl() {
    return baseTypeDefImpl;
  }

  @Override
  List<BaseBeanTypeDefImpl> getInheritedTypeDefImpls() {
    return inheritedTypeDefImpls;
  }

  // Delegate everything else to the base type:

  @Override
  boolean isType(String desiredTypeName) {
    if (getTypeName().equals(desiredTypeName)) {
      return true;
    }
    return getBaseTypeDefImpl().isType(desiredTypeName);
  }

  @Override
  public boolean isReferenceable() {
    return getBaseTypeDefImpl().isReferenceable();
  }

  @Override
  public boolean isOrdered() {
    return getBaseTypeDefImpl().isOrdered();
  }

  @Override
  public boolean isSupportsCustomFilteringDashboards() {
    return getBaseTypeDefImpl().isSupportsCustomFilteringDashboards();
  }

  @Override
  BeanPropertyDefImpl getKeyPropertyDefImpl() {
    return getBaseTypeDefImpl().getKeyPropertyDefImpl();
  }

  @Override
  BeanPropertyDefImpl getIdentityPropertyDefImpl() {
    return getBaseTypeDefImpl().getIdentityPropertyDefImpl();
  }

  @Override
  public boolean isHomogeneous() {
    return getBaseTypeDefImpl().isHomogeneous();
  }

  @Override
  BeanPropertyDefImpl getSubTypeDiscriminatorPropertyDefImpl() {
    return getBaseTypeDefImpl().getSubTypeDiscriminatorPropertyDefImpl();
  }

  @Override
  public List<String> getSubTypeDiscriminatorLegalValues() {
    return getBaseTypeDefImpl().getSubTypeDiscriminatorLegalValues();
  }

  @Override
  BaseBeanTypeDefImpl getSubTypeDefImpl(String subTypeDiscriminator) {
    return getBaseTypeDefImpl().getSubTypeDefImpl(subTypeDiscriminator);
  }

  @Override
  public boolean hasChildDef(Path childPath, boolean searchSubTypes) {
    return getBaseTypeDefImpl().hasChildDef(childPath, searchSubTypes);
  }

  @Override
  BaseBeanChildDefImpl getChildDefImpl(Path childPath, boolean searchSubTypes) {
    return getBaseTypeDefImpl().getChildDefImpl(childPath, searchSubTypes);
  }

  @Override
  public boolean isSettable() {
    return getBaseTypeDefImpl().isSettable();
  }

  @Override
  public DeleteBeanCustomizerDef getDeleteCustomizerDef() {
    return getBaseTypeDefImpl().getDeleteCustomizerDef();
  }

  @Override
  public String getCreateResourceMethod() {
    return getBaseTypeDefImpl().getCreateResourceMethod();
  }

  @Override
  public String getGetCollectionMethod() {
    return getBaseTypeDefImpl().getGetCollectionMethod();
  }

  @Override
  boolean isDisableMBeanJavadoc() {
    return getBaseTypeDefImpl().isDisableMBeanJavadoc();
  }

  @Override
  BeanTypeDefSource getTypeDefSource() {
    return baseTypeDefImpl.getTypeDefSource();
  }

  @Override
  boolean isEditable() {
    return baseTypeDefImpl.isEditable();
  }
}
