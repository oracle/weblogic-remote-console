// Copyright (c) 2021, 2024, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.providers;

import java.io.File;
import java.io.FileInputStream;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.logging.Logger;
import javax.json.Json;
import javax.json.JsonArray;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;
import javax.json.JsonString;
import javax.json.JsonValue;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ResourceContext;

import com.fasterxml.jackson.databind.ObjectMapper;
import weblogic.remoteconsole.common.repodef.LocalizedConstants;
import weblogic.remoteconsole.server.ConsoleBackendRuntime;
import weblogic.remoteconsole.server.PersistenceManager;
import weblogic.remoteconsole.server.repo.Frontend;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.token.SsoTokenManager;

public class ProviderManager {
  private static final Logger LOGGER = Logger.getLogger(ProviderManager.class.getName());
  private static final SsoTokenManager SSO_TOKEN_MANAGER =
    ConsoleBackendRuntime.INSTANCE.getSsoTokenManager();

  private Map<String,Provider> providers = new ConcurrentHashMap<>();

  public AdminServerDataProvider createAdminServerDataProvider(
    String name,
    String label,
    String url,
    String authorizationHeader,
    boolean useSso,
    boolean local) {
    // Ignore the authorization header when using SSO tokens
    String auth = useSso ? null : authorizationHeader;
    AdminServerDataProvider ret = new AdminServerDataProviderImpl(name, label, url, auth, local);
    // Obtain an SSO token ID from the SSO token manager
    ret.setSsoTokenId(useSso ? SSO_TOKEN_MANAGER.add(ret) : null);
    providers.put(name, ret);
    return ret;
  }

  public PropertyListDataProvider createPropertyListDataProvider(String name, String label) {
    PropertyListDataProvider ret = new PropertyListDataProviderImpl(name, label);
    providers.put(name, ret);
    return ret;
  }

  public WDTModelDataProvider createWDTModelDataProvider(String name, String label) {
    WDTModelDataProvider ret = new WDTModelDataProviderImpl(name, label);
    providers.put(name, ret);
    return ret;
  }

  public WDTCompositeDataProvider createWDTCompositeDataProvider(String name, String label, List<String> models) {
    WDTCompositeDataProvider ret = new WDTCompositeDataProviderImpl(name, label, models, this);
    providers.put(name, ret);
    return ret;
  }

  public boolean hasProvider(String name) {
    return providers.containsKey(name);
  }

  public boolean hasProvider(String name, String type) {
    return (providers.containsKey(name) ? providers.get(name).getType().equals(type) : false);
  }

  public Provider getProvider(String name, String type) {
    Provider provider = providers.get(name);
    return (((provider != null) && provider.getType().equals(type)) ? provider : null);
  }

  // Since a ProviderManager doesn't have any state besides the list of
  // providers yet, to terminate the ProviderManager is to destory its providers.
  // However, it is wise to treat these as two different things.
  public void terminate() {
    terminateAllProviders();
  }

  public void terminateAllProviders() {
    for (Provider prov : providers.values()) {
      prov.terminate();
    }
    providers.clear();
  }

  public void deleteProvider(String name) {
    removeSsoToken(name);
    terminateProvider(name);
    providers.remove(name);
  }

  public void terminateProvider(String name) {
    providers.get(name).terminate();
  }

  public void testProvider(String name, InvocationContext ic) {
    providers.get(name).test(ic);
  }

  public boolean startProvider(String name, InvocationContext ic) {
    Provider provider = providers.get(name);
    boolean connected = isProviderConnected(provider);
    boolean started = provider.start(ic);
    if (started && !connected) {
      removeSsoToken(name);
    }
    return started;
  }

  public void removeSsoToken(String name) {
    AdminServerDataProvider provider =
      (AdminServerDataProvider) getProvider(name, AdminServerDataProviderImpl.TYPE_NAME);
    if (provider != null) {
      SSO_TOKEN_MANAGER.remove(provider);
    }
  }

  private boolean isProviderConnected(Provider provider) {
    // Return provider is connected unless determined otherwise!
    boolean result = true;
    if (provider instanceof AdminServerDataProvider) {
      result = ((AdminServerDataProvider)provider).isConnected();
    }
    return result;
  }

  public static ProviderManager getFromContext(ResourceContext context) {
    return Frontend.getFromContext(
      context.getResource(ContainerRequestContext.class)).getProviderManager();
  }

  public Collection<Provider> getAll() {
    return providers.values();
  }

  public static JsonArray getAllHelp(InvocationContext ic) {
    JsonObjectBuilder objectBuilder;
    JsonArrayBuilder ret = Json.createArrayBuilder();

    objectBuilder = Json.createObjectBuilder();
    objectBuilder.add("type", AdminServerDataProviderImpl.TYPE_NAME);
    objectBuilder.add("help", AdminServerDataProviderImpl.getHelp(ic));
    ret.add(objectBuilder.build());

    objectBuilder = Json.createObjectBuilder();
    objectBuilder.add("type", WDTModelDataProviderImpl.TYPE_NAME);
    objectBuilder.add("help", WDTModelDataProviderImpl.getHelp(ic));
    ret.add(objectBuilder.build());

    objectBuilder = Json.createObjectBuilder();
    objectBuilder.add("type", WDTCompositeDataProviderImpl.TYPE_NAME);
    objectBuilder.add("help", WDTCompositeDataProviderImpl.getHelp(ic));
    ret.add(objectBuilder.build());

    objectBuilder = Json.createObjectBuilder();
    objectBuilder.add("type", PropertyListDataProviderImpl.TYPE_NAME);
    objectBuilder.add("help", PropertyListDataProviderImpl.getHelp(ic));
    ret.add(objectBuilder.build());

    return ret.build();
  }

  public JsonObject getJSON(String name, InvocationContext ic) {
    return providers.get(name).toJSON(ic);
  }

  private static JsonObject genDefaultProvider(InvocationContext ic) {
    JsonObjectBuilder provBuilder = Json.createObjectBuilder();
    provBuilder.add("name", ic.getLocalizer().localizeString(LocalizedConstants.DEFAULT_HOSTED_PROVIDER_NAME));
    provBuilder.add("type", "adminserver");
    // We're gonna put a URL in here, but it is going to get overridden
    // when the user tries to connect
    provBuilder.add("url",
      ic.getUriInfo().getRequestUri().getScheme() + "://"
      + ic.getUriInfo().getRequestUri().getHost() + ":"
      + ic.getUriInfo().getRequestUri().getPort());
    JsonObjectBuilder settingsBuilder = Json.createObjectBuilder();
    settingsBuilder.add("local", true);
    provBuilder.add("settings", settingsBuilder.build());
    return provBuilder.build();
  }

  public static JsonObject genDefaultProject(InvocationContext ic) {
    JsonObjectBuilder builder = Json.createObjectBuilder();
    builder.add("name", "Hosted WebLogic Remote Console");
    JsonArrayBuilder childrenBuilder = Json.createArrayBuilder();
    childrenBuilder.add(genDefaultProvider(ic));
    JsonArray otherProviders = loadOtherProviders(ic);
    if (otherProviders != null) {
      for (JsonValue walk : otherProviders) {
        childrenBuilder.add(walk);
      }
    }
    builder.add("dataProviders", childrenBuilder.build());
    builder.add("current", true);
    return builder.build();
  }

  // This seems bad, but it actually makes sense.  The toJSON() method
  // is combination of runtime state and configuration information.  Here
  // we just need the latter.
  private static JsonObject convertToPersistenceFormat(
    Provider prov,
    InvocationContext ic
  ) {
    JsonObject provJSON = prov.toJSON(ic);
    JsonObjectBuilder provBuilder = Json.createObjectBuilder();
    if (provJSON.get("label") != null) {
      provBuilder.add("name", provJSON.getString("label"));
    } else {
      provBuilder.add("name", provJSON.getString("name"));
    }
    // Somehow the name got confused.  Use the one expected
    if (AdminServerDataProviderImpl.TYPE_NAME.equals(provJSON.getString("providerType"))) {
      provBuilder.add("type", "adminserver");
    } else {
      provBuilder.add("type", provJSON.getString("providerType"));
    }
    if (provJSON.get("domainUrl") != null) {
      provBuilder.add("url", provJSON.getString("domainUrl"));
    }
    if (provJSON.get("username") != null) {
      provBuilder.add("username", provJSON.getString("username"));
    }
    if (provJSON.get("file") != null) {
      provBuilder.add("file", provJSON.getString("file"));
    }
    if (provJSON.get("models") != null) {
      JsonArrayBuilder modelBuilder = Json.createArrayBuilder();
      for (JsonString walk : provJSON.getJsonArray("models").getValuesAs(JsonString.class)) {
        modelBuilder.add(walk.getString());
      }
      provBuilder.add("models", modelBuilder.build());
    }
    if (provJSON.get("propertyLists") != null) {
      JsonArrayBuilder propertyListBuilder = Json.createArrayBuilder();
      for (JsonString walk : provJSON.getJsonArray("propertyLists").getValuesAs(JsonString.class)) {
        propertyListBuilder.add(walk.getString());
      }
      provBuilder.add("propertyLists", propertyListBuilder.build());
    }
    JsonObjectBuilder settingsBuilder = Json.createObjectBuilder();
    if (provJSON.get("sso") != null) {
      settingsBuilder.add("sso", provJSON.getBoolean("sso"));
    }
    if (provJSON.get("local") != null) {
      settingsBuilder.add("local", provJSON.getBoolean("local"));
    }
    if (provJSON.get("insecure") != null) {
      settingsBuilder.add("insecure", provJSON.getBoolean("insecure"));
    }
    if (provJSON.get("proxyOverride") != null) {
      settingsBuilder.add("proxyOverride", provJSON.getString("proxyOverride"));
    }
    JsonObject settings = settingsBuilder.build();
    if (!settings.isEmpty()) {
      provBuilder.add("settings", settings);
    }
    return provBuilder.build();
  }

  private static boolean isProviderLocal(Provider prov) {
    if (prov instanceof AdminServerDataProvider) {
      return ((AdminServerDataProvider) prov).isLocal();
    }
    return false;
  }

  private JsonArray getJSONOtherConfiguredProviders(InvocationContext ic) {
    JsonArrayBuilder childrenBuilder = Json.createArrayBuilder();
    boolean foundOne = false;
    for (Provider prov : providers.values()) {
      if (!isProviderLocal(prov)) {
        foundOne = true;
        childrenBuilder.add(convertToPersistenceFormat(prov, ic));
      }
    }
    if (!foundOne) {
      return null;
    }
    return childrenBuilder.build();
  }

  public void save(InvocationContext ic) {
    if (!PersistenceManager.shouldIPersistProjects(ic)) {
      return;
    }
    String path = PersistenceManager.getPersistenceFilePath(ic);

    if (path == null) {
      return;
    }
    String fullPath = path + "/user-projects.json";
    JsonArray other = getJSONOtherConfiguredProviders(ic);
    if (other == null) {
      new File(fullPath).delete();
      return;
    }
    JsonObjectBuilder builder = Json.createObjectBuilder();
    builder.add("name", "Hosted WebLogic Remote Console");
    builder.add("label", "Hosted WebLogic Remote Console");
    builder.add("dataProviders", other);
    builder.add("current", true);
    try {
      ObjectMapper mapper = new ObjectMapper();
      mapper.writerWithDefaultPrettyPrinter().writeValue(
        new File(fullPath),
        mapper.readValue(builder.build().toString(), Object.class)
      );
    } catch (Throwable t) {
      LOGGER.severe(
        "Problem writing" + " " + fullPath + ": " + t.getMessage()
      );
    }
  }

  private static JsonArray loadOtherProviders(InvocationContext ic) {
    String path = PersistenceManager.getPersistenceFilePath(ic);
    if (path == null) {
      return null;
    }
    String fullPath = path + "/user-projects.json";
    if (!new File(fullPath).exists()) {
      return null;
    }
    try (FileInputStream is = new FileInputStream(fullPath)) {
      JsonObject in = Json.createReader(is).readObject();
      return in.getJsonArray("dataProviders");
    } catch (Throwable t) {
      // FortifyIssueSuppression Log Forging
      // This path name comes from our own code only
      LOGGER.severe(
        "Problem reading" + " " + fullPath + ": " + t.getMessage()
      );
    }
    return null;
  }
}
