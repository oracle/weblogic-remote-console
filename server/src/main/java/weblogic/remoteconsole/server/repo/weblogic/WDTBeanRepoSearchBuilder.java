// Copyright (c) 2021, 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo.weblogic;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.logging.Logger;

import weblogic.remoteconsole.common.repodef.BeanPropertyDef;
import weblogic.remoteconsole.common.repodef.Localizer;
import weblogic.remoteconsole.common.utils.Path;
import weblogic.remoteconsole.server.repo.BeanReaderRepoSearchBuilder;
import weblogic.remoteconsole.server.repo.BeanReaderRepoSearchResults;
import weblogic.remoteconsole.server.repo.BeanSearchResults;
import weblogic.remoteconsole.server.repo.BeanTreePath;
import weblogic.remoteconsole.server.repo.ReferenceAsReferencesValue;
import weblogic.remoteconsole.server.repo.Response;
import weblogic.remoteconsole.server.repo.SettableValue;
import weblogic.remoteconsole.server.repo.StringValue;
import weblogic.remoteconsole.server.repo.UnknownValue;
import weblogic.remoteconsole.server.repo.Value;

/**
 * The WDT model based implementation of BeanReaderRepoSearchBuilder
 */
public class WDTBeanRepoSearchBuilder implements BeanReaderRepoSearchBuilder {
  private static final Logger LOGGER = Logger.getLogger(WDTBeanRepoSearchBuilder.class.getName());

  private boolean includeIsSet = true;
  private BeanTree beanTree = null;
  private Localizer localizer = null;

  public WDTBeanRepoSearchBuilder(BeanTree beanTree, boolean includeIsSet, Localizer localizer) {
    this.beanTree = beanTree;
    this.includeIsSet = includeIsSet;
    this.localizer = localizer;
  }

  @Override
  public void addProperty(BeanTreePath beanTreePath, BeanPropertyDef propertyDef) {
  }

  /**
   * Return a response pointing at the in memory bean tree
   */
  @Override
  public Response<BeanReaderRepoSearchResults> search() {
    LOGGER.finest("WDT: BeanReaderRepoSearchResults search()");
    Response<BeanReaderRepoSearchResults> response = new Response<>();

    // IFF the bean tree is not supplied then return a not found response
    if (beanTree == null) {
      return response.setNotFound();
    }

    // Create the search results
    WDTBeanReaderRepoSearchResults results =
      new WDTBeanReaderRepoSearchResults(beanTree, includeIsSet);

    // Return the results...
    return response.setSuccess(results);
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
      if (beanTreePath.isCollection()) {
        throw new AssertionError("WDT: getBean() does not return collections: " + beanTreePath);
      }
      BeanTreeEntry entry = null;
      if (!beanTreePath.isRoot()) {
        entry = beanTree.getBeanTreeEntry(beanTreePath);
        if (entry == null) {
          return null;
        }
        if (entry.isBeanCollection()) {
          throw new AssertionError("WDT: Error getBean() found a bean collection: " + entry);
        }
      }
      return new WDTBeanSearchResults(this, beanTreePath, entry, includeIsSet);
    }

    @Override
    public List<BeanSearchResults> getUnsortedCollection(BeanTreePath beanTreePath) {
      LOGGER.fine("WDT: BeanReaderRepoSearchResults getUnsortedCollection(): " + beanTreePath);
      if (!beanTreePath.isCollection()) {
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

    // Obtain the defaulted value for a property based on production and secure mode settings
    Value getDefaultValue(BeanPropertyDef propertyDef) {
      // Cache the current values for secure and production mode...
      if (!modeValuesResolved) {
        // Get each mode and when both are set, populate the boolean values...
        secureMode = beanTree.getSecureModeSetting();
        productionMode = beanTree.getProductionModeSetting();
        if ((productionMode != null) && (secureMode != null)) {
          secureModeValue =
            WDTValueConverter.getValueType(secureMode, secureMode.getBeanPropertyDef(), localizer)
              .asBoolean().getValue();
          productionModeValue =
            WDTValueConverter.getValueType(productionMode, productionMode.getBeanPropertyDef(), localizer)
              .asBoolean().getValue();
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

      if (getBeanTreePath().isRoot()) {
        // This is the root bean.  It has no properties.
        return null;
      }

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
      return WDTValueConverter.getValueType(value, propertyDef, localizer);
    }
  }
}
