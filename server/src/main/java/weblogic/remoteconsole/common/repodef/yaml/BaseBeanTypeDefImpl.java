// Copyright (c) 2021, 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.yaml;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.logging.Logger;

import weblogic.remoteconsole.common.repodef.BeanActionDef;
import weblogic.remoteconsole.common.repodef.BeanChildDef;
import weblogic.remoteconsole.common.repodef.BeanPropertyDef;
import weblogic.remoteconsole.common.repodef.BeanRepoDef;
import weblogic.remoteconsole.common.repodef.BeanTypeDef;
import weblogic.remoteconsole.common.repodef.LocalizableString;
import weblogic.remoteconsole.common.utils.Path;

/**
 * Base implentation of the BeanTypeDef interface for yaml-based repos.
 */
public abstract class BaseBeanTypeDefImpl implements BeanTypeDef {

  private static final Logger LOGGER = Logger.getLogger(BaseBeanTypeDefImpl.class.getName());

  private String typeName;
  private BeanRepoDefImpl beanRepoDefImpl;
  private List<BeanPropertyDefImpl> propertyDefImpls;
  private List<BeanPropertyDef> propertyDefs;
  private List<BaseBeanChildDefImpl> childDefImpls;
  private List<BeanChildDef> childDefs;
  private List<BeanActionDefImpl> actionDefImpls;
  private List<BeanActionDef> actionDefs;
  private List<BaseBeanTypeDefImpl> subTypeDefImpls;

  BaseBeanTypeDefImpl(BeanRepoDefImpl beanRepoDefImpl, String typeName) {
    this.beanRepoDefImpl = beanRepoDefImpl;
    this.typeName = typeName;
  }

  BeanRepoDefImpl getBeanRepoDefImpl() {
    return this.beanRepoDefImpl;
  }

  @Override
  public BeanRepoDef getBeanRepoDef() {
    return getBeanRepoDefImpl();
  }

  @Override
  public String getTypeName() {
    return this.typeName;
  }

  abstract LocalizableString getDescriptionHTML();

  protected String getTypeNameLabelKey() {
    return getLocalizationKey("type.label");
  }

  protected String getInstanceNameLabelKey() {
    return getLocalizationKey("instance.label");
  }

  protected String getDescriptionHTMLKey() {
    return getLocalizationKey("descriptionHTML");
  }

  @Override
  public boolean hasPropertyDef(Path propertyPath, boolean searchSubTypes) {
    BeanPropertyDefImpl propertyDefImpl = findPropertyDefImpl(propertyPath, searchSubTypes);
    if (propertyDefImpl != null) {
      if (getBeanRepoDefImpl().isAccessAllowed(propertyDefImpl.getGetRoles())) {
        return true;
      }
    }
    return false;
  }

  @Override
  public BeanPropertyDef getPropertyDef(Path propertyPath, boolean searchSubTypes) {
    return getPropertyDefImpl(propertyPath, searchSubTypes);
  }

  BeanPropertyDefImpl getPropertyDefImpl(Path propertyPath) {
    return getPropertyDefImpl(propertyPath, false);
  }

  BeanPropertyDefImpl getPropertyDefImpl(Path propertyPath, boolean searchSubTypes) {
    BeanPropertyDefImpl propertyDefImpl = findPropertyDefImpl(propertyPath, searchSubTypes);
    if (propertyDefImpl != null) {
      if (getBeanRepoDefImpl().isAccessAllowed(propertyDefImpl.getGetRoles())) {
        return propertyDefImpl;
      }
    }
    if (!getBeanRepoDefImpl().isRemoveMissingPropertiesAndTypes()) {
      throw new AssertionError("Can't find property " + getTypeName() + " " + propertyPath);
    }
    return null;
  }

  private BeanPropertyDefImpl findPropertyDefImpl(Path propertyPath, boolean searchSubTypes) {
    return findPropertyDefImpl(new HashSet<String>(), propertyPath, searchSubTypes);
  }

  private BeanPropertyDefImpl findPropertyDefImpl(
    Set<String> searchedTypes,
    Path propertyPath,
    boolean searchSubTypes
  ) {
    BeanPropertyDefImpl propertyDefImpl = findPropertyDefImpl(propertyPath); // local search
    if (propertyDefImpl != null) {
      return propertyDefImpl;
    }
    if (!searchSubTypes || isHomogeneous()) {
      return null;
    }
    for (BaseBeanTypeDefImpl subTypeDefImpl : getSubTypeDefImpls()) {
      String subTypeName = subTypeDefImpl.getTypeName();
      if (subTypeName.equals(getTypeName())) {
        // we've already searched locally.
      } else if (searchedTypes.contains(subTypeName)) {
        // we've already searched this type.
      } else {
        searchedTypes.add(subTypeName);
        BeanPropertyDefImpl subTypePropertyDefImpl =
          subTypeDefImpl.findPropertyDefImpl(searchedTypes, propertyPath, true);
        if (subTypePropertyDefImpl != null) {
          return subTypePropertyDefImpl;
        }
      }
    }
    return null;
  }

  // Just searches locally, returns null if the property isn't found.
  abstract BeanPropertyDefImpl findPropertyDefImpl(Path propertyPath);

  List<BeanPropertyDefImpl> getPropertyDefImpls() {
    return propertyDefImpls;
  }

  @Override
  public List<BeanPropertyDef> getPropertyDefs() {
    return propertyDefs;
  }

  @Override
  public BeanPropertyDef getPropertyDefFromOfflineName(String offlinePropertyName) {
    for (BeanPropertyDef propDef : getPropertyDefs()) {
      if (propDef.getParentPath().isEmpty() && propDef.getOfflinePropertyName().equals(offlinePropertyName)) {
        return propDef;
      }
    }
    return null;
  }

  @Override
  public boolean hasChildDef(Path childPath, boolean searchSubTypes) {
    BaseBeanChildDefImpl childDefImpl = findChildDefImpl(childPath, searchSubTypes);
    if (childDefImpl != null) {
      if (getBeanRepoDefImpl().isAccessAllowed(childDefImpl.getGetRoles())) {
        return true;
      }
    }
    return false;
  }

  @Override
  public BeanChildDef getChildDef(Path childPath, boolean searchSubTypes) {
    return getChildDefImpl(childPath, searchSubTypes);
  }

  BaseBeanChildDefImpl getChildDefImpl(Path childPath) {
    return getChildDefImpl(childPath, false);
  }

  BaseBeanChildDefImpl getChildDefImpl(Path childPath, boolean searchSubTypes) {
    BaseBeanChildDefImpl childDefImpl = findChildDefImpl(childPath, searchSubTypes);
    if (childDefImpl != null) {
      if (getBeanRepoDefImpl().isAccessAllowed(childDefImpl.getGetRoles())) {
        return childDefImpl;
      }
    }
    if (!getBeanRepoDefImpl().isRemoveMissingPropertiesAndTypes()) {
      throw new AssertionError("Can't find child " + getTypeName() + " " + childPath);
    }
    return null;
  }

  private BaseBeanChildDefImpl findChildDefImpl(Path childPath, boolean searchSubTypes) {
    return findChildDefImpl(new HashSet<String>(), childPath, searchSubTypes);
  }

  private BaseBeanChildDefImpl findChildDefImpl(
    Set<String> searchedTypes,
    Path childPath,
    boolean searchSubTypes
  ) {
    BaseBeanChildDefImpl childDefImpl = findChildDefImpl(childPath); // local search
    if (childDefImpl != null) {
      return childDefImpl;
    }
    if (!searchSubTypes || isHomogeneous()) {
      return null;
    }
    for (BaseBeanTypeDefImpl subTypeDefImpl : getSubTypeDefImpls()) {
      String subTypeName = subTypeDefImpl.getTypeName();
      if (subTypeName.equals(getTypeName())) {
        // we've already searched locally.
      } else if (searchedTypes.contains(subTypeName)) {
        // we've already searched this type.
      } else {
        searchedTypes.add(subTypeName);
        BaseBeanChildDefImpl subTypeChildDefImpl =
          subTypeDefImpl.findChildDefImpl(searchedTypes, childPath, searchSubTypes);
        if (subTypeChildDefImpl != null) {
          return subTypeChildDefImpl;
        }
      }
    }
    return null;
  }

  // Just searches locally, returns null if the child isn't found.
  abstract BaseBeanChildDefImpl findChildDefImpl(Path childPath);

  List<BaseBeanChildDefImpl> getChildDefImpls() {
    return childDefImpls;
  }

  @Override
  public List<BeanChildDef> getChildDefs() {
    return childDefs;
  }

  @Override
  public BeanChildDef getChildDefFromOfflineName(String offlineChildName) {
    for (BeanChildDef childDef : getChildDefs()) {
      if (childDef.getParentPath().isEmpty() && childDef.getOfflineChildName().equals(offlineChildName)) {
        return childDef;
      }
    }
    return null;
  }

  @Override
  public boolean hasActionDef(Path actionPath, boolean searchSubTypes) {
    BeanActionDefImpl actionDefImpl = findActionDefImpl(actionPath, searchSubTypes);
    if (actionDefImpl != null) {
      if (getBeanRepoDefImpl().isAccessAllowed(actionDefImpl.getInvokeRoles())) {
        return true;
      }
    }
    return false;
  }

  @Override
  public BeanActionDef getActionDef(Path actionPath, boolean searchSubTypes) {
    return getActionDefImpl(actionPath, searchSubTypes);
  }

  BeanActionDefImpl getActionDefImpl(Path actionPath) {
    return getActionDefImpl(actionPath, false);
  }

  BeanActionDefImpl getActionDefImpl(Path actionPath, boolean searchSubTypes) {
    BeanActionDefImpl actionDefImpl = findActionDefImpl(actionPath, searchSubTypes);
    if (actionDefImpl != null) {
      if (getBeanRepoDefImpl().isAccessAllowed(actionDefImpl.getInvokeRoles())) {
        return actionDefImpl;
      }
    }
    if (!getBeanRepoDefImpl().isRemoveMissingPropertiesAndTypes()) {
      throw new AssertionError("Can't find action " + getTypeName() + " " + actionPath);
    }
    return null;
  }

  private BeanActionDefImpl findActionDefImpl(Path actionPath, boolean searchSubTypes) {
    return findActionDefImpl(new HashSet<String>(), actionPath, searchSubTypes);
  }

  private BeanActionDefImpl findActionDefImpl(
    Set<String> searchedTypes,
    Path actionPath,
    boolean searchSubTypes
  ) {
    BeanActionDefImpl actionDefImpl = findActionDefImpl(actionPath); // local search
    if (actionDefImpl != null) {
      return actionDefImpl;
    }
    if (!searchSubTypes || isHomogeneous()) {
      return null;
    }
    for (BaseBeanTypeDefImpl subTypeDefImpl : getSubTypeDefImpls()) {
      String subTypeName = subTypeDefImpl.getTypeName();
      if (subTypeName.equals(getTypeName())) {
        // we've already searched locally.
      } else if (searchedTypes.contains(subTypeName)) {
        // we've already searched this type.
      } else {
        searchedTypes.add(subTypeName);
        BeanActionDefImpl subTypeActionDefImpl =
          subTypeDefImpl.findActionDefImpl(searchedTypes, actionPath, true);
        if (subTypeActionDefImpl != null) {
          return subTypeActionDefImpl;
        }
      }
    }
    return null;
  }

  // Just searches locally, returns null if the action isn't found.
  abstract BeanActionDefImpl findActionDefImpl(Path actionPath);

  List<BeanActionDefImpl> getActionDefImpls() {
    return actionDefImpls;
  }

  @Override
  public List<BeanActionDef> getActionDefs() {
    return actionDefs;
  }

  // The derived classes must call this after they've finished creating the properties and children:
  protected void initializeContainedDefsAndImpls(
    Collection<BeanPropertyDefImpl> propertyDefImplsColl,
    Collection<BaseBeanChildDefImpl> childDefImplsColl,
    Collection<BeanActionDefImpl> actionDefImplsColl
  ) {
    propertyDefImpls = Collections.unmodifiableList(new ArrayList<>(propertyDefImplsColl));
    propertyDefs = Collections.unmodifiableList(propertyDefImpls);
    childDefImpls = Collections.unmodifiableList(new ArrayList<>(childDefImplsColl));
    childDefs = Collections.unmodifiableList(childDefImpls);
    actionDefImpls = Collections.unmodifiableList(new ArrayList<>(actionDefImplsColl));
    actionDefs = Collections.unmodifiableList(actionDefImpls);
  }

  abstract BeanPropertyDefImpl getKeyPropertyDefImpl();

  abstract BeanPropertyDefImpl getIdentityPropertyDefImpl();

  @Override
  public BeanPropertyDef getKeyPropertyDef() {
    return getKeyPropertyDefImpl();
  }

  @Override
  public BeanPropertyDef getIdentityPropertyDef() {
    return getIdentityPropertyDefImpl();
  }

  abstract List<BaseBeanTypeDefImpl> getInheritedTypeDefImpls();

  abstract BaseBeanTypeDefImpl getSubTypeDefImpl(String subTypeDiscriminator);

  @Override
  public BeanTypeDef getSubTypeDef(String subTypeDiscriminator) {
    return getSubTypeDefImpl(subTypeDiscriminator);
  }

  abstract BeanPropertyDefImpl getSubTypeDiscriminatorPropertyDefImpl();

  private synchronized List<BaseBeanTypeDefImpl> getSubTypeDefImpls() {
    if (subTypeDefImpls != null) {
      return subTypeDefImpls;
    }
    subTypeDefImpls = new ArrayList<>();
    for (String disc : getSubTypeDiscriminatorLegalValues()) {
      subTypeDefImpls.add(getSubTypeDefImpl(disc));
    }
    return subTypeDefImpls;
  }

  @Override
  public BeanPropertyDef getSubTypeDiscriminatorPropertyDef() {
    return getSubTypeDiscriminatorPropertyDefImpl();
  }

  String getLocalizationKey(String key) {
    return getBeanRepoDefImpl().getLocalizationKey(getTypeName() + "." + key);
  }

  YamlBasedBeanTypeDefImpl asYamlBasedBeanTypeDefImpl() {
    return YamlBasedBeanTypeDefImpl.class.cast(this);
  }

  abstract boolean isDisableMBeanJavadoc();

  abstract boolean isEditable();

  @Override
  public String toString() {
    return "type=" + getTypeName();
  }
}
