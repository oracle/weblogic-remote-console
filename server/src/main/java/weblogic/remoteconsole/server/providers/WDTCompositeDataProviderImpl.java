// Copyright (c) 2021, 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.providers;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;
import java.util.stream.IntStream;
import javax.json.Json;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;

import weblogic.remoteconsole.common.repodef.LocalizedConstants;
import weblogic.remoteconsole.common.utils.WebLogicMBeansVersion;
import weblogic.remoteconsole.common.utils.WebLogicMBeansVersions;
import weblogic.remoteconsole.common.utils.WebLogicVersions;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.weblogic.WDTCompositePageRepo;
import weblogic.remoteconsole.server.repo.weblogic.WDTModelBuilder;
import weblogic.remoteconsole.server.repo.weblogic.WDTModelSchema;
import weblogic.remoteconsole.server.webapp.FailedRequestException;
import weblogic.remoteconsole.server.webapp.ProviderResource;

/**
 * The implementation of the provider for an order list of WDT Models
 * where the models come from other created WDT providers.
*/
public class WDTCompositeDataProviderImpl implements WDTCompositeDataProvider {
  private static final Logger LOGGER = Logger.getLogger(WDTCompositeDataProviderImpl.class.getName());

  public static final String TYPE_NAME = "WDTCompositeModel";
  private String name;
  private List<String> modelNames;
  private ProviderManager pm;
  private String lastMessage = null;
  private String lastProviderNoModel = null;
  private List<Map<String, Object>> models = null;
  private Map<String, Root> roots = new HashMap<String, Root>();
  private Root viewRoot;

  public WDTCompositeDataProviderImpl(String name, List<String> modelNames, ProviderManager pm) {
    this.name = name;
    this.modelNames = modelNames;
    this.pm = pm;

    // Setup the roots
    viewRoot = new Root(
      this,
      Root.COMPOSITE_CONFIGURATION_NAME,
      Root.CONFIGURATION_ROOT,
      Root.COMPOSITE_CONFIGURATION_LABEL,
      true, // read only
      Root.NAV_TREE_RESOURCE,
      Root.SIMPLE_SEARCH_RESOURCE
     );
    roots.put(Root.COMPOSITE_CONFIGURATION_NAME, viewRoot);
  }

  @Override
  public void checkModels(InvocationContext ic) {
    lastProviderNoModel = null;

    // Obtain the WDT models
    models = getCurrentModels(ic);

    // Check if there was a problem with any of the providers or models
    // and set the list of models to null so an error will be reported
    if (lastProviderNoModel != null) {
      models = null;
      throw new FailedRequestException(getNoModelMessage(ic));
    }
  }

  @Override
  public List<Map<String, Object>> getModels() {
    return models;
  }

  @Override
  public String getType() {
    return TYPE_NAME;
  }

  @Override
  public String getName() {
    return name;
  }

  @Override
  public void terminate() {
  }

  @Override
  public void test(InvocationContext ic) {
    start(ic);
  }

  @Override
  public boolean start(InvocationContext ic) {
    ic.setProvider(this);
    if (models == null) {
      // The WDT Composite Provider is unable to start without any WDT models!
      throw new FailedRequestException(getNoModelMessage(ic));
    }

    // IFF the models have been updated then update the PageRepo so these changes are visible to the composite...
    List<Map<String, Object>> currentModels = getCurrentModels(ic);
    boolean sameLength = (models.size() == currentModels.size());
    if (!sameLength || !IntStream.range(0, models.size()).allMatch(i -> models.get(i) == currentModels.get(i))) {
      LOGGER.fine("WDTCompositeDataProvider: WDT models updated for the WDT composite: " + name);
      models = currentModels;
      setPageRepo(ic);
      return true;
    }

    // Otherwise ensure the PageRepo is setup and continue...
    if (viewRoot.getPageRepo() == null) {
      setPageRepo(ic);
    }
    return true;
  }

  // Set a new PageRepo for the tree using the current list of WDT models
  private void setPageRepo(InvocationContext ic) {
    viewRoot.setPageRepo(
      new WDTCompositePageRepo(
        WebLogicMBeansVersions.getVersion(
          WebLogicVersions.getCurrentVersion(),
          null, // GA
          WebLogicMBeansVersion.NO_CAPABILITIES
        ),
        models,
        ic
      )
    );
  }

  // Get the current list of WDT models from the model providers and IFF a
  // provider or a model is not found then skip that model in the composite!
  private List<Map<String, Object>> getCurrentModels(InvocationContext ic) {
    // Obtain the list of WDT model providers from the WDT model names
    List<WDTModelDataProvider> wdtProviders = new ArrayList<>(modelNames.size());
    modelNames.forEach(name -> {
      WDTModelDataProvider provider = (WDTModelDataProvider)pm.getProvider(name,WDTModelDataProviderImpl.TYPE_NAME);
      boolean added = ((provider != null) ? wdtProviders.add(provider) : false);
      if (!added) {
        // Log and note the provider that was not found...
        LOGGER.finest("WDTCompositeDataProvider unable to find WDT model provider: " + name);
        lastProviderNoModel = " (" + name + ")";
      }
    });

    // Obtain the list of WDT models from the WDT model providers
    List<Map<String, Object>> wdtModels = new ArrayList<>(wdtProviders.size());
    wdtProviders.forEach(provider -> {
      Map<String, Object> model = provider.getModel(ic);
      boolean added = ((model != null) ? wdtModels.add(model) : false);
      if (!added) {
        // Log and note the provider name for the model that was not found...
        LOGGER.finest("WDTCompositeDataProvider unable to get WDT model: " + provider.getName());
        lastProviderNoModel = " (" + provider.getName() + ")";
      }
    });
    return wdtModels;
  }

  // Get the response message when no model is set on the provider
  private String getNoModelMessage(InvocationContext ic) {
    String result =
      ic.getLocalizer().localizeString(
        LocalizedConstants.MODEL_INVALID,
        WDTModelSchema.KNOWN_SECTIONS
      );
    result += (lastProviderNoModel != null) ? lastProviderNoModel : "";
    lastMessage = result;
    return result;
  }

  @Override
  public Map<String, Root> getRoots() {
    return roots;
  }

  @Override
  public JsonObject toJSON(InvocationContext ic) {
    JsonObjectBuilder ret = Json.createObjectBuilder();
    ret.add("name", getName());
    ret.add(ProviderResource.PROVIDER_TYPE, getType());
    JsonArrayBuilder builder = Json.createArrayBuilder();
    for (Root root : getRoots().values()) {
      builder.add(root.toJSON(ic));
    }
    ret.add("roots", builder);
    ret.add("mode", "standalone");
    if (modelNames != null) {
      JsonArrayBuilder models = Json.createArrayBuilder();
      modelNames.forEach(models::add);
      ret.add("modelNames", models);
    }
    if (lastMessage != null) {
      ret.add("messages", createMessages(lastMessage));
    }
    return ret.build();
  }

  @Override
  public boolean isValidPath(String path) {
    return WDTModelBuilder.isValidPath(path);
  }
}
