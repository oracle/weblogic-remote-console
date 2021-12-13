// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.providers;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.json.Json;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;

import weblogic.remoteconsole.common.repodef.LocalizedConstants;
import weblogic.remoteconsole.common.utils.StringUtils;
import weblogic.remoteconsole.common.utils.WebLogicMBeansVersions;
import weblogic.remoteconsole.common.utils.WebLogicVersions;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.weblogic.WDTCompositePageRepo;
import weblogic.remoteconsole.server.repo.weblogic.WDTModelBuilder;
import weblogic.remoteconsole.server.webapp.FailedRequestException;
import weblogic.remoteconsole.server.webapp.ProviderResource;
import weblogic.remoteconsole.server.webapp.UriUtils;

/**
 * The implementation of the provider for an order list of WDT Models
 * where the models come from other created WDT providers.
*/
public class WDTCompositeDataProviderImpl implements WDTCompositeDataProvider {

  public static final String TYPE_NAME = "WDTCompositeModel";
  private String name;
  private List<WDTModelDataProvider> wdtProviders;
  private String lastMessage = null;
  private List<Map<String, Object>> models = null;
  private Map<String, Root> roots = new HashMap<String, Root>();
  private Root viewRoot;

  public WDTCompositeDataProviderImpl(String name, List<WDTModelDataProvider> wdtProviders) {
    this.name = name;
    this.wdtProviders = wdtProviders;
    String encodedName = StringUtils.urlEncode(name);
    viewRoot = new Root(
      Root.COMPOSITE_CONFIGURATION_NAME,
      Root.CONFIGURATION_ROOT,
      Root.CONFIGURATION_LABEL,
      "/" + UriUtils.API_URI + "/" + encodedName + "/" + Root.COMPOSITE_CONFIGURATION_NAME + "/navtree",
      null, // no change manager
      null, // download is _not_ advertised but can be used to see the composite model
      true  // read only
    );
    roots.put(Root.COMPOSITE_CONFIGURATION_NAME, viewRoot);

    // Fixup - Check and handle when no model from the provider
    // Fixup - Check and handle a WDT provider being removed
    models = new ArrayList<>(wdtProviders.size());
    wdtProviders.forEach(provider -> models.add(provider.getModel()));
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
    if (viewRoot.getPageRepo() == null) {
      if (models == null) {
        // Only provide error message when start fails...
        throw new FailedRequestException(getNoModelMessage(ic));
      }
      viewRoot.setPageRepo(
        new WDTCompositePageRepo(
          WebLogicMBeansVersions.getVersion(
            WebLogicVersions.getCurrentVersion(),
            false // supports security warnings
          ),
          models,
          ic
        )
      );
      lastMessage = null;
    }
    return true;
  }

  // Get the response message when no model is set on the provider
  private String getNoModelMessage(InvocationContext ic) {
    return (lastMessage != null) ? lastMessage : ic.getLocalizer().localizeString(LocalizedConstants.MODEL_INVALID);
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
    if (wdtProviders != null) {
      JsonArrayBuilder models = Json.createArrayBuilder();
      wdtProviders.forEach(p -> models.add(p.getName()));
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
