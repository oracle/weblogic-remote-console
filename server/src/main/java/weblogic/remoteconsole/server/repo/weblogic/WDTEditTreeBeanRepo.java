// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo.weblogic;

import java.io.Writer;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.json.Json;
import javax.json.JsonObject;
import javax.json.JsonWriterFactory;
import javax.json.stream.JsonGenerator;

import org.yaml.snakeyaml.Yaml;
import weblogic.remoteconsole.common.repodef.BeanChildDef;
import weblogic.remoteconsole.common.repodef.BeanPropertyDef;
import weblogic.remoteconsole.common.repodef.Localizer;
import weblogic.remoteconsole.common.utils.Path;
import weblogic.remoteconsole.common.utils.WebLogicVersion;
import weblogic.remoteconsole.server.providers.WDTModelDataProvider;
import weblogic.remoteconsole.server.repo.BeanEditorRepo;
import weblogic.remoteconsole.server.repo.BeanPropertyValue;
import weblogic.remoteconsole.server.repo.BeanPropertyValues;
import weblogic.remoteconsole.server.repo.BeanReaderRepoSearchBuilder;
import weblogic.remoteconsole.server.repo.BeanReaderRepoSearchResults;
import weblogic.remoteconsole.server.repo.BeanSearchResults;
import weblogic.remoteconsole.server.repo.BeanTreePath;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.ReferenceAsReferencesValue;
import weblogic.remoteconsole.server.repo.Response;
import weblogic.remoteconsole.server.repo.SettableValue;
import weblogic.remoteconsole.server.repo.StringValue;
import weblogic.remoteconsole.server.repo.UnknownValue;
import weblogic.remoteconsole.server.repo.Value;
import weblogic.remoteconsole.server.webapp.FailedRequestException;

/**
 * WDT model based implementation of a BeanRepo that implements BeanReaderRepo.
 * <p>
 * WDTEditTreeBeanRepo first creates an in memory edit bean tree and then uses
 * the bean tree to walk the BeanTreePath and return Value objects.
 * <p>
 * The WDTModelDataProvider parses the YAML into the Map and the BeanTreeBuilder
 * is used to walk the Map using the bean type information to create the bean tree.
 * <p>
 */
public class WDTEditTreeBeanRepo extends WDTBeanRepo implements BeanEditorRepo {
  private static final Logger LOGGER = Logger.getLogger(WDTEditTreeBeanRepo.class.getName());
  private static final String DOMAIN = "Domain";

  // The resulting bean tree from the parsed model
  private BeanTree beanTree = null;

  // The cached YAML emitter
  private Yaml emitter = null;

  // The cached JSON factory
  private JsonWriterFactory writerFactory = null;

  public WDTEditTreeBeanRepo(WebLogicVersion version, Map<String, Object> model, InvocationContext ic) {
    super(version);

    // Setup the bean tree used to walk a BeanTreePath and return Value objects...
    // The model was parsed into memory from the WDTModelDataProvider
    if ((model != null) && !model.isEmpty()) {
      LOGGER.fine("WDT: WDTEditTreeBeanRepo created");
      BeanChildDef rootChildDef = getBeanRepoDef().getRootTypeDef().getChildDef(new Path(DOMAIN));
      BeanTreeBuilder builder = new BeanTreeBuilder(model, this, rootChildDef, ic.getLocalizer());
      builder.addModelSection("topology").addModelSection("resources").addModelSection("appDeployments");

      // Build the bean tree and any exception during the build results in a failed request!
      try {
        beanTree = builder.build();
      } catch (Exception exc) {
        throw new FailedRequestException(exc.getMessage());
      }

      // Only fall through to dump the tree when log level is correct to avoid Map dump overhead!
      if (LOGGER.isLoggable(Level.FINEST)) {
        BeanTreeEntry beanTreeEntry = beanTree.getDomain();
        LOGGER.finest("WDT: WDTEditTreeBeanRepo Tree - " + beanTreeEntry.getBeanTreePath() + ":" + beanTree);
      }

      // The initial tree from the parsed model is ready...
      LOGGER.fine("WDT: WDTEditTreeBeanRepo bean tree built");

      // Attempt to resolve the unresolved references inside the bean tree...
      LOGGER.fine("WDT: WDTEditTreeBeanRepo attempt reference resolution");
      beanTree.resolveReferences();

      // Complete the bean tree by filling in the required singletons and collections...
      LOGGER.fine("WDT: WDTEditTreeBeanRepo complete bean tree with required entries not in the model");
      beanTree.completeRequiredBeanTreeEntries();

      // Done.
      LOGGER.fine("WDT: WDTEditTreeBeanRepo completed");
    }
  }

  // Write the WDT model by using the WDT model builder
  public void writeWDTModel(Writer writer, InvocationContext ic) {
    if (beanTree != null) {
      // Build the model from the bean tree...
      Map<String, Object> model = null;
      try {
        model = new WDTModelBuilder(beanTree, ic.getLocalizer()).build();
      } catch (Exception exc) {
        String msg = exc.toString();
        LOGGER.log(Level.SEVERE, "WDT: WDTEditTreeBeanRepo ERROR converting BeanTree: " + msg, exc);
        throw new FailedRequestException(msg);
      }

      // Determine if emitting YAML or JSON output...
      boolean isJson = false;
      if (ic.getProvider() instanceof WDTModelDataProvider) {
        isJson = ((WDTModelDataProvider)ic.getProvider()).isJson();
      }

      // Output the model based on the format...
      LOGGER.fine("WDT: Writing model using " + (isJson ? "JSON" : "YAML"));
      if (isJson) {
        writeJson(writer, model);
      } else {
        writeYaml(writer, model);
      }
    }
  }

  // Output the WDT model using the YAML emitter
  private void writeYaml(Writer writer, Map<String, Object> model) {
    if (model != null) {
      emitter = (emitter == null) ? WDTModelRepresenter.getYamlEmitter() : emitter;
      try {
        emitter.dump(model, writer);
      } catch (Exception exc) {
        String msg = exc.toString();
        LOGGER.log(Level.SEVERE, "WDT: WDTEditTreeBeanRepo ERROR outputting YAML BeanTree: " + msg, exc);
        throw new FailedRequestException(msg);
      }
    }
  }

  // Output the WDT model using javax.Json support
  private void writeJson(Writer writer, Map<String, Object> model) {
    if (model != null) {
      writerFactory = (writerFactory == null) ? getJsonWriterFactory() : writerFactory;
      try {
        JsonObject jsonObject = Json.createObjectBuilder(model).build();
        writerFactory.createWriter(writer).writeObject(jsonObject);
      } catch (Exception exc) {
        String msg = exc.toString();
        LOGGER.log(Level.SEVERE, "WDT: WDTEditTreeBeanRepo ERROR outputting JSON BeanTree: " + msg, exc);
        throw new FailedRequestException(msg);
      }
    }
  }

  // Creates the JSON writer factory used for download in JSON format
  private static JsonWriterFactory getJsonWriterFactory() {
    return Json.createWriterFactory(Map.of(JsonGenerator.PRETTY_PRINTING, true));
  }

  /**
   * Return a BeanReaderRepoSearchBuilder where the results are backed by the WDT model
   */
  @Override  
  public BeanReaderRepoSearchBuilder createSearchBuilder(InvocationContext invocationContext, boolean includeIsSet) {
    LOGGER.fine("WDT: WDTEditTreeBeanRepo createSearchBuilder() "
                 + invocationContext.getBeanTreePath()
                 + " - includeSet: " + includeIsSet);
    return new WDTBeanReaderRepoSearchBuilder(beanTree, includeIsSet);
  }

  /**
   * The implementation of BeanReaderRepoSearchBuilder returns the in memory bean tree...
   */
  class WDTBeanReaderRepoSearchBuilder implements BeanReaderRepoSearchBuilder {
    private boolean includeIsSet = true;
    private BeanTree beanTree = null;

    public WDTBeanReaderRepoSearchBuilder(BeanTree beanTree, boolean includeIsSet) {
      this.beanTree = beanTree;
      this.includeIsSet = includeIsSet;
    }

    @Override
    public void addProperty(BeanTreePath beanTreePath, BeanPropertyDef propertyDef) {
    }

    /**
     * Return a response pointing at the in memory bean tree
     */
    @Override
    public Response<BeanReaderRepoSearchResults> search() {
      LOGGER.finest("WDT: WDTEditTreeBeanRepo search()");
      Response<BeanReaderRepoSearchResults> response = new Response<>();

      // IFF the bean tree is not supplied then return a not found response
      if (beanTree == null) {
        return response.setNotFound();
      }

      // Create the search results
      WDTBeanReaderRepoSearchResults results = new WDTBeanReaderRepoSearchResults(beanTree, includeIsSet);

      // Return the results...
      return response.setSuccess(results);
    }
  }

  class WDTBeanReaderRepoSearchResults implements BeanReaderRepoSearchResults {
    private boolean includeIsSet = true;
    private BeanTree beanTree = null;

    // Lazy cache of settings used for the default value computation
    boolean modeValuesResolved = false;
    boolean secureModeValue = false;
    boolean productionModeValue = false;
    BeanTreeEntry secureMode = null;
    BeanTreeEntry productionMode = null;

    public WDTBeanReaderRepoSearchResults(
      BeanTree beanTree,
      boolean includeIsSet
    ) {
      this.beanTree = beanTree;
      this.includeIsSet = includeIsSet;
    }

    @Override
    public BeanSearchResults getBean(BeanTreePath beanTreePath) {
      LOGGER.fine("WDT: BeanReaderRepoSearchResults getBean(): " + beanTreePath);
      if (isCollection(beanTreePath)) {
        throw new AssertionError("WDT: getBean() does not return collections: " + beanTreePath);
      }
      BeanTreeEntry entry = beanTree.getBeanTreeEntry(beanTreePath);
      if (entry == null) {
        return null;
      }
      if (entry.isBeanCollection()) {
        throw new AssertionError("WDT: Error getBean() found a bean collection: " + entry);
      }
      return new WDTBeanSearchResults(this, beanTreePath, entry, includeIsSet);
    }

    @Override
    public List<BeanSearchResults> getUnsortedCollection(BeanTreePath beanTreePath) {
      LOGGER.fine("WDT: BeanReaderRepoSearchResults getUnsortedCollection(): " + beanTreePath);
      if (!isCollection(beanTreePath)) {
        throw new AssertionError("WDT: getUnsortedCollection() cannot return a single bean: " + beanTreePath);
      }
      BeanTreeEntry entry = beanTree.getBeanTreeEntry(beanTreePath);
      if (entry == null) {
        return null;
      }
      if (entry.isBean()) {
        throw new AssertionError("WDT: Error getUnsortedCollection() found a bean: " + entry);
      }
      List<BeanSearchResults> result = new ArrayList<>();
      Set<String> items = entry.getKeySet();
      for (String item : items) {
        BeanTreeEntry instance = entry.getBeanTreeEntry(item);
        result.add(new WDTBeanSearchResults(this, instance.getBeanTreePath(), instance, includeIsSet));
      }
      return result;
    }

    // Determine if the bean tree path is a collection
    private boolean isCollection(BeanTreePath beanTreePath) {
      if (beanTreePath.getLastSegment().getChildDef().isCollection()) {
        if (!beanTreePath.getLastSegment().isKeySet()) {
          return true;
        }
      }
      return false; // singleton child or collection child
    }

    // Obtain the defaulted value for a property based on production and secure mode settings
    Value getDefaultValue(BeanPropertyDef propertyDef) {
      // Cache the current values for secure and production mode...
      if (!modeValuesResolved) {
        // Get each mode and when both are set, populate the boolean values...
        secureMode = beanTree.getSecureModeSetting();
        productionMode = beanTree.getProductionModeSetting();
        if ((productionMode != null) && (secureMode != null)) {
          secureModeValue = WDTValueConverter.getBooleanFromObject(secureMode.getPropertyValue());
          productionModeValue = WDTValueConverter.getBooleanFromObject(productionMode.getPropertyValue());
        }
        modeValuesResolved = true;
      }

      // IFF both modes are set then return the default value based on
      // these settings otherwise use the alternate defaulting logic...
      if ((productionMode != null) && (secureMode != null)) {
        return propertyDef.getDefaultValue(secureModeValue, productionModeValue);
      } else {
        return propertyDef.getDefaultValue();
      }
    }
  }

  class WDTBeanSearchResults implements BeanSearchResults {
    private WDTBeanReaderRepoSearchResults results;
    private BeanTreePath beanTreePath;
    private BeanTreeEntry beanTreeEntry;
    private boolean includeIsSet;

    public WDTBeanSearchResults(
      WDTBeanReaderRepoSearchResults results,
      BeanTreePath beanTreePath,
      BeanTreeEntry beanTreeEntry,
      boolean includeIsSet
    ) {
      this.results = results;
      this.beanTreePath = beanTreePath;
      this.beanTreeEntry = beanTreeEntry;
      this.includeIsSet = includeIsSet;
    }

    @Override public BeanReaderRepoSearchResults getSearchResults() {
      return results;
    }

    @Override public BeanTreePath getBeanTreePath() {
      return beanTreePath;
    }

    private BeanTreeEntry getBeanTreeEntry() {
      return beanTreeEntry;
    }

    private boolean isIncludeIsSet() {
      return includeIsSet;
    }

    @Override
    public Value getUnsortedValue(BeanPropertyDef propertyDef) {
      LOGGER.fine("WDT: BeanSearchResults getUnsortedValue() on " + getBeanTreePath() + " for: " + propertyDef);

      // Check property to see if the property is the identity
      // WebLogicRestBeanSearchResults explictly sets the identity property as 'unset' (i.e. false)
      if (propertyDef.isIdentity()) {
        return getReturnValue(getBeanTreePath(), false);
      }

      // Check property to see if the property is the key which is implied from the model
      if (BeanTree.isKey(getBeanTreePath(), propertyDef)) {
        return getReturnValue(new StringValue(getBeanTreeEntry().getKey()), true);
      }

      // The property will have a relative path from the bean instance
      Path propertyPath = propertyDef.getPropertyPath();
      BeanTreeEntry value = BeanTree.getProperty(getBeanTreeEntry(), propertyPath);
      LOGGER.fine("WDT: BeanSearchResults getUnsortedValue() lookup found value: " + value);

      // Convert the model value to the backend value type...
      // If the value is in the model then the state is 'set'
      boolean isPropertySet = (value != null);
      Value propertyValue = getValueOrDefault(value, propertyDef);
      if (propertyValue != null) {
        propertyValue = getReturnValue(propertyValue, isPropertySet);
      } else {
        propertyValue = getUnknownValue(isPropertySet);
      }
      LOGGER.fine("WDT: BeanSearchResults getUnsortedValue() returning property value: " + propertyValue);
      return propertyValue;
    }

    // Get the Value to return based on the SearchBuilder 'includeIsSet' flag...
    private Value getReturnValue(Value value, boolean set) {
      Value result = value;
      if ((value != null) && isIncludeIsSet()) {
        result = new SettableValue(value, set);
      }
      return result;
    }

    // Get the UnknownValue to return based on the SearchBuilder 'includeIsSet' flag...
    private Value getUnknownValue(boolean set) {
      Value result = UnknownValue.INSTANCE;
      if (isIncludeIsSet()) {
        result = new SettableValue(result, set);
      }
      return result;
    }

    // Get the Value type based on the property def or the default value when NULL...
    private Value getValueOrDefault(BeanTreeEntry value, BeanPropertyDef propertyDef) {
      if (value == null) {
        // Check if the property needs to be converted for ReferenceAsReferences
        Value defaultValue = results.getDefaultValue(propertyDef);
        if (propertyDef.isReferenceAsReferences() && (defaultValue != null) && defaultValue.isArray()) {
          List<Value> values = defaultValue.asArray().getValues();
          defaultValue = new ReferenceAsReferencesValue(values);
        }
        return defaultValue;
      }
      return WDTValueConverter.getValueType(value, propertyDef);
    }
  }

  @Override
  public Response<Void> updateBean(InvocationContext invocationContext, BeanPropertyValues propertyValues) {
    LOGGER.fine("WDT: WDTEditTreeBeanRepo updateBean() "
                 + invocationContext.getBeanTreePath()
                 + " - propertyValues: " + propertyValues);

    // Look up the bean in the tree...
    Response<Void> response = new Response<>();
    if (beanTree == null) {
      return response.setNotFound();
    }
    BeanTreeEntry entry = beanTree.getBeanTreeEntry(propertyValues.getBeanTreePath());
    if (entry == null) {
      response.setNotFound();
    } else {
      // Update each property on the bean based on the state of the bean tree...
      LOGGER.finest("WDT: updateBean(): " + entry.getPath());
      Localizer localizer = invocationContext.getLocalizer();
      boolean performReferenceResolution = false;
      for (BeanPropertyValue value : propertyValues.getPropertyValues()) {
        BeanPropertyDef propertyDef = value.getPropertyDef();
        LOGGER.finest("WDT: updateBean() for: " + propertyDef);

        // Skip the key property...
        if (BeanTree.isKey(entry.getBeanTreePath(), propertyDef)) {
          LOGGER.finest("WDT: updateBean() skipping key property!");
          continue;
        }

        // Make sure the property is parented by the bean otherwise skip...
        if (!propertyDef.getParentPath().isEmpty()) {
          LOGGER.warning("WARNING: updateBean() - Property has parent: " + propertyDef.getParentPath());
          continue;
        }

        // Get the property, the new value and determine the required operation...
        boolean unset = value.getValue().isUnset();
        SettableValue newValue = value.getValue();
        BeanTreeEntry property = BeanTree.getProperty(entry, propertyDef.getPropertyPath());
        if (unset) {
          // Unsetting a property takes precendence over updating the value
          // thus remove the property unless the property was not found...
          LOGGER.finest("WDT: updateBean() UNSET: " + newValue);
          if (property != null) {
            LOGGER.finest("WDT: updateBean() UNSET previous: " + getDebugValue(property));
            if (!beanTree.removeProperty(entry, property)) {
              LOGGER.warning("WDT: updateBean() unable to remove property: " + property.getPath());
            }
          }
        } else if (property != null) {
          // Update the property and convert the Value type to the Java type...
          LOGGER.finest("WDT: updateBean() UPDATE: " + newValue + " previous: " + getDebugValue(property));
          Object newPropertyValue = WDTValueConverter.getJavaType(newValue.getValue(),  propertyDef, localizer);
          if (!beanTree.updateProperty(entry, property, newPropertyValue)) {
            LOGGER.warning("WDT: updateBean() unable to update property: " + property.getPath());
          }
          // Check if the property is a reference and indicate reference resolution...
          performReferenceResolution = (!performReferenceResolution ? BeanTree.isReference(propertyDef) : true);
        } else {
          // Add in the property and convert the Value type to the Java type...
          LOGGER.finest("WDT: updateBean() ADD: " + newValue);
          Object propertyValue = WDTValueConverter.getJavaType(newValue.getValue(), propertyDef, localizer);
          if (!beanTree.addProperty(entry, propertyDef, propertyValue)) {
            LOGGER.warning("WDT: updateBean() unable to add property: " + propertyDef);
          }
          // Check if the property is a reference and indicate reference resolution...
          performReferenceResolution = (!performReferenceResolution ? BeanTree.isReference(propertyDef) : true);
        }
      }
      // Reference resolution is performed if any refererences where updated or added...
      if (performReferenceResolution) {
        LOGGER.finest("WDT: updateBean() resolve only added or updated references!");
        beanTree.resolveReferences(false);
      }
    }
    return response;
  }

  @Override
  public Response<Void> createBean(InvocationContext invocationContext, BeanPropertyValues propertyValues) {
    LOGGER.fine("WDT: WDTEditTreeBeanRepo createBean() "
                 + invocationContext.getBeanTreePath()
                 + " - propertyValues: " + propertyValues);

    BeanTreeEntry createdBean = null;
    Response<Void> response = new Response<>();
    if (beanTree == null) {
      return response.setNotFound();
    }

    // Determine if there is a singleton or collection instance being created...
    BeanTreePath beanTreePath = propertyValues.getBeanTreePath();
    BeanChildDef beanChildDef = beanTreePath.getLastSegment().getChildDef();
    List<BeanPropertyValue> listPropertyValues = propertyValues.getPropertyValues();
    if (!beanChildDef.isCollection()) {
      createdBean = createSingletonBean(beanTreePath, beanChildDef);
    } else {
      createdBean = createInstanceBean(beanTreePath, listPropertyValues);
    }

    if (createdBean == null) {
      response.setFrontEndBadRequest();
    } else {
      LOGGER.finest("WDT: createBean() created: " + createdBean.getPath());

      // Add all the specified properties to the created bean...
      Localizer localizer = invocationContext.getLocalizer();
      boolean performReferenceResolution = false;
      for (BeanPropertyValue value : listPropertyValues) {
        BeanPropertyDef propertyDef = value.getPropertyDef();
        LOGGER.finest("WDT: createBean() for: " + propertyDef);

        // Skip the key property...
        if (BeanTree.isKey(createdBean.getBeanTreePath(), propertyDef)) {
          LOGGER.finest("WDT: createBean() skipping key property!");
          continue;
        }

        // Make sure the property is parented by the bean otherwise skip...
        if (!propertyDef.getParentPath().isEmpty()) {
          LOGGER.warning("WARNING: createBean() - Property has parent: " + propertyDef.getParentPath());
          continue;
        }

        // Get the property, the new value and determine the required operation...
        boolean unset = value.getValue().isUnset();
        SettableValue newValue = value.getValue();
        if (unset) {
          // Unsetting a property during create implies skip adding to the bean (i.e. default)
          LOGGER.finest("WDT: createBean() UNSET: " + newValue);
        } else {
          // Add in the property and convert the Value type to the Java type...
          LOGGER.finest("WDT: createBean() ADD: " + newValue);
          Object propertyValue = WDTValueConverter.getJavaType(newValue.getValue(), propertyDef, localizer);
          if (!beanTree.addProperty(createdBean, propertyDef, propertyValue)) {
            LOGGER.warning("WDT: createBean() unable to add property: " + propertyDef);
          }
          // Check if the property is a reference and indicate reference resolution...
          performReferenceResolution = (!performReferenceResolution ? BeanTree.isReference(propertyDef) : true);
        }
      }
      // Reference resolution is performed if any refererences where added after bean create
      if (performReferenceResolution) {
        LOGGER.finest("WDT: createBean() resolve only added references!");
        beanTree.resolveReferences(false);
      }
    }
    return response;
  }

  // Create the bean based on the bean tree path looking for the key from the supplied property values...
  private BeanTreeEntry createInstanceBean(BeanTreePath beanTreePath, List<BeanPropertyValue> listPropertyValues) {
    // Look up the bean tree path as this will be the parent of the bean being created...
    BeanTreeEntry parent = beanTree.getBeanTreeEntry(beanTreePath);
    if (parent == null) {
      LOGGER.warning("WDT: Unable to find parent bean: " + beanTreePath.getPath());
      return null;
    }

    // First determine and obtain the key property...
    Optional<BeanPropertyValue> keyPropertyValue = listPropertyValues.stream()
        .filter(value -> value.getPropertyDef().isKey()).findFirst();

    // Make sure we found the key property and there is a value available...
    if (!keyPropertyValue.isPresent()
        || keyPropertyValue.get().getValue().isUnset()
        || (keyPropertyValue.get().getValue().getValue() == null)
        || !keyPropertyValue.get().getValue().getValue().isString()) {
      LOGGER.warning("WDT: Unable to determine key property value: " + keyPropertyValue);
      return null;
    }

    // Get the key value and create the bean...
    String key = keyPropertyValue.get().getValue().getValue().asString().getValue();
    if ((key == null) || !beanTree.addBean(parent, parent.getBeanChildDef(), key)) {
      LOGGER.warning("WDT: Unable to create bean: " + parent.getPath() + " - " + key);
      return null;
    }
    return parent.getBeanTreeEntry(key);
  }

  // Create the singleton bean based on the bean tree path and sepcified child def...
  private BeanTreeEntry createSingletonBean(BeanTreePath beanTreePath, BeanChildDef beanChildDef) {
    String name = beanChildDef.getChildName();
    BeanTreeEntry parent = beanTree.getParentBeanTreeEntry(beanTreePath);
    if ((parent == null) || !beanTree.addBean(parent, beanChildDef, name)) {
      LOGGER.finest("WDT: singleton parent bean: " + (parent != null ? parent.getPath() : "None"));
      LOGGER.warning("WDT: Unable to create singleton: " + beanTreePath.getPath() + " - " + name);
      return null;
    }
    return parent.getBeanTreeEntry(name);
  }

  @Override
  public Response<Void> deleteBean(InvocationContext invocationContext, BeanTreePath beanTreePath) {
    LOGGER.fine("WDT: WDTEditTreeBeanRepo deleteBean() "
                 + invocationContext.getBeanTreePath()
                 + " - beanTreePath: " + beanTreePath);

    // Look up the bean in the tree...
    Response<Void> response = new Response<>();
    if (beanTree == null) {
      return response.setNotFound();
    }
    BeanTreeEntry entry = beanTree.getBeanTreeEntry(beanTreePath);
    if (entry == null) {
      response.setNotFound();
    } else {
      LOGGER.finest("WDT: deleteBean(): " + entry.getPath());

      // Find the parent bean...
      BeanTreeEntry parent = beanTree.getParentBeanTreeEntry(beanTreePath);
      LOGGER.finest("WDT: deleteBean() parent: " + ((parent != null) ? parent.getPath() : "None"));

      // Remove the bean from the parent...
      if ((parent == null) || !beanTree.removeBean(parent, entry)) {
        LOGGER.warning("WDT: deleteBean() unable to delete bean: " + entry.getPath());
        response.setServiceNotAvailable();
      }
    }
    return response;
  }

  private static String getDebugValue(BeanTreeEntry property) {
    return (property.getPropertyValue() != null) ? property.getPropertyValue().toString() : "NULL";
  }
}
