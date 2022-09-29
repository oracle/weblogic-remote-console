// Copyright (c) 2021, 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.providers;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.logging.Logger;
import javax.json.Json;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;

import org.yaml.snakeyaml.Yaml;
import weblogic.remoteconsole.common.repodef.LocalizedConstants;
import weblogic.remoteconsole.common.utils.WebLogicMBeansVersion;
import weblogic.remoteconsole.common.utils.WebLogicMBeansVersions;
import weblogic.remoteconsole.common.utils.WebLogicVersions;
import weblogic.remoteconsole.server.repo.BeanRepo;
import weblogic.remoteconsole.server.repo.DownloadBeanRepo;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.PageRepo;
import weblogic.remoteconsole.server.repo.weblogic.WDTModelBuilder;
import weblogic.remoteconsole.server.repo.weblogic.WDTModelSchema;
import weblogic.remoteconsole.server.repo.weblogic.WDTPageRepo;
import weblogic.remoteconsole.server.webapp.FailedRequestException;
import weblogic.remoteconsole.server.webapp.ProviderResource;

/**
 * The implementation of the provider for WDT Models.  The model is
 * initialized via an InputStream and parsed immediately into a map
 * representation of the data.
*/
public class WDTModelDataProviderImpl implements WDTModelDataProvider {
  private static final Logger LOGGER = Logger.getLogger(WDTModelDataProviderImpl.class.getName());

  public static final String TYPE_NAME = "WDTModel";
  private String name;
  private String lastMessage = null;
  private Map<String, Object> model = null;
  private Map<String, Root> roots = new HashMap<String, Root>();
  private Root editRoot;
  private boolean isJson = false;
  private List<String> propertyListNames = null;
  private ProviderManager pm = null;

  public WDTModelDataProviderImpl(String name) {
    this.name = name;
    editRoot = new Root(
      this,
      Root.EDIT_NAME,
      Root.CONFIGURATION_ROOT,
      Root.EDIT_LABEL,
      false, // it is not read only
      Root.NAV_TREE_RESOURCE,
      Root.SIMPLE_SEARCH_RESOURCE,
      Root.DOWNLOAD_RESOURCE
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
      test(ic); // Builds the bean tree so we can look for more problems with the model
    } catch (FailedRequestException fre) {
      throw fre;
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
  public void setPropertyListProviders(List<String> propertyListNames, ProviderManager pm) {
    this.pm = pm;
    this.propertyListNames = propertyListNames;
  }

  @Override
  public List<PropertySource> getPropertySources() {
    // No information when no property list references exist
    if (propertyListNames == null) {
      return null;
    }

    // Obtain the property list data providers from the names
    List<PropertyListDataProvider> dataProviders = new ArrayList<>(propertyListNames.size());
    propertyListNames.forEach(name -> {
      PropertyListDataProvider dataProvider = (PropertyListDataProvider)
        pm.getProvider(name, PropertyListDataProviderImpl.TYPE_NAME);
      boolean added = ((dataProvider != null) ? dataProviders.add(dataProvider) : false);
      if (!added) {
        LOGGER.finest("WDTModelDataProviderImpl unable to find Property List provider: " + name);
      }
    });

    // No information if the property list references are not available
    if (dataProviders.isEmpty()) {
      return null;
    }

    // Obtain the list of Properties from the property list data providers
    List<PropertySource> propertySources = new ArrayList<>(dataProviders.size());
    dataProviders.forEach(provider -> {
      propertySources.add(new PropertySourceImpl(
          provider.getName(),
          provider.getResourceData(),
          provider.getProperties()));
    });

    // Done.
    LOGGER.finest("WDTModelDataProviderImpl obtained Property Sources from: " + propertyListNames);
    return propertySources;
  }

  // Information on the property list provider and the supplied properties
  private class PropertySourceImpl implements PropertySource {
    private String name;
    private String resoruceData;
    private Properties properties;

    private PropertySourceImpl(String name, String resoruceData, Properties properties) {
      this.name = name;
      this.resoruceData = resoruceData;
      this.properties = properties;
    }

    @Override
    public String getName() {
      return name;
    }

    @Override
    public String getResourceData() {
      return resoruceData;
    }

    @Override
    public Properties getProperties() {
      return properties;
    }
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
            null, // GA
            WebLogicMBeansVersion.NO_CAPABILITIES
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
        .anyMatch(entry -> WDTModelSchema.KNOWN_SECTIONS.contains(entry.getKey()));
      result = validModel ? parsed : null;
    }
    if (result == null) {
      lastMessage = getNoModelMessage(ic);
    }
    return result;
  }

  // Get the response message when no model is set on the provider
  private String getNoModelMessage(InvocationContext ic) {
    return
      (lastMessage != null)
        ? lastMessage
        : ic.getLocalizer().localizeString(LocalizedConstants.MODEL_INVALID, WDTModelSchema.KNOWN_SECTIONS);
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
    if (propertyListNames != null) {
      JsonArrayBuilder props = Json.createArrayBuilder();
      propertyListNames.forEach(props::add);
      ret.add("propertyLists", props);
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
