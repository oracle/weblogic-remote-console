// Copyright (c) 2021, 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.providers;

import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import javax.json.Json;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;

import org.yaml.snakeyaml.Yaml;
import weblogic.remoteconsole.common.repodef.LocalizedConstants;
import weblogic.remoteconsole.common.utils.StringUtils;
import weblogic.remoteconsole.common.utils.WebLogicMBeansVersions;
import weblogic.remoteconsole.common.utils.WebLogicVersions;
import weblogic.remoteconsole.server.repo.BeanRepo;
import weblogic.remoteconsole.server.repo.DownloadBeanRepo;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.PageRepo;
import weblogic.remoteconsole.server.repo.weblogic.WDTModelBuilder;
import weblogic.remoteconsole.server.repo.weblogic.WDTPageRepo;
import weblogic.remoteconsole.server.webapp.FailedRequestException;
import weblogic.remoteconsole.server.webapp.ProviderResource;
import weblogic.remoteconsole.server.webapp.UriUtils;

/**
 * The implementation of the provider for WDT Models.  The model is
 * initialized via an InputStream and parsed immediately into a map
 * representation of the data.
*/
public class WDTModelDataProviderImpl implements WDTModelDataProvider {
  public static final Set<String> WDT_MODEL_SECTIONS =
    Set.of("domainInfo","topology","resources","appDeployments","kubernetes");

  public static final String TYPE_NAME = "WDTModel";
  private String name;
  private String lastMessage = null;
  private Map<String, Object> model = null;
  private Map<String, Root> roots = new HashMap<String, Root>();
  private Root editRoot;
  private boolean isJson = false;

  public WDTModelDataProviderImpl(String name) {
    this.name = name;
    String encodedName = StringUtils.urlEncode(name);
    editRoot = new Root(
      Root.EDIT_NAME,
      Root.CONFIGURATION_ROOT,
      Root.EDIT_LABEL,
      "/" + UriUtils.API_URI + "/" + encodedName + "/" + Root.EDIT_NAME + "/navtree",
      null, // no change manager
      "/" + UriUtils.API_URI + "/" + encodedName + "/" + Root.EDIT_NAME + "/download",
      false // it is not read only
    );
    roots.put(Root.EDIT_NAME, editRoot);
  }

  @Override
  public void parseModel(InputStream is, boolean isJson, InvocationContext ic) {
    try {
      // Parse and return exceptions from the parse...
      this.isJson = isJson;
      Object parsedModel = new Yaml().load(is);
      model = getAcceptableModel(parsedModel, ic);
    } catch (Exception e) {
      Throwable walk = e;
      for ( ; ; ) {
        if (walk.getCause() == null) {
          break;
        }
        walk = walk.getCause();
      }
      lastMessage = walk.getMessage();
      if (lastMessage == null) {
        System.err.println("The exception " + walk + "(" + walk.getClass() + ") has no message");
      }
      throw new FailedRequestException(toJSON(ic));
    }
    // Return failure when no model available!
    if (model == null) {
      throw new FailedRequestException(toJSON(ic));
    }
  }

  @Override
  public Map<String, Object> getModel(InvocationContext ic) {
    // IFF provider has not been started, return the uploaded model
    PageRepo pageRepo = editRoot.getPageRepo();
    if (pageRepo == null) {
      return model;
    }

    // IFF provider does NOT support download return uploaded model
    BeanRepo beanRepo = pageRepo.getBeanRepo();
    if (!(beanRepo instanceof DownloadBeanRepo)) {
      return model;
    }

    // Otherwise get the current model from BeanRepo
    return ((DownloadBeanRepo)beanRepo).getContent(ic);
  }

  @Override
  public boolean isJson() {
    return isJson;
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
    if (editRoot.getPageRepo() == null) {
      if (model == null) {
        // Only provide error message when start fails...
        throw new FailedRequestException(getNoModelMessage(ic));
      }
      editRoot.setPageRepo(
        new WDTPageRepo(
          WebLogicMBeansVersions.getVersion(
            WebLogicVersions.getCurrentVersion(),
            null // GA
          ),
          model,
          ic
        )
      );
      lastMessage = null;
    }
    return true;
  }

  // Perform a basic validation of the parsed model and then
  // return NULL when the model is not considered valid...
  @SuppressWarnings("unchecked")
  private Map<String, Object> getAcceptableModel(Object parsedModel, InvocationContext ic) {
    Map<String, Object> result = null;
    if (parsedModel instanceof Map) {
      Map<String, Object> parsed = (Map<String, Object>) parsedModel;
      boolean validModel = parsed.entrySet().stream()
        .anyMatch(entry -> WDT_MODEL_SECTIONS.contains(entry.getKey()));
      result = validModel ? parsed : null;
    }
    if (result == null) {
      lastMessage = getNoModelMessage(ic);
    }
    return result;
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
