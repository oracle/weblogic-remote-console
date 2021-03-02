// Copyright (c) 2020, 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.typedesc;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.logging.Logger;

import weblogic.console.backend.utils.Path;
import weblogic.console.backend.utils.StringUtils;
import weblogic.console.backend.utils.YamlUtils;

/**
 * This class holds the effective description of a Weblogic bean type.
 * <p>
 * It includes information from the harvested weblogic bean info for the type as well as
 * information from the console yaml file(s) for that type.
 * <p>
 * For example, for a ClusterMBean, it holds the merged information from:
 * <ul>
 *   <li>harvestedWeblogicBeanTypes/14.1.1.0.0/ClusterMBean.yaml</li>
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
 * It includes all of the properties of type and its subtypes. It also contains all of the
 * properties of its automatically created child beans (for example, ServerMBean also includes the
 * properties of its SSLMBean child bean.)
 * <p>
 * Note: several places in the console ask a WeblogicBeanType to find a property by its name,
 * where the type is heterogeneous and the property only exists in one of the derived types (e.g.
 * asking ComponentRuntimeMBean to find the WseeV2Runtimes property).
 * <p>
 * Ideally, these places in the console would start off with an instance, get its real type (e.g.
 * a WebAppComponentRuntimeMBean instance), then look for the property there.
 * <p>
 * But, that would require some major restructuring of the CBE, and could require extra REST
 * calls from the CBE to WLS and calling custom CBE code to compute property values (to find out the
 * instance's type discriminator then look up that instance's actual type).
 * <p>
 * This is more than we want to take on for MVP.
 * <p>
 * So, as a work around, then a base heterogeneous type is asked for a property that it doesn't
 * know about, it asks each of its instantiable sub types. Since the property could be defined in
 * more than one (e.g. WebAppComponentRuntime and EJBComponentRuntime both declare a WseeV2Runtimes
 * property), then it checks that all matching properties are basically the same (e.g. same name,
 * same java type, same relationship).
 * <p>
 * If there are one or more matches, and they're essentially the same, then it returns the first
 * one. If they're not the same, then it complains that the property is ambiguous.
 * <p>
 * This is not a perfect algorithm, but it seems to work well enough for MVP.
 */
public abstract class WeblogicBeanType {

  private static final Logger LOGGER = Logger.getLogger(WeblogicBeanType.class.getName());

  private WeblogicBeanTypes types;

  public WeblogicBeanTypes getTypes() {
    return this.types;
  }

  private HarvestedWeblogicBeanType harvestedType;

  /*package*/ HarvestedWeblogicBeanType getHarvestedType() {
    return this.harvestedType;
  }

  private ConsoleWeblogicBeanType consoleType;

  /*package*/ ConsoleWeblogicBeanType getConsoleType() {
    return this.consoleType;
  }

  private Map<String, List<WeblogicBeanProperty>> nameToProperties = new HashMap<>();

  public Set getPropertyNames() {
    return this.nameToProperties.keySet();
  }

  private Map<String, WeblogicBeanProperty> beanPropertyNameToLocalProperty = new HashMap<>();

  private Map<String, WeblogicBeanProperty> propertyRestNameToLocalProperty = new HashMap<>();

  private Map<String, WeblogicBeanProperty> propertyBeanPathToProperty = new HashMap<>();

  private Map<String, Boolean> typeToIsType = new HashMap<>();

  private List<SubType> allSubTypes; // This type's instantiable sub types

  public abstract String getName();

  // Returns the underlying weblogic mbean type, typically 'this' (v.s. for pseudo types)
  public WeblogicBeanType getActualWeblogicBeanType() {
    return this;
  }

  public String getDisplayName() {
    return StringUtils.camelCaseToUpperCaseWords(StringUtils.getSimpleTypeName(getName()));
  }

  public String getSimpleName() {
    return StringUtils.getSimpleTypeName(getName());
  }

  public String getDescriptionHTML() {
    return getHarvestedType().getDescriptionHTML();
  }

  private WeblogicBeanProperty keyProperty;

  public WeblogicBeanProperty getKeyProperty() throws Exception {
    if (this.keyProperty == null) {
      this.keyProperty = findKeyProperty();
    }
    return this.keyProperty;
  }

  private WeblogicBeanProperty findKeyProperty() throws Exception {
    WeblogicBeanProperty nameProp = null;
    for (WeblogicBeanProperty prop : getProperties()) {
      if (prop.isKey()) {
        return prop;
      }
      if ("Name".equals(prop.getName())) {
        nameProp = prop;
      }
    }
    if (nameProp == null) {
      YamlUtils.configurationError("no name or key property for " + getName());
    }
    return nameProp;
  }

  public String getSubTypeDiscriminatorPropertyName() throws Exception {
    validateHeterogeneous();
    return do_getSubTypeDiscriminatorPropertyName();
  }

  protected abstract String do_getSubTypeDiscriminatorPropertyName();

  public List<SubType> getSubTypes() throws Exception {
    validateHeterogeneous();
    // Lazy evaluation since it requires a recursive walk of the sub types.
    if (this.allSubTypes == null) {
      this.allSubTypes = findAllSubTypes();
    }
    return this.allSubTypes;
  }

  // Finds all of this type's instantiable sub types.
  // Note that this type's type.yaml only lists its immediate instantiable sub types.
  // Their type.yaml files list their immediate sub types.  Recursively walk all of
  // them to find the complete list.
  private List<SubType> findAllSubTypes() throws Exception {
    Set<String> visited = new HashSet<>(); // set of type names
    List<SubType> subTypes = new ArrayList<>();
    for (SubType subType : do_getSubTypes()) {
      addSubType(visited, subTypes, subType);
    }
    return subTypes;
  }

  private void addSubType(
    Set<String> visited,
    List<SubType> subTypes,
    SubType subType
  ) throws Exception {
    String subTypeName = subType.getType();
    if (visited.contains(subTypeName)) {
      return;
    }
    visited.add(subTypeName);
    subTypes.add(subType);
    if (getName().equals(subTypeName)) {
      // The base type is instantiable.
      // findAllSubTypes will walk its sub types.
      return;
    }
    WeblogicBeanType subTypeBeanType = getTypes().getType(subTypeName);
    if (subTypeBeanType == null) {
      if (!getTypes().isRemoveMissingPropertiesAndTypes()) {
        configurationError(
          "addSubType",
          getName(),
          "refers to a sub type does not exist: " + subTypeName
        );
      } else {
        LOGGER.finest(
          "Skipping missing sub type "
          + getTypes().getWeblogicVersion()
          + " "
          + getName()
          + " "
          + subTypeName
        );
        return;
      }
    }
    if (subTypeBeanType.isHomogeneous()) {
      // The sub type doesn't have further sub types. Stop walking.
      return;
    }
    // The sub type has further sub types. Collect them too.
    for (SubType subTypeSubType : subTypeBeanType.getSubTypes()) {
      addSubType(visited, subTypes, subTypeSubType);
    }
  }

  // This type's immediate instantiable sub types.
  // Abstract since pseudo types and normal types handle this differently.
  protected abstract List<SubType> do_getSubTypes();

  public boolean isHomogeneous() {
    List<SubType> subTypes = do_getSubTypes();
    return subTypes == null || subTypes.isEmpty();
  }

  public WeblogicBeanType getSubType(String subTypeDiscriminator) throws Exception {
    validateHeterogeneous();
    if (subTypeDiscriminator == null) {
      // treat it as the base type
      return this;
    }
    for (SubType subType : do_getSubTypes()) {
      if (subType.getValue().equals(subTypeDiscriminator)) {
        return getTypes().getType(subType.getType());
      }
    }
    YamlUtils.configurationError(
      getName()
      + ": unknown subTypeDiscriminator: "
      + subTypeDiscriminator
    );
    return null;
  }

  private void validateHeterogeneous() throws Exception {
    if (isHomogeneous()) {
      throw new Exception(getName() + ": is not heterogeneous");
    }
  }

  public boolean hasProperty(String property) throws Exception {
    return getProperties(property) != null;
  }

  /*package*/ WeblogicBeanProperty getProperty(Path propertyBeanPath) {
    return this.propertyBeanPathToProperty.get(propertyBeanPath.getDotSeparatedPath());
  }

  public WeblogicBeanProperty getProperty(String context, String property) throws Exception {
    WeblogicBeanProperty prop = null;

    List<WeblogicBeanProperty> props = getProperties(property);
    if (props != null) {
      MatchingPropertiesCollector collector = new MatchingPropertiesCollector(context, property);
      for (WeblogicBeanProperty p : props) {
        if (p.isUnavailable() == null) {
          collector.addProperty(p);
        }
      }
      prop = collector.getProperty();
    }
    if (prop != null && !isAvailable(context, prop)) {
      prop = null;
    }
    if (prop == null) {
      if (!getTypes().isRemoveMissingPropertiesAndTypes()) {
        configurationError(context, property, "refers to a property that does not exist");
      } else {
        LOGGER.finest(
          "Skipping missing property "
          + getTypes().getWeblogicVersion()
          + " "
          + getName()
          + " "
          + property
        );
      }
    }
    return prop;
  }

  private boolean isAvailable(String context, WeblogicBeanProperty prop) throws Exception {
    String reason = prop.isUnavailable();
    if (reason != null) {
      if (!getTypes().isRemoveMissingPropertiesAndTypes()) {
        configurationError(context, prop.getName(), reason);
      } else {
        LOGGER.finest(
          "Skipping unavailable property "
          + getTypes().getWeblogicVersion()
          + " "
          + getName()
          + " "
          + prop.getName()
          + " "
          + reason
        );
      }
      return false;
    } else {
      return true;
    }
  }

  public WeblogicBeanProperty getPropertyFromRestName(String propRestName) throws Exception {
    return getPropertyFromRestName(new Path(), propRestName);
  }

  public WeblogicBeanProperty getPropertyFromRestName(Path unfoldedPath, String propRestName) throws Exception {
    String unfoldedPathAsString = unfoldedPath.toString();
    WeblogicBeanProperty prop = getPropertyFromRestName(getProperties(), unfoldedPathAsString, propRestName);
    if (prop == null) {
      // This type don't have the property. See if one of its sub types does.
      if (!isHomogeneous()) {
        MatchingPropertiesCollector collector =
          new MatchingPropertiesCollector("getPropertyFromRestName", propRestName);
        for (SubType subType : getSubTypes()) {
          if (subType.getType().equals(getName())) {
            // the base type is listed as a sub type - skip it
          } else {
            WeblogicBeanType subTypeType = getTypes().getType(subType.getType());
            if (subTypeType == null) {
              // This version of weblogic doesn't have this type.  Skip it.
            } else {
              collector.addProperty(
                getPropertyFromRestName(subTypeType.getProperties(), unfoldedPathAsString, propRestName)
              );
            }
          }
        }
        prop = collector.getProperty();
      }
    }
    if (prop == null) {
      throw new Exception(
        "Can't find property from rest name: " + getName()
        + " unfoldedPath=" + unfoldedPath
        + " property=" + propRestName);
    }
    return prop;
  }

  private WeblogicBeanProperty getPropertyFromRestName(
    List<WeblogicBeanProperty> properties,
    String unfoldedPath,
    String propRestName
  ) throws Exception {
    for (WeblogicBeanProperty prop : properties) {
      if (propRestName.equals(prop.getRestName())) {
        if (unfoldedPath.equals(prop.getUnfoldedBeanPath().toString())) {
          return prop;
        }
      }
    }
    return null;
  }

  public WeblogicBeanProperty getLocalPropertyByBeanPropertyName(
    String context,
    String beanPropertyName
  ) throws Exception {
    WeblogicBeanProperty prop = this.beanPropertyNameToLocalProperty.get(beanPropertyName);
    if (prop == null) {
      // This type don't have the property. See if one of its sub types does.
      if (!isHomogeneous()) {
        MatchingPropertiesCollector collector =
          new MatchingPropertiesCollector(context, beanPropertyName);
        for (SubType subType : getSubTypes()) {
          if (subType.getType().equals(getName())) {
            // the base type is listed as a sub type - skip it
          } else {
            WeblogicBeanType subTypeType = getTypes().getType(subType.getType());
            if (subTypeType == null) {
              // This version of weblogic doesn't have this type.  Skip it.
            } else {
              collector.addProperty(
                subTypeType.getLocalPropertyByBeanPropertyName(beanPropertyName)
              );
            }
          }
        }
        prop = collector.getProperty();
      }
    }
    if (prop == null) {
      configurationError(
        context,
        beanPropertyName,
        "refers to a local property that does not exist"
      );
      return null;
    }
    return (isAvailable(context, prop)) ? prop : null;
  }

  private WeblogicBeanProperty getLocalPropertyByBeanPropertyName(
    String beanPropertyName
  ) throws Exception {
    return this.beanPropertyNameToLocalProperty.get(beanPropertyName);
  }

  public WeblogicBeanProperty getLocalPropertyByPropertyRestName(
    String context,
    String propertyRestName
  ) throws Exception {
    WeblogicBeanProperty prop = this.propertyRestNameToLocalProperty.get(propertyRestName);
    if (prop == null) {
      // This type don't have the property. See if one of its sub types does.
      if (!isHomogeneous()) {
        MatchingPropertiesCollector collector =
          new MatchingPropertiesCollector(context, propertyRestName);
        for (SubType subType : getSubTypes()) {
          if (subType.getType().equals(getName())) {
            // the base type is listed as a sub type - skip it
          } else {
            WeblogicBeanType subTypeType = getTypes().getType(subType.getType());
            if (subTypeType == null) {
              // This version of weblogic doesn't have this type.  Skip it.
            } else {
              collector.addProperty(
                subTypeType.getLocalPropertyByPropertyRestName(propertyRestName)
              );
            }
          }
        }
        prop = collector.getProperty();
      }
    }
    if (prop == null) {
      configurationError(
        context,
        propertyRestName,
        "refers to a local property that does not exist"
      );
      return null;
    }
    return (isAvailable(context, prop)) ? prop : null;
  }

  private WeblogicBeanProperty getLocalPropertyByPropertyRestName(
    String propertyRestName
  ) throws Exception {
    return this.propertyRestNameToLocalProperty.get(propertyRestName);
  }

  public boolean isConfigurationMBean() throws Exception {
    return isType("weblogic.management.configuration.ConfigurationMBean");
  }

  public boolean isRuntimeMBean() throws Exception {
    return isType("weblogic.management.configuration.RuntimeMBean");
  }

  public boolean isSettable() throws Exception {
    return isType("weblogic.descriptor.SettableBean");
  }

  public boolean isType(String type) throws Exception {
    Boolean isType = this.typeToIsType.get(type);
    if (isType == null) {
      isType = computeIsType(type);
      this.typeToIsType.put(type, isType);
    }
    return isType;
  }

  private boolean computeIsType(String type) throws Exception {
    if (getName().equals(type)) {
      return true;
    }
    for (String baseType : getHarvestedType().getBaseTypes()) {
      if (getTypes().getType(baseType).isType(type)) {
        return true;
      }
    }
    return false;
  }

  public List<String> getDerivedTypes() throws Exception {
    return getHarvestedType().getDerivedTypes();
  }

  public boolean isDisableMBeanJavadoc() throws Exception {
    if (getConsoleType() != null) {
      return getConsoleType().isDisableMBeanJavadoc();
    } else {
      return false;
    }
  }

  private void configurationError(
    String context,
    String property,
    String problem
  ) throws Exception {
    YamlUtils.configurationError(
      context
      + " "
      + getName()
      + " '"
      + property
      + "' : "
      + problem
    );
  }

  public List<WeblogicBeanProperty> getProperties() {
    return this.properties;
  }

  private List<WeblogicBeanProperty> getProperties(String property) throws Exception {
    List<WeblogicBeanProperty> props = this.nameToProperties.get(property);
    if (props == null) {
      // This type don't have the property. See if any of its sub types does.
      if (!isHomogeneous()) {
        for (SubType subType : getSubTypes()) {
          if (subType.getType().equals(getName())) {
            // the base type is listed as a sub type - skip it
          } else {
            WeblogicBeanType subTypeType = getTypes().getType(subType.getType());
            if (subTypeType == null) {
              // This version of weblogic doesn't have this type.  Skip it.
            } else {
              List<WeblogicBeanProperty> subTypeProps = subTypeType.getProperties(property);
              if (subTypeProps != null) {
                if (props == null) {
                  props = new ArrayList<>();
                }
                props.addAll(subTypeProps);
              }
            }
          }
        }
      }
    }
    return props;
  }

  private void createMaps() {
    this.nameToProperties.clear();
    this.beanPropertyNameToLocalProperty.clear();
    this.propertyRestNameToLocalProperty.clear();
    this.propertyBeanPathToProperty.clear();
    for (WeblogicBeanProperty prop : getProperties()) {
      this.propertyBeanPathToProperty.put(
        prop.getPropertyUnfoldedBeanPath().getDotSeparatedPath(),
        prop
      );
      String name = prop.getName();
      List<WeblogicBeanProperty> propsForName = this.nameToProperties.get(name);
      if (propsForName == null) {
        propsForName = new ArrayList<>();
        this.nameToProperties.put(name, propsForName);
      }
      propsForName.add(prop);
      if (prop.getUnfoldedBeanPath().isEmpty()) {
        this.beanPropertyNameToLocalProperty.put(prop.getBeanName(), prop);
        this.propertyRestNameToLocalProperty.put(prop.getRestName(), prop);
      }
    }
  }

  private List<WeblogicBeanProperty> properties = new ArrayList<>();

  public void setProperties(List<WeblogicBeanProperty> val) {
    this.properties = val;
    createMaps();
  }

  protected WeblogicBeanType(
    WeblogicBeanTypes types,
    HarvestedWeblogicBeanType harvestedType,
    ConsoleWeblogicBeanType consoleType
  ) {
    this.types = types;
    this.harvestedType = harvestedType;
    this.consoleType = consoleType;
  }

  public String getDeleteMethod() {
    return null;
  }

  public String getCreateMethod() {
    return null;
  }

  public String getCreateFormPropertiesMethod() {
    return null;
  }

  public String getCollectionResourceClass() {
    return null;
  }

  public String getInstanceResourceClass() {
    return null;
  }

  @Override
  public String toString() {
    return getName();
  }

  /**
   * When someone asks for a heterogeneous base type for a property, and the property isn't defined
   * there, then we search each of its sub types for the property.
   *
   * <p>If all the matching properties are essentially the same, we return the first one. If they're
   * different, then we report an error.
   *
   * <p>Since we have several ways of looking up properties, each of them need to do this
   * computation.
   *
   * <p>This helper class does the work for them. i.e. those spots just need to find the candidate
   * matching properties, and this class takes care of checking whether they're the same or not.
   *
   * <p>Basic pattern:
   *
   * <p>- construct a MatchingPropertiesCollection, passing in the context string and desired
   * property name in case we need to report an error.
   *
   * <p>- find the matching properties from each sub type, calling addProperty for each one. if a
   * matching property isn't essentially the same, it reports the problem immediately and throws an
   * exception.
   *
   * <p>- call getProperty to get the matching property (returns null if there isn't one)
   */
  private class MatchingPropertiesCollector {
    private String context;
    private String propertyName;

    private WeblogicBeanProperty property = null;

    private WeblogicBeanProperty getProperty() {
      return this.property;
    }

    private MatchingPropertiesCollector(String context, String propertyName) {
      this.context = context;
      this.propertyName = propertyName;
    }

    private void addProperty(WeblogicBeanProperty prop) throws Exception {
      if (prop == null) {
        return;
      }
      if (getProperty() == null) {
        this.property = prop;
      } else {
        if (!sameProperty(getProperty(), prop)) {
          configurationError(
            context,
            this.propertyName,
            "ambiguous property "
            + getName()
            + " "
            + prop.getType()
            + ":"
            + prop.getName()
            + " "
            + getProperty().getType()
            + " "
            + getProperty().getName()
          );
        }
      }
    }

    private boolean sameProperty(
      WeblogicBeanProperty p1,
      WeblogicBeanProperty p2
    ) throws Exception {
      return
        p1.getRestName().equals(p2.getRestName())
        && p1.getJavaType().equals(p2.getJavaType())
        && p1.isArray() == p2.isArray()
        && StringUtils.nonNull(p1.getRelationship()).equals(StringUtils.nonNull(p2.getRelationship()));
    }
  }
}
