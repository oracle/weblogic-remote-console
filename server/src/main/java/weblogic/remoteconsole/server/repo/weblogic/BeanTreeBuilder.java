// Copyright (c) 2021, 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo.weblogic;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.Set;
import java.util.TreeMap;
import java.util.logging.Level;
import java.util.logging.Logger;

import weblogic.remoteconsole.common.repodef.BeanChildDef;
import weblogic.remoteconsole.common.repodef.BeanPropertyDef;
import weblogic.remoteconsole.common.repodef.BeanTypeDef;
import weblogic.remoteconsole.common.repodef.LocalizableString;
import weblogic.remoteconsole.common.repodef.LocalizedConstants;
import weblogic.remoteconsole.common.repodef.Localizer;
import weblogic.remoteconsole.common.utils.Path;
import weblogic.remoteconsole.common.utils.StringUtils;
import weblogic.remoteconsole.server.repo.BeanRepo;
import weblogic.remoteconsole.server.repo.BeanTreePath;
import weblogic.remoteconsole.server.repo.Value;
import weblogic.remoteconsole.server.webapp.FailedRequestException;

/**
 * BeanTreeBuilder creates a BeanTree holding a bean tree created from a WDT model.
 */
public class BeanTreeBuilder {
  private static final Logger LOGGER = Logger.getLogger(BeanTreeBuilder.class.getName());

  private static final String DOMAIN_PREFIX = "Domain.";
  private static final int DOMAIN_PREFIX_LEN = DOMAIN_PREFIX.length();

  // UnixMachine and Machine are under Machines for BeanTreeEntry
  private static final String MACHINE = "Machine";
  private static final String MACHINES = "Machines";
  private static final String UNIX_MACHINE = "UnixMachine";
  private static final String DOMAIN_MBEAN_TYPE = "DomainMBean";

  // WDT delete operator for removing entries (e.g. "!Cluster1")
  private static final String DELETE_OPER = "!";
  private static final int DELETE_OPER_LEN = 1;

  // The bean repo for the bean tree
  private BeanTree beanTree;

  // The localizer for messages
  private Localizer localizer;

  // The model entry for the bean
  // Entire model when at the Domain
  private Map<String, Object> model;

  // The bean type of this bean
  // Domain type when at the Domain
  private BeanTypeDef beanTypeDef;

  // The identity for the parent bean
  private BeanTreePath identity;

  // The bean tree entry that will parent new entries
  private BeanTreeEntry parent;

  // The list of sections to add to the Domain
  private Map<String, Map<String, Object>> modelSections = null;

  // The current section of the model used by the builder
  private String currentModelSection = null;

  // Controls the application of the WDT delete operator from the model
  private boolean isWDTDeleteApplied = false;

  // Indicate if the security provider type has been applied during build
  private boolean isSecurityProviderTypeApplied = false;

  private BeanTree getBeanTree() {
    return beanTree;
  }

  private Map<String, Object> getModel() {
    return model;
  }

  private BeanTypeDef getBeanTypeDef() {
    return beanTypeDef;
  }

  private BeanTreePath getIdentity() {
    return identity;
  }

  private BeanTreeEntry getParent() {
    return parent;
  }

  private BeanTypeDef getSecurityProviderBeanTypeDef() {
    return getBeanTree().getSecurityProviderTypeDef();
  }

  private Map<String, Set<String>> getUnknownProperties() {
    return getBeanTree().getUnknownProperties();
  }

  // Determine if the WDT delete operator is applied during build
  public boolean isWDTDeleteApplied() {
    return isWDTDeleteApplied;
  }

  // Enable the application of the WDT delete operator during build
  public void setWDTDeleteApplied() {
    isWDTDeleteApplied = true;
  }

  // Set the state of the WDT delete operator for the build
  private void setWDTDeleteApplied(boolean deleteApplied) {
    isWDTDeleteApplied = deleteApplied;
  }

  // Determine if the security provider type has been applied during build
  public boolean isSecurityProviderTypeApplied() {
    return isSecurityProviderTypeApplied;
  }

  // Flag that the security provider type has been applied during build
  public void setSecurityProviderTypeApplied() {
    isSecurityProviderTypeApplied = true;
  }

  // Create the builder for the Domain root which holds the model sections
  public BeanTreeBuilder(
    Map<String, Object> wdtModel,
    BeanRepo beanRepo,
    BeanChildDef rootChildDef,
    Localizer localizer
  ) {
    // Create the BeanTree that will used by the builder
    beanTree =
      new BeanTree(
        wdtModel,      // The parsed WDT model
        beanRepo,      // The WDT BeanRepo
        rootChildDef   // The Domain BeanChildDef
      );

    // Initialize the builder
    initialize(localizer);
  }

  // Create the builder using a existing bean tree and adding in another model
  public BeanTreeBuilder(
    BeanTree baseBeanTree,
    Map<String, Object> wdtModel,
    Localizer localizer
  ) {
    // Add the model to the bean tree
    beanTree = baseBeanTree;
    beanTree.addWDTModel(wdtModel);

    // Initialize the builder
    initialize(localizer);
  }

  // Common initialization for the bean tree builder
  private void initialize(
    Localizer localizer
  ) {
    this.localizer = localizer;

    // Setup root of the model using the Domain information
    parent = beanTree.getDomain();
    model = beanTree.getWDTModel();
    identity = parent.getBeanTreePath();
    beanTypeDef = parent.getBeanChildDef().getChildTypeDef();

    // Create Map to hold the model sections being added to the Domain
    modelSections = new LinkedHashMap<>();
  }

  // Create builder for the parent in order to walk down to the children
  // Provide the model value being added to parent along with the parent identity
  private BeanTreeBuilder(
    BeanTree beanTree,
    BeanTreeEntry parent,
    Map<String, Object> value,
    BeanTreePath identity,
    BeanTypeDef beanTypeDef,
    Localizer localizer
  ) {
    this.beanTree = beanTree;
    this.parent = parent;
    this.model = value;
    this.identity = identity;
    this.beanTypeDef = beanTypeDef;
    this.localizer = localizer;
  }

  // Add a WDT model sections that will be placed into the bean tree
  public void addModelSections() {
    getModel().keySet().forEach(section -> {
      if (!WDTModelSchema.KNOWN_SECTIONS.contains(section)) {
        throw failedRequestException(LocalizedConstants.WDT_INVALID_SECTION, section, WDTModelSchema.KNOWN_SECTIONS);
      }
    });
    WDTModelSchema.SUPPORTED_SECTIONS.forEach(section -> {
      addModelSection(section);
    });
  }


  // Add a WDT model section that will be placed into the bean tree
  private void addModelSection(String section) {
    if ((section != null) && !section.isEmpty()) {
      if (getModel().containsKey(section)) {
        // Get and place the model section into the list of model sections
        // Fixup - Convert from deprecated getApplications() to getAppDeployments()
        if (!"appDeployments".equals(section)) {
          modelSections.put(section, getMapValueFromKey(section, getModel()));
        } else {
          Map<String, Object> fixedSection = null;
          Map<String, Object> modelSection = getMapValueFromKey(section, getModel());
          if (modelSection != null) {
            fixedSection = new LinkedHashMap<>();
            for (String key : modelSection.keySet()) {
              String fixedKey = ("Application".equals(key) ? "AppDeployment" : key);
              fixedSection.put(fixedKey, modelSection.get(key));
            }
          }
          modelSections.put(section, fixedSection);
        }
      }
    }
  }

  // Build the bean tree using the model sections specified
  // When no sections are added you have an empty Domain
  public BeanTree build() {
    for (Map.Entry<String, Map<String, Object>> entry : modelSections.entrySet()) {
      // For each of the added model sections, fill in the bean tree
      currentModelSection = entry.getKey();
      LOGGER.fine("BeanTreeBuilder adding section: " + currentModelSection);
      buildEntries(entry.getValue());
    }

    // Clear the current model section and return the bean tree...
    currentModelSection = null;

    return getBeanTree();
  }

  // Build the entries from the model value to fill in the bean tree
  // The subtree is built by a builder created for each child
  private void buildSubTree() {
    buildEntries(getModel());
  }

  // Build each of the entries in the value by adding them into the bean tree
  private void buildEntries(Map<String, Object> value) {
    if ((value != null) && !value.isEmpty()) {
      for (String key : value.keySet()) {
        addTree(key, value.get(key));
      }
    }
  }

  // Update or create a property, update may require a merge where
  // created properties are added into the bean tree with their value
  private void createOrUpdateProperty(
    String key,
    Object value,
    BeanPropertyDef beanPropDef
  ) {
    // Check for the property and create when non-existent
    BeanTreeEntry property = getParent().getBeanTreeEntry(key);
    if (property == null) {
      property = createProperty(key, value, beanPropDef, getIdentity(), true);
      checkPropertyValueForDelete(property, beanPropDef);
      return;
    }

    // Otherwise, update or merge the property value...
    mergeOrUpdateProperty(property, value, beanPropDef);
  }

  // Update or create a property using the supplied parent,
  // update may require a merge, created properties are added
  // into the supplied parent with their value
  private void createOrUpdateProperty(
    String key,
    Object value,
    BeanPropertyDef beanPropDef,
    BeanTreeEntry parent
  ) {
    // Check for the property and create when non-existent
    BeanTreeEntry property = parent.getBeanTreeEntry(key);
    if (property == null) {
      property = createProperty(key, value, beanPropDef, parent.getBeanTreePath(), false);
      parent.putBeanTreeEntry(key, property);
      checkPropertyValueForDelete(property, beanPropDef);
      return;
    }

    // Otherwise, update or merge the property value...
    mergeOrUpdateProperty(property, value, beanPropDef);
  }

  // Create a property but only place into the parent when specified
  private BeanTreeEntry createProperty(
    String key,
    Object value,
    BeanPropertyDef beanPropDef,
    BeanTreePath identity,
    boolean addToParent
  ) {
    // Create the entry for the property
    BeanTreeEntry property = getBeanTree().createProperty(key, value, identity, beanPropDef);

    // Add the entry to the parent unless we are creating the entry directly
    if (addToParent) {
      getParent().putBeanTreeEntry(key, property);
    }

    validatePropertyValue(property);

    // Return created property
    return property;
  }

  // Update or merge a property value based on the property type
  private void mergeOrUpdateProperty(
    BeanTreeEntry currentProperty,
    Object value,
    BeanPropertyDef beanPropDef
  ) {
    validatePropertyValue(currentProperty);

    // Merge values when property is of type Properties
    if (beanPropDef.isProperties()) {
      mergePropertiesProperty(currentProperty, value, beanPropDef);
      return;
    }

    // Update non-array property to the new value (i.e. no merge needed)
    if (!beanPropDef.isArray()) {
      currentProperty.setPropertyValue(value);
      return;
    }

    // Merge the reference keys when there is a reference array type property
    if (beanPropDef.isReference()) {
      mergeReferenceArray(currentProperty, value, beanPropDef.isReferenceAsReferences());
      return;
    }

    // Otherwise, merge the two arrays based on the type of the array
    mergeArrayProperty(currentProperty, value, beanPropDef);
  }

  private void validatePropertyValue(BeanTreeEntry property) {
    if (!property.getBeanPropertyDef().isSupportsModelTokens()) {
      if (WDTValueConverter.isPropertyModelToken(property)) {
        throw
          failedRequestException(
            LocalizedConstants.WDT_MODEL_TOKEN_NOT_SUPPORTED,
            property.getKey(),
            property.getPropertyValue()
          );
      }
    }
    // Throws FailedRequestException if the property's value doesn't match its type:
    WDTValueConverter.getValueType(property, property.getBeanPropertyDef(), localizer);
  }

  // Check and get an existing bean when available, otherwise create
  // the bean or bean collection and place that bean into the bean tree
  // Return the created BeanTreeEntry so the bean properties can be added
  private BeanTreeEntry getOrCreateBean(
    String key,
    boolean collection,
    BeanChildDef beanChildDef
  ) {
    BeanTreeEntry bean = getParent().getBeanTreeEntry(key);
    return (bean != null) ? bean : createBean(key, collection, beanChildDef, getIdentity(), true);
  }

  // Check and get an existing bean from the supplied
  // parent, otherwise create the bean using the parent
  // identity and then add the created bean to the parent
  private BeanTreeEntry getOrCreateBean(
    String key,
    boolean collection,
    BeanChildDef beanChildDef,
    BeanTreeEntry parent
  ) {
    BeanTreeEntry bean = parent.getBeanTreeEntry(key);
    if (bean == null) {
      bean = createBean(key, collection, beanChildDef, parent.getBeanTreePath(), false);
      parent.putBeanTreeEntry(key, bean);
    }
    return bean;
  }

  // Create a bean but only place the bean into the parent when specified
  // The identity of the bean is computed from the supplied parent identity
  private BeanTreeEntry createBean(
    String key,
    boolean collection,
    BeanChildDef beanChildDef,
    BeanTreePath identity,
    boolean addToParent
  ) {
    // Create the entry for the bean
    BeanTreeEntry bean = getBeanTree().createBean(key, identity, collection, beanChildDef);

    // Add the entry to the parent unless we are creating the entry holding the collection
    if (addToParent) {
      getParent().putBeanTreeEntry(key, bean);
    }

    // Return created bean (i.e. the next parent) so properties and children can be added
    return bean;
  }

  // Build the child bean from the model value
  // The key may be the pluralized key and not match key in model value
  private void buildChild(String key, Map<String, Object> value, BeanChildDef beanChildDef) {
    // Check for Machine as these need a type discriminator plus the Machine
    // and the UnixMachine map into a single Machines collection...
    if (BeanTree.isMachineType(beanChildDef)) {
      buildMachines(MACHINE, value);
      return;
    }

    BeanTreeEntry bean = getOrCreateBean(key, beanChildDef.isCollection(), beanChildDef);
    if (beanChildDef.isCollection()) {
      buildChildCollection(bean, value, beanChildDef);
    } else if (beanChildDef.isCollapsedInWDT()) {
      LOGGER.finest("BeanTreeBuilder expanding child: " + key);

      // Get the childDef child type which is needed to expand the path properly
      // Fixup - Check for same keys and that missing child is a collection
      BeanChildDef missingChildDef = beanChildDef.getChildTypeDef().getChildDef(new Path(key));
      if ((missingChildDef == null) || !missingChildDef.isCollection()) {
        throw failedRequestException(LocalizedConstants.WDT_INVALID_CHILD, key);
      }

      // Create or add the missing child bean thus exapanding per the online bean tree path
      BeanTreeEntry missingChildBean =
        getOrCreateBean(key, missingChildDef.isCollection(), missingChildDef, bean);

      // Continue with the child collecton using the created collection bean, the value and proper type
      buildChildCollection(missingChildBean, value, missingChildDef);
    } else {
      buildChildInstance(bean, value, beanChildDef);
    }
  }

  // Build the collection and add each instance into the collection
  private void buildChildCollection(
    BeanTreeEntry parent,
    Map<String, Object> value,
    BeanChildDef beanChildDef
  ) {
    if ((value != null) && !value.isEmpty()) {
      // For each entry in the collection build the bean and add to the parent
      for (String key : value.keySet()) {

        // Check if the WDT delete operation is used and skip add when applied...
        if (deleteBeanApplied(key, parent)) {
          continue;
        }

        // Get or add the instance into the collection
        BeanTreeEntry bean = getOrCreateBean(key, false, beanChildDef, parent);

        // Now build the instance from the model value
        buildChildInstance(bean, getMapValueFromKey(key, value), beanChildDef);
      }
    }
  }

  // Build the security provider bean from the model where the model value
  // contains the properties for the specific type of security provider
  private void buildSecurityProvider(String key, Map<String, Object> value) {
    // Get the provider name to use for the bean instance
    String providerName = getParent().getKey();
    if (isSingleton()) {
      // For a singleton the current model value is the name!
      providerName = key;

      // Also ensure the type is present as well as the name...
      if (value.keySet().size() != 1) {
        throw failedRequestException(LocalizedConstants.WDT_INVALID_SECURITY_PROVIDER_TYPE, key);
      }

      // Now shift to the type and the value specified in the model
      // such that the remainging logic is uniform with a collection
      key = value.keySet().iterator().next();
      value = getMapValueFromKey(key, value);
    }

    // Place the name property of the security provider into the bean
    BeanPropertyDef namePropDef = getBeanTypeDef().getPropertyDef(new Path("Name"));
    String nameProp = namePropDef.getPropertyName();
    createOrUpdateProperty(nameProp, providerName, namePropDef);

    // Attempt to match the model key against the legal values for the provider type
    String type = null;
    List<String> subTypes = getBeanTypeDef().getSubTypeDiscriminatorLegalValues();
    for (String subType : subTypes) {
      String subTypeName = StringUtils.getLeafClassName(subType);
      if (key.equals(subTypeName) || key.equals(subType)) {
        type = subType;
        break;
      }
    }

    // IFF the type does not match the legal values then skip this security provider
    if (type == null) {
      throw failedRequestException(LocalizedConstants.WDT_INVALID_SECURITY_PROVIDER_TYPE, key);
    }

    // Place the type property of the security provider into the bean
    // On merge, IFF the type exists and does not match then skip this security provider
    BeanPropertyDef typePropDef = getBeanTypeDef().getSubTypeDiscriminatorPropertyDef();
    String typeProp = typePropDef.getPropertyName();
    if (getParent().getKeySet().contains(typeProp)) {
      Object curType = getParent().getBeanTreeEntry(typeProp).getPropertyValue();
      if (!type.equals(curType.toString())) {
        throw failedRequestException(LocalizedConstants.WDT_INVALID_SECURITY_PROVIDER_TYPE, key);
      }
    }
    createOrUpdateProperty(typeProp, type, typePropDef);

    // Get the security provider type and show the current state of the
    // proivider for the specified log level to avoiding Map dump overhead...
    BeanTypeDef subTypeDef = getBeanTypeDef().getSubTypeDef(type);
    if (LOGGER.isLoggable(Level.FINEST)) {
      LOGGER.finest("BeanTreeBuilder buildSecurityProvider: " + getParent());
      LOGGER.finest("BeanTreeBuilder buildSecurityProvider SubType: " + subTypeDef);
    }

    // Create a builder for the security provider type
    // Use the current bean and the value supplied but change
    // to the specific provider type to continue building...
    BeanTreeBuilder builder =
      new BeanTreeBuilder(
        getBeanTree(),               // The bean tree being constructed
        getParent(),                 // The bean where properties/children are added
        value,                       // The bean property value(s)
        getIdentity(),               // The identity of the bean being built
        subTypeDef,                  // The bean type definition
        localizer                    // The message localizer
      );

    // Flag that the security provider type has been processed
    builder.setSecurityProviderTypeApplied();

    // Build the entry for the security provider...
    builder.setWDTDeleteApplied(isWDTDeleteApplied);
    builder.buildSubTree();
  }

  // Build the UnixMachine or Machine instances from the model and place each
  // instance into the collection of Machines to get the proper mapping...
  private void buildMachines(String type, Map<String, Object> value) {
    LOGGER.finest("BeanTreeBuilder building Machines for: " + type);

    // Get the Machines child def to use for the collection
    BeanChildDef beanChildDef = getBeanTypeDef().getChildDef(new Path(MACHINES));
    if (beanChildDef == null) {
      throw failedRequestException(LocalizedConstants.NO_MACHINES_DEF, type);
    }

    // Get the Machines collection or create one when not available...
    BeanTreeEntry machines = getOrCreateBean(MACHINES, beanChildDef.isCollection(), beanChildDef);

    // Create each Machine or UnixMachine instance including the type property
    if ((value != null) && !value.isEmpty()) {
      for (String machineName : value.keySet()) {
        // Check if the WDT delete operation is used for the machine
        if (deleteBeanApplied(machineName, machines)) {
          continue;
        }
        BeanTreeEntry bean = getOrCreateBean(machineName, false, beanChildDef, machines);

        // Place the type property into the bean so it can be viewed properly...
        BeanPropertyDef typePropDef = beanChildDef.getChildTypeDef().getSubTypeDiscriminatorPropertyDef();
        String typeProp = typePropDef.getPropertyName();
        createOrUpdateProperty(typeProp, type, typePropDef, bean);

        // Obtain the proper type def and get the Map of attribute values...
        BeanTypeDef typeDef = beanChildDef.getChildTypeDef().getSubTypeDef(type);
        Map<String, Object> machineValue = getMapValueFromKey(machineName, value);

        // Create a builder for the Machine bases on the supplied type...
        BeanTreeBuilder builder =
          new BeanTreeBuilder(
            getBeanTree(),              // The bean tree being constructed
            bean,                       // The bean where properties/children are added
            machineValue,               // The bean property value(s)
            bean.getBeanTreePath(),     // The identity of the bean being built
            typeDef,                    // The bean type definition
            localizer                   // The message localizer
          );

        // Build the entry for the Machine or UnixMachine...
        builder.setWDTDeleteApplied(isWDTDeleteApplied);
        builder.buildSubTree();
      }
    }
  }

  // Build the child bean instance
  private void buildChildInstance(
    BeanTreeEntry parent,
    Map<String, Object> value,
    BeanChildDef childDef
  ) {
    // Create the builder for the bean instance
    BeanTreeBuilder builder =
      new BeanTreeBuilder(
        getBeanTree(),               // The bean tree being constructed
        parent,                      // The bean where properties/children are added
        value,                       // The bean property value(s)
        parent.getBeanTreePath(),    // The identity of the bean being built
        childDef.getChildTypeDef(),  // The bean type definition
        localizer                    // The message localizer
      );

    // Build the entry for the bean instance along with any children
    builder.setWDTDeleteApplied(isWDTDeleteApplied);
    builder.buildSubTree();
  }

  // Introspect the value and add to the tree as property or bean
  private void addTree(String key, Object value) {
    boolean isMap = value instanceof Map;
    LOGGER.finest("BeanTreeBuilder addTree: " + key + "=" + (isMap ? "MAP" : value));

    // Check for security provider type collection as these require special handling...
    if (isSecurityProviderBaseType()) {
      buildSecurityProvider(key, getMapFromValue(value, key));
      return;
    }

    // Check the type of key in order to create a bean entry from the value
    BeanPropertyDef propDef = getBeanTypeDef().getPropertyDefFromOfflineName(key);
    if (propDef != null) {
      createOrUpdateProperty(propDef.getPropertyName(), value, propDef);
    } else {
      BeanChildDef childDef = getBeanTypeDef().getChildDefFromOfflineName(key);
      if (childDef != null) {
        String name = childDef.getChildName();
        buildChild(name, getMapFromValue(value, name), childDef);
      } else {
        // The UnixMachine is offline schema and listed under Machines for online!
        if (isUnixMachineType(key)) {
          buildMachines(UNIX_MACHINE, getMapFromValue(value, key));
          return;
        }
        Path beanPath = getIdentity().getPath().childPath(key);
        if (isMap) {
          // It's a child
          if (isKnownButNotSupported(key)) {
            // It's a known but unsupported child, e.g. topology -> NMProperties.
            // Do a silent pass through.
            addUnknownProperty(beanPath.getDotSeparatedPath());
          } else {
            // It's an unknown child, e.g. topology -> foo
            throw failedRequestException(LocalizedConstants.WDT_INVALID_CHILD, key);
          }
        } else {
          // It's a property value.
          // WDTBeanRepoDef already exposes mbean properties that aren't
          // supported by the WLS REST api so that WDT can pass them through.
          // Therefore, either this is a property that was added in a PSU
          // that the remote console hasn't caught up to yet, or it's
          // a bogus property name.  Assume the latter.
          throw failedRequestException(LocalizedConstants.WDT_INVALID_PROPERTY, key);
        }
      }
    }
  }

  // Determine if the value is known but not supported
  private boolean isKnownButNotSupported(String key) {
    if (currentModelSection != null) {
      return WDTModelSchema.SUPPORTED_SECTION_CONTENTS.get(currentModelSection).contains(key);
    }
    return false;
  }

  // Add to the unknown properties per model section which will be used when model is persisted
  private void addUnknownProperty(String propertyPath) {
    LOGGER.finest("BeanTreeBuilder addUnknownProperty: " + propertyPath);
    if ((currentModelSection != null) && (propertyPath != null) && propertyPath.startsWith(DOMAIN_PREFIX)) {
      Map<String, Set<String>> unknownProperties = getUnknownProperties();
      if (!unknownProperties.containsKey(currentModelSection)) {
        unknownProperties.put(currentModelSection, new LinkedHashSet<String>());
      }
      String unknownProperty = propertyPath.substring(DOMAIN_PREFIX_LEN);
      unknownProperties.get(currentModelSection).add(unknownProperty);
    }
  }

  // Determine if the current key is for UnixMachine
  private boolean isUnixMachineType(String key) {
    return (UNIX_MACHINE.equals(key) && DOMAIN_MBEAN_TYPE.equals(getBeanTypeDef().getTypeName()));
  }

  // Determine if the current type is that of a security provider
  private boolean isSecurityProviderBaseType() {
    boolean result = false;
    if (getBeanTypeDef().isTypeDef(getSecurityProviderBeanTypeDef())) {
      // IFF the security provider has not already had the type
      // processed then flag that special handling is required!
      if (!isSecurityProviderTypeApplied()) {
        result = true;
      }
    }
    return result;
  }

  // Determine if the security provider is a singleton (i.e. not a collection)
  private boolean isSingleton() {
    // Realm can have a singleton for the ProviderMBean (e.g. Adjudicator)
    return !getParent().getBeanChildDef().isCollection();
  }

  // Check and get the Map value for the specified key
  // Generates and throws an exception when value is not a Map...
  @SuppressWarnings("unchecked")
  private Map<String, Object> getMapValueFromKey(String key, Map<String, Object> value) {
    Object result = value.get(key);
    if ((result != null) && !(result instanceof Map)) {
      throw failedRequestException(LocalizedConstants.KEY_VALUE_NOT_MAP, key);
    }
    return (Map<String, Object>)result;
  }

  // Check and get the Map from the specified Object value
  // Generates and throws an exception when value is not a Map...
  @SuppressWarnings("unchecked")
  private Map<String, Object> getMapFromValue(Object value, String key) {
    if ((value != null) && !(value instanceof Map)) {
      throw failedRequestException(LocalizedConstants.VALUE_NOT_MAP, key);
    }
    return (Map<String, Object>)value;
  }

  // Merge two reference arrays by normalizing them using the reference
  // resolver to parse and get the keys from the property values...
  // NOTE: There is an intermediate step of setting the property to the new
  // value so the reference keys can be obtained, the new value remains as
  // the property value if the exisiting and new values cannot be merged!
  private void mergeReferenceArray(BeanTreeEntry currentProperty, Object value, boolean isRefAsRefs) {
    // Get the list of reference keys for both the current and new property values
    List<String> currentKeys = BeanTreeReferenceResolver.getReferenceKeys(currentProperty);
    currentProperty.setPropertyValue(value);
    List<String> newKeys = BeanTreeReferenceResolver.getReferenceKeys(currentProperty);

    // Check and handle delete operator for the reference list...
    boolean removedKeys = false;
    if (isWDTDeleteApplied() && !newKeys.isEmpty()) {
      Set<String> removes = new LinkedHashSet<>();
      newKeys.stream()
        .filter(key -> (key != null) ? key.startsWith(DELETE_OPER) : false)
          .forEach(key -> removes.add(key));
      if (!removes.isEmpty()) {
        LOGGER.finest("BeanTreeBuilder remove merge reference keys: " + removes);
        removes.forEach(key -> {
          newKeys.remove(key);
          currentKeys.remove(key.substring(DELETE_OPER_LEN));
        });
        removedKeys = true;
      }
    }

    // Create a merged list and set the property value to the new list of keys...
    if (!currentKeys.isEmpty() || !newKeys.isEmpty() || removedKeys) {
      List<String> mergedKeys = new ArrayList<>();
      mergedKeys.addAll(currentKeys);
      mergedKeys.addAll(newKeys);
      if (mergedKeys.isEmpty()) {
        currentProperty.setPropertyValue(null);
      } else {
        currentProperty.setPropertyValue(mergedKeys);
        // Last reference remains for isReferenceAsReferences
        if (isRefAsRefs && (mergedKeys.size() > 1)) {
          String last = mergedKeys.get(mergedKeys.size() - 1);
          mergedKeys.clear();
          mergedKeys.add(last);
        }
      }
    }
  }

  // Merge two arrays by normalizing them using the Value types since an
  // array type will return an empty list if there is no current value...
  // NOTE: There is an intermediate step of setting the property to the new
  // value so the Value type can be obtained, the new value remains as
  // the property value if the exisiting and new values cannot be merged!
  @SuppressWarnings("unchecked")
  private void mergeArrayProperty(
    BeanTreeEntry currentProperty, Object value, BeanPropertyDef beanPropDef
  ) {
    // Get the Value type for both the current and new property values
    Value currentValue = WDTValueConverter.getValueType(currentProperty, beanPropDef, localizer);
    currentProperty.setPropertyValue(value);
    Value newValue = WDTValueConverter.getValueType(currentProperty, beanPropDef, localizer);

    // Check and handle delete operator for an array of strings...
    if (isWDTDeleteApplied() && beanPropDef.isString()
        && newValue.isArray() && !newValue.asArray().getValues().isEmpty()) {
      mergeDeleteStringArray(currentProperty, beanPropDef, currentValue, newValue);
      return;
    }

    // Proceed with merge when both are array values as there could be a model token...
    if (currentValue.isArray() && newValue.isArray()) {
      Object curVal = WDTValueConverter.getJavaType(currentValue, beanPropDef, localizer);
      Object newVal = WDTValueConverter.getJavaType(newValue, beanPropDef, localizer);
      if ((curVal instanceof List) && (newVal instanceof List)) {
        List<Object> mergedList = (List<Object>) curVal;
        mergedList.addAll((List<Object>) newVal);
        currentProperty.setPropertyValue(mergedList);
      }
    }
  }

  // Handle the merged of a String array that may contain an entry with a delete operator
  // The current property will be updated with no additional handling required...
  @SuppressWarnings("unchecked")
  private void mergeDeleteStringArray(
    BeanTreeEntry currentProperty, BeanPropertyDef beanPropDef, Value currentValue, Value newValue
  ) {
    LOGGER.finest("BeanTreeBuilder merge string array entries with delete");

    // If delete operator is used without previous being an array then use the new value
    if (!currentValue.isArray()) {
      removeDeleteFromStringArray(currentProperty, beanPropDef);
      return;
    }

    // At this point we have a current and new array of Strings, so merge them checking for delete!
    Object newVal = WDTValueConverter.getJavaType(newValue, beanPropDef, localizer);
    if (newVal instanceof List) {
      List<String> newValues = (List<String>) newVal;

      // Find any delete operator entries...
      Set<String> removes = new LinkedHashSet<>();
      newValues.stream()
        .filter(val -> (val != null) ? val.startsWith(DELETE_OPER) : false)
          .forEach(val -> removes.add(val));

      // Get the current value and update the entries as needed...
      Object curVal = WDTValueConverter.getJavaType(currentValue, beanPropDef, localizer);
      if (curVal instanceof List) {
        List<String> curValues = (List<String>) curVal;

        // Check and apply the delete operator entries...
        if (!removes.isEmpty()) {
          LOGGER.finest("BeanTreeBuilder remove merge array entries: " + removes);
          removes.forEach(key -> {
            newValues.remove(key);
            curValues.remove(key.substring(DELETE_OPER_LEN));
          });
        }

        // Create a merged list and set the property value to the new list of strings...
        List<String> mergedList = new ArrayList<>();
        mergedList.addAll(curValues);
        mergedList.addAll(newValues);
        currentProperty.setPropertyValue(mergedList);
      }
    }
  }

  // Merge two Properties by normalizing them using the Value types...
  // NOTE: There is an intermediate step of setting the property to the new
  // value so the Value type can be obtained, the new value remains as
  // the property value if the exisiting and new values cannot be merged!
  @SuppressWarnings("unchecked")
  private void mergePropertiesProperty(
    BeanTreeEntry currentProperty, Object value, BeanPropertyDef beanPropDef
  ) {
    // Keep the existing properties when there is no new value...
    if (value == null) {
      return;
    }

    // Get the Value type for both the current and new property values
    Value currentValue = WDTValueConverter.getValueType(currentProperty, beanPropDef, localizer);
    currentProperty.setPropertyValue(value);
    Value newValue = WDTValueConverter.getValueType(currentProperty, beanPropDef, localizer);

    // Check and handle delete operator for the Properties keys...
    if (isWDTDeleteApplied() && (newValue != null) && newValue.isProperties()) {
      Set<String> removes = new LinkedHashSet<>();
      newValue.asProperties().getValue().stringPropertyNames().stream()
        .filter(key -> (key != null) ? key.startsWith(DELETE_OPER) : false)
          .forEach(key -> removes.add(key));

      // If delete operator is used without previous value then use the new properties
      if (!removes.isEmpty() && ((currentValue == null) || !currentValue.isProperties())) {
        removeDeleteFromProperties(currentProperty, beanPropDef);
        return;
      }

      // If delete operator is used then update the Properties value
      if (!removes.isEmpty() && (currentValue != null) && currentValue.isProperties()) {
        LOGGER.finest("BeanTreeBuilder remove merge property keys: " + removes);
        Properties curVal = currentValue.asProperties().getValue();
        Properties newVal = newValue.asProperties().getValue();
        removes.forEach(key -> {
          newVal.remove(key);
          curVal.remove(key.substring(DELETE_OPER_LEN));
        });
      }
    }

    // Proceed with merge when both are Properties as there could be a parse problem...
    if ((currentValue != null) && currentValue.isProperties()
        && (newValue != null) && newValue.isProperties()) {
      Object curVal = WDTValueConverter.getJavaType(currentValue, beanPropDef, localizer);
      curVal = (curVal != null) ? curVal : new LinkedHashMap<String, Object>();
      Object newVal = WDTValueConverter.getJavaType(newValue, beanPropDef, localizer);
      newVal = (newVal != null) ? newVal : new LinkedHashMap<String, Object>();
      if ((curVal instanceof Map) && (newVal instanceof Map)) {
        // Sort the Properties keys for predictable updated results...
        Map<String, Object> sorter = new TreeMap<>();
        Map<String, Object> mergedMap = new LinkedHashMap<>();
        ((Map<String, Object>)curVal).forEach((key, val) -> sorter.put(key, val));
        ((Map<String, Object>)newVal).forEach((key, val) -> sorter.put(key, val));
        sorter.forEach((key, val) -> mergedMap.put(key, val));
        if (mergedMap.isEmpty()) {
          currentProperty.setPropertyValue(null);
        } else {
          currentProperty.setPropertyValue(mergedMap);
        }
      }
    }
  }

  // Determine if the WDT delete operator is being applied
  // IFF delete, attempt to remove the instance from the parent
  // Return true when applied and delete operator is specified
  private boolean deleteBeanApplied(String key, BeanTreeEntry parent) {
    // WDT delete operator must be enabled on the builder...
    if (isWDTDeleteApplied() && key.startsWith(DELETE_OPER)) {
      String deleteKey = key.substring(DELETE_OPER_LEN);
      LOGGER.finest("BeanTreeBuilder attempting to delete instance: " + deleteKey);
      parent.getBeanValue().remove(deleteKey);
      return true;
    }
    // Otherwise not applied...
    return false;
  }

  // Check a bean property value for use of delete operator and update as needed
  // A Reference, Proeprties or Array type bean prop can have delete entries removed
  private void checkPropertyValueForDelete(BeanTreeEntry currentProperty, BeanPropertyDef beanPropDef) {
    if (isWDTDeleteApplied()) {
      if (beanPropDef.isProperties()) {
        removeDeleteFromProperties(currentProperty, beanPropDef);
      } else if (beanPropDef.isReference() && beanPropDef.isArray()) {
        removeDeleteFromReferenceArray(currentProperty, beanPropDef);
      } else if (beanPropDef.isArray() && beanPropDef.isString()) {
        removeDeleteFromStringArray(currentProperty, beanPropDef);
      }
    }
  }

  // Check and update a Reference key(s) for use of WDT delete operator
  private void removeDeleteFromReferenceArray(BeanTreeEntry currentProperty, BeanPropertyDef beanPropDef) {
    List<String> currentKeys = BeanTreeReferenceResolver.getReferenceKeys(currentProperty);
    if (!currentKeys.isEmpty()) {
      Set<String> removes = new LinkedHashSet<>();
      currentKeys.stream()
        .filter(key -> (key != null) ? key.startsWith(DELETE_OPER) : false)
          .forEach(key -> removes.add(key));
      if (!removes.isEmpty()) {
        LOGGER.finest("BeanTreeBuilder remove reference keys: " + removes);
        removes.forEach(key -> currentKeys.remove(key));
        if (currentKeys.isEmpty()) {
          currentProperty.setPropertyValue(null);
        } else {
          List<Object> updatedKeys = new ArrayList<>();
          updatedKeys.addAll(currentKeys);
          currentProperty.setPropertyValue(updatedKeys);
        }
      }
    }
  }

  // Check and update a Properties keys for use of WDT delete operator
  @SuppressWarnings("unchecked")
  private void removeDeleteFromProperties(BeanTreeEntry currentProperty, BeanPropertyDef beanPropDef) {
    Value currentValue = WDTValueConverter.getValueType(currentProperty, beanPropDef, localizer);
    if ((currentValue != null) && currentValue.isProperties()) {
      Object curVal = WDTValueConverter.getJavaType(currentValue, beanPropDef, localizer);
      if (curVal instanceof Map) {
        // Find the delete entries and if any are present remove them...
        Set<String> removes = new LinkedHashSet<>();
        Map<String, Object> properties = ((Map<String, Object>)curVal);
        properties.entrySet().stream()
          .filter(entry -> entry.getKey().startsWith(DELETE_OPER))
            .forEach(entry -> removes.add(entry.getKey()));
        if (!removes.isEmpty()) {
          LOGGER.finest("BeanTreeBuilder remove property keys: " + removes);
          removes.forEach(key -> properties.remove(key));
          if (properties.isEmpty()) {
            currentProperty.setPropertyValue(null);
          } else {
            currentProperty.setPropertyValue(properties);
          }
        }
      }
    }
  }

  // Check and update the String array entries for use of WDT delete operator
  @SuppressWarnings("unchecked")
  private void removeDeleteFromStringArray(BeanTreeEntry currentProperty, BeanPropertyDef beanPropDef) {
    Value currentValue = WDTValueConverter.getValueType(currentProperty, beanPropDef, localizer);
    if (currentValue.isArray()) {
      Object curVal = WDTValueConverter.getJavaType(currentValue, beanPropDef, localizer);
      if ((curVal instanceof List)) {
        // Find the delete entries and if any are present remove them...
        Set<String> removes = new LinkedHashSet<>();
        List<String> updatedList = (List<String>) curVal;
        updatedList.stream()
          .filter(val -> (val != null) ? val.startsWith(DELETE_OPER) : false)
            .forEach(val -> removes.add(val));
        if (!removes.isEmpty()) {
          LOGGER.finest("BeanTreeBuilder remove array entries: " + removes);
          removes.forEach(key -> updatedList.remove(key));
          currentProperty.setPropertyValue(updatedList);
        }
      }
    }
  }

  private FailedRequestException failedRequestException(LocalizableString errorMessage, Object... args) {
    LOGGER.fine(errorMessage.getEnglishText(args));
    return new FailedRequestException(localizer.localizeString(errorMessage, args));
  }
}
