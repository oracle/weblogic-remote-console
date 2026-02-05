// Copyright (c) 2021, 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.providers;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;
import javax.json.Json;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;

import weblogic.remoteconsole.common.repodef.LocalizableString;
import weblogic.remoteconsole.common.repodef.LocalizedConstants;
import weblogic.remoteconsole.common.utils.WebLogicMBeansVersions;
import weblogic.remoteconsole.common.utils.WebLogicVersion;
import weblogic.remoteconsole.common.utils.WebLogicVersions;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.weblogic.WDTCapabilities;
import weblogic.remoteconsole.server.repo.weblogic.WDTCompositePageRepo;
import weblogic.remoteconsole.server.repo.weblogic.WDTModelBuilder;
import weblogic.remoteconsole.server.repo.weblogic.WDTModelSchema;
import weblogic.remoteconsole.server.webapp.FailedRequestException;

/**
 * The implementation of the provider for an order list of WDT Models
 * where the models come from other created WDT providers.
*/
public class WDTCompositeDataProviderImpl implements Provider {
  private static final Logger LOGGER = Logger.getLogger(WDTCompositeDataProviderImpl.class.getName());

  public static final String TYPE_NAME = "WDTCompositeModel";
  private String name;
  private List<String> modelNames;
  private String lastProviderNoModel = null;
  private List<Map<String, Object>> models = null;
  private Map<String, Root> roots = new HashMap<String, Root>();
  private Root editRoot;

  public WDTCompositeDataProviderImpl() {
    makeRoots();
  }

  public WDTCompositeDataProviderImpl(String name, List<String> modelNames) {
    this.name = name;
    this.modelNames = modelNames;
    makeRoots();
  }

  private void makeRoots() {
    // Setup the only root.  Technically, this isn't really "edit", since you
    // can't change anything, but it is a simplifying assumption in the code
    // that every provider has an edit and then maybe others.  The name isn't
    // used anywhere except in the wire protocol.
    editRoot = new Root(
      this,
      Root.EDIT_NAME,
      Root.CONFIGURATION_ROOT,
      Root.EDIT_LABEL,
      LocalizedConstants.COMPOSITE_CONFIGURATION_DESCRIPTION,
      true, // read only
      Root.NAV_TREE_RESOURCE,
      Root.SIMPLE_SEARCH_RESOURCE
     );
    roots.put(Root.EDIT_NAME, editRoot);
  }

  @Override
  public String getType() {
    return TYPE_NAME;
  }

  private static JsonObject makeHelpClause(
    InvocationContext ic,
    LocalizableString summary,
    LocalizableString detail
  ) {
    JsonObjectBuilder ret = Json.createObjectBuilder();
    ret.add("helpSummaryHTML", ic.getLocalizer().localizeString(summary));
    ret.add("detailedHelpHTML", ic.getLocalizer().localizeString(detail));
    return ret.build();
  }

  public static JsonObject getHelp(InvocationContext ic) {
    JsonObjectBuilder ret = Json.createObjectBuilder();
    ret.add("name",
      makeHelpClause(
        ic,
        LocalizedConstants.DATA_PROVIDER_HELP_NAME_SUMMARY,
        LocalizedConstants.DATA_PROVIDER_HELP_NAME_DETAIL
    ));
    ret.add("file",
      makeHelpClause(
        ic,
        LocalizedConstants.WDT_COMPOSITE_PROVIDER_HELP_MODELS_SUMMARY,
        LocalizedConstants.WDT_COMPOSITE_PROVIDER_HELP_MODELS_DETAIL
    ));
    return ret.build();
  }

  @Override
  public String getName() {
    return name;
  }

  @Override
  public void terminate() {
  }

  @Override
  public boolean start(InvocationContext ic) {
    ic.setProvider(this);
    if ((modelNames == null) || (modelNames.size() == 0)) {
      // The WDT Composite Provider is unable to start without any WDT models!
      throw new FailedRequestException(getNoModelMessage(ic));
    }

    // IFF the models have been updated then update the PageRepo so these changes are visible to the composite...
    List<Map<String, Object>> currentModels = getCurrentModels(ic);
    models = currentModels;
    setPageRepo(ic);
    return true;
  }

  // Set a new PageRepo for the tree using the current list of WDT models
  private void setPageRepo(InvocationContext ic) {
    WebLogicVersion weblogicVersion = WebLogicVersions.getLatestVersion();
    editRoot.setPageRepo(
      new WDTCompositePageRepo(
        WebLogicMBeansVersions.getVersion(
          weblogicVersion,
          WDTCapabilities.getCapabilities(weblogicVersion)
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
      ConfiguredProvider prov = ic.getProjectManager().getCurrentProject().getProvider(name);
      prov.start(ic);
      WDTModelDataProvider provider = (WDTModelDataProvider) prov.getLiveProvider();
      boolean added = ((provider != null) ? wdtProviders.add(provider) : false);
      if (!added) {
        // Log and note the provider that was not found...
        LOGGER.finest("WDTCompositeDataProviderImpl unable to find WDT model provider: " + name);
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
        LOGGER.finest("WDTCompositeDataProviderImpl unable to get WDT model: " + provider.getName());
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
    ret.add("providerType", getType());
    JsonArrayBuilder builder = Json.createArrayBuilder();
    for (Root root : getRoots().values()) {
      builder.add(root.toJSON(ic));
    }
    ret.add("lastRootUsed", "edit");
    ret.add("roots", builder);
    ret.add("mode", "standalone");
    if (modelNames != null) {
      JsonArrayBuilder models = Json.createArrayBuilder();
      modelNames.forEach(models::add);
      ret.add("modelNames", models);
    }
    return ret.build();
  }

  @Override
  public boolean isValidPath(String path) {
    return WDTModelBuilder.isValidPath(path);
  }

  @Override
  public void updateStatus(InvocationContext ic) {
  }

  @Override
  public LinkedHashMap<String, String> getStatusMap(InvocationContext ic) {
    LinkedHashMap<String, String> ret = new LinkedHashMap<>();
    return ret;
  }
}
