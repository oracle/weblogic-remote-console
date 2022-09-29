// Copyright (c) 2021, 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.yaml;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;

import weblogic.remoteconsole.common.repodef.DeleteBeanCustomizerDef;
import weblogic.remoteconsole.common.repodef.LocalizableString;
import weblogic.remoteconsole.common.repodef.schema.BeanActionDefCustomizerSource;
import weblogic.remoteconsole.common.repodef.schema.BeanActionDefSource;
import weblogic.remoteconsole.common.repodef.schema.BeanChildDefCustomizerSource;
import weblogic.remoteconsole.common.repodef.schema.BeanPropertyDefCustomizerSource;
import weblogic.remoteconsole.common.repodef.schema.BeanPropertyDefSource;
import weblogic.remoteconsole.common.repodef.schema.BeanTypeDefCustomizerSource;
import weblogic.remoteconsole.common.repodef.schema.BeanTypeDefExtensionSource;
import weblogic.remoteconsole.common.repodef.schema.BeanTypeDefSource;
import weblogic.remoteconsole.common.repodef.schema.SubTypeDefSource;
import weblogic.remoteconsole.common.utils.Path;
import weblogic.remoteconsole.common.utils.StringUtils;
import weblogic.remoteconsole.common.utils.WebLogicRoles;

/**
 * yaml-based implementation of the BeanTypeDef interface for interfaces
 * defined in <FooMBean>.yaml and <FooMBean>/type.yaml (i.e. 'normal' types)
 */
public class NormalBeanTypeDefImpl extends YamlBasedBeanTypeDefImpl {

  private static final Logger LOGGER = Logger.getLogger(NormalBeanTypeDefImpl.class.getName());

  private BeanTypeDefSource source;
  private BeanTypeDefExtensionSource extensionSource;
  private BeanTypeDefCustomizerSource customizerSource;
  private BeanPropertyDefImpl keyPropertyDefImpl;
  private BeanPropertyDefImpl identityPropertyDefImpl;
  private boolean settable;
  private LocalizableString descriptionHTML;
  private DeleteBeanCustomizerDefImpl deleteCustomizerDefImpl;
  private List<BaseBeanTypeDefImpl> inheritedTypeDefImpls = new ArrayList<>();

  // maps subtype discriminator legal value to sub type name:
  private Map<String,BaseBeanTypeDefImpl> subTypeDiscriminatorToSubTypeDefImplMap;

  public NormalBeanTypeDefImpl(BeanRepoDefImpl beanRepoDefImpl, BeanTypeDefSource source) {
    super(beanRepoDefImpl, source.getName());
    this.source = source;
    this.extensionSource = getBeanRepoDefImpl().getYamlReader().getBeanTypeDefExtensionSource(this);

    initializeCustomizerSource();
    initializeInstanceName(getCustomizerSource().getInstanceName());
    this.descriptionHTML =
      new LocalizableString(getLocalizationKey("descriptionHTML"), getSource().getDescriptionHTML());

    initializeInheritedTypeDefImpls();

    addContainedDefImpls();
  
    // If this type is homogeneous, initialize the sub types to an empty map
    // right now.  Otherwise don't and we'll lazy load them later.
    //
    // We can't just initialize them now because we want to put the
    // corresponding sub type def into the map.
    //
    // Since the base type def is always constructed before the
    // sub type def, if we try to get the sub type def from the base type
    // def's constructor, we'll have a circular dependency when the
    // sub type def tries to create the base type def too.
    subTypeDiscriminatorToSubTypeDefImplMap =
      getCustomizerSource().getSubTypes().isEmpty() ? new HashMap<>() : null;
    findKeyAndIdentityPropertyDefImpls();
    computeSettable();
    initializeContainedDefsAndImpls();
  }

  @Override
  LocalizableString getDescriptionHTML() {
    return descriptionHTML;
  }

  @Override
  BeanPropertyDefImpl getKeyPropertyDefImpl() {
    return keyPropertyDefImpl;
  }

  @Override
  BeanPropertyDefImpl getIdentityPropertyDefImpl() {
    return identityPropertyDefImpl;
  }

  @Override
  public boolean isHomogeneous() {
    return getSubTypeDiscriminatorToSubTypeDefImplMap().isEmpty();
  }

  @Override
  BeanPropertyDefImpl getSubTypeDiscriminatorPropertyDefImpl() {
    if (isHomogeneous()) {
      return null;
    }
    return getHeterogeneousTypeSubTypeDiscriminatorPropertyDefImpl();
  }

  private BeanPropertyDefImpl getHeterogeneousTypeSubTypeDiscriminatorPropertyDefImpl() {
    Path propertyPath = new Path(getCustomizerSource().getSubTypeDiscriminatorProperty());
    return getPropertyDefImpl(propertyPath);
  }

  @Override
  public List<String> getSubTypeDiscriminatorLegalValues() {
    if (isHomogeneous()) {
      return null;
    } else {
      return new ArrayList<>(getSubTypeDiscriminatorToSubTypeDefImplMap().keySet());
    }
  }

  @Override
  BaseBeanTypeDefImpl getSubTypeDefImpl(String subTypeDiscriminator) {
    if (isHomogeneous()) {
      return null;
    }
    if (getSubTypeDiscriminatorToSubTypeDefImplMap().containsKey(subTypeDiscriminator)) {
      return getSubTypeDiscriminatorToSubTypeDefImplMap().get(subTypeDiscriminator);
    } else {
      throw new AssertionError(
        "Invalid subtype discriminator:"
        + " " + subTypeDiscriminator
        + " " + getTypeName()
        + " " + getSubTypeDiscriminatorLegalValues()
      );
    }
  }

  private void findKeyAndIdentityPropertyDefImpls() {
    for (BeanPropertyDefImpl propertyDefImpl : getPropertyNameToPropertyDefImplMap().values()) {
      if (propertyDefImpl.getParentPath().isEmpty()) {
        // The property is directly on this bean (v.s. a child bean)
        if (propertyDefImpl.isKey()) {
          keyPropertyDefImpl = propertyDefImpl;
        } else if (keyPropertyDefImpl == null && "Name".equals(propertyDefImpl.getPropertyName())) {
          // default to the Name property if there isn't one explictly tagged as the key property
          keyPropertyDefImpl = propertyDefImpl;
        }
        if (propertyDefImpl.isIdentity()) {
          identityPropertyDefImpl = propertyDefImpl;
        }
      }
    }
    if (keyPropertyDefImpl != null && !keyPropertyDefImpl.isKey()) {
      // Force the Name property to be the key property if it wasn't annotated that
      // way in the WLS MBeans and no other property is annotated as the key property
      keyPropertyDefImpl.setKey(true);
    }
  }

  private void computeSettable() {
    if (!getBeanRepoDefImpl().isEditable()) {
      // The tree isn't editable.
      // Don't make settable available, even if the type extends SettableBean.
      settable = false;
    } else if (!isType("SettableBean")) {
      // The type doesn't support finding out if a property is set or unsetting a property.
      settable = false;
    } else if (!getBeanRepoDefImpl().isAccessAllowed(WebLogicRoles.ADMIN_ROLES)) {
      // Not an administrator.  The WLS REST api uses SettableBean.isSet to see if a property
      // is set when reading a property. And isSet is only available to administrators.
      settable = false;
    } else {
      settable = true;
    }
  }

  @Override
  List<BaseBeanTypeDefImpl> getInheritedTypeDefImpls() {
    return inheritedTypeDefImpls;
  }

  void initializeInheritedTypeDefImpls() {
    for (String inheritedTypeName : getSource().getBaseTypes()) {
      inheritedTypeDefImpls.add(
        getBeanRepoDefImpl().getTypeDefImpl(StringUtils.getLeafClassName(inheritedTypeName))
      );
    }
  }

  @Override
  boolean isType(String desiredTypeName) {
    if (getTypeName().equals(desiredTypeName)) {
      return true;
    }
    for (BaseBeanTypeDefImpl inheritedTypeDefImpl : getInheritedTypeDefImpls()) {
      if (inheritedTypeDefImpl.asYamlBasedBeanTypeDefImpl().isType(desiredTypeName)) {
        return true;
      }
    }
    return false;
  }

  @Override
  public boolean isReferenceable() {
    return getCustomizerSource().isReferenceable();
  }

  @Override
  public boolean isOrdered() {
    return getCustomizerSource().isOrdered();
  }

  @Override
  public boolean isSupportsCustomFilteringDashboards() {
    return getCustomizerSource().isSupportsCustomFilteringDashboards();
  }

  @Override
  public boolean isSettable() {
    return settable;
  }

  @Override
  public DeleteBeanCustomizerDef getDeleteCustomizerDef() {
    String deleteMethod = getCustomizerSource().getDeleteMethod();
    if (StringUtils.isEmpty(deleteMethod)) {
      return null;
    }
    if (deleteCustomizerDefImpl == null) {
      // Don't initialize this during the constructor
      // since the various property defs referenced by this
      // customizer's arguments might not exist yet and
      // initializing them in the constructor might
      // cause cyclic dependencies.
      synchronized (this) {
        if (deleteCustomizerDefImpl == null) {
          deleteCustomizerDefImpl = new DeleteBeanCustomizerDefImpl(this, deleteMethod);
        }
      }
    }
    return deleteCustomizerDefImpl;
  }

  @Override
  public String getCreateResourceMethod() {
    return getCustomizerSource().getCreateResourceMethod();
  }

  @Override
  public String getGetCollectionMethod() {
    return getCustomizerSource().getGetCollectionMethod();
  }

  @Override
  boolean isDisableMBeanJavadoc() {
    return getCustomizerSource().isDisableMBeanJavadoc();
  }

  private void initializeCustomizerSource() {
    customizerSource =
      getBeanRepoDefImpl().getYamlReader().getBeanTypeDefCustomizerSource(this);
    if (customizerSource == null) {
      customizerSource = new BeanTypeDefCustomizerSource();
    }
  }

  private void addContainedDefImpls() {
    ContainedDefsSourcesMerger merger = new ContainedDefsSourcesMerger();
    for (ContainedDefsSourcesMerger.PropertyDefSources propertyDefSources : merger.getPropertyDefsSources()) {
      addPropertyDefImpl(propertyDefSources);
    }
    for (ContainedDefsSourcesMerger.ChildDefSources childDefSources : merger.getChildDefsSources()) {
      addChildDefImpl(childDefSources);
    }
    for (ContainedDefsSourcesMerger.ActionDefSources actionDefSources : merger.getActionDefsSources()) {
      addActionDefImpl(actionDefSources);
    }
  }

  private void addPropertyDefImpl(ContainedDefsSourcesMerger.PropertyDefSources propertyDefSources) {
    BeanPropertyDefSource src = propertyDefSources.getSource();
    // Weed out properties that are not included in the WLS REST api:
    if (!isSupported(src)) {
      LOGGER.finest("addPropertyDefImpl() skipping unsupported property " + getTypeName() + " " + src.getName());
      return;
    }
    // Weed out the Encrypted properties:
    if (src.isEncrypted()
        && src.getName().endsWith("Encrypted")
        && src.getType().equals("byte")
        && src.isArray()
    ) {
      LOGGER.finest("addPropertyDefImpl() skipping encrypted " + getTypeName() + " " + src.getName());
      return;
    }
    BeanPropertyDefCustomizerSource customizerSrc = propertyDefSources.getCustomizerSource();
    customizerSrc.setName(source.getName());
    Path parentPath = propertyDefSources.getPath().getParent();
    BeanPropertyDefImpl propertyDefImpl = createBeanPropertyDefImpl(parentPath, src, customizerSrc);
    if (!propertyDefImpl.isSupportedType()) {
      LOGGER.finest(
        "addPropertyDefImpl() skipping unsupported property type " + getTypeName()
        + " " + src.getName() + " " + src.getType()
      );
      return;
    }
    addPropertyDefImpl(propertyDefImpl);
  }

  private void addChildDefImpl(ContainedDefsSourcesMerger.ChildDefSources childDefSources) {
    BeanPropertyDefSource src = childDefSources.getSource();
    // Weed out children that are not included in the WLS REST api:
    if (!isSupported(src)) {
      LOGGER.finest("addChildDefImpl() skipping unsupported child " + src.getName());
      return;
    }
    BeanChildDefCustomizerSource customizerSrc = childDefSources.getCustomizerSource();
    customizerSrc.setName(src.getName());
    Path parentPath = childDefSources.getPath().getParent();
    addChildDefImpl(createBeanChildDefImpl(parentPath, src, customizerSrc));
  }

  private void addActionDefImpl(ContainedDefsSourcesMerger.ActionDefSources actionDefSources) {
    Path parentPath = actionDefSources.getPath().getParent();
    BeanActionDefSource src = actionDefSources.getSource();
    BeanActionDefCustomizerSource customizerSrc = actionDefSources.getCustomizerSource();
    customizerSrc.setName(src.getName());
    addActionDefImpl(new BeanActionDefImpl(this, parentPath, src, customizerSrc));
  }

  private Map<String,BaseBeanTypeDefImpl> getSubTypeDiscriminatorToSubTypeDefImplMap() {
    if (subTypeDiscriminatorToSubTypeDefImplMap == null) {
      // The sub types haven't been initialized yet.  Initialize them now.
      synchronized (this) {
        if (subTypeDiscriminatorToSubTypeDefImplMap == null) {
          subTypeDiscriminatorToSubTypeDefImplMap = initializeSubTypeDefImpls();
        }
      }
    }
    return subTypeDiscriminatorToSubTypeDefImplMap;
  }

  private Map<String,BaseBeanTypeDefImpl> initializeSubTypeDefImpls() {
    Map<String,BaseBeanTypeDefImpl> subTypesMap = new HashMap<>();
    // Add the immediate sub types
    for (SubTypeDefSource subTypeDefSource : getCustomizerSource().getSubTypes()) {
      addImmediateSubType(subTypesMap, subTypeDefSource);
    }
    // Add the immediate sub types' sub types
    for (SubTypeDefSource subTypeDefSource : getCustomizerSource().getSubTypes()) {
      addImmediateSubTypeSubTypes(subTypesMap, subTypeDefSource);
    }
    if (!subTypesMap.isEmpty() && getHeterogeneousTypeSubTypeDiscriminatorPropertyDefImpl() == null) {
      throw configurationError(
        "subTypes defined but subTypeDisciminator not set or refers to a non-existing property"
      );
    }
    return subTypesMap;
  }

  private void addImmediateSubType(
    Map<String,BaseBeanTypeDefImpl> subTypesMap,
    SubTypeDefSource subTypeDefSource
  ) {
    String subTypeDiscriminator = subTypeDefSource.getValue();
    if (StringUtils.isEmpty(subTypeDiscriminator)) {
      // By default, use the type as the discriminator
      subTypeDiscriminator = subTypeDefSource.getType();
    }
    String subTypeName = subTypeDefSource.getType();
    if (subTypesMap.containsKey(subTypeDiscriminator)) {
      throw configurationError("duplicate subType value: " + subTypeDiscriminator);
    }
    BaseBeanTypeDefImpl subTypeDefImpl =
      getBeanRepoDefImpl().getTypeDefImpl(StringUtils.getLeafClassName(subTypeName));
    if (subTypesMap.containsValue(subTypeDefImpl)) {
      throw configurationError("duplicate subType type: " + subTypeName);
    }
    subTypesMap.put(subTypeDiscriminator, subTypeDefImpl);
  }

  private void addImmediateSubTypeSubTypes(
    Map<String,BaseBeanTypeDefImpl> subTypesMap,
    SubTypeDefSource subTypeDefSource
  ) {
    String subTypeDiscriminator = subTypeDefSource.getValue();
    BaseBeanTypeDefImpl subTypeDefImpl = subTypesMap.get(subTypeDiscriminator);
    if (subTypeDefImpl == this) {
      // already handled it
      return;
    }
    if (subTypeDefImpl instanceof PseudoBeanTypeDefImpl) {
      // the pseudo type just delegates back to the base type to figure out its sub types
      // so we've already handled it
      return;
    }
    if (subTypeDefImpl.isHomogeneous()) {
      // the type doesn't have any more sub types
      return;
    }
    for (String subSubTypeDiscriminator : subTypeDefImpl.getSubTypeDiscriminatorLegalValues()) {
      BaseBeanTypeDefImpl subSubTypeDefImpl = subTypeDefImpl.getSubTypeDefImpl(subSubTypeDiscriminator);
      if (subTypesMap.containsKey(subSubTypeDiscriminator)) {
        BaseBeanTypeDefImpl oldSubSubTypeDefImpl =
          subTypesMap.get(subSubTypeDiscriminator);
        if (subSubTypeDefImpl != oldSubSubTypeDefImpl) {
          throw new AssertionError(
            "Previously registered sub type mismatch:"
            + " type=" + getTypeName()
            + " subtype discriminator=" + subTypeDiscriminator
            + " subtype=" + subTypeDefImpl.getTypeName()
            + " subsubtype discriminator=" + subSubTypeDiscriminator
            + " previous subsubtype=" + oldSubSubTypeDefImpl.getTypeName()
            + " subsubtype=" + subSubTypeDefImpl.getTypeName()
          );
        }
        subTypesMap.put(subSubTypeDiscriminator, subSubTypeDefImpl);
      }
    }
  }

  private BeanTypeDefSource getSource() {
    return source;
  }

  @Override
  BeanTypeDefSource getTypeDefSource() {
    return getSource();
  }

  @Override
  boolean isEditable() {
    if (getCustomizerSource().isEditableSpecifiedInYaml()) {
      return getCustomizerSource().isEditable();
    }
    return getBeanRepoDefImpl().isEditable();
  }

  private BeanTypeDefExtensionSource getExtensionSource() {
    return extensionSource;
  }

  private BeanTypeDefCustomizerSource getCustomizerSource() {
    return customizerSource;
  }

  protected boolean isSupported(BeanPropertyDefSource source) {
    // By default, only expose properties that the WLS REST api supports:
    return source.isSupported();
  }

  private class ContainedDefsSourcesMerger {

    private ContainedDefsSourcesMerger() {
      merge();
    }
  
    private void merge() {
      // The basic idea is that customizations need to be merged
      // from the furthest place first to the nearest place last
      // since merging overlays the incoming on the existing.

      // Add in the properties, children and actions defined on this type,
      // but don't pull in their customizations yet since we want
      // to add overlay them last since they need to take precedence.
      addLocalContainedDefsSources();

      // Add in the properties, children and actions of any readonly
      // singleton children defined on this type (i.e. foldable
      // children).  This will cause their types to
      // get loaded and include any customizations defined on
      // those types (including their foldable children)
      addFoldableContainedDefsSources();

      // Add in the properties, children and actions defined in any
      // of our base classes.  This will cause the base types to
      // get loaded and include any customizations defined on
      // those types (including their foldable children).
      // They'll override any customizations that were defined
      // on the children defined on this type.
      addInheritedContainedDefsSources();

      // Overlay any customizations defined on this type
      // for any properties, children and actions defined on this type,
      // any of its base types and any of its foldable children
      customizeContainedDefsSources();
    }

    private void addLocalContainedDefsSources() {
      addLocalPropertyAndChildDefsSources(getSource().getProperties());
      addLocalActionDefsSources(getSource().getActions());
      if (getExtensionSource() != null) {
        addLocalPropertyAndChildDefsSources(getExtensionSource().getProperties());
        addLocalActionDefsSources(getExtensionSource().getActions());
      }
      addLocalActionDefsSources(getCustomActionSources());
    }

    // Find custom actions that are only defined in type.yaml (v.s. extension.yaml or FooMBean.yaml)
    private List<BeanActionDefSource> getCustomActionSources() {
      List<BeanActionDefSource> actionSources = new ArrayList<>();
      for (BeanActionDefCustomizerSource actionCustomizerSource : getCustomizerSource().getActions()) {
        BeanActionDefSource actionSource = actionCustomizerSource.getDefinition();
        if (actionSource != null) {
          // Copy over the name so that we don't need to specify it twice in the PDY:
          actionSource.setName(actionCustomizerSource.getName());
          actionSources.add(actionSource);
        }
      }
      return actionSources;
    }

    private void addLocalPropertyAndChildDefsSources(List<BeanPropertyDefSource> propertyDefSources) {
      for (BeanPropertyDefSource propertyDefSource : propertyDefSources) {
        // these properties are directly beneath this bean type
        Path path = new Path(propertyDefSource.getName());
        if (propertyDefSource.isChild()) {
          addChildDefSources(path, propertyDefSource, new BeanChildDefCustomizerSource());
        } else {
          addPropertyDefSources(path, propertyDefSource, new BeanPropertyDefCustomizerSource());
        }
      }
    }

    private void addLocalActionDefsSources(List<BeanActionDefSource> actionDefSources) {
      for (BeanActionDefSource actionDefSource : actionDefSources) {
        // these actions are directly beneath this bean type
        Path path = new Path(actionDefSource.getName());
        addActionDefSources(path, actionDefSource, new BeanActionDefCustomizerSource());
      }
    }

    private void addFoldableContainedDefsSources() {
      // Loop over the child beans defined on this type.
      // They will pull in their children too.
      addFoldableContainedDefsSources(getSource().getProperties());
      if (getExtensionSource() != null) {
        addFoldableContainedDefsSources(getExtensionSource().getProperties());
      }
    }

    private void addFoldableContainedDefsSources(List<BeanPropertyDefSource> propertyDefSources) {
      // Loop over the child beans defined on this type.
      // They will pull in their children too.
      for (BeanPropertyDefSource propertyDefSource : propertyDefSources) {
        if (propertyDefSource.isChild() && isSupported(propertyDefSource)) {
          boolean isCollection = propertyDefSource.isArray();
          boolean isCreatable = !propertyDefSource.getCreators().isEmpty();
          boolean isFoldable = !isCollection && !isCreatable;
          if (isFoldable) {
            Path childPath = new Path(propertyDefSource.getName());
            String childTypeName = StringUtils.getLeafClassName(propertyDefSource.getType());
            YamlBasedBeanTypeDefImpl childTypeDefImpl =
              getBeanRepoDefImpl().getTypeDefImpl(childTypeName).asYamlBasedBeanTypeDefImpl();
            if (childTypeDefImpl.isHomogeneous()) {
              addOrMergeContainedDefSources(childPath, childTypeDefImpl);
            } else {
              // Don't support folding heterogeneous children.
            }
          }
        }
      }
    }

    private void addInheritedContainedDefsSources() {
      for (String inheritedTypeName : getSource().getBaseTypes()) {
        addOrMergeContainedDefSources(
          new Path(),
          getBeanRepoDefImpl().getTypeDefImpl(
            StringUtils.getLeafClassName(inheritedTypeName)
          ).asYamlBasedBeanTypeDefImpl()
        );
      }
    }

    private void addOrMergeContainedDefSources(Path parentPath, YamlBasedBeanTypeDefImpl typeDefImpl) {
      for (BeanPropertyDefImpl propertyDefImpl : typeDefImpl.getPropertyNameToPropertyDefImplMap().values()) {
        addOrMergePropertyDefSources(parentPath, propertyDefImpl);
      }
      for (BeanChildDefImpl childDefImpl : typeDefImpl.getChildNameToChildDefImplMap().values()) {
        addOrMergeChildDefSources(parentPath, childDefImpl);
      }
      for (BeanActionDefImpl actionDefImpl : typeDefImpl.getActionNameToActionDefImplMap().values()) {
        addOrMergeActionDefSources(parentPath, actionDefImpl);
      }
    }
  
    private void addOrMergePropertyDefSources(Path parentPath, BeanPropertyDefImpl propertyDefImpl) {
      Path propertyPath = parentPath.childPath(propertyDefImpl.getPropertyPath());
      if (!hasPropertyDefSources(propertyPath)) {
        // We haven't heard about this property yet.  Add it with no customizations.
        addPropertyDefSources(parentPath, propertyDefImpl, false);
      }
      // always merge in the new info so we have our own copy and so we can fix refs like UsedIfs
      getPropertyDefSources(propertyPath).merge(propertyDefImpl, parentPath);
    }

    private void addOrMergeChildDefSources(Path parentPath, BeanChildDefImpl childDefImpl) {
      Path childPath = parentPath.childPath(childDefImpl.getChildPath());
      if (!hasChildDef(childPath)) {
        // We haven't heard about this child yet.  Add it with no customizations.
        addChildDefSources(parentPath, childDefImpl, false);
      }
      // always merge in the new info so we have our own copy and so we can fix refs like UsedIfs
      getChildDefSources(childPath).merge(childDefImpl, parentPath);
    }

    private void addOrMergeActionDefSources(Path parentPath, BeanActionDefImpl actionDefImpl) {
      Path actionPath = parentPath.childPath(actionDefImpl.getActionPath());
      if (!hasActionDef(actionPath)) {
        // We haven't heard about this action yet.  Add it with no customizations.
        addActionDefSources(parentPath, actionDefImpl, false);
      }
      // always merge in the new info so we have our own copy and so we can fix refs like UsedIfs
      getActionDefSources(actionPath).merge(actionDefImpl, parentPath);
    }

    private void customizeContainedDefsSources() {
      customizePropertyDefsSources();
      customizeChildDefsSources();
      customizeActionDefsSources();
    }

    private void customizePropertyDefsSources() {
      for (BeanPropertyDefCustomizerSource propertyDefCustomizerSource : getCustomizerSource().getProperties()) {
        Path propertyPath = new Path(propertyDefCustomizerSource.getName());
        if (hasPropertyDefSources(propertyPath)) {
          getPropertyDefSources(propertyPath).merge(propertyDefCustomizerSource, new Path());
        } else {
          // Skip customizing the property since it doesn't exist.
        }
      }
    }

    private void customizeChildDefsSources() {
      for (BeanChildDefCustomizerSource childCustomizerSource : getCustomizerSource().getChildren()) {
        Path childPath = new Path(childCustomizerSource.getName());
        if (hasChildDefSources(childPath)) {
          getChildDefSources(childPath).merge(childCustomizerSource, new Path());
        } else {
          // Skip customizing the child since it doesn't exist.
        }
      }
    }

    private void customizeActionDefsSources() {
      for (BeanActionDefCustomizerSource actionCustomizerSource : getCustomizerSource().getActions()) {
        Path actionPath = new Path(actionCustomizerSource.getName());
        if (hasActionDefSources(actionPath)) {
          getActionDefSources(actionPath).merge(actionCustomizerSource, new Path());
        } else {
          // Skip customizing the action since it doesn't exist.
        }
      }
    }

    private Map<String,PropertyDefSources> propertyPathToPropertyDefSourcesMap = new HashMap<>();
    private Map<String,ChildDefSources> childPathToChildDefSourcesMap = new HashMap<>();
    private Map<String,ActionDefSources> actionPathToActionDefSourcesMap = new HashMap<>();

    private Map<String,PropertyDefSources> getPropertyPathToPropertyDefSourcesMap() {
      return propertyPathToPropertyDefSourcesMap;
    }

    private Map<String,ChildDefSources> getChildPathToChildDefSourcesMap() {
      return childPathToChildDefSourcesMap;
    }

    private Map<String,ActionDefSources> getActionPathToActionDefSourcesMap() {
      return actionPathToActionDefSourcesMap;
    }

    private Collection<PropertyDefSources> getPropertyDefsSources() {
      return getPropertyPathToPropertyDefSourcesMap().values();
    }

    private Collection<ChildDefSources> getChildDefsSources() {
      return getChildPathToChildDefSourcesMap().values();
    }

    private Collection<ActionDefSources> getActionDefsSources() {
      return getActionPathToActionDefSourcesMap().values();
    }

    private boolean hasPropertyDefSources(Path propertyPath) {
      return getPropertyPathToPropertyDefSourcesMap().containsKey(getKey(propertyPath));
    }

    private boolean hasChildDefSources(Path childPath) {
      return getChildPathToChildDefSourcesMap().containsKey(getKey(childPath));
    }

    private boolean hasActionDefSources(Path actionPath) {
      return getActionPathToActionDefSourcesMap().containsKey(getKey(actionPath));
    }

    private PropertyDefSources getPropertyDefSources(Path propertyPath) {
      return getPropertyPathToPropertyDefSourcesMap().get(getKey(propertyPath));
    }

    private ChildDefSources getChildDefSources(Path childPath) {
      return getChildPathToChildDefSourcesMap().get(getKey(childPath));
    }

    private ActionDefSources getActionDefSources(Path actionPath) {
      return getActionPathToActionDefSourcesMap().get(getKey(actionPath));
    }

    private void addPropertyDefSources(
      Path parentPath,
      BeanPropertyDefImpl propertyDefImpl,
      boolean useCustomizations
    ) {
      BeanPropertyDefCustomizerSource customizerSrc =
        (useCustomizations) ? propertyDefImpl.getCustomizerSource() : new BeanPropertyDefCustomizerSource();
      addPropertyDefSources(
        parentPath.childPath(propertyDefImpl.getPropertyPath()),
        propertyDefImpl.getSource(),
        customizerSrc
      );
    }

    private void addPropertyDefSources(
      Path propertyPath,
      BeanPropertyDefSource src,
      BeanPropertyDefCustomizerSource customizerSrc
    ) {
      getPropertyPathToPropertyDefSourcesMap().put(
        getKey(propertyPath),
        new PropertyDefSources(propertyPath, src, customizerSrc)
      );
    }

    private void addChildDefSources(
      Path parentPath,
      BeanChildDefImpl childDefImpl,
      boolean useCustomizations
    ) {
      BeanChildDefCustomizerSource customizerSrc =
        (useCustomizations) ? childDefImpl.getCustomizerSource() : new BeanChildDefCustomizerSource();
      addChildDefSources(
        parentPath.childPath(childDefImpl.getChildPath()),
        childDefImpl.getSource(),
        customizerSrc
      );
    }

    private void addChildDefSources(
      Path childPath,
      BeanPropertyDefSource src,
      BeanChildDefCustomizerSource customizerSrc
    ) {
      getChildPathToChildDefSourcesMap().put(
        getKey(childPath),
        new ChildDefSources(childPath, src, customizerSrc)
      );
    }

    private void addActionDefSources(
      Path parentPath,
      BeanActionDefImpl actionDefImpl,
      boolean useCustomizations
    ) {
      BeanActionDefCustomizerSource customizerSrc =
        (useCustomizations) ? actionDefImpl.getCustomizerSource() : new BeanActionDefCustomizerSource();
      addActionDefSources(
        parentPath.childPath(actionDefImpl.getActionPath()),
        actionDefImpl.getSource(),
        customizerSrc
      );
    }

    private void addActionDefSources(
      Path actionPath,
      BeanActionDefSource src,
      BeanActionDefCustomizerSource customizerSrc
    ) {
      getActionPathToActionDefSourcesMap().put(
        getKey(actionPath),
        new ActionDefSources(actionPath, src, customizerSrc)
      );
    }

    private class PropertyDefSources extends DefSources<BeanPropertyDefSource,BeanPropertyDefCustomizerSource> {

      private void merge(BeanPropertyDefImpl propertyDefImpl, Path propertyDefImplContainedBeanPath) {
        merge(propertyDefImpl.getCustomizerSource(), propertyDefImplContainedBeanPath);
      }

      private void merge(BeanPropertyDefCustomizerSource from, Path fromContainedBeanPath) {
        getCustomizerSource().merge(from, fromContainedBeanPath);
      }

      private PropertyDefSources(
        Path path,
        BeanPropertyDefSource source,
        BeanPropertyDefCustomizerSource customizerSource
      ) {
        super(path, source, customizerSource);
      }
    }

    private class ChildDefSources extends DefSources<BeanPropertyDefSource,BeanChildDefCustomizerSource> {

      private void merge(BeanChildDefImpl childDefImpl, Path childDefImplContainedBeanPath) {
        merge(childDefImpl.getCustomizerSource(), childDefImplContainedBeanPath);
      }

      private void merge(BeanChildDefCustomizerSource from, Path fromContainedBeanPath) {
        getCustomizerSource().merge(from, fromContainedBeanPath);
      }

      private ChildDefSources(
        Path path,
        BeanPropertyDefSource source,
        BeanChildDefCustomizerSource customizerSource
      ) {
        super(path, source, customizerSource);
      }
    }

    private class ActionDefSources extends DefSources<BeanActionDefSource,BeanActionDefCustomizerSource> {

      private void merge(BeanActionDefImpl actionDefImpl, Path actionDefImplContainedBeanPath) {
        merge(actionDefImpl.getCustomizerSource(), actionDefImplContainedBeanPath);
      }

      private void merge(BeanActionDefCustomizerSource from, Path fromContainedBeanPath) {
        getCustomizerSource().merge(from, fromContainedBeanPath);
      }

      private ActionDefSources(
        Path path,
        BeanActionDefSource source,
        BeanActionDefCustomizerSource customizerSource
      ) {
        super(path, source, customizerSource);
      }
    }

    private class DefSources<S,C> {
      private Path path;
      private S source;
      private C customizerSource;

      Path getPath() {
        return path;
      }

      S getSource() {
        return source;
      }

      C getCustomizerSource() {
        return customizerSource;
      }

      private DefSources(Path path, S source, C customizerSource) {
        this.path = path;
        this.source = source;
        this.customizerSource = customizerSource;
      }
    }

    private String getKey(Path path) {
      return path.getDotSeparatedPath();
    }
  }
}
