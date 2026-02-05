// Copyright (c) 2021, 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.utils;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

import weblogic.remoteconsole.server.ConsoleBackendRuntimeConfig;

/**
 * Contains overall information a version of the WebLogic MBeans.
 *
 * Also supports caching objects (by their class) on the version.
 */
public abstract class WebLogicMBeansVersion {

  // e.g. the tool for building the english resource bundle wants
  // to generate mappings for all features
  public static final Set<String> ALL_CAPABILITIES = Set.of("All");

  // Caches objects associated with this version
  private Map<String, Object> cache = new ConcurrentHashMap<>();

  public abstract WebLogicVersion getWebLogicVersion();

  public abstract Set<String> getRoles();

  public boolean isAccessAllowed(Set<String> rolesAllowed) {
    return isAccessAllowed(getRoles(), rolesAllowed);
  }

  public static boolean isAccessAllowed(Set<String> rolesHave, Set<String> rolesAllowed) {
    if (!ConsoleBackendRuntimeConfig.isRestrictContentBasedOnRoles()) {
      return true;
    }
    // Return true if the user is in any of the roles in rolesAllowed, false otherwise
    for (String roleAllowed : rolesAllowed) {
      if (rolesHave.contains(roleAllowed)) {
        return true;
      }
    }
    return false;
  }

  public abstract Set<String> getCapabilities();

  public abstract List<RemoteConsoleExtension> getExtensions();

  private <T> T putCache(Class<T> clazz, T value) {
    // Place the instance object into the cache
    cache.put(clazz.getName(), value);
    return value;
  }

  private <T> T getCache(Class<T> clazz) {
    T result = null;

    // Look for the cached object and cast to the specified type
    Object object = cache.get(clazz.getName());
    if ((object != null) && object.getClass().isAssignableFrom(clazz)) {
      result = clazz.cast(object);
    }

    // Return result or null when not available...
    return result;
  }

  /**
   * Obtain the cached Class type associated with this instance.
   * If there isn't one already cached, use the factory to create one
   * then store it in the cache.
   *
   * @param clazz The class to be created
   */
  public <T> T findOrCreate(Class<T> clazz) {
    T instance = getCache(clazz);
    if (instance == null) {
      synchronized (this) {
        instance = getCache(clazz);
        if (instance == null) {
          try {
            instance =
              putCache(
                clazz,
                clazz.getDeclaredConstructor(WebLogicMBeansVersion.class).newInstance(this)
              );
          } catch (Exception e) {
            // These are all exceptions having to do with reflection and should
            // never happen once we're done writing the code
            throw new AssertionError("Error instantiating " + clazz.getName(), e);
          }
        }
      }
    }
    return instance;
  }

  public boolean isOffline() {
    return this instanceof OfflineWebLogicMBeansVersion;
  }

  public OfflineWebLogicMBeansVersion asOffline() {
    return (OfflineWebLogicMBeansVersion)this;
  }

  public boolean isOnline() {
    return this instanceof OnlineWebLogicMBeansVersion;
  }

  public OnlineWebLogicMBeansVersion asOnline() {
    return (OnlineWebLogicMBeansVersion)this;
  }
}
