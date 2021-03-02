// Copyright (c) 2020, 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.typedesc;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.logging.Logger;

import weblogic.console.backend.utils.Path;
import weblogic.console.backend.utils.StringUtils;
import weblogic.console.backend.utils.YamlUtils;

/**
 * This class returns the effective weblogic bean type descriptions for a weblogic version.
 * <p>
 * It does this by converting the harvested weblogic bean type yaml files and the
 * console-specific weblogic bean type yaml files (i.e. the source files that describe the weblogic
 * bean types) into POJOs that reflect the effective configuration.
 * <p>
 * For example, for a ClusterMBean, it merges the information from:
 * <ul>
 *   <li>harvestedWeblogicBeanTypes/14.1.0.0.0/ClusterMBean.yaml</li>
 *   <li>ClusterMBean/type.yaml</li>
 *   <li>ClusterMBean/extension.yaml</li>
 * </ul>
 * and its inherited types:
 * <ul>
 *   <li>ClusterMBean</li>
 *   <li>TargetMBean</li>
 *   <li>ConfigurationMBean</li>
 *   <li>WebLogicMBean SettableBean</li>
 * </ul>
 * <p>
 * This class gradually reads in the corresponding yaml files as information about different
 * types is requested, and caches the effective configurations so that subsequent access is fast.
 */
public class WeblogicBeanTypes {

  private static final Logger LOGGER = Logger.getLogger(WeblogicBeanTypes.class.getName());

  private String weblogicVersion;

  public String getWeblogicVersion() {
    return this.weblogicVersion;
  }

  private boolean removeMissingPropertiesAndTypes;

  public boolean isRemoveMissingPropertiesAndTypes() {
    return this.removeMissingPropertiesAndTypes;
  }

  // Maps a type name to the type definition (or null if the type doesn't exist)
  private Map<String, Optional<WeblogicBeanType>> types = new ConcurrentHashMap<>();

  private Map<String, Optional<WeblogicBeanType>> getTypes() {
    return this.types;
  }

  public WeblogicBeanTypes(String weblogicVersion) {
    this.weblogicVersion = weblogicVersion;
    // If the WLS version isn't the one that we hand coded yaml files against
    // (e.g. nav tree, types, PDYs) then remove mbean types and properties that aren't
    // in this WLS version from the pages.
    this.removeMissingPropertiesAndTypes =
      !WeblogicVersions.getCurrentVersion().equals(weblogicVersion);
  }

  private static final String DOMAIN_MBEAN = "weblogic.management.configuration.DomainMBean";
  private static final String DOMAIN_RUNTIME_MBEAN = "weblogic.management.runtime.DomainRuntimeMBean";
  private static final String SERVER_RUNTIME_MBEAN = "weblogic.management.runtime.ServerRuntimeMBean";

  public WeblogicBeanType getDomainMBeanType() throws Exception {
    return getType(DOMAIN_MBEAN);
  }

  public WeblogicBeanType getDomainMBeanType(Path beanPath) throws Exception {
    return getType(DOMAIN_MBEAN, beanPath);
  }

  public WeblogicBeanType getDomainRuntimeMBeanType() throws Exception {
    return getType(DOMAIN_RUNTIME_MBEAN);
  }

  public WeblogicBeanType getDomainRuntimeMBeanType(Path beanPath) throws Exception {
    return getType(DOMAIN_RUNTIME_MBEAN, beanPath);
  }

  public WeblogicBeanType getServerRuntimeMBeanType() throws Exception {
    return getType(SERVER_RUNTIME_MBEAN);
  }

  public WeblogicBeanType getServerRuntimeMBeanType(Path beanPath) throws Exception {
    return getType(SERVER_RUNTIME_MBEAN, beanPath);
  }

  public Path getUnfoldedBeanPath(WeblogicBeanType type, Path foldedBeanPath) throws Exception {
    Path unfoldedPath = new Path();
    Path parentFoldedPath = new Path();
    WeblogicBeanType parentBeanType = type;
    for (String foldedPropertyName : foldedBeanPath.getComponents()) {
      String context =
        "getUnfoldedBeanPath type=" + type.getName() + " foldedBeanPath=" + foldedBeanPath;
      WeblogicBeanProperty property = parentBeanType.getProperty(context, foldedPropertyName);
      if (property == null) {
        return null; // getProperty already reported a problem with details
      }
      unfoldedPath.addPath(property.getUnfoldedBeanPath());
      parentFoldedPath.addComponent(foldedPropertyName);
      parentBeanType = property.getBeanType();
    }
    LOGGER.finest("getUnfoldedBeanPath folded=" + foldedBeanPath + " unfolded=" + unfoldedPath);
    return unfoldedPath;
  }

  /**
   * Returns the effective description of a weblogic bean type given its full class name
   * (e.g. weblogic.management.configuration.ServerMBean) or its leaf class name (e.g. ServerMBean)
   * <p>
   * Returns null if the type does not exist.
   */
  public WeblogicBeanType getType(String typeName) throws Exception {
    Optional<WeblogicBeanType> opt = getTypes().get(typeName);
    if (opt == null) {
      opt = Optional.ofNullable(createType(typeName));
      getTypes().put(typeName, opt);
    }
    return opt.isPresent() ? opt.get() : null;
  }

  /**
   * Returns the effective description for the type of a property given the class name of a type
   * that eventually contains this property plus the list of property names that get to this
   * property.
   * <p>
   * Background:
   * <p>
   * The weblogic mbeans are organized into a containment hierarchy. For example, the
   * DomainMBean's 'servers' property contains a collection of ServerMBeans where each ServerMBean's
   * 'networkAccessPoints' property contains a collection of NetworkAccessPointMBeans.
   * <p>
   * Sometimes, the console backend code needs to get the description of a property's type, given
   * the classname of a type higher up the containment tree and a list of containment property names
   * that get to the property.
   * <p>
   * For example, it may need to find the type of the DomainMBean's 'servers' property's
   * 'networkAccessPoint' property.
   * <p>
   * Or it may need to find the type of the ServerMBean's 'SSL' property.
   * <p>
   * This method takes the classname of a parent type in the containment tree, and an ordered
   * list of property names (i.e. 'beanPath'), and returns the type description of that property's
   * type.
   * <p>
   * This method returns null if the parent type or the contained property does not exist.
   * <p>
   * If the beanPath is empty, then this method returns the type description for the parent type.
   * <p>
   * Some example: You can get the network access point's type description by calling any of
   * these:
   * <ul>
   *   <li>getType("DomainMBean", "Servers.NetworkAccessPoints")</li>
   *   <li>getType("ServerMBean", "Servers")</li>
   *   <li>getType("NetworkAccessPointMBean", "")</li>
   * </ul>
   */
  public WeblogicBeanType getType(String typeName, Path beanPath) throws Exception {
    LOGGER.fine("getType " + typeName + " " + beanPath);
    WeblogicBeanType type = getType(typeName);
    if (type == null) {
      return null;
    }
    if (beanPath.isEmpty()) {
      return type;
    }
    String propName = beanPath.getFirstComponent();
    Path nextBeanPath = beanPath.subPath(1, beanPath.length());
    if (propName.isEmpty()) {
      // skip empty components
      return getType(typeName, nextBeanPath);
    }
    WeblogicBeanProperty prop = findContainmentProperty(type, propName);
    if (prop == null) {
      return null;
    }
    String propType = prop.getBeanType().getName();
    return getType(propType, nextBeanPath);
  }

  /** Create an identity for a config bean from its folded bean path with identities */
  public WeblogicBeanIdentity getWeblogicConfigBeanIdentityFromFoldedBeanPathWithIdentities(
    Path foldedBeanPathWithIdentities
  ) throws Exception {
    return
      getWeblogicBeanIdentityFromFoldedBeanPathWithIdentities(
        getDomainMBeanType(),
        foldedBeanPathWithIdentities
      );
  }

  /** Create an identity for a config bean from its unfolded bean path with identities */
  public WeblogicBeanIdentity getWeblogicConfigBeanIdentityFromUnfoldedBeanPathWithIdentities(
    Path unfoldedBeanPathWithIdentities
  ) throws Exception {
    return
      getWeblogicBeanIdentityFromUnfoldedBeanPathWithIdentities(
        getDomainMBeanType(),
        unfoldedBeanPathWithIdentities
      );
  }

  /** Create an identity for the root bean of a bean tree */
  public WeblogicBeanIdentity newRootIdentity(WeblogicBeanType rootType) throws Exception {
    return new WeblogicBeanIdentity(rootType);
  }

  /**
   * Create an identity for a bean from its bean tree's root bean type and folded bean path with
   * identities
   */
  public WeblogicBeanIdentity getWeblogicBeanIdentityFromFoldedBeanPathWithIdentities(
    WeblogicBeanType rootType,
    Path foldedBeanPathWithIdentities
  ) throws Exception {
    WeblogicBeanIdentity identity = newRootIdentity(rootType);
    identity.addFoldedBeanPathWithIdentities(foldedBeanPathWithIdentities);
    return identity;
  }

  /**
   * Create an identity for a bean from its bean tree's root bean type and unfolded bean path with
   * identities
   */
  public WeblogicBeanIdentity getWeblogicBeanIdentityFromUnfoldedBeanPathWithIdentities(
    WeblogicBeanType rootType,
    Path unfoldedBeanPathWithIdentities
  ) throws Exception {
    WeblogicBeanIdentity identity = newRootIdentity(rootType);
    identity.addUnfoldedBeanPathWithIdentities(unfoldedBeanPathWithIdentities);
    return identity;
  }

  private WeblogicBeanProperty findContainmentProperty(
    WeblogicBeanType type,
    String property
  ) throws Exception {
    String context = "findContainmentProperty";
    WeblogicBeanProperty prop = type.getProperty(context, property);
    if (prop == null) {
      // getProperty already reported a problem with details
      return null;
    }
    if (!prop.isContainmentRelationship()) {
      throw
        new AssertionError(
          "Not a containment property "
          + type.getName()
          + " "
          + property
          + " '"
          + prop.getRelationship()
          + "'"
        );
    }
    return prop;
  }

  private WeblogicBeanType createType(String typeName) throws Exception {
    ConsolePseudoWeblogicBeanType consolePseudoType = readConsolePseudoTypeYaml(typeName);
    if (consolePseudoType != null) {
      return createPseudoType(consolePseudoType);
    }
    HarvestedWeblogicBeanType harvestedType = readHarvestedTypeYaml(typeName);
    if (harvestedType != null) {
      return createNormalType(harvestedType);
    }
    // the type doesn't exist
    return null;
  }

  private PseudoWeblogicBeanType createPseudoType(
    ConsolePseudoWeblogicBeanType consolePseudoType
  ) throws Exception {
    WeblogicBeanType baseType = getType(consolePseudoType.getWeblogicBeanType());
    if (baseType == null) {
      throw
        new AssertionError(
          "Pseudo type "
          + consolePseudoType.getName()
          + " weblogicBeanType "
          + consolePseudoType.getWeblogicBeanType()
          + " does not exist"
        );
    }
    PseudoWeblogicBeanType type = new PseudoWeblogicBeanType(baseType, consolePseudoType);
    copyPropertiesToPseudoType(type);
    LOGGER.finest("created pseudo type: " + type.getName() + " " + type.getBaseType().getName());
    for (WeblogicBeanProperty p : type.getProperties()) {
      LOGGER.finest(
        "pseudo type: "
        + type.getName()
        + " "
        + type.getBaseType().getName()
        + " "
        + p.getName());
    }
    return type;
  }

  private NormalWeblogicBeanType createNormalType(
    HarvestedWeblogicBeanType harvestedType
  ) throws Exception {
    String name = harvestedType.getName();
    NormalWeblogicBeanType type =
      new NormalWeblogicBeanType(
        this,
        harvestedType,
        readHarvestedTypeExtensionYaml(name),
        readConsoleTypeYaml(name)
      );
    createProperties(type);
    createBaseTypes(type);
    return type;
  }

  HarvestedWeblogicBeanType readHarvestedTypeYaml(String typeName) throws Exception {
    String resourceName =
      "harvestedWeblogicBeanTypes/"
      + getWeblogicVersion()
      + "/"
      + StringUtils.getLeafClassName(typeName)
      + ".yaml";
    return YamlUtils.read(resourceName, HarvestedWeblogicBeanType.class);
  }

  ConsoleWeblogicBeanType readConsoleTypeYaml(String typeName) throws Exception {
    String resourceName = StringUtils.getLeafClassName(typeName) + "/type.yaml";
    return YamlUtils.read(resourceName, ConsoleWeblogicBeanType.class);
  }

  HarvestedWeblogicBeanTypeExtension readHarvestedTypeExtensionYaml(String typeName)
      throws Exception {
    String resourceName = StringUtils.getLeafClassName(typeName) + "/extension.yaml";
    return YamlUtils.read(resourceName, HarvestedWeblogicBeanTypeExtension.class);
  }

  ConsolePseudoWeblogicBeanType readConsolePseudoTypeYaml(String typeName) throws Exception {
    String resourceName = StringUtils.getLeafClassName(typeName) + "/pseudo-type.yaml";
    return YamlUtils.read(resourceName, ConsolePseudoWeblogicBeanType.class);
  }

  private void copyPropertiesToPseudoType(PseudoWeblogicBeanType type) throws Exception {
    List<String> include = type.getConsolePseudoType().getInclude();
    List<String> exclude = type.getConsolePseudoType().getExclude();
    if (!include.isEmpty() && exclude.isEmpty()) {
      copyIncludedPropertiesToPseudoType(type, include);
    } else if (!exclude.isEmpty() && include.isEmpty()) {
      copyNonExcludedPropertiesToPseudoType(type, exclude);
    } else if (!include.isEmpty() && !exclude.isEmpty()) {
      throw
        new AssertionError(
          "pseudo weblogic bean type "
          + type.getName()
          + " include and exclude are both not empty"
        );
    } else {
      throw
        new AssertionError(
          "pseudo weblogic bean type "
          + type.getName()
          + " include and exclude are empty"
        );
    }
  }

  private void copyIncludedPropertiesToPseudoType(
      PseudoWeblogicBeanType type, List<String> propertyNames) throws Exception {
    List<WeblogicBeanProperty> properties = new ArrayList<>();
    WeblogicBeanType baseType = type.getBaseType();
    List<WeblogicBeanProperty> baseProperties = baseType.getProperties();
    for (String propertyName : propertyNames) {
      boolean found = false;
      for (WeblogicBeanProperty property : baseProperties) {
        if (property.getName().equals(propertyName)) {
          properties.add(new WeblogicBeanProperty(type, property));
          found = true;
          break;
        }
      }
      if (!found) {
        throw
          new AssertionError(
            "pseude weblogic bean type "
            + type.getName()
            + " for base type "
            + baseType.getName()
            + " does not have a "
            + propertyName
            + " property"
          );
      }
    }
    type.setProperties(properties);
  }

  private void copyNonExcludedPropertiesToPseudoType(
      PseudoWeblogicBeanType type, List<String> propertyNames) throws Exception {
    List<WeblogicBeanProperty> properties = new ArrayList<>();
    WeblogicBeanType baseType = type.getBaseType();
    List<WeblogicBeanProperty> baseProperties = baseType.getProperties();
    Set<String> exclude = new HashSet<>(propertyNames);
    Set<String> found = new HashSet<>();
    for (WeblogicBeanProperty property : baseProperties) {
      String propertyName = property.getName();
      if (exclude.contains(propertyName)) {
        found.add(propertyName);
      } else {
        properties.add(new WeblogicBeanProperty(type, property));
      }
    }
    for (String propertyName : propertyNames) {
      if (!found.contains(propertyName)) {
        throw
          new AssertionError(
           "pseude weblogic bean type "
            + type.getName()
            + " for base type "
            + baseType.getName()
            + " does not have a "
            + propertyName
            + " property"
          );
      }
    }
    type.setProperties(properties);
  }

  private void createProperties(NormalWeblogicBeanType type) throws Exception {
    List<WeblogicBeanProperty> allProps = new ArrayList<>();

    // top level relative bean path -> property
    Map<String, WeblogicBeanProperty> beanPathToFoldedProp =
        new HashMap<>();

    // used to update UsedInfos' Property when the property has been renamed during folding
    List<UsedIfInfo> usedIfInfos =
        new ArrayList<>();

    // Get the console specific information for this type's properties
    Map<String, ConsoleWeblogicBeanProperty> consoleProperties = getConsoleProperties(type);

    // create weblogic properties for all of the properties defined on this type
    // also, create weblogic properties for all of the folded properties from this type's contained
    // singleton children
    // based on the names those properties had in the singleton children
    for (WeblogicBeanProperty prop : getImmediateProperties(type, consoleProperties, usedIfInfos)) {
      allProps.add(prop);
      if (prop.isFoldableContainedSingleton()) {
        getFoldedContainedSingletonProperties(beanPathToFoldedProp, usedIfInfos, type, prop);
      }
    }

    getInheritedFoldedContainedSingletonProperties(beanPathToFoldedProp, usedIfInfos, type);

    // we started off mapping bean path to folded prop to handle inherited properties
    // that were renamed in derived types (i.e. the most derived name wins)
    // now, create a mapping from the source path needed to reference one of these properties
    // to the property so that we can complete the folding based on the console property's source
    // value
    Map<String, WeblogicBeanProperty> sourcePathToFoldedProp = new HashMap<>();
    for (WeblogicBeanProperty foldedProp : beanPathToFoldedProp.values()) {
      sourcePathToFoldedProp.put(foldedProp.getSourcePath().getDotSeparatedPath(), foldedProp);
    }

    // create weblogic properties for any folded properties from this type's
    // contained singleton children that this type has renamed
    for (ConsoleWeblogicBeanProperty cprop : consoleProperties.values()) {
      if (!isImmediateProperty(getSource(cprop))) {
        WeblogicBeanProperty prop = renameFoldedProperty(type, cprop, sourcePathToFoldedProp);
        if (prop != null) {
          allProps.add(prop);
        }
      }
    }

    // keep any folded properties from this type's contained singleton children that haven't been
    // renamed
    for (WeblogicBeanProperty prop : sourcePathToFoldedProp.values()) {
      allProps.add(new WeblogicBeanProperty(type, prop));
    }

    type.setProperties(allProps);

    // needs to happen last since we need to be able to lookup properties by their
    // final names
    updateUsedIfs(type, usedIfInfos);

    recordKeyProperty(type);
  }

  private void recordKeyProperty(WeblogicBeanType type) throws Exception {
    for (WeblogicBeanProperty prop : type.getProperties()) {
      if (prop.isKey()) {
        return; // we already have an explicitly marked key property
      }
    }
    String context = "recordKeyProperty";
    if (type.hasProperty("Name")) {
      WeblogicBeanProperty nameProp = type.getProperty(context, "Name");
      if (nameProp != null) {
        nameProp.setIsKey();
      } else {
        // there's something wrong (e.g. it's deprecated, there are multiple matching props)
        // the error has already been reported.
        // keep going without recording a name/key prop.
      }
    } else {
      // some types, e.g. SettableBean, UserEditorMBean, don't have a key or a name property
      // that's OK.  we only really need key properties for top level folded bean types.
      // the code dealing with that will worry about whether there's a key or name property.
    }
  }

  private WeblogicBeanProperty renameFoldedProperty(
    WeblogicBeanType type,
    ConsoleWeblogicBeanProperty cprop,
    Map<String, WeblogicBeanProperty> sourcePathToFoldedProp
  ) throws Exception {
    WeblogicBeanProperty foldedProp = sourcePathToFoldedProp.remove(cprop.getSource());
    if (foldedProp == null) {
      YamlUtils.configurationError(
        "renameFoldedProperty can't find source property: "
        + type.getName()
        + " "
        + cprop.getName()
        + " "
        + cprop.getSource()
      );
      return null;
    }
    ConsoleWeblogicBeanProperty mergedCprop =
      mergeConsolePropertyInfos(cprop, foldedProp.getConsoleProperty());
    // since mergeConsolePropertyInfos sets the name to foldedProp's name:
    mergedCprop.setName(cprop.getName());
    Path sourcePath = new Path(cprop.getName());
    return new WeblogicBeanProperty(
      type,
      foldedProp.getUnfoldedType(),
      foldedProp.getUnfoldedBeanPath(),
      sourcePath,
      foldedProp.getHarvestedProperty(),
      mergedCprop
    );
  }

  private List<WeblogicBeanProperty> getImmediateProperties(
    NormalWeblogicBeanType type,
    Map<String, ConsoleWeblogicBeanProperty> consoleProperties, // hprop name -> cprop
    List<UsedIfInfo> usedIfInfos
  ) throws Exception {
    // TBD - consider baseTypes so that we have one stop shopping
    // note - or should we? i.e. do we want the entire set of wl/console prop pairs thru the inh
    // tree
    // in case different aspects of the prop can be set at different levels? e.g.
    // could helpSummary be defined at the server level and helpDetails be defined as the server
    // template level?
    // I don't think we have this - i think you just take the nearest prop on both the weblogic and
    // console type sides
    Map<String, HarvestedWeblogicBeanProperty> harvestedProperties = getHarvestedProperties(type);
    Set<String> hpropNames = new HashSet<>(harvestedProperties.keySet());
    for (ConsoleWeblogicBeanProperty cprop : consoleProperties.values()) {
      String source = getSource(cprop);
      if (isImmediateProperty(source)) {
        hpropNames.add(source);
      }
    }
    List<WeblogicBeanProperty> rtn = new ArrayList<>();
    for (String hpropName : hpropNames) {
      if (harvestedProperties.get(hpropName) == null) {
        if (!isRemoveMissingPropertiesAndTypes()) {
          YamlUtils.configurationError(
            "getImmediateProperties not found: "
            + type.getName()
            + " '"
            + hpropName
            + "' "
            + harvestedProperties.keySet()
            + " "
            + consoleProperties.keySet()
            + " "
            + consoleProperties.size()
          );
        } else {
          LOGGER.finest(
            "Skipping missing property "
            + getWeblogicVersion()
            + " "
            + type.getName()
            + " "
            + hpropName
          );
        }
      } else {
        WeblogicBeanProperty prop =
          new WeblogicBeanProperty(
            type,
            type,
            harvestedProperties.get(hpropName),
            consoleProperties.get(hpropName)
          );
        collectUsedIfInfo(usedIfInfos, new Path(), type, prop);
        rtn.add(prop);
      }
    }
    return rtn;
  }

  private void getFoldedContainedSingletonProperties(
    Map<String, WeblogicBeanProperty> beanPathToFoldedProp,
    List<UsedIfInfo> usedIfInfos,
    WeblogicBeanType type,
    WeblogicBeanProperty prop
  ) throws Exception {
    // Note: don't need to recurse since each top level singleton property has already
    // folded its singleton children's properties into its properties list.
    WeblogicBeanType childType = prop.getBeanType();
    if (childType != null) {
      // e.g. it's null for DescriptorBean
      for (WeblogicBeanProperty childProp : childType.getProperties()) {
        WeblogicBeanProperty parentRelativeChildProp =
          createParentRelativeChildProperty(type, prop, childProp);
        if (!BaseProperties.isBaseProperty(parentRelativeChildProp.getBeanName())) {
          beanPathToFoldedProp.put(
            parentRelativeChildProp.getPropertyUnfoldedBeanPath().getDotSeparatedPath(),
            parentRelativeChildProp
          );
          collectUsedIfInfo(usedIfInfos, prop.getPropertyUnfoldedBeanPath(), childType, childProp);
        }
      }
    }
  }

  private void getInheritedFoldedContainedSingletonProperties(
    Map<String, WeblogicBeanProperty> beanPathToFoldedProp,
    List<UsedIfInfo> usedIfInfos,
    WeblogicBeanType type
  ) throws Exception {
    List<String> baseTypes = type.getHarvestedType().getBaseTypes();
    // traverse in reverse order:
    for (int i = baseTypes.size() - 1; i >= 0; i--) {
      String baseTypeName = baseTypes.get(i);
      WeblogicBeanType baseType = getType(baseTypeName);
      for (WeblogicBeanProperty prop : baseType.getProperties()) {
        if (!prop.isTopLevel()) {
          beanPathToFoldedProp.put(prop.getPropertyUnfoldedBeanPath().getDotSeparatedPath(), prop);
          collectUsedIfInfo(usedIfInfos, new Path(), type, prop);
        }
      }
    }
  }

  private void updateUsedIfs(WeblogicBeanType type, List<UsedIfInfo> usedIfInfos) throws Exception {
    for (UsedIfInfo usedIfInfo : usedIfInfos) {
      updateUsedIf(type, usedIfInfo);
    }
  }

  private void updateUsedIf(WeblogicBeanType type, UsedIfInfo usedIfInfo) throws Exception {
    WeblogicBeanProperty preFoldingProp = usedIfInfo.getPreFoldingProperty();
    ConsoleWeblogicBeanUsedIf preFoldingUsedIf = preFoldingProp.getUsedIf();
    String usedIfPropName = preFoldingUsedIf.getProperty();
    String context = preFoldingProp.getName() + " usedIf property '" + usedIfPropName + "'";
    WeblogicBeanProperty preFoldingUsedIfProp =
      usedIfInfo.getPreFoldingSingletonType().getProperty(context, usedIfPropName);
    if (preFoldingUsedIfProp == null) {
      // already reported the problem
      // for now, let the bogus usedIf flow back to the UI
      // since later on the bogus usedIf will be a build error
      return;
    }
    Path preFoldingSingletonBeanPath = usedIfInfo.getPreFoldingSingletonBeanPath();
    WeblogicBeanProperty foldedProp =
      findPropertyByFoldedPath(type, preFoldingSingletonBeanPath, preFoldingProp);
    WeblogicBeanProperty foldedUsedIfProp =
      findPropertyByFoldedPath(type, preFoldingSingletonBeanPath, preFoldingUsedIfProp);
    ConsoleWeblogicBeanUsedIf foldedUsedIf = new ConsoleWeblogicBeanUsedIf();
    foldedUsedIf.setProperty(foldedUsedIfProp.getName());
    foldedUsedIf.setValues(preFoldingUsedIf.getValues());
    foldedUsedIf.setHide(preFoldingUsedIf.isHide());
    foldedProp.getConsoleProperty().setUsedIf(foldedUsedIf);
  }

  private void collectUsedIfInfo(
    List<UsedIfInfo> usedIfInfos,
    Path preFoldingSingletonBeanPath,
    WeblogicBeanType preFoldingSingletonType,
    WeblogicBeanProperty preFoldingProperty
  ) {
    ConsoleWeblogicBeanUsedIf usedIf = preFoldingProperty.getUsedIf();
    if (usedIf == null) {
      return;
    }
    usedIfInfos.add(
      new UsedIfInfo(preFoldingSingletonBeanPath, preFoldingSingletonType, preFoldingProperty)
    );
  }

  private class UsedIfInfo {
    // path from top level bean (e.g. ServerMBean) to the singleton
    // bean being folded (e.g. SSLMBean) (e.g. [ "SSL"] )
    private Path preFoldingSingletonBeanPath;

    private Path getPreFoldingSingletonBeanPath() {
      return this.preFoldingSingletonBeanPath;
    }

    private WeblogicBeanType preFoldingSingletonType;

    private WeblogicBeanType getPreFoldingSingletonType() {
      return this.preFoldingSingletonType;
    }

    private WeblogicBeanProperty preFoldingProperty;

    private WeblogicBeanProperty getPreFoldingProperty() {
      return this.preFoldingProperty;
    }

    private UsedIfInfo(
      Path preFoldingSingletonBeanPath,
      WeblogicBeanType preFoldingSingletonType,
      WeblogicBeanProperty preFoldingProperty
    ) {
      this.preFoldingSingletonBeanPath = preFoldingSingletonBeanPath;
      this.preFoldingSingletonType = preFoldingSingletonType;
      this.preFoldingProperty = preFoldingProperty;
    }
  }

  private WeblogicBeanProperty findPropertyByFoldedPath(
    WeblogicBeanType type,
    Path preFoldingSingletonBeanPath,
    WeblogicBeanProperty preFoldingProperty
  ) {
    // clone:
    Path foldedBeanPath = new Path(preFoldingSingletonBeanPath);
    foldedBeanPath.addComponents(preFoldingProperty.getPropertyUnfoldedBeanPath().getComponents());
    WeblogicBeanProperty foldedProperty = type.getProperty(foldedBeanPath);
    if (foldedProperty == null) {
      throw new AssertionError("Can't find " + type.getName() + " " + foldedBeanPath);
    }
    return foldedProperty;
  }

  private WeblogicBeanProperty createParentRelativeChildProperty(
    WeblogicBeanType type,
    WeblogicBeanProperty parentProp,
    WeblogicBeanProperty childProp
  ) {
    Path unfoldedBeanPath = new Path(parentProp.getBeanName());
    unfoldedBeanPath.addPath(childProp.getUnfoldedBeanPath());
    Path sourcePath = new Path(parentProp.getName());
    sourcePath.addPath(childProp.getSourcePath());
    return new WeblogicBeanProperty(
      type,
      childProp.getUnfoldedType(),
      unfoldedBeanPath,
      sourcePath,
      childProp.getHarvestedProperty(),
      childProp.getConsoleProperty()
    );
  }

  private Map<String, HarvestedWeblogicBeanProperty> getHarvestedProperties(
    NormalWeblogicBeanType type
  ) throws Exception {
    // It's possible to add javadoc comments for an mbean property both at a base type and at a
    // derived type.
    // The weblogic code that builds the weblogic bean infos already handles merging that together
    // into an
    // aggregate bean info on the derived type.
    //
    // So, we only need to find the nearest property info (instead of trying to merge derived and
    // base
    // ones for the same property together).
    //
    // Collect property infos starting at the furthest base type up to the nearest base type
    // then add the ones defined on this type, replacing as we go along so that the nearest
    // value wins.

    Map<String, HarvestedWeblogicBeanProperty> properties = new HashMap<>();
    List<String> baseTypes = type.getHarvestedType().getBaseTypes();
    // traverse in reverse order:
    for (int i = baseTypes.size() - 1; i >= 0; i--) {
      String baseTypeName = baseTypes.get(i);
      WeblogicBeanType baseType = getType(baseTypeName);
      // each base type has already aggregated its base types' properties into a single list
      // therefore we don't need to recurse beyond this type's immediate base types.
      for (WeblogicBeanProperty prop : baseType.getProperties()) {
        if (prop.isTopLevel()) {
          HarvestedWeblogicBeanProperty hprop = prop.getHarvestedProperty();
          properties.put(hprop.getName(), hprop);
        } else {
          // skip properties from inherited foldable contained singleton children
          // since we'll collect them later in getInheritedFoldedContainedSingletonProperties
        }
      }
    }
    // finally add in type's immediate properties.
    // note: at this point, we haven't set the properties on the type yet,
    // (because we're trying to compute them!) so get the set of properties from the
    // HarvestedWeblogicBeanType
    // (was were read in when the weblogic bean info yaml file was read in)
    collectHarvestedProperties(properties, type.getHarvestedType().getProperties(), false);
    HarvestedWeblogicBeanTypeExtension extension = type.getHarvestedTypeExtension();
    if (extension != null) {
      collectHarvestedProperties(properties, extension.getProperties(), true);
    }
    return properties;
  }

  private void collectHarvestedProperties(
    Map<String, HarvestedWeblogicBeanProperty> properties,
    List<HarvestedWeblogicBeanProperty> hprops,
    boolean extension
  ) {
    for (HarvestedWeblogicBeanProperty hprop : hprops) {
      // TBD - worry about duplicates?
      hprop.setExtension(extension);
      properties.put(hprop.getName(), hprop);
    }
  }

  private Map<String, ConsoleWeblogicBeanProperty> getConsoleProperties(
    NormalWeblogicBeanType type
  ) throws Exception {
    validateConsoleProperties(type);

    // It's possible to add console specific property info at both a derived and base type.
    // Unlike the weblogic bean infos, the console ones do not get merged.
    // For example, the base type can set usedIf for property 'foo' and a derived type can
    // specify 'helpSummaryHTML' for that type.
    // We need to merge this together into one property info that has the helpSummary and the
    // usedIf.

    // Start off by collecting a set of console property infos for each property name,
    // starting with the furthest and ending with the nearest.
    // Then merge the set for each property into a merged property info and return that.

    Map<String, List<ConsoleWeblogicBeanProperty>> propertyLists = new HashMap<>();
    List<String> baseTypes = type.getHarvestedType().getBaseTypes();
    for (int i = baseTypes.size() - 1; i >= 0; i--) { // traverse in reverse order
      String baseTypeName = baseTypes.get(i);
      WeblogicBeanType baseType = getType(baseTypeName);
      // each base type has already aggregated its base types' properties into a single list
      // therefore we don't need to recurse beyond this type's immediate base types.
      for (WeblogicBeanProperty prop : baseType.getProperties()) {
        if (prop.isTopLevel()) {
          addConsoleProperty(prop.getConsoleProperty(), propertyLists);
        } else {
          // skip properties from inherited foldable contained singleton children
          // since we'll collect them later in getInheritedFoldedContainedSingletonProperties
        }
      }
    }

    // finally add in type's immediate properties.
    // note: at this point, we haven't set the properties on the type yet,
    // (because we're trying to compute them!) so get the set of properties from the
    // ConsoleWeblogicBeanType
    // (which were read in when the console bean info yaml file was read in)
    ConsoleWeblogicBeanType ctype = type.getConsoleType();
    if (ctype != null) {
      for (ConsoleWeblogicBeanProperty cprop : ctype.getProperties()) {
        updateInheritedPropertyName(type, cprop, propertyLists);
        addConsoleProperty(cprop, propertyLists);
      }
    }

    return mergeConsolePropertyInfos(propertyLists);
  }

  private void validateConsoleProperties(NormalWeblogicBeanType type) throws Exception {
    Set<String> names = new HashSet<>();
    Set<String> sources = new HashSet<>();
    ConsoleWeblogicBeanType ctype = type.getConsoleType();
    if (ctype == null) {
      return;
    }
    for (ConsoleWeblogicBeanProperty cprop : ctype.getProperties()) {
      String name = cprop.getName();
      if (names.contains(name)) {
        throw
          new AssertionError(
            "Multiple console properties with the same name: "
            + type.getName()
            + " "
            + name
          );
      } else {
        names.add(name);
      }
      String source = cprop.getSource();
      if (StringUtils.isEmpty(source)) {
        source = cprop.getName();
      }
      if (sources.contains(source)) {
        throw
          new AssertionError(
            "Multiple console properties with the same source: "
            + type.getName()
            + " "
            + source
          );
      } else {
        sources.add(source);
      }
    }
  }

  private void updateInheritedPropertyName(
    WeblogicBeanType type,
    ConsoleWeblogicBeanProperty cprop,
    Map<String, List<ConsoleWeblogicBeanProperty>> propertyLists
  ) throws Exception {
    String source = cprop.getSource();
    if (StringUtils.notEmpty(source) && !source.contains(".")) {
      // This console property is renaming an inherited one or one at this level
      if (propertyLists.containsKey(source)) {
        // This console property is renaming an inherited property
        String name = cprop.getName();
        if (propertyLists.containsKey(name)) {
          throw
            new AssertionError(
              "Console property is renaming an inherited property into another inherited property"
              + " name: "
              + type.getName()
              + " name="
              + name
              + " source="
              + source
            );
        }
        // Rename the inherited property
        List<ConsoleWeblogicBeanProperty> properties = propertyLists.remove(source);
        propertyLists.put(name, properties);
      }
    }
  }

  private void addConsoleProperty(
    ConsoleWeblogicBeanProperty cprop,
    Map<String, List<ConsoleWeblogicBeanProperty>> propertyLists
  ) {
    String hpropName = getSource(cprop);
    List<ConsoleWeblogicBeanProperty> list = propertyLists.get(hpropName);
    if (list == null) {
      list = new ArrayList<>();
      propertyLists.put(hpropName, list);
    }
    list.add(cprop);
  }

  private Map<String, ConsoleWeblogicBeanProperty> mergeConsolePropertyInfos(
    Map<String, List<ConsoleWeblogicBeanProperty>> propertyLists
  ) {
    Map<String, ConsoleWeblogicBeanProperty> properties = new HashMap<>();
    for (Map.Entry<String, List<ConsoleWeblogicBeanProperty>> entry : propertyLists.entrySet()) {
      properties.put(entry.getKey(), mergeConsolePropertyInfos(entry.getValue()));
    }
    return properties;
  }

  private ConsoleWeblogicBeanProperty mergeConsolePropertyInfos(
    ConsoleWeblogicBeanProperty cprop1,
    ConsoleWeblogicBeanProperty cprop2
  ) {
    if (cprop2 == null) {
      return cprop1;
    }
    List<ConsoleWeblogicBeanProperty> cprops = new ArrayList<>();
    cprops.add(cprop1);
    cprops.add(cprop2);
    return mergeConsolePropertyInfos(cprops);
  }

  private ConsoleWeblogicBeanProperty mergeConsolePropertyInfos(
      List<ConsoleWeblogicBeanProperty> list
  ) {
    if (list == null) {
      throw new AssertionError("Null list");
    }
    if (list.isEmpty()) {
      throw new AssertionError("Empty list");
    }
    if (list.size() == 1) {
      return list.get(0);
    }
    ConsoleWeblogicBeanProperty merged = new ConsoleWeblogicBeanProperty();
    for (ConsoleWeblogicBeanProperty prop : list) {
      mergeConsolePropertyInfo(merged, prop);
    }
    return merged;
  }

  private void mergeConsolePropertyInfo(
    ConsoleWeblogicBeanProperty merged,
    ConsoleWeblogicBeanProperty prop
  ) {
    merged.setName(prop.getName());
    {
      String val = prop.getSource();
      if (StringUtils.notEmpty(val) && StringUtils.isEmpty(merged.getSource())) {
        // keep the most derived source name.
        // e.g. if A has p1
        // and B extends A and adds p2 sourced from p1
        // and C extends B and adds p3 sourced from p2,
        // the net result for C is that p3 is sourced from p1.
        merged.setSource(val);
      }
    }
    {
      // Note: we only replace the entire usedIf - we don't support
      // one level setting the usedIf's property and another level
      // setting its value.
      ConsoleWeblogicBeanUsedIf val = prop.getUsedIf();
      if (val != null) {
        merged.setUsedIf(val);
      }
    }
    {
      String val = prop.getLabel();
      if (val != null) {
        merged.setLabel(val);
      }
    }
    {
      String val = prop.getHelpSummaryHTML();
      if (val != null) {
        merged.setHelpSummaryHTML(val);
      }
    }
    {
      String val = prop.getHelpDetailsHTML();
      if (val != null) {
        merged.setHelpDetailsHTML(val);
      }
    }
    {
      String val = prop.getHelpHTML();
      if (val != null) {
        merged.setHelpHTML(val);
      }
    }
    {
      List<ConsoleWeblogicBeanLegalValue> val = prop.getLegalValues();
      if (val != null) {
        merged.setLegalValues(val);
      }
    }
    {
      ConsoleWeblogicBeanProperty.Writable val = prop.getWritable();
      if (val != ConsoleWeblogicBeanProperty.Writable.defer) {
        merged.setWritable(val);
      }
    }
    {
      String val = prop.getGetMethod();
      if (val != null) {
        merged.setGetMethod(val);
      }
    }
    {
      String val = prop.getOptionsMethod();
      if (val != null) {
        merged.setOptionsMethod(val);
      }
    }
    {
      List<String> val = prop.getOptionsSources();
      if (!val.isEmpty()) {
        merged.setOptionsSources(val);
      }
    }
    // Since 'required' is a boolean, we can't tell whether
    // it was explictly set by the prop we're merging, thus
    // should use prop's value.
    // But we do know that 'required' defaults to false, so,
    // if prop's value is true, we know it was explictly set.
    // So, only set merged to required if prop is required.
    // Yes, this means that if a base sets it true, a
    // derived can't set it back to false, but that's OK
    // since we don't have any use cases for this.
    if (prop.isRequired()) {
      merged.setRequired(prop.isRequired());
    }

    // Same rational for 'ordered' (boolean that defaults to false)
    if (prop.isOrdered()) {
      merged.setOrdered(prop.isOrdered());
    }

    // Same rational for 'reference' (boolean that defaults to false)
    if (prop.isReference()) {
      merged.setReference(prop.isReference());
    }

    // Same rational for 'dateAsLong' (boolean that defaults to false)
    if (prop.isDateAsLong()) {
      merged.setReference(prop.isDateAsLong());
    }

    // Same rational for 'allowNullReference' (boolean that defaults to true)
    if (!prop.isAllowNullReference()) {
      merged.setReference(prop.isAllowNullReference());
    }
  }

  private void createBaseTypes(WeblogicBeanType type) throws Exception {
    for (String baseTypeName : type.getHarvestedType().getBaseTypes()) {
      getType(baseTypeName); // ensure that all of this type's base types have been read in
    }
  }

  private String getSource(ConsoleWeblogicBeanProperty cprop) {
    String source = cprop.getSource();
    if (StringUtils.isEmpty(source)) {
      source = cprop.getName();
    }
    return source;
  }

  private boolean isImmediateProperty(String source) {
    return source.indexOf(".") == -1;
  }

  private void addProperty(
      Map<String, List<WeblogicBeanProperty>> properties, WeblogicBeanProperty prop) {
    String name = prop.getName();
    List<WeblogicBeanProperty> list = properties.get(name);
    if (list == null) {
      list = new ArrayList<>();
      properties.put(name, list);
    }
    list.add(prop);
  }
}
