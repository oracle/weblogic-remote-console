// Copyright (c) 2021, 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.yaml;

import java.util.Set;
import java.util.logging.Logger;

import weblogic.remoteconsole.common.repodef.LocalizableString;
import weblogic.remoteconsole.common.repodef.schema.BeanChildDefCustomizerSource;
import weblogic.remoteconsole.common.repodef.schema.BeanPropertyDefSource;
import weblogic.remoteconsole.common.repodef.schema.BeanTypeDefSource;
import weblogic.remoteconsole.common.utils.Path;
import weblogic.remoteconsole.common.utils.StringUtils;

/**
 * yaml-based implementation of the BeanChildDef interface.
 */
public class BeanChildDefImpl extends BaseBeanChildDefImpl {
  private Path parentPath;
  private BeanPropertyDefSource source;
  private BeanChildDefCustomizerSource customizerSource;
  private LocalizableString label;
  private LocalizableString singularLabel;
  private boolean initializedRoles = false;
  private Set<String> getRoles;
  private Set<String> setRoles;
  private Set<String> createRoles;
  private Set<String> deleteRoles;

  private static final Logger LOGGER = Logger.getLogger(BeanChildDefImpl.class.getName());

  public BeanChildDefImpl(
    BaseBeanTypeDefImpl typeDefImpl,
    Path parentPath,
    BeanPropertyDefSource source,
    BeanChildDefCustomizerSource customizerSource
  ) {
    super(typeDefImpl);
    this.source = source;
    this.parentPath = parentPath.clone();
    this.customizerSource = customizerSource;
    initializeLabel();
    initializeSingularLabel();
    LOGGER.finest("BeanChildDefImpl constructor " + getTypeDef().getTypeName() + " " + getChildPath());
  }

  private void initializeLabel() {
    String englishLabel = getCustomizerSource().getLabel();
    if (StringUtils.isEmpty(englishLabel)) {
      englishLabel = StringUtils.camelCaseToUpperCaseWords(getChildName());
    }
    if (getCustomizerSource().isUseUnlocalizedNameAsLabel()) {
      label = new LocalizableString(englishLabel);
    } else {
      label = new LocalizableString(getLocalizationKey("label"), englishLabel);
    }
  }

  private void initializeSingularLabel() {
    if (!isCollection()) {
      singularLabel = label;
    } else {
      String englishSingularLabel = getCustomizerSource().getSingularLabel();
      if (StringUtils.isEmpty(englishSingularLabel)) {
        englishSingularLabel = StringUtils.getSingular(label.getEnglishText());
      }
      if (getCustomizerSource().isUseUnlocalizedNameAsLabel()) {
        singularLabel = new LocalizableString(englishSingularLabel);
      } else {
        singularLabel = new LocalizableString(getLocalizationKey("singularLabel"), englishSingularLabel);
      }
    }
  }

  void mergeCustomizations(BeanChildDefImpl from) {
    LOGGER.finest(
      "mergeCustomizations "
      + getTypeDef().getTypeName()
      + " " + getParentPath()
      + " " + getChildName()
      + " " + from.getTypeDef().getTypeName()
      + " " + from.getParentPath()
      + " " + from.getChildName()
    );
    mergeCustomizations(from.getCustomizerSource());
  }

  void mergeCustomizations(BeanChildDefCustomizerSource customizerSource) {
    getCustomizerSource().merge(customizerSource, new Path());
  }

  // Initialize roles on first use instead of the constructor
  // to prevent infinite loops (caused by types that refer to themselves)
  private void initializeRoles() {
    if (!initializedRoles) {
      synchronized (this) {
        if (!initializedRoles) {
          BeanTypeDefSource typeSource =
            getChildTypeDefImpl().asYamlBasedBeanTypeDefImpl().getTypeDefSource();
          BeanPropertyDefSource propertySource = getSource();
          getRoles = RoleUtils.computeGetRoles(typeSource, propertySource);
          setRoles = RoleUtils.computeSetRoles(typeSource, propertySource);
          createRoles = RoleUtils.computeCreateRoles(typeSource, propertySource);
          deleteRoles = RoleUtils.computeDeleteRoles(typeSource, propertySource);
          initializedRoles = true;
        }
      }
    }
  }

  @Override
  public String getChildName() {
    return getSource().getName();
  }

  @Override
  public String getOnlineChildName() {
    String onlineName = getCustomizerSource().getOnlineName();
    if (StringUtils.isEmpty(onlineName)) {
      return StringUtils.getRestName(getChildName());
    }
    return onlineName;
  }

  @Override
  public String getOfflineChildName() {
    String offlineName = getCustomizerSource().getOfflineName();
    if (StringUtils.isEmpty(offlineName)) {
      if (isCollection()) {
        offlineName = StringUtils.getSingular(getChildName());
      } else {
        offlineName = getChildName();
      }
    }
    return offlineName;
  }

  @Override
  BaseBeanTypeDefImpl getChildTypeDefImpl() {
    return
      getTypeDefImpl().getBeanRepoDefImpl().getTypeDefImpl(
        StringUtils.getLeafClassName(getSource().getType())
      );
  }

  @Override
  public Path getParentPath() {
    return this.parentPath;
  }

  @Override
  public boolean isCollection() {
    return getSource().isArray();
  }

  @Override
  public boolean isRoot() {
    return false;
  }

  @Override
  public boolean isCreatable() {
    if (!getTypeDefImpl().getBeanRepoDefImpl().isAccessAllowed(getCreateRoles())) {
      return false;
    }
    if (getCustomizerSource().isCreatableSpecifiedInYaml()) {
      return getCustomizerSource().isCreatable();
    }
    if (!isEditable()) {
      return false;
    }
    if (getSource().isCreatable()) {
      return true;
    }
    return false;
  }

  @Override
  public boolean isDeletable() {
    if (!getTypeDefImpl().getBeanRepoDefImpl().isAccessAllowed(getDeleteRoles())) {
      return false;
    }
    if (getCustomizerSource().isDeletableSpecifiedInYaml()) {
      return getCustomizerSource().isDeletable();
    }
    return isCreatable();
  }

  @Override
  public boolean isAsyncCreate() {
    return getCustomizerSource().isAsyncCreate();
  }

  @Override
  public boolean isAsyncDelete() {
    return getCustomizerSource().isAsyncDelete();
  }

  @Override
  public boolean isOptional() {
    if (isCollection()) {
      return false;
    }
    if (getSource().isCreatable()) {
      return true;
    }
    if (getCustomizerSource().isNonCreatableOptionalSingleton()) {
      return true;
    }
    return false;
  }

  @Override 
  public boolean isEditable() {
    return getChildTypeDefImpl().isEditable();
  }

  @Override
  public LocalizableString getLabel() {
    return this.label;
  }

  @Override
  public LocalizableString getSingularLabel() {
    return this.singularLabel;
  }

  @Override
  public boolean isRestartNeeded() {
    return getSource().isRestartNeeded();
  }

  @Override
  public boolean isCollapsedInWDT() {
    return getCustomizerSource().isCollapsedInWDT();
  }

  @Override
  public Set<String> getGetRoles() {
    initializeRoles();
    return getRoles;
  }

  @Override
  public Set<String> getSetRoles() {
    initializeRoles();
    return setRoles;
  }

  @Override
  public Set<String> getCreateRoles() {
    initializeRoles();
    return createRoles;
  }

  @Override
  public Set<String> getDeleteRoles() {
    initializeRoles();
    return deleteRoles;
  }

  BeanPropertyDefSource getSource() {
    return this.source;
  }

  BeanChildDefCustomizerSource getCustomizerSource() {
    return this.customizerSource;
  }
}
