// Copyright (c) 2021, 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.yaml;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.logging.Logger;

import weblogic.remoteconsole.common.repodef.BeanRepoDef;
import weblogic.remoteconsole.common.repodef.BeanTypeDef;
import weblogic.remoteconsole.common.repodef.schema.BeanTypeDefSource;
import weblogic.remoteconsole.common.repodef.schema.PseudoBeanTypeDefSource;
import weblogic.remoteconsole.common.utils.WebLogicMBeansVersion;

/**
 * Yaml-based implementation of the BeanRepoDef interface.
 */
public abstract class BeanRepoDefImpl implements BeanRepoDef {
  private BaseBeanTypeDefImpl rootTypeDefImpl;
  private WebLogicMBeansVersion mbeansVersion;

  private static final Logger LOGGER = Logger.getLogger(BeanRepoDefImpl.class.getName());

  protected BeanRepoDefImpl(WebLogicMBeansVersion mbeansVersion) {
    this.mbeansVersion = mbeansVersion;
  }

  protected abstract boolean isRemoveMissingPropertiesAndTypes();

  protected abstract boolean isEditable();

  protected abstract String[] getRootChildNames();

  // This method hould be called from a derived constructor,
  // i.e. the derived class implements the protected methods
  // used to find the names of the root child bean types and the
  // directory theiryaml files live in.
  protected void createRootTypeDefImpl() {
    rootTypeDefImpl = new RootBeanTypeDefImpl(this, getRootChildNames());
    getTypeNameToTypeDefImplMap().put(
      getRootTypeDefImpl().getTypeName(),
      Optional.ofNullable(getRootTypeDefImpl())
    );
  }

  // Maps a type name to the type definition (or null if the type doesn't exist)
  private Map<String, Optional<BaseBeanTypeDefImpl>> typeNameToTypeDefImplMap = new ConcurrentHashMap<>();

  private Map<String, Optional<BaseBeanTypeDefImpl>> getTypeNameToTypeDefImplMap() {
    return typeNameToTypeDefImplMap;
  }

  BaseBeanTypeDefImpl getRootTypeDefImpl() {
    return rootTypeDefImpl;
  }

  @Override
  public BeanTypeDef getRootTypeDef() {
    return getRootTypeDefImpl();
  }

  @Override
  public BeanTypeDef getTypeDef(String typeName) {
    return getTypeDefImpl(typeName);
  }

  BaseBeanTypeDefImpl getTypeDefImpl(String typeName) {
    Optional<BaseBeanTypeDefImpl> opt = getTypeNameToTypeDefImplMap().get(typeName);
    if (opt == null) {
      opt = Optional.ofNullable(createTypeDefImpl(typeName));
      getTypeNameToTypeDefImplMap().put(typeName, opt);
    }
    if (opt.isPresent()) {
      return opt.get();
    }
    if (!isRemoveMissingPropertiesAndTypes()) {
      throw new AssertionError("Can't find type " + typeName);
    }
    return null;
  }

  private BaseBeanTypeDefImpl createTypeDefImpl(String typeName) {
    PseudoBeanTypeDefSource pseudoTypeDefSource = getYamlReader().getPseudoBeanTypeDefSource(typeName);
    if (pseudoTypeDefSource != null) {
      return createPseudoTypeDefImpl(pseudoTypeDefSource);
    }
    BeanTypeDefSource typeDefSource = getYamlReader().getBeanTypeDefSource(typeName);
    if (typeDefSource != null) {
      return createNormalTypeDefImpl(typeDefSource);
    }
    // the type doesn't exist
    return null;
  }

  private NormalBeanTypeDefImpl createNormalTypeDefImpl(BeanTypeDefSource typeDefSource) {
    LOGGER.finest("createNormalType " + typeDefSource.getName());
    return createNormalBeanTypeDefImpl(typeDefSource);
  }

  private PseudoBeanTypeDefImpl createPseudoTypeDefImpl(PseudoBeanTypeDefSource pseudoBeanTypeDefSource) {
    LOGGER.finest(
      "createPseudoTypeDef"
      + " " + pseudoBeanTypeDefSource.getName()
      + " " + pseudoBeanTypeDefSource.getBaseType()
    );
    return createPseudoBeanTypeDefImpl(pseudoBeanTypeDefSource);
  }

  protected NormalBeanTypeDefImpl createNormalBeanTypeDefImpl(BeanTypeDefSource typeDefSource) {
    return new NormalBeanTypeDefImpl(this, typeDefSource);
  }

  protected PseudoBeanTypeDefImpl createPseudoBeanTypeDefImpl(PseudoBeanTypeDefSource pseudoTypeDefSource) {
    return new PseudoBeanTypeDefImpl(this, pseudoTypeDefSource);
  }

  boolean isAccessAllowed(Set<String> rolesAllowed) {
    // Return true if the user is in any of the roles in rolesAllowed, false otherwise
    for (String roleAllowed : rolesAllowed) {
      if (mbeansVersion.getRoles().contains(roleAllowed)) {
        return true;
      }
    }
    return false;
  }

  boolean supportsCapabilities(List<String> capabilities) {
    if (mbeansVersion.getCapabilities().contains("All")) {
      return true;
    }
    for (String capability : capabilities) {
      if (!mbeansVersion.getCapabilities().contains(capability)) {
        return false;
      }
    }
    return true;
  }

  protected abstract YamlReader getYamlReader();

  protected WebLogicMBeansVersion getMBeansVersion() {
    return mbeansVersion;
  }

  String getLocalizationKey(String key) {
    return key;
  }
}
