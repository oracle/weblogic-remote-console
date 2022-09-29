// Copyright (c) 2021, 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.yaml;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.logging.Logger;

import weblogic.remoteconsole.common.repodef.BeanTypeDef;
import weblogic.remoteconsole.common.repodef.LocalizableString;
import weblogic.remoteconsole.common.repodef.schema.BeanChildDefCustomizerSource;
import weblogic.remoteconsole.common.repodef.schema.BeanPropertyDefCustomizerSource;
import weblogic.remoteconsole.common.repodef.schema.BeanPropertyDefSource;
import weblogic.remoteconsole.common.repodef.schema.BeanTypeDefSource;
import weblogic.remoteconsole.common.utils.Path;
import weblogic.remoteconsole.common.utils.StringUtils;

/**
 * base yaml-based implementation of the BeanTypeDef interface.
 */
abstract class YamlBasedBeanTypeDefImpl extends BaseBeanTypeDefImpl {

  private static final Logger LOGGER = Logger.getLogger(YamlBasedBeanTypeDefImpl.class.getName());

  private String instanceName;
  private LocalizableString instanceNameLabel;
  private Map<String,BeanPropertyDefImpl> propertyNameToPropertyDefImplMap = new HashMap<>();
  private Map<String,BeanChildDefImpl> childNameToChildDefImplMap = new HashMap<>();
  private Map<String,BeanActionDefImpl> actionNameToActionDefImplMap = new HashMap<>();

  YamlBasedBeanTypeDefImpl(BeanRepoDefImpl beanRepoDefImpl, String typeName) {
    super(beanRepoDefImpl, StringUtils.getLeafClassName(typeName));
  }

  // Derived class must call this once it knows the label for the type:
  protected void initializeInstanceName(String instanceName) {
    this.instanceName = instanceName;
    if (StringUtils.isEmpty(getInstanceName())) {
      // e.g. ServerLifeCycleRuntimeMBean -> ServerLifeCycleRuntime
      this.instanceName = StringUtils.getSimpleTypeName(getTypeName());
    }
    this.instanceNameLabel =
      new LocalizableString(
        getInstanceNameLabelKey(),
        StringUtils.camelCaseToUpperCaseWords(this.instanceName)
      );
  }

  // The derived classes must call this after they've finished creating the properties and children:
  protected void initializeContainedDefsAndImpls() {
    initializeContainedDefsAndImpls(
      getPropertyNameToPropertyDefImplMap().values(),
      new ArrayList<>(getChildNameToChildDefImplMap().values()),
      getActionNameToActionDefImplMap().values()
    );
  }

  protected BeanPropertyDefImpl createBeanPropertyDefImpl(
    Path parentPath,
    BeanPropertyDefSource source,
    BeanPropertyDefCustomizerSource customizerSource
  ) {
    return new BeanPropertyDefImpl(this, parentPath, source, customizerSource);
  }

  protected BeanChildDefImpl createBeanChildDefImpl(
    Path parentPath,
    BeanPropertyDefSource source,
    BeanChildDefCustomizerSource customizerSource
  ) {
    if (!getBeanRepoDefImpl().supportsCapabilities(customizerSource.getRequiredCapabilities())) {
      // This domain doesn't support this child.
      return null;
    }
    return new BeanChildDefImpl(this, parentPath, source, customizerSource);
  }

  @Override
  public String getInstanceName() {
    return this.instanceName;
  }

  @Override
  public LocalizableString getInstanceNameLabel() {
    return this.instanceNameLabel;
  }

  protected String pathKey(Path path) {
    return path.getDotSeparatedPath();
  }

  abstract boolean isType(String desiredTypeName);

  abstract BeanTypeDefSource getTypeDefSource();

  @Override
  public boolean isTypeDef(BeanTypeDef otherTypeDef) {
    return isType(otherTypeDef.getTypeName());
  }

  @Override
  BeanPropertyDefImpl findPropertyDefImpl(Path propertyPath) {
    if (getPropertyNameToPropertyDefImplMap().containsKey(pathKey(propertyPath))) {
      return getPropertyNameToPropertyDefImplMap().get(pathKey(propertyPath));
    }
    return null;
  }

  protected void addPropertyDefImpl(BeanPropertyDefImpl propertyDefImpl) {
    Path propertyPath = propertyDefImpl.getPropertyPath();
    if (!hasPropertyDef(propertyPath)) {
      getPropertyNameToPropertyDefImplMap().put(pathKey(propertyPath), propertyDefImpl);
    } else {
      // we already have it - keep the prior one
    }
  }

  protected Map<String,BeanPropertyDefImpl> getPropertyNameToPropertyDefImplMap() {
    return this.propertyNameToPropertyDefImplMap;
  }

  @Override
  BaseBeanChildDefImpl findChildDefImpl(Path childPath) {
    if (getChildNameToChildDefImplMap().containsKey(pathKey(childPath))) {
      return getChildNameToChildDefImplMap().get(pathKey(childPath));
    }
    return null;
  }

  protected void addChildDefImpl(BeanChildDefImpl childDef) {
    if (childDef == null) {
      return;
    }
    Path childPath = childDef.getChildPath();
    if (!hasChildDef(childPath)) {
      getChildNameToChildDefImplMap().put(pathKey(childPath), childDef);
    } else {
      // we already have it - keep the prior one
    }
  }

  protected Map<String,BeanChildDefImpl> getChildNameToChildDefImplMap() {
    return this.childNameToChildDefImplMap;
  }

  @Override
  BeanActionDefImpl findActionDefImpl(Path actionPath) {
    if (getActionNameToActionDefImplMap().containsKey(pathKey(actionPath))) {
      return getActionNameToActionDefImplMap().get(pathKey(actionPath));
    }
    return null;
  }

  protected void addActionDefImpl(BeanActionDefImpl actionDefImpl) {
    Path actionPath = actionDefImpl.getActionPath();
    if (!hasActionDef(actionPath)) {
      getActionNameToActionDefImplMap().put(pathKey(actionPath), actionDefImpl);
    } else {
      // we already have it - keep the prior one
    }
  }

  protected Map<String,BeanActionDefImpl> getActionNameToActionDefImplMap() {
    return this.actionNameToActionDefImplMap;
  }

  protected Error configurationError(String problem) {
    String msg =
      "Configuration Error:"
      + " type " + getTypeName()
      + " : " + problem;
    LOGGER.severe(msg);
    return new AssertionError(msg);
  }
}
