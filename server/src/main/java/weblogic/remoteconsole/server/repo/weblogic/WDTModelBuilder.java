// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo.weblogic;

import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.logging.Logger;

import weblogic.remoteconsole.common.repodef.BeanChildDef;
import weblogic.remoteconsole.common.repodef.BeanPropertyDef;
import weblogic.remoteconsole.common.repodef.BeanTypeDef;
import weblogic.remoteconsole.common.repodef.LocalizedConstants;
import weblogic.remoteconsole.common.repodef.Localizer;
import weblogic.remoteconsole.common.utils.Path;
import weblogic.remoteconsole.common.utils.StringUtils;

/**
 * WDTModelBuilder consumes a BeanTree instance in order to
 * create a WDT model that can be written out using Snake YAML.
 */
public class WDTModelBuilder {
  private static final Logger LOGGER = Logger.getLogger(WDTModelBuilder.class.getName());

  // Security Provider property names
  private static final String PROVIDER_NAME = "Name";
  private static final String PROVIDER_TYPE = "Type";

  // WDT model sections
  private static final String TOPOLOGY = "topology";
  private static final String RESOURCES = "resources";
  private static final String APP_DEPLOYMENTS = "appDeployments";
  private static final List<String> SECTIONS = List.of(TOPOLOGY, RESOURCES, APP_DEPLOYMENTS);
  private static final Set<String> TOPOLOGY_SECTION = new HashSet<>();
  private static final Set<String> RESOURCES_SECTION = new HashSet<>();
  private static final Set<String> APP_DEPLOYMENTS_SECTION = new HashSet<>();
  private static final Set<String> NAVTREE_VALID_PATHS = new HashSet<>();

  static {
    // topology section
    TOPOLOGY_SECTION.add("AdminConsole");
    TOPOLOGY_SECTION.add("CdiContainer");
    TOPOLOGY_SECTION.add("Cluster");
    TOPOLOGY_SECTION.add("EmbeddedLDAP");
    TOPOLOGY_SECTION.add("JMX");
    TOPOLOGY_SECTION.add("JPA");
    TOPOLOGY_SECTION.add("JTA");
    TOPOLOGY_SECTION.add("Log");
    TOPOLOGY_SECTION.add("LogFilter");
    TOPOLOGY_SECTION.add("Machine");
    TOPOLOGY_SECTION.add("MigratableTarget");
    TOPOLOGY_SECTION.add("NMProperties");
    TOPOLOGY_SECTION.add("RestfulManagementServices");
    TOPOLOGY_SECTION.add("Security");
    TOPOLOGY_SECTION.add("SecurityConfiguration");
    TOPOLOGY_SECTION.add("Server");
    TOPOLOGY_SECTION.add("ServerTemplate");
    TOPOLOGY_SECTION.add("UnixMachine");
    TOPOLOGY_SECTION.add("VirtualHost");
    TOPOLOGY_SECTION.add("VirtualTarget");
    TOPOLOGY_SECTION.add("WSReliableDeliveryPolicy");
    TOPOLOGY_SECTION.add("XMLEntityCache");
    TOPOLOGY_SECTION.add("XMLRegistry");

    // resources section
    RESOURCES_SECTION.add("CoherenceClusterSystemResource");
    RESOURCES_SECTION.add("FileStore");
    RESOURCES_SECTION.add("ForeignJNDIProvider");
    RESOURCES_SECTION.add("JDBCStore");
    RESOURCES_SECTION.add("JDBCSystemResource");
    RESOURCES_SECTION.add("JMSBridgeDestination");
    RESOURCES_SECTION.add("JMSServer");
    RESOURCES_SECTION.add("JMSSystemResource");
    RESOURCES_SECTION.add("JoltConnectionPool");
    RESOURCES_SECTION.add("MailSession");
    RESOURCES_SECTION.add("MessagingBridge");
    RESOURCES_SECTION.add("ODLConfiguration");
    RESOURCES_SECTION.add("OHS");
    RESOURCES_SECTION.add("Partition");
    RESOURCES_SECTION.add("PartitionWorkManager");
    RESOURCES_SECTION.add("PathService");
    RESOURCES_SECTION.add("ResourceGroup");
    RESOURCES_SECTION.add("ResourceGroupTemplate");
    RESOURCES_SECTION.add("ResourceManagement");
    RESOURCES_SECTION.add("SAFAgent");
    RESOURCES_SECTION.add("SelfTuning");
    RESOURCES_SECTION.add("ShutdownClass");
    RESOURCES_SECTION.add("SingletonService");
    RESOURCES_SECTION.add("StartupClass");
    RESOURCES_SECTION.add("SystemComponent");
    RESOURCES_SECTION.add("WebAppContainer");
    RESOURCES_SECTION.add("WLDFSystemResource");
    RESOURCES_SECTION.add("WTCServer");

    // appDeployments section
    APP_DEPLOYMENTS_SECTION.add("Application");
    APP_DEPLOYMENTS_SECTION.add("Library");

    // Now setup valid navtree top level paths
    makeValidNavtreeKeySet();
  }

  // The bean tree use to build the model
  private BeanTree beanTree;

  // The localizer for messages
  private Localizer localizer;

  // The model that is created from the bean tree
  private Map<String, Object> model;

  private BeanTree getBeanTree() {
    return beanTree;
  }

  private Map<String, Object> getOriginalModel() {
    return getBeanTree().getWDTModel();
  }

  private BeanTypeDef getSecurityProviderBeanTypeDef() {
    return getBeanTree().getSecurityProviderTypeDef();
  }

  private Map<String, List<String>> getUnknownProperties() {
    return getBeanTree().getUnknownProperties();
  }

  // Create the builder for the Domain root which holds the model sections
  public WDTModelBuilder(
    BeanTree beanTree,
    Localizer localizer
  ) {
    // Reference the bean tree
    this.beanTree = beanTree;
    this.localizer = localizer;

    // Setup the new model and copy the original model sections
    model = new LinkedHashMap<>();
    getOriginalModel().forEach((key, value) -> model.put(key, value));

    // Create each updated section of the new model
    SECTIONS.forEach(section -> model.put(section, new LinkedHashMap<String, Object>()));
  }

  // Create the set of valid online paths for the Navtree
  private static void makeValidNavtreeKeySet() {
    // Add each section by converting to the online names...
    TOPOLOGY_SECTION.forEach(WDTModelBuilder::addValidNavtreeKey);
    RESOURCES_SECTION.forEach(WDTModelBuilder::addValidNavtreeKey);
    APP_DEPLOYMENTS_SECTION.forEach(WDTModelBuilder::addValidNavtreeKey);

    // Ensure AppDeployments is valid for Applications
    NAVTREE_VALID_PATHS.add("AppDeployments");
  }

  // Add the key to the set of valid navtree paths
  private static void addValidNavtreeKey(String key) {
    NAVTREE_VALID_PATHS.add(key);
    NAVTREE_VALID_PATHS.add(StringUtils.getPlural(key));
  }

  // Check for a valid path and reject only paths that are
  // directly under Domain that are in a WDT model section
  public static boolean isValidPath(String dotPath) {
    Path path = (dotPath != null) ? new Path(dotPath) : null;
    if ((path == null) || (path.getComponents().size() != 2) || !path.getFirstComponent().equals("Domain")) {
      return true;
    }
    return NAVTREE_VALID_PATHS.contains(path.getLastComponent());
  }

  // Build the WDT model using the current state of the bean tree...
  public Map<String, Object> build() {
    BeanTreeEntry domain = beanTree.getDomain();

    // Make a deep copy of the domain...
    copyDomain(domain.getBeanValue());

    // Copy the unsupported settings from original (e.g. NMProperties)
    // Fixup - Copy all unknown/added properties from MBeans
    copyUnsuportedSettings();

    // If any of the updated section are empty remove them...
    cleanupModelSections();

    // Return the new model!
    return model;
  }

  // Deep copy of the Domain placing the attributes into the proper model sections
  private void copyDomain(Map<String, BeanTreeEntry> domainBeanValue) {
    domainBeanValue.forEach((key, value) -> {
      if (value.isProperty()) {
        BeanPropertyDef propertyDef = value.getBeanPropertyDef();
        getTopolgy().put(propertyDef.getOfflinePropertyName(), value.getPropertyValue());
      } else if (!value.isTransient()) {
        BeanChildDef childDef = value.getBeanChildDef();
        if (!BeanTree.isMachineType(childDef)) {
          String name = childDef.getOfflineChildName();
          // Fixup - Check for AppDeployment to save as Application in the model
          name = ("AppDeployment".equals(name)) ? "Application" : name;
          getSection(name).put(name, copyBeanValue(value.getBeanValue()));
        } else {
          // Machines saved as a Machine or a UnixMachine
          copyMachines(value);
        }
      }
    });
  }

  // Deep copy of the bean value used for conversion from bean tree to the model
  // Return NULL if there is no bean value or when there are no attributes...
  private Map<String, Object> copyBeanValue(Map<String, BeanTreeEntry> beanValue) {
    // Check for no bean value...
    if ((beanValue == null) || beanValue.isEmpty()) {
      return null;
    }
    // Otherwise, recursively go through the bean attributes...
    Map<String, Object> result = new LinkedHashMap<>();
    beanValue.forEach((key, value) -> {
      if (value.isProperty()) {
        BeanPropertyDef propertyDef = value.getBeanPropertyDef();
        result.put(propertyDef.getOfflinePropertyName(), value.getPropertyValue());
      } else if (!value.isTransient()) {
        BeanChildDef childDef = value.getBeanChildDef();
        // Use the child def to determine the proper conversion to the model...
        if (childDef.isCollapsedInWDT()) {
          // Skip one level in the model and copy the child...
          BeanTreeEntry childValue = value.getBeanValue().get(key);
          result.put(childDef.getOfflineChildName(), copyBeanValue(childValue.getBeanValue()));
        } else if (isSecurityProviderBaseType(childDef)) {
          // Add in the provider name and type to the model along with the settings...
          result.put(childDef.getOfflineChildName(), copySecurityProviders(value));
        } else {
          // Copy of the bean and choose the proper name for the bean...
          String name = key;
          if (value.isBeanCollection() || !childDef.isCollection()) {
            name = childDef.getOfflineChildName();
          }
          result.put(name, copyBeanValue(value.getBeanValue()));
        }
      }
    });
    // Double check that attributes are available in the result
    // as transient children may have been added to the bean...
    if (result.isEmpty()) {
      return null;
    }
    // Otherwise return the copied attributes...
    return result;
  }

  // Determine and return the model section for the specific bean child name
  private Map<String, Object> getSection(String childName) {
    if (TOPOLOGY_SECTION.contains(childName)) {
      return getTopolgy();
    }
    if (RESOURCES_SECTION.contains(childName)) {
      return getResources();
    }
    if (APP_DEPLOYMENTS_SECTION.contains(childName)) {
      return getAppDeployments();
    }
    // Fixup - update the log and warning handling
    LOGGER.warning("WARNING: WDTModelBuilder found unmapped section for: " + childName);
    String unmappedSection = localizer.localizeString(LocalizedConstants.UNMAPPED_SECTION);
    throw new IllegalArgumentException("WDT Model Builder - " + unmappedSection + childName);
  }

  @SuppressWarnings("unchecked")
  private Map<String, Object> getTopolgy() {
    return (Map<String, Object>)model.get(TOPOLOGY);
  }

  @SuppressWarnings("unchecked")
  private Map<String, Object> getResources() {
    return (Map<String, Object>)model.get(RESOURCES);
  }

  @SuppressWarnings("unchecked")
  private Map<String, Object> getAppDeployments() {
    return (Map<String, Object>)model.get(APP_DEPLOYMENTS);
  }

  // Handle copy of unsupported model settings where the Map of the
  // unknonwn properties contains a list of settings by model section
  @SuppressWarnings("unchecked")
  private void copyUnsuportedSettings() {
    getUnknownProperties().forEach((key, list) -> {
      Object val = getOriginalModel().get(key);
      if (val instanceof Map) {
        Map<String, Object> section = (Map<String, Object>) val;
        list.forEach(item -> {
          if (section.containsKey(item)) {
            getSection(item).put(item, section.get(item));
          }
        });
      }
    });
  }

  // Remove any of the sections which have no settings...
  @SuppressWarnings("unchecked")
  private void cleanupModelSections() {
    SECTIONS.forEach(section -> {
      Object val = model.get(section);
      if (val instanceof Map) {
        Map<String, Object> value = (Map<String, Object>)val;
        if (value.isEmpty()) {
          model.remove(section);
        }
      }
    });
  }

  // Determine if the current type is that of a security provider
  private boolean isSecurityProviderBaseType(BeanChildDef childDef) {
    return childDef.getChildTypeDef().isTypeDef(getSecurityProviderBeanTypeDef());
  }

  // Copy the security provider entries as the model structure includes name an type
  private Map<String, Object> copySecurityProviders(BeanTreeEntry value) {
    // Check if there is any provider(s) to copy...
    if ((value == null) || value.getBeanValue().isEmpty()) {
      return null;
    }

    // Determine if there is a singleton or a collection of providers...
    BeanChildDef childDef = value.getBeanChildDef();
    if (!childDef.isCollection()) {
      // Copy the provider as this is a singleton value
      return copySecurityProvider(value);
    } else {
      // Copy each provider and add to the returned collection
      Map<String, Object> result = new LinkedHashMap<>();
      value.getBeanValue().forEach((name, provider) -> {
        Map<String, Object> providerValue = copySecurityProvider(provider);
        result.put(name, providerValue.get(name));
      });
      return result;
    }
  }

  // Copy the provider into the model layout of name -> type -> settings
  private Map<String, Object> copySecurityProvider(BeanTreeEntry provider) {
    // Copy the settings then remove the name and type...
    Map<String, Object> settings = copyBeanValue(provider.getBeanValue());
    removeProperty(settings, PROVIDER_NAME);
    removeProperty(settings, PROVIDER_TYPE);

    // Check for empty settings and add settings into the type...
    settings = settings.isEmpty() ? null : settings;
    Map<String, Object> type = new LinkedHashMap<>();
    BeanTreeEntry typeValue = provider.getBeanTreeEntry(PROVIDER_TYPE);
    String typePropertyValue = getSecurityProviderType(typeValue);
    type.put(typePropertyValue, settings);

    // Now place the type into the returned provider value based on the name...
    BeanTreeEntry nameValue = provider.getBeanTreeEntry(PROVIDER_NAME);
    String name = (nameValue != null) ? nameValue.getPropertyValue().toString() : null;
    name = ((name == null) ? provider.getKey() : name);
    Map<String, Object> providerValue = new LinkedHashMap<>();
    providerValue.put(name, type);

    // Done.
    return providerValue;
  }

  // Obtain the short type name (vs fully qualified) for the WebLogic security providers...
  private String getSecurityProviderType(BeanTreeEntry typeValue) {
    String result = typeValue.getPropertyValue().toString();
    if (result.startsWith("weblogic.security.providers.") || result.startsWith("com.bea.security.")) {
      result = StringUtils.getLeafClassName(result);
    }
    return result;
  }

  // Copy the machine entries by splitting into UnixMachine and Machine
  private void copyMachines(BeanTreeEntry machines) {
    // Check for no machines present...
    Set<String> machineNames = (machines != null) ? machines.getKeySet() : null;
    if ((machineNames == null) || machineNames.isEmpty()) {
      return;
    }

    // Get the type property of the machine...
    BeanChildDef beanChildDef = machines.getBeanChildDef();
    BeanPropertyDef typePropDef = beanChildDef.getChildTypeDef().getSubTypeDiscriminatorPropertyDef();
    String typeProp = typePropDef.getPropertyName();

    // Loop through each machine entry and sort them by the type...
    Map<String, List<BeanTreeEntry>> sortedMachines = new LinkedHashMap<>();
    machineNames.forEach(name -> {
      BeanTreeEntry machine = machines.getBeanTreeEntry(name);
      BeanTreeEntry type = machine.getBeanValue().get(typeProp);
      if (type == null) {
        LOGGER.warning("WARNING: Machine contains no Type property!");
        return;
      }
      String offlineType = type.getPropertyValue().toString();
      if (!sortedMachines.containsKey(offlineType)) {
        sortedMachines.put(offlineType, new LinkedList<BeanTreeEntry>());
      }
      sortedMachines.get(offlineType).add(machine);
    });

    // Go through the sorted lists and place into topology based on type...
    sortedMachines.forEach((offlineType, listMachines) -> {
      // Create the map holding each machine instance
      Map<String, Object> result = new LinkedHashMap<>();
      // Add each machine to the list for that type
      listMachines.forEach(machine -> {
        Map<String, Object> beanValue = copyBeanValue(machine.getBeanValue());
        result.put(machine.getKey(), checkRemoveProperty(beanValue, typeProp));
      });
      // Add the machines based on the offline type name... 
      getTopolgy().put(offlineType, result);
    });
  }

  // Check and remove the specified property returning null if the map becomes empty
  @SuppressWarnings("unchecked")
  private Map<String, Object> checkRemoveProperty(Object beanValue, String propertyName) {
    Map<String, Object> result = null;
    if (beanValue instanceof Map) {
      Map<String, Object> bean = (Map<String, Object>)beanValue;
      removeProperty(bean, propertyName);
      result = bean.isEmpty() ? null : bean;
    }
    return result;
  }

  // Remove the specified property from the bean value...
  private void removeProperty(Map<String, Object> beanValue, String propertyName) {
    if (beanValue != null)  {
      beanValue.remove(propertyName);
    }
  }
}
