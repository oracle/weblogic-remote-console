// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo.weblogic;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;

import weblogic.remoteconsole.common.repodef.BeanChildDef;
import weblogic.remoteconsole.common.repodef.BeanPropertyDef;
import weblogic.remoteconsole.common.repodef.BeanTypeDef;
import weblogic.remoteconsole.common.utils.Path;
import weblogic.remoteconsole.server.repo.BeanRepo;
import weblogic.remoteconsole.server.repo.BeanTreePath;

/**
 * BeanTree maintains the in memory bean tree created from a WDT model.
 * <p>
 * The BeanTree APIs support CRUD operations on the tree and support the ability
 * to persist the current state of the brean tree in memory to a WDT model.
 * <p>
 */
public class BeanTree {
  private static final Logger LOGGER = Logger.getLogger(BeanTree.class.getName());

  private static final String MACHINE_MBEAN_TYPE = "MachineMBean";

  // The Domain relative path used to obtain the Secure mode and Production mode property values
  private static final Path PRODUCTION_MODE_PATH = new Path("ProductionModeEnabled");
  private static final Path SECURE_MODE_PATH = new Path("SecurityConfiguration.SecureMode.SecureModeEnabled");

  // The root of the bean tree
  private Map<String, BeanTreeEntry> beanTree;

  // The bean repo for the bean tree
  private BeanRepo beanRepo;

  // The BeanTypeDef used to identify Security Provider MBeans
  private BeanTypeDef securityProviderTypeDef;

  // The ordered list of models that are used to create the bean tree
  private List<Map<String, Object>> wdtModels;

  // The list of references from the model that are being resolved
  private List<BeanTreeEntry> references;

  // The list of entries that are bean collections (i.e. contain instances)
  private List<BeanTreeEntry> beanCollections;

  // The key used to obtain the Domain bean tree entry
  private String domainKeyName;

  // The list of unknown properties by model section
  private Map<String, Set<String>> unknownProperties;

  private Map<String, BeanTreeEntry> getTree() {
    return beanTree;
  }

  private BeanRepo getBeanRepo() {
    return beanRepo;
  }

  public BeanTypeDef getSecurityProviderTypeDef() {
    return securityProviderTypeDef;
  }

  // Last model used to create the bean tree
  public Map<String, Object> getWDTModel() {
    int index = wdtModels.size() - 1;
    return (index > -1) ? wdtModels.get(index) : null;
  }

  // Ordered list of models used to create the bean tree
  public List<Map<String, Object>> getWDTModels() {
    return wdtModels;
  }

  // Add to the ordered list of models used to create the bean tree
  void addWDTModel(Map<String, Object> wdtModel) {
    wdtModels.add(wdtModel);
  }

  public Map<String, Set<String>> getUnknownProperties() {
    return unknownProperties;
  }

  // Create the Domain root of the bean tree for holding the model sections
  BeanTree(
    Map<String, Object> wdtModel,
    BeanRepo beanRepo,
    BeanChildDef domainChildDef
  ) {
    // Keep model related data
    this.beanRepo = beanRepo;

    // Create and initialze the list of models used for the bean tree
    wdtModels = new LinkedList<>();
    addWDTModel(wdtModel);

    // Create lists that will hold references and bean collections
    references = new LinkedList<>();
    beanCollections = new LinkedList<>();

    // Create the Map used for unknown properties
    unknownProperties = new LinkedHashMap<>();

    // Create the identity for the Domain
    Path path = new Path(domainChildDef.getChildName());
    BeanTreePath domainIdentity = BeanTreePath.create(beanRepo, path);

    // Create the bean tree Domain entry
    BeanTreeEntry domain =
      newBeanEntry(
        domainChildDef.getChildName(),  // Domain key
        domainIdentity,                 // Domain's BeanTreePath
        false,                          // Domain bean is an instance
        domainChildDef                  // Domain definition (contains type)
      );

    // Create the root of the bean tree and add the Domain
    domainKeyName = domain.getKey();
    beanTree = new LinkedHashMap<String, BeanTreeEntry>();
    beanTree.put(domainKeyName, domain);

    // Setup the security provider type used for determining a provider bean type
    securityProviderTypeDef = beanRepo.getBeanRepoDef().getTypeDef("ProviderMBean");
  }

  // Create a property with the specified values
  private BeanTreeEntry newPropertyEntry(
    String key,
    Object value,
    BeanTreePath identity,
    BeanPropertyDef beanPropDef
  ) {
    return new BeanTreeEntry(key, value, identity, beanPropDef);
  }

  // Create a bean with the specified values
  private BeanTreeEntry newBeanEntry(
    String key,
    BeanTreePath identity,
    boolean isCollection,
    BeanChildDef beanChildDef
  ) {
    // Create the Map used for the bean attribute values (i.e. settings)
    Map<String, BeanTreeEntry> map = new LinkedHashMap<>();

    // Return the new entry
    return new BeanTreeEntry(key, map, identity, isCollection, beanChildDef);
  }

  // Create a property and add a reference to the list of bean tree references
  public BeanTreeEntry createProperty(
    String key,
    Object value,
    BeanTreePath identity,
    BeanPropertyDef beanPropDef
  ) {
    // Create the entry for the property
    BeanTreeEntry result = newPropertyEntry(key, value, identity, beanPropDef);

    // Update the list of references to be resolved
    if (isReference(beanPropDef)) {
      references.add(result);
    }

    // Return the property
    return result;
  }

  // Add the property value specified to the bean and clear the transient flag.
  // The property should be an attribute of the specified bean and not a property path!
  public boolean addProperty(BeanTreeEntry parent, BeanPropertyDef propertyDef, Object propertyValue) {
    boolean added = false;

    // Create the entry for the property
    String propertyName = propertyDef.getPropertyName();
    BeanTreePath identity = parent.getBeanTreePath();
    BeanTreeEntry property = createProperty(propertyName, propertyValue, identity, propertyDef);

    // Add the entry to the parent
    if (parent.putBeanTreeEntry(propertyName, property)) {
      // Clear any transient flag on the parent and indicate success
      clearTransientParent(parent);
      added = true;
    }

    // Return if property was added...
    return added;
  }

  // Update the property value specified on the bean.
  // The property should be an attribute of the specified bean and not a property path!
  public boolean updateProperty(BeanTreeEntry parent, BeanTreeEntry property, Object newPropertyValue) {
    boolean updated = false;

    // Update the property value on the property instance
    if (property.setPropertyValue(newPropertyValue)) {
      updated = true;
    }

    // IFF updated and we have a reference, mark value to be resolved...
    if (updated && isReference(property)) {
      property.clearReference();
    }

    // Return if property was updated...
    return updated;
  }

  // Remove the property specified from the bean and update the list of references.
  // The property should be an attribute of the specified bean and not a property path!
  public boolean removeProperty(BeanTreeEntry parent, BeanTreeEntry property) {
    boolean removed = false;

    // Remove the property from the bean
    Map<String, BeanTreeEntry> beanValue = parent.getBeanValue();
    if (beanValue.remove(property.getKey()) != null) {
      removed = true;
    }

    // Update the list of references to be resolved
    if (removed && isReference(property)) {
      references.remove(property);
    }

    // Check/Set if the parent should now be transient
    if (removed) {
      setTransientParent(parent);
    }

    // Return if property was removed...
    return removed;
  }

  // Create a bean by computing the new bean identity from the parent
  // For collections, add to the list of known bean tree collections
  public BeanTreeEntry createBean(
    String key,
    BeanTreePath parentIdentity,
    boolean isCollection,
    BeanChildDef beanChildDef
  ) {
    // Create the identity for the bean
    Path beanPath = parentIdentity.getPath().childPath(key);
    BeanTreePath beanIdentity = BeanTreePath.create(getBeanRepo(), beanPath);

    // Create the entry for the bean
    BeanTreeEntry result = newBeanEntry(key, beanIdentity, isCollection, beanChildDef);

    // Update the list of bean collections used for reference resolution
    if (isCollection) {
      beanCollections.add(result);
    }

    // Return the bean
    return result;
  }

  // Add the bean to the specified parent and clear the transient flag
  // then fill in the singletons and collections for the new bean.
  public boolean addBean(BeanTreeEntry parent, BeanChildDef beanChildDef, String key) {
    boolean added = false;

    // Create the entry for the bean
    BeanTreeEntry bean = createBean(key, parent.getBeanTreePath(), false, beanChildDef);

    // Add the entry to the parent
    if (parent.putBeanTreeEntry(key, bean)) {
      // Clear any transient flag on the parent and indicate success
      clearTransientParent(parent);
      added = true;
    }

    // Update the bean with all required singletons and collections...
    if (added) {
      updateBeanTreeEntry(bean, beanChildDef.getChildTypeDef());
      LOGGER.finest("BeanTree added: " + bean.getPath());

      // Address any unresolved references to the bean...
      if (beanChildDef.isCollection()) {
        LOGGER.fine("BeanTree handle references for added bean!");
        resolveReferences();
      }
    }

    // Return if bean was added...
    return added;
  }

  // Remove the bean from the specified parent and cleanup the
  // contained beans and references from now deleted bean.
  public boolean removeBean(BeanTreeEntry parent, BeanTreeEntry bean) {
    boolean removed = false;

    // Remove the bean from the parent
    Map<String, BeanTreeEntry> beanValue = parent.getBeanValue();
    if (beanValue.remove(bean.getKey()) != null) {
      removed = true;
    }

    // Cleanup the bean and related references when removed...
    if (removed) {
      List<BeanTreePath> removedBeans = new ArrayList<>();
      removeBeanTreeEntry(bean, bean.getBeanChildDef().getChildTypeDef(), removedBeans);
      if (LOGGER.isLoggable(Level.FINEST)) {
        removedBeans.forEach(removedBean -> {
          LOGGER.finest("BeanTree removed: " + removedBean.getPath());
        });
      }

      // Remove references to any of the deleted beans...
      resolveReferencesForDeletedBeans(removedBeans);

      // Check if the collection has become empty and mark transient...
      setTransientParent(parent);
    }

    // Return if bean was removed...
    return removed;
  }

  // Obtain the Domain which is the root of the tree...
  public BeanTreeEntry getDomain() {
    return beanTree.get(domainKeyName);
  }

  // Obtain the Secure mode setting for the Domain...
  public BeanTreeEntry getSecureModeSetting() {
    return getProperty(getDomain(), PRODUCTION_MODE_PATH);
  }

  // Obtain the Production mode setting for the Domain...
  public BeanTreeEntry getProductionModeSetting() {
    return getProperty(getDomain(), SECURE_MODE_PATH);
  }

  // Obtain the bean from the specified bean identity
  public BeanTreeEntry getBeanTreeEntry(BeanTreePath beanTreePath) {
    Path path = beanTreePath.getPath();
    LOGGER.finest("BeanTree getBeanTreeEntry(): " + path);

    // Setup to walk the tree along the path specified...
    List<String> components = path.getComponents();
    Map<String, BeanTreeEntry> tree = getTree();
    BeanTreeEntry entry = null;
    BeanTreeEntry value = null;

    // Step through each component of the path...
    for (int i = 0; i < components.size(); i++) {
      String key = components.get(i);
      entry = tree.get(key);

      // IFF not found, stop and ensure there is no value...
      if (entry == null) {
        value = null;
        break;
      }

      // IFF found a property then error...
      if (entry.isProperty()) {
        throw new AssertionError("Error BeanTree getBeanTreeEntry() found property: " + key);
      }

      // Setup the value and move down the tree...
      value = entry;
      tree = entry.getBeanValue();
    }

    // Return the last value found...
    return value;
  }

  // Obtain the parent bean from the specified bean identity
  public BeanTreeEntry getParentBeanTreeEntry(BeanTreePath beanTreePath) {
    Path parentPath = beanTreePath.getPath().getParent();
    BeanTreePath parentIdentity = BeanTreePath.create(getBeanRepo(), parentPath);
    return getBeanTreeEntry(parentIdentity);
  }

  // Attempt to resolve the entire list of references using the key to that reference
  public void resolveReferences() {
    resolveReferences(true);
  }

  // Attempt to resolve the list of references using the key to that reference,
  // when full resolution is not required, only updated entries will be resolved
  public void resolveReferences(boolean isFullResolve) {
    if (!references.isEmpty()) {
      LOGGER.fine("BeanTree resolve references: " + (isFullResolve ? "All" : "Only updated"));
      BeanTreeReferenceResolver resolver = new BeanTreeReferenceResolver(beanCollections);
      if (isFullResolve) {
        references.forEach(resolver::handleUnresolvedReference);
      } else {
        references.stream()
          .filter(reference -> !reference.containsReference())
            .forEach(resolver::handleUnresolvedReference);
      }
    }
  }

  // Attempt to resolve references for beans that have been deleted
  // IFF a reference value becomes NULL then remove (i.e. unset) the
  // reference property from the model...
  public void resolveReferencesForDeletedBeans(List<BeanTreePath> deletedBeans) {
    if (!references.isEmpty() && !deletedBeans.isEmpty()) {
      LOGGER.fine("BeanTree resolve references for deleted beans!");

      // Update the reference based on the deleted beans and collect the list of
      // references that have become NULL as a result of the delete...
      List<BeanTreeEntry> nullRefs = new ArrayList<>();
      BeanTreeReferenceResolver resolver = new BeanTreeReferenceResolver(beanCollections, deletedBeans);
      references.stream().filter(resolver::handleDeleteBean).forEach(nullRefs::add);

      // Now remove all the reference properties that became NULL...
      nullRefs.forEach(prop -> removeProperty(getBeanTreeEntry(prop.getBeanTreePath()), prop));
    }
  }

  // Complete the bean tree with mandatory singletons and collections
  public void completeRequiredBeanTreeEntries() {
    LOGGER.fine("BeanTree update mandatory singletons and collections");
    BeanTreeEntry domain = getDomain();
    BeanTypeDef domainTypeDef = domain.getBeanChildDef().getChildTypeDef();
    updateBeanTreeEntry(domain, domainTypeDef);
  }

  // Update the bean tree entry with mandatory singletons and collections recursively...
  private void updateBeanTreeEntry(BeanTreeEntry parent, BeanTypeDef parentTypeDef) {
    BeanTreePath parentIdentity = parent.getBeanTreePath();
    List<BeanChildDef> childDefs = parentTypeDef.getChildDefs();

    // Walk each of the child defs for the specified parent bean type and then
    // create and/or update the parent bean tree entry as required...
    for (BeanChildDef childDef : childDefs) {
      // Only look at children that are contained directly on the specified type...
      String childKey = childDef.getChildName();
      if (!childDef.getParentPath().isEmpty() || isChildSkipped(childKey, parentTypeDef)) {
        LOGGER.finest("BeanTree update skipping ChildDef: " + childDef.getChildPath());
        continue;
      }

      // On each child update and/or create the singletons and collections as needed...
      BeanTreeEntry childEntry = parent.getBeanTreeEntry(childKey);
      if (childDef.isMandatorySingleton()) {
        // Check for a singlteton that is required but may not specified in the model (e.g. SecurityConfiguration)...
        if (childEntry == null) {
          // Create the child bean, mark as transient and add to the bean tree...
          childEntry = createBean(childKey, parentIdentity, false, childDef);
          if (!addTransientChild(parent, childKey, childEntry)) {
            // Cannot continue without the singleton...
            return;
          }
          LOGGER.finest("BeanTree added transient Singleton: " + childEntry.getPath());
        }
        // Continue down the tree updating the singleton...
        updateBeanTreeEntry(childEntry, childDef.getChildTypeDef());

      // Otherwise, check for collections specified in the model (e.g. Machines)...
      } else if (childDef.isCollection()) {
        // Create an empty collection when not specified in the model...
        if (childEntry == null) {
          childEntry = createBean(childKey, parentIdentity, true, childDef);
          addTransientChild(parent, childKey, childEntry);
          LOGGER.finest("BeanTree added transient Collection: " + childEntry.getPath());

        // Otherwise continue down the tree updating each instance in the collection that is in the model...
        } else {
          for (String instanceName: childEntry.getKeySet()) {
            BeanTreeEntry beanInstanceEntry = childEntry.getBeanTreeEntry(instanceName);
            BeanChildDef beanInstanceChildDef = beanInstanceEntry.getBeanChildDef();
            updateBeanTreeEntry(beanInstanceEntry, beanInstanceChildDef.getChildTypeDef());
          }
        }
      }
    }
  }

  // Walk through the bean to remove singletons, collections and references recursively...
  // Collections will be removed from the list of collections and references will be
  // removed from the list of references in order to run reference resolution properly.
  private void removeBeanTreeEntry(BeanTreeEntry bean, BeanTypeDef beanTypeDef, List<BeanTreePath> removed) {
    // Add the bean to the list of beans being removed when this is an instance of a collection
    if (bean.getBeanChildDef().isCollection()) {
      removed.add(bean.getBeanTreePath());
    }

    // Walk each of the child defs for the specified parent bean type and
    // then handle the bean tree entries from the parent...
    List<BeanChildDef> childDefs = beanTypeDef.getChildDefs();
    for (BeanChildDef childDef : childDefs) {
      // Only look at children that are contained directly on the specified type...
      String childKey = childDef.getChildName();
      if (!childDef.getParentPath().isEmpty() || isChildSkipped(childKey, beanTypeDef)) {
        LOGGER.finest("BeanTree remove skipping ChildDef: " + childDef.getChildPath());
        continue;
      }

      // Continue down the tree when finding the singletons...
      BeanTreeEntry childEntry = bean.getBeanTreeEntry(childKey);
      if (!childDef.isCollection() && (childEntry != null)) {
        bean.getBeanValue().remove(childKey);
        removeBeanTreeEntry(childEntry, childDef.getChildTypeDef(), removed);
      } else if (childDef.isCollection()) {
        // Or remove each member of the collection and continue down the tree for each member...
        if (!childEntry.getKeySet().isEmpty()) {
          for (String instanceName: childEntry.getKeySet()) {
            BeanTreeEntry beanInstanceEntry = childEntry.getBeanTreeEntry(instanceName);
            BeanChildDef beanInstanceChildDef = beanInstanceEntry.getBeanChildDef();
            removeBeanTreeEntry(beanInstanceEntry, beanInstanceChildDef.getChildTypeDef(), removed);
          }
        }
        // Remove the collection itself and then remove from list of collections...
        bean.getBeanValue().remove(childKey);
        beanCollections.remove(childEntry);
      }
    }

    // Now look at the remaining properties and remove references from the list of references...
    bean.getBeanValue().entrySet().stream().filter(entry -> isReference(entry.getValue()))
      .forEach(entry -> references.remove(entry.getValue()));
  }

  // Clear the transient state of the bean to ensure the update will be pesisted in the model.
  private void clearTransientParent(BeanTreeEntry entry) {
    if (entry.isTransient()) {
      // Clear transiet state and continue with the parent entry...
      entry.clearTransient();
      BeanTreeEntry parent = getParentBeanTreeEntry(entry.getBeanTreePath());
      if (parent != null) {
        clearTransientParent(parent);
      }
    }
  }

  // Determine if the bean is considered transient.
  // A collection should _not_ be persistent when empty.
  // A manditory singleton should _not_ be persisted when
  // there are no settings or when all settings are transient.
  private void setTransientParent(BeanTreeEntry entry) {
    boolean isTransient = false;
    BeanChildDef childDef = entry.getBeanChildDef();

    // Determine if the entry should be transient...
    if (childDef.isMandatorySingleton()) {
      // Singleton is empty or has all transient settings
      isTransient = true;
      for (String key : entry.getKeySet()) {
        if (!entry.getBeanTreeEntry(key).isTransient()) {
          isTransient = false;
          break;
        }
      }
    } else if (childDef.isCollection()) {
      // Collection has no instances
      if (entry.isBeanCollection() && entry.getKeySet().isEmpty()) {
        isTransient = true;
      }
    }

    // Now mark transient when indicated then check the parent...
    if (isTransient) {
      entry.setTransient();
      BeanTreeEntry parent = getParentBeanTreeEntry(entry.getBeanTreePath());
      if (parent != null) {
        setTransientParent(parent);
      }
    }
  }

  // Fixup - How to handle types that are being skipped while updating singletons and collections?
  private static boolean isChildSkipped(String key, BeanTypeDef parentTypeDef) {
    return ("CustomResources".equals(key) && "DomainMBean".equals(parentTypeDef.getTypeName()));
  }

  // Add a child bean to the parent as a transient entry (e.g. not specifed in the model)...
  private static boolean addTransientChild(BeanTreeEntry parent, String childKey, BeanTreeEntry childEntry) {
    childEntry.setTransient();
    if (!parent.putBeanTreeEntry(childKey, childEntry)) {
      // Fixup - log warning or should the build assert a problem?
      LOGGER.warning("BeanTree - Child bean entry NOT added: " + childEntry.getPath());
      return false;
    }
    return true;
  }

  // Check if property is key of the bean instance
  public static boolean isKey(BeanTreePath beanTreePath, BeanPropertyDef propertyDef) {
    return (beanTreePath.isCollectionChild() && propertyDef.isKey() && propertyDef.isString());
  }

  // Check if bean tree entry is a property that is a refernce type
  public static boolean isReference(BeanTreeEntry entry) {
    return (entry.isProperty() && isReference(entry.getBeanPropertyDef()));
  }

  // Check if the property def is a reference with a reference type....
  public static boolean isReference(BeanPropertyDef propertyDef) {
    return (propertyDef.isReference() && (propertyDef.getReferenceTypeDef() != null));
  }

  // Determine if the bean child def is a Machine
  public static boolean isMachineType(BeanChildDef childDef) {
    return (MACHINE_MBEAN_TYPE.equals(childDef.getChildTypeDef().getTypeName()));
  }

  // Get the property specified in the path from the bean tree entry
  public static BeanTreeEntry getProperty(BeanTreeEntry bean, Path propertyPath) {
    LOGGER.finest("BeanTree getProperty() on: " + bean.getPath() + " for " + propertyPath);

    // Look for the property value relative to the bean instance...
    Map<String, BeanTreeEntry> tree = bean.getBeanValue();
    List<String> components = propertyPath.getComponents();
    BeanTreeEntry value = null;
    BeanTreeEntry entry = null;
    int pathEnd = components.size() - 1;
    for (int i = 0; i < components.size(); i++) {
      String key = components.get(i);
      entry = tree.get(key);

      // IFF not found, stop and ensure there is no value...
      if (entry == null) {
        value = null;
        break;
      }

      // IFF the entry found is not property and search path is at the end, then error...
      if (!entry.isProperty() && (i >= pathEnd)) {
        throw new AssertionError("Error BeanTree getProperty() found a bean or collection: " + key);
      }

      // Setup the value and move down the tree as the property may be on a contained bean...
      value = entry;
      tree = entry.getBeanValue();

      // IFF the value found is a property and the search path is not complete, then error...
      if (value.isProperty() && (i < pathEnd)) {
        throw new AssertionError("Error BeanTree getProperty() found an unexpected property: " + key);
      }
    }
    return value;
  }

  @Override
  public String toString() {
    return getTree().toString();
  }
}
