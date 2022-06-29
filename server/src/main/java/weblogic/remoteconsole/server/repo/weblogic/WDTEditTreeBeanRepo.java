// Copyright (c) 2021, 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo.weblogic;

import java.io.Writer;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;
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
import weblogic.remoteconsole.common.utils.WebLogicMBeansVersion;
import weblogic.remoteconsole.server.providers.WDTModelDataProvider;
import weblogic.remoteconsole.server.providers.WDTModelDataProvider.PropertySource;
import weblogic.remoteconsole.server.repo.BeanEditorRepo;
import weblogic.remoteconsole.server.repo.BeanPropertyValue;
import weblogic.remoteconsole.server.repo.BeanPropertyValues;
import weblogic.remoteconsole.server.repo.BeanReaderRepoSearchBuilder;
import weblogic.remoteconsole.server.repo.BeanTreePath;
import weblogic.remoteconsole.server.repo.DownloadBeanRepo;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.ModelTokenReader;
import weblogic.remoteconsole.server.repo.ModelTokens;
import weblogic.remoteconsole.server.repo.Option;
import weblogic.remoteconsole.server.repo.OptionsSource;
import weblogic.remoteconsole.server.repo.Response;
import weblogic.remoteconsole.server.repo.SettableValue;
import weblogic.remoteconsole.server.repo.StringValue;
import weblogic.remoteconsole.server.webapp.FailedRequestException;

/**
 * WDT model based implementation of a BeanRepo that implements BeanEditorRepo.
 * <p>
 * WDTEditTreeBeanRepo first creates an in memory edit bean tree and then uses
 * the bean tree to walk the BeanTreePath and return Value objects or to update
 * the bean tree from Value objects.
 * <p>
 * The WDTModelDataProvider parses the YAML into the Map and the BeanTreeBuilder
 * is used to walk the Map using the bean type information to create the bean tree.
 * <p>
 * The WDTModelBuilder is used create a new model from the bean tree in YAML or JSON.
 * <p>
 */
public class WDTEditTreeBeanRepo extends WDTBeanRepo implements BeanEditorRepo, DownloadBeanRepo, ModelTokenReader {
  private static final Logger LOGGER = Logger.getLogger(WDTEditTreeBeanRepo.class.getName());
  private static final String DOMAIN = "Domain";

  // The resulting bean tree from the parsed model
  private BeanTree beanTree = null;

  // The cached YAML emitter
  private Yaml emitter = null;

  // The cached JSON factory
  private JsonWriterFactory writerFactory = null;

  // The cached model from the current bean tree to support DownloadBeanRepo operations
  private volatile Map<String, Object> cachedModel = null;

  public WDTEditTreeBeanRepo(WebLogicMBeansVersion mbeansVersion, Map<String, Object> model, InvocationContext ic) {
    super(mbeansVersion);

    // Setup the bean tree used to walk a BeanTreePath and return Value objects...
    // The model was parsed into memory from the WDTModelDataProvider
    if ((model != null) && !model.isEmpty()) {
      LOGGER.fine("WDT: WDTEditTreeBeanRepo created");
      BeanChildDef rootChildDef = getBeanRepoDef().getRootTypeDef().getChildDef(new Path(DOMAIN));
      BeanTreeBuilder builder = new BeanTreeBuilder(model, this, rootChildDef, ic.getLocalizer());
      builder.addModelSections();

      // Build the bean tree and any exception during the build results in a failed request!
      try {
        beanTree = builder.build();
      } catch (FailedRequestException fre) {
        throw fre;
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

  /**
   * Clear the local reference to the model holding the latest bean tree.
   *
   * The cache is cleared after BeanEditorRepo operations and will be set
   * as a result of executing the DownloadBeanRepo operations.
   */
  private synchronized void clearCachedModel() {
    cachedModel = null;
  }

  /**
   * Obtain the local reference to the model holding the latest bean tree.
   *
   * The cached model is created and set as part of the DownloadBeanRepo operations
   * and the cached value will be returned until cleared by BeanEditorRepo operations.
   * @return RuntimeException IFF a problem building the model from the bean tree
   */
  private synchronized Map<String, Object> getCachedModel(Localizer localizer) {
    if ((cachedModel == null) && (beanTree != null)) {
      WDTModelBuilder builder = new WDTModelBuilder(beanTree, localizer);
      LOGGER.fine("WDT: WDTEditTreeBeanRepo getCachedModel() building model...");
      cachedModel = Collections.unmodifiableMap(builder.build());
    }
    return cachedModel;
  }

  /**
   * Obtain the download content from the cached model of the bean tree content.
   * @return NULL when there is no bean tree created from the original model
   */
  @Override
  public Map<String, Object> getContent(InvocationContext ic) {
    try {
      return getCachedModel(ic.getLocalizer());
    } catch (Exception exc) {
      String msg = exc.toString();
      LOGGER.log(Level.SEVERE, "WDT: WDTEditTreeBeanRepo getting model from BeanTree: " + msg, exc);
      throw new FailedRequestException(msg);
    }
  }

  /**
   * Handle download for the DownloadBeanRepo by writing the WDT model using the WDT model builder
   */
  @Override
  public void download(Writer writer, InvocationContext ic) {
    if (beanTree != null) {
      // Build the model from the bean tree...
      Map<String, Object> model = null;
      try {
        model = getCachedModel(ic.getLocalizer());
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
   * Provide information on WDT model tokens when the WDT model references a property list.
   */
  @Override
  public ModelTokens getModelTokens(InvocationContext ic) {
    ModelTokens modelTokens = null;
    if (ic.getProvider() instanceof WDTModelDataProvider) {
      List<PropertySource> sources = ((WDTModelDataProvider)ic.getProvider()).getPropertySources();

      // Create the model tokens information using the property list source and the list of Properties
      if ((sources != null) && !sources.isEmpty()) {
        modelTokens = new ModelTokens();
        for (PropertySource source : sources) {
          // Add the source location of the Property List provider
          modelTokens.getOptionsSources().add(new OptionsSource(source.getName(), source.getResourceData()));

          // Add an option for each of the Properties using the label as the property name (i.e. key)
          // and setting the option value to the WDT model token for the property name...
          List<Option> options = modelTokens.getOptions();
          source.getProperties().forEach((key, val) -> {
            String label = key.toString();
            StringValue value = new StringValue("@@PROP:" + label + "@@");
            options.add(new Option(label, value));
          });
        }
      }
    }
    return modelTokens;
  }

  /**
   * Handle read for the BeanReaderRepo by returning a BeanReaderRepoSearchBuilder backed by the bean tree
   */
  @Override  
  public BeanReaderRepoSearchBuilder createSearchBuilder(InvocationContext ic, boolean includeIsSet) {
    LOGGER.fine("WDT: WDTEditTreeBeanRepo createSearchBuilder() "
                 + ic.getBeanTreePath()
                 + " - includeSet: " + includeIsSet);
    return new WDTBeanRepoSearchBuilder(beanTree, includeIsSet, ic.getLocalizer());
  }

  /**
   * Handle udpate for the BeanEditorRepo on the bean tree
   */
  @Override
  public Response<Void> updateBean(InvocationContext ic, BeanPropertyValues propertyValues) {
    LOGGER.fine("WDT: WDTEditTreeBeanRepo updateBean() "
                 + ic.getBeanTreePath()
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
      Localizer localizer = ic.getLocalizer();
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
    return invalidateCachedModel(response);
  }

  /**
   * Handle create for the BeanEditorRepo on the bean tree
   */
  @Override
  public Response<Void> createBean(InvocationContext ic, BeanPropertyValues propertyValues) {
    LOGGER.fine("WDT: WDTEditTreeBeanRepo createBean() "
                 + ic.getBeanTreePath()
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
      Localizer localizer = ic.getLocalizer();
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
    return invalidateCachedModel(response);
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

  /**
   * Handle delete for the BeanEditorRepo on the bean tree
   */
  @Override
  public Response<Void> deleteBean(InvocationContext ic, BeanTreePath beanTreePath) {
    LOGGER.fine("WDT: WDTEditTreeBeanRepo deleteBean() "
                 + ic.getBeanTreePath()
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
    return invalidateCachedModel(response);
  }

  /**
   * Invalidate the cached model after successfull response from the
   * BeanEditorRepo operations, then return the response to the caller.
   */
  private Response<Void> invalidateCachedModel(Response<Void> response) {
    if (response.isSuccess()) {
      clearCachedModel();
    }
    return response;
  }

  private static String getDebugValue(BeanTreeEntry property) {
    return (property.getPropertyValue() != null) ? property.getPropertyValue().toString() : "NULL";
  }
}
