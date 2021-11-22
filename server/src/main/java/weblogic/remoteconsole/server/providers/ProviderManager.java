// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.providers;

import java.util.Collection;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import javax.json.JsonObject;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ResourceContext;

import weblogic.remoteconsole.server.repo.Frontend;
import weblogic.remoteconsole.server.repo.InvocationContext;

public class ProviderManager {
  private Map<String,Provider> providers = new ConcurrentHashMap<>();

  public AdminServerDataProvider createAdminServerDataProvider(
    String name,
    String url,
    String authorizationHeader) {
    AdminServerDataProvider ret = new AdminServerDataProviderImpl(name, url, authorizationHeader);
    providers.put(name, ret);
    return ret;
  }

  public WDTModelDataProvider createWDTModelDataProvider(String name) {
    WDTModelDataProvider ret = new WDTModelDataProviderImpl(name);
    providers.put(name, ret);
    return ret;
  }

  public boolean hasProvider(String name) {
    return providers.containsKey(name);
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
    return providers.get(name).start(ic);
  }

  public static ProviderManager getFromContext(ResourceContext context) {
    return Frontend.getFromContext(
      context.getResource(ContainerRequestContext.class)).getProviderManager();
  }

  public Collection<Provider> getAll() {
    return providers.values();
  }

  public JsonObject getJSON(String name, InvocationContext ic) {
    return providers.get(name).toJSON(ic);
  }
}
