// Copyright (c) 2020, 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.typedesc;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;

import weblogic.console.backend.utils.Path;
import weblogic.console.backend.utils.StringUtils;
import weblogic.console.backend.utils.YamlUtils;

/**
 * This class holds the effective description of a Weblogic bean type's property.
 * <p>
 * It includes information from the harvested weblogic bean info for the property as well as
 * information for the console info for that property.
 * <p>
 * For example, for a ClusterMBean, it holds the merged information from:
 * <ul>
 *   <li>harvestedWeblogicBeanTypes/14.1.1.0.0/ClusterMBean.yaml</li>
 *   <li>ClusterMBean/type.yaml</li>
 * </ul>
 * and its inherited
 * types:
 * <ul>
 *   <li>ClusterMBean</li>
 *   <li>TargetMBean</li>
 *   <li>ConfigurationMBean</li>
 *   <li>WebLogicMBean SettableBean</li>
 * </ul>
 * <p>
 * Both the console and harvested property info is available, and each contain the effective info
 * for the property.
 * <p>
 * For example, the console yaml file for KernelMBean could set SocketReaderTimeoutMinMillis's
 * label to 'Minimum Socket Reader Timeout' and the console yaml file for the ServerMBean, which
 * extends KernelMBean, could set the SockerReaderTimeoutMinMillis's helpSummary. The value returned
 * from getConsoleProperty would include both the label defined at the KernelMBean level and the
 * helpSummary defined at the ServerMBean level.
 */
public class WeblogicBeanProperty {

  private static final Logger LOGGER = Logger.getLogger(WeblogicBeanProperty.class.getName());

  // The folded bean type referencing this property
  private WeblogicBeanType type;

  public WeblogicBeanType getType() {
    return this.type;
  }

  // The unfolded bean type referencing this property
  private WeblogicBeanType unfoldedType;

  public WeblogicBeanType getUnfoldedType() {
    return this.unfoldedType;
  }

  // The unfolded path from the parent folded bean, in the bean tree, to this property's type:
  private Path unfoldedBeanPath;

  public Path getUnfoldedBeanPath() {
    return this.unfoldedBeanPath;
  }

  // The path from the parent folded bean, in the parent's console mbean yaml file, to this
  // property.
  // i.e. the value to set "source" to in a console property when you want to rename this property.
  private Path sourcePath;

  public Path getSourcePath() {
    return this.sourcePath;
  }

  private String propertyKey;

  public String getPropertyKey() {
    return this.propertyKey;
  }

  private HarvestedWeblogicBeanProperty harvestedProperty;

  /*package*/ HarvestedWeblogicBeanProperty getHarvestedProperty() {
    return harvestedProperty;
  }

  private ConsoleWeblogicBeanProperty consoleProperty;

  /*package*/ ConsoleWeblogicBeanProperty getConsoleProperty() {
    return this.consoleProperty;
  }

  public WeblogicBeanProperty(WeblogicBeanType type, WeblogicBeanProperty toClone) {
    this(
      type,
      toClone.getUnfoldedType(),
      toClone.getUnfoldedBeanPath(),
      toClone.getSourcePath(),
      toClone.getHarvestedProperty(),
      toClone.getConsoleProperty()
    );
  }

  public WeblogicBeanProperty(
    WeblogicBeanType type,
    WeblogicBeanType unfoldedType,
    HarvestedWeblogicBeanProperty harvestedProperty,
    ConsoleWeblogicBeanProperty consoleProperty
  ) {
    this(type, unfoldedType, new Path(), new Path(), harvestedProperty, consoleProperty);
    this.sourcePath.addComponent(getName());
  }

  public WeblogicBeanProperty(
    WeblogicBeanType type,
    WeblogicBeanType unfoldedType,
    Path unfoldedBeanPath,
    Path sourcePath,
    HarvestedWeblogicBeanProperty harvestedProperty,
    ConsoleWeblogicBeanProperty consoleProperty
  ) {
    this.type = type;
    this.unfoldedType = unfoldedType;
    this.unfoldedBeanPath = unfoldedBeanPath;
    this.sourcePath = sourcePath;
    this.harvestedProperty = harvestedProperty;
    if (consoleProperty == null) {
      consoleProperty = new ConsoleWeblogicBeanProperty();
      consoleProperty.setName(harvestedProperty.getName());
    }
    this.consoleProperty = consoleProperty;
    this.propertyKey = getPropertyUnfoldedBeanPath().getDotSeparatedPath();
  }

  // The unfolded path from the parent folded bean, in the bean tree, to this property
  public Path getPropertyUnfoldedBeanPath() {
    return getUnfoldedBeanPath().childPath(getHarvestedProperty().getName());
  }

  public String getName() {
    return getConsoleProperty().getName();
  }

  public String getBeanName() {
    return getHarvestedProperty().getName();
  }

  public String getRestName() {
    return StringUtils.getRestName(getBeanName());
  }

  public boolean isTopLevel() {
    return getUnfoldedBeanPath().isEmpty();
  }

  public String getRelationship() {
    return getHarvestedProperty().getRelationship();
  }

  public boolean isContainmentRelationship() {
    return "containment".equals(getRelationship());
  }

  public boolean isReferenceRelationship() {
    return "reference".equals(getRelationship());
  }

  public boolean isBeanType() {
    return isContainmentRelationship() || isReferenceRelationship();
  }

  public WeblogicBeanType getBeanType() throws Exception {
    return isBeanType() ? getType().getTypes().getType(getHarvestedProperty().getType()) : null;
  }

  public boolean isArray() {
    return getHarvestedProperty().isArray();
  }

  public String getJavaType() {
    return getHarvestedProperty().getType();
  }

  public static final String PROPERTY_TYPE_STRING = "string";
  public static final String PROPERTY_TYPE_INT = "int";
  public static final String PROPERTY_TYPE_LONG = "long";
  public static final String PROPERTY_TYPE_DOUBLE = "double";
  public static final String PROPERTY_TYPE_BOOLEAN = "boolean";
  public static final String PROPERTY_TYPE_SECRET = "secret";
  public static final String PROPERTY_TYPE_DATE = "date";
  public static final String PROPERTY_TYPE_PROPERTIES = "properties";
  public static final String PROPERTY_TYPE_REFERENCE = "reference";
  public static final String PROPERTY_TYPE_HEALTH_STATE = "healthState";

  private static Map<String, String> javaTypeToPropertyType = new HashMap<>();

  static {
    javaTypeToPropertyType.put("java.lang.String", PROPERTY_TYPE_STRING);
    javaTypeToPropertyType.put("int", PROPERTY_TYPE_INT);
    javaTypeToPropertyType.put("java.lang.Integer", PROPERTY_TYPE_INT);
    javaTypeToPropertyType.put("long", PROPERTY_TYPE_LONG);
    javaTypeToPropertyType.put("java.lang.Long", PROPERTY_TYPE_LONG);
    javaTypeToPropertyType.put("double", PROPERTY_TYPE_DOUBLE);
    javaTypeToPropertyType.put("java.lang.Double", PROPERTY_TYPE_DOUBLE);
    javaTypeToPropertyType.put("boolean", PROPERTY_TYPE_BOOLEAN);
    javaTypeToPropertyType.put("java.lang.Boolean", PROPERTY_TYPE_BOOLEAN);
    javaTypeToPropertyType.put("java.util.Date", PROPERTY_TYPE_DATE);
    javaTypeToPropertyType.put("java.util.Properties", PROPERTY_TYPE_PROPERTIES);
    javaTypeToPropertyType.put("weblogic.health.HealthState", PROPERTY_TYPE_HEALTH_STATE);
  }

  public String getPropertyType() throws Exception {
    if (isRepresentedAsReference()) {
      return PROPERTY_TYPE_REFERENCE;
    }
    if (isDateAsLong()) {
      return PROPERTY_TYPE_DATE;
    }
    String javaType = getJavaType();
    String propType = javaTypeToPropertyType.get(javaType);
    if (PROPERTY_TYPE_STRING.equals(propType) && isEncrypted()) {
      return PROPERTY_TYPE_SECRET;
    }
    if (propType != null) {
      return propType;
    }
    YamlUtils.configurationError(
      "type"
      + getType().getName()
      + " property "
      + getBeanName()
      + ": unsupported type: "
      + javaType
    );
    return "unsupported";
  }

  public boolean isSupportsOptions() {
    // currently we only support options for properties that are
    // represented as a reference or array of references.
    // we'll probably expand on this at some point.
    return isRepresentedAsReference();
  }

  // Is this property represented as a reference or array of references in the PDJ/RDJ?
  private boolean isRepresentedAsReference() {
    return
      isReferenceAsReferences()
      /* || isReferenceAsBeanKeyString() */
      || isReference()
      || isReferences();
  }

  public boolean isReference() {
    return !isArray() && isReferenceRelationship();
  }

  public boolean isReferences() {
    return isArray() && isReferenceRelationship();
  }

  public boolean isReferenceAsReferences() {
    return isReferences() && getConsoleProperty().isReference();
  }

  public boolean isSecret() throws Exception {
    return PROPERTY_TYPE_SECRET.equals(getPropertyType());
  }

  public boolean isDate() throws Exception {
    // WLS REST returned an ISO 8601 string
    return PROPERTY_TYPE_DATE.equals(getPropertyType());
  }

  public boolean isProperties() throws Exception {
    return PROPERTY_TYPE_PROPERTIES.equals(getPropertyType());
  }

  public boolean isDateAsLong() {
    return getConsoleProperty().isDateAsLong();
  }

  // Uncomment when we add support for string properties that hold mbean references
  /*
  public boolean isReferenceAsBeanKeyString() {
    return String.class.getName().equals(getJavaType()) && getConsoleProperty().isReference();
  }
  */

  public boolean hasCreator() {
    return !getHarvestedProperty().getCreators().isEmpty();
  }

  public boolean isFoldableContainedSingleton() throws Exception {
    if (!isContainmentRelationship()) {
      return false;
    }
    if (isContainedCollection()) {
      return false;
    }
    if (isContainedOptionalSingleton()) {
      if (!getBeanType().isHomogeneous()) {
        // never fold heterogeneous optional singletons
        return false;
      } else {
        // there will be two patterns for representing homogeneous optional singletons,
        // depending on the particular bean:
        // 1) they appear as a separate bean to the user
        // 2) they don't appear as a separate bean to the user,
        //    instead they're folded into the parent bean.
        // MVP only supports (1)
        // post-MVP will support (1) and (2) and we'll probably extend
        // the ConsoleWeblogicBeanProperty to distinguish the cases.
        return false;
      }
    } else {
      // this is a singleton that is automatically created and always exists.
      // fold it.
      return true;
    }
  }

  public boolean isContainedOptionalSingleton() {
    return isCreatableContainedOptionalSingleton() || isNonCreatableContainedOptionalSingleton();
  }

  public boolean isNonCreatableContainedOptionalSingleton() {
    return
      isContainedSingleton()
      && !hasCreator()
      && getConsoleProperty().isNonCreatableOptionalSingleton();
  }

  public boolean isCreatableContainedOptionalSingleton() {
    return isContainedSingleton() && hasCreator();
  }

  public boolean isContainedSingleton() {
    return !isArray() && isContainmentRelationship();
  }

  public boolean isContainedCollection() {
    return isArray() && isContainmentRelationship();
  }

  public boolean isPublic() {
    return (isUnavailable() == null);
  }

  // returns null if the property is available, a reason otherwise
  public String isUnavailable() {
    if (!getHarvestedProperty().isSupported()) {
      return "Unsupported because property is deprecated before 12.2.1.0.0, obsolete or excluded";
    } else {
      return null;
    }
  }

  public String getDescriptionHTML() {
    return getHarvestedProperty().getDescriptionHTML();
  }

  // harvestedProperty.isKey only records whether property has an @key annotation.
  // if none of the properties has this annotation, then the Name property is used
  // as the key.  WeblogicBeanTypes figures this out, and calls setIsKey to force
  // the Name property to be the key property.
  private boolean isKey = false;

  public void setIsKey() {
    this.isKey = true;
  }

  public boolean isKey() {
    return this.isKey || getHarvestedProperty().isKey();
  }

  public boolean isCreateWritable() {
    switch (getConsoleProperty().getWritable()) {
      case always:
      case createOnly:
        return true;
      case never:
        return false;
      default:
        return getHarvestedProperty().isWritable();
    }
  }

  public boolean isUpdateWritable() {
    switch (getConsoleProperty().getWritable()) {
      case always:
        return true;
      case createOnly:
      case never:
        return false;
      default:
        return getHarvestedProperty().isWritable();
    }
  }

  public boolean isNullable() {
    return getHarvestedProperty().isNullable();
  }

  public boolean isRestartNeeded() {
    return getHarvestedProperty().isRestartNeeded();
  }

  public boolean isRedeployNeeded() {
    return getHarvestedProperty().isRedeployNeeded();
  }

  public boolean isEncrypted() {
    return getHarvestedProperty().isEncrypted();
  }

  public boolean isTransient() {
    return getHarvestedProperty().isTransient();
  }

  private List<Object> legalValues = null;

  public List<Object> getLegalValues() {
    if (this.legalValues == null) {
      this.legalValues = computeLegalValues();
    }
    return this.legalValues;
  }

  private List<Object> computeLegalValues() {
    List<Object> harvestedLegalValues = getHarvestedProperty().getLegalValues();
    if (!harvestedLegalValues.isEmpty()) {
      return harvestedLegalValues;
    }
    // Heterogeneous types often use the Type property from the bean info
    // as the descriminator property.  The Type property in the bean info
    // doesn't have any legal values, but type.yaml for the heterogeneous
    // type does.  So, use them.
    List<Object> rtn = new ArrayList<>();
    for (ConsoleWeblogicBeanLegalValue legalValue : getLegalValueLabels()) {
      rtn.add(legalValue.getValue());
    }
    return rtn;
  }

  public List<String> getCreators() {
    return getHarvestedProperty().getCreators();
  }

  public String getSource() {
    return getConsoleProperty().getSource();
  }

  public List<String> getOptionsSources() {
    return getConsoleProperty().getOptionsSources();
  }

  public String getLabel() {
    return getConsoleProperty().getLabel();
  }

  public String getHelpSummaryHTML() {
    return getConsoleProperty().getHelpSummaryHTML();
  }

  public String getHelpDetailsHTML() {
    return getConsoleProperty().getHelpDetailsHTML();
  }

  public String getHelpHTML() {
    return getConsoleProperty().getHelpHTML();
  }

  public ConsoleWeblogicBeanUsedIf getUsedIf() {
    return getConsoleProperty().getUsedIf();
  }

  public boolean isRequired() {
    return getConsoleProperty().isRequired();
  }

  public List<ConsoleWeblogicBeanLegalValue> getLegalValueLabels() {
    return getConsoleProperty().getLegalValues();
  }

  public String getGetMethod() {
    return getConsoleProperty().getGetMethod();
  }

  public String getOptionsMethod() {
    return getConsoleProperty().getOptionsMethod();
  }

  public boolean isOrdered() {
    return getConsoleProperty().isOrdered();
  }

  public boolean isAllowNullReference() {
    return getConsoleProperty().isAllowNullReference();
  }

  public HarvestedDefaultValue getDefaultValue() {
    return getHarvestedProperty().getDefaultValue();
  }

  // Whether this property was defined in extension.yaml,
  // i.e. did not come from a harvested bean info
  public boolean isExtension() {
    return getHarvestedProperty().isExtension();
  }

  @Override
  public String toString() {
    return "(" + getName() + ": " + propertyKey + ")";
  }
}
