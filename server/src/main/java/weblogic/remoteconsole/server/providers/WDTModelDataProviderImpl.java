// Copyright (c) 2021, 2026, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.providers;

import java.io.FileInputStream;
import java.io.FileWriter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.logging.Logger;
import javax.json.Json;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.yaml.snakeyaml.Yaml;
import weblogic.remoteconsole.common.repodef.LocalizedConstants;
import weblogic.remoteconsole.common.utils.WebLogicMBeansVersions;
import weblogic.remoteconsole.common.utils.WebLogicVersion;
import weblogic.remoteconsole.common.utils.WebLogicVersions;
import weblogic.remoteconsole.server.repo.BeanRepo;
import weblogic.remoteconsole.server.repo.DownloadBeanRepo;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.PageRepo;
import weblogic.remoteconsole.server.repo.weblogic.WDTCapabilities;
import weblogic.remoteconsole.server.repo.weblogic.WDTModelBuilder;
import weblogic.remoteconsole.server.repo.weblogic.WDTModelSchema;
import weblogic.remoteconsole.server.repo.weblogic.WDTPageRepo;
import weblogic.remoteconsole.server.webapp.FailedRequestException;

/**
 * The implementation of the provider for WDT Models.  The model is
 * parsed immediately into a map representation of the data.
*/
public class WDTModelDataProviderImpl implements WDTModelDataProvider {
  private static final Logger LOGGER = Logger.getLogger(WDTModelDataProviderImpl.class.getName());

  public static final String TYPE_NAME = "WDTModel";
  private String name;
  private Map<String, Object> model = null;
  private Map<String, Root> roots = new HashMap<String, Root>();
  private Root editRoot;
  private boolean isJson = false;
  private List<String> propertyListNames = null;
  private String fileName;

  private void makeRoots() {
    editRoot = new Root(
      this,
      Root.EDIT_NAME,
      Root.CONFIGURATION_ROOT,
      Root.EDIT_LABEL,
      LocalizedConstants.EDIT_DESCRIPTION,
      false, // it is not read only
      Root.NAV_TREE_RESOURCE,
      Root.SIMPLE_SEARCH_RESOURCE
    );
    roots.put(Root.EDIT_NAME, editRoot);
  }

  public WDTModelDataProviderImpl(String name, String fileName) {
    this.name = name;
    this.fileName = fileName;
    isJson = fileName.endsWith(".json");
    makeRoots();
  }

  public void parseModel(InvocationContext ic) {
    try (FileInputStream fis = new FileInputStream(fileName)) {
      // Parse and return exceptions from the parse...
      Object parsedModel = new Yaml().load(fis);
      model = getAcceptableModel(parsedModel, ic);
      start(ic); // Builds the bean tree so we can look for more problems with the model
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
      String message = walk.getMessage();
      if (message == null) {
        message = getNoModelMessage(ic);
      }
      throw new FailedRequestException(message);
    }
    // Return failure when no model available!
    if (model == null) {
      throw new FailedRequestException(toJSON(ic));
    }
  }

  @Override
  public Map<String, Object> getModel(InvocationContext ic) {
    if (model == null) {
      parseModel(ic);
    }
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
  public List<PropertySource> getPropertySources(InvocationContext ic) {
    // No information when no property list references exist
    if (propertyListNames == null) {
      return null;
    }

    // Obtain the property list data providers from the names
    List<PropertyListDataProvider> dataProviders = new ArrayList<>(propertyListNames.size());
    propertyListNames.forEach(name -> {
      PropertyListDataProvider dataProvider = (PropertyListDataProvider)
        null; // was pm.getProvider(name, PropertyListDataProviderImpl.TYPE_NAME);
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
  public boolean start(InvocationContext ic) {
    ic.setProvider(this);
    if (editRoot.getPageRepo() == null) {
      if (model == null) {
        // Only provide error message when start fails...
        parseModel(ic);
      }
      WebLogicVersion weblogicVersion = WebLogicVersions.getLatestVersion();
      editRoot.setPageRepo(
        new WDTPageRepo(
          WebLogicMBeansVersions.getVersion(
            weblogicVersion,
            WDTCapabilities.getCapabilities(weblogicVersion)
          ),
          model,
          ic
        )
      );
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
    return result;
  }

  // Get the response message when no model is set on the provider
  private String getNoModelMessage(InvocationContext ic) {
    return ic.getLocalizer().localizeString(
      LocalizedConstants.MODEL_INVALID, WDTModelSchema.KNOWN_SECTIONS);
  }

  @Override
  public Map<String, Root> getRoots() {
    return roots;
  }

  @Override
  public void updateLastRootUsed(String root) {
    // There's only one
  }

  @Override
  public String getLastRootUsed() {
    return Root.EDIT_NAME;
  }

  public static void saveNew(InvocationContext ic, String fileName) {
    try (FileWriter writer = new FileWriter(fileName)) {
      if (fileName.endsWith(".json")) {
        JsonObject json = Json.createObjectBuilder()
          .add("domainInfo", Json.createObjectBuilder()
            .add("AdminUserName", "@@PROP:ADMIN_USERNAME@@")
            .add("AdminPassword", "@@PROP:ADMIN_PASSWORD@@"))
          .add("topology", Json.createObjectBuilder()
            .add("domainInfo", Json.createObjectBuilder())).build();
        ObjectMapper mapper = new ObjectMapper();
        mapper.writerWithDefaultPrettyPrinter().writeValue(
          writer, mapper.readValue(json.toString(), Object.class));
      } else {
        String init =
          "domainInfo:\n"
          + "  AdminUserName: '@@PROP:ADMIN_USERNAME@@'\n"
          + "  AdminPassword: '@@PROP:ADMIN_PASSWORD@@'\n"
          + "topology:\n"
          + "  Server:\n"
          + "    AdminServer:\n";
        writer.write(init, 0, init.length());
      }
    } catch (Exception e) {
      throw new WebApplicationException(Response.status(
        Status.UNAUTHORIZED.getStatusCode(),
         e.getMessage()).build());
    }
  }

  public static void save(InvocationContext ic, String fileName, String contents) {
    try (FileWriter writer = new FileWriter(fileName)) {
      writer.write(contents, 0, contents.length());
    } catch (Exception e) {
      throw new WebApplicationException(Response.status(
        Status.UNAUTHORIZED.getStatusCode(),
         e.getMessage()).build());
    }
  }

  @Override
  public void save(InvocationContext ic) {
    DownloadBeanRepo drepo = (DownloadBeanRepo) ic.getPageRepo().getBeanRepo();
    try (FileWriter writer = new FileWriter(fileName)) {
      drepo.download(writer, ic);
    } catch (Exception e) {
      throw new WebApplicationException(Response.status(
        Status.UNAUTHORIZED.getStatusCode(),
         e.getMessage()).build());
    }
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
    if (propertyListNames != null) {
      JsonArrayBuilder props = Json.createArrayBuilder();
      propertyListNames.forEach(props::add);
      ret.add("propertyLists", props);
    }
    return ret.build();
  }

  @Override
  public boolean isValidPath(String path) {
    return WDTModelBuilder.isValidPath(path);
  }

  @Override
  public boolean supportsShoppingCart() {
    return false;
  }

  @Override
  public boolean isShoppingCartEmpty() {
    return true;
  }

  @Override
  public void setIsShoppingCartEmpty(boolean isEmpty) {
    // We could assert here
  }

  @Override
  public void updateStatus(InvocationContext ic) {
  }

  @Override
  public LinkedHashMap<String, String> getStatusMap(InvocationContext ic) {
    LinkedHashMap<String, String> ret = new LinkedHashMap<>();
    ret.put("introductionHTML", ic.getLocalizer().localizeString(
      LocalizedConstants.WDT_MODEL_STATUS_INTRODUCTION, getName()));
    ret.put("Name", getName());
    ret.put("Provider Type", getType());
    ret.put("State", "Active");
    ret.put("INDIRECT-File Contents", "/api/-current-/edit/download");
    return ret;
  }
}
