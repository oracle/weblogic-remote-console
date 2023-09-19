// Copyright (c) 2021, 2023, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.providers;

import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import javax.json.Json;
import javax.json.JsonArray;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ResourceContext;

import weblogic.remoteconsole.server.ConsoleBackendRuntime;
import weblogic.remoteconsole.server.repo.Frontend;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.token.SsoTokenManager;

public class ProviderManager {
  private static final SsoTokenManager SSO_TOKEN_MANAGER =
    ConsoleBackendRuntime.INSTANCE.getSsoTokenManager();

  private Map<String,Provider> providers = new ConcurrentHashMap<>();

  public AdminServerDataProvider createAdminServerDataProvider(
    String name,
    String url,
    String authorizationHeader,
    boolean useSso) {
    // Ignore the authorization header when using SSO tokens
    String auth = useSso ? null : authorizationHeader;
    AdminServerDataProvider ret = new AdminServerDataProviderImpl(name, url, auth);
    // Obtain an SSO token ID from the SSO token manager
    ret.setSsoTokenId(useSso ? SSO_TOKEN_MANAGER.add(ret) : null);
    providers.put(name, ret);
    return ret;
  }

  public PropertyListDataProvider createPropertyListDataProvider(String name) {
    PropertyListDataProvider ret = new PropertyListDataProviderImpl(name);
    providers.put(name, ret);
    return ret;
  }

  public WDTModelDataProvider createWDTModelDataProvider(String name) {
    WDTModelDataProvider ret = new WDTModelDataProviderImpl(name);
    providers.put(name, ret);
    return ret;
  }

  public WDTCompositeDataProvider createWDTCompositeDataProvider(String name, List<String> models) {
    WDTCompositeDataProvider ret = new WDTCompositeDataProviderImpl(name, models, this);
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
}
