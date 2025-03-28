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
public class WebLogicMBeansVersion {

  // Caches objects associated with this version
  private Map<String, Object> cache = new ConcurrentHashMap<>();

  // Describes the overall WebLogic version
  private WebLogicVersion weblogicVersion;

  // The set of role for viewing the mbeans
  // (since what mbeans a user can see depends on the user's roles)
  private Set<String> roles;

  // The set of console extension capabilities this version supports
  private Set<String> capabilities;

  // The remote console extensions this version supports
  private List<RemoteConsoleExtension> extensions;

  // e.g. WDT doesn't talk to a running server, therefore no
  // remote console REST extension capabilities are available:
  public static final Set<String> NO_CAPABILITIES = Set.of();

  // e.g. the tool for building the english resource bundle wants
  // to generate mappings for all features
  public static final Set<String> ALL_CAPABILITIES = Set.of("All");

  public WebLogicVersion getWebLogicVersion() {
    return weblogicVersion;
  }

  public Set<String> getRoles() {
    return roles;
  }

  public boolean isAccessAllowed(Set<String> rolesAllowed) {
    if (!ConsoleBackendRuntimeConfig.isRestrictContentBasedOnRoles()) {
      return true;
    }
    // Return true if the user is in any of the roles in rolesAllowed, false otherwise
    for (String roleAllowed : rolesAllowed) {
      if (getRoles().contains(roleAllowed)) {
        return true;
      }
    }
    return false;
  }

  public Set<String> getCapabilities() {
    return capabilities;
  }

  public List<RemoteConsoleExtension> getExtensions() {
    return extensions;
  }

  WebLogicMBeansVersion(
    WebLogicVersion weblogicVersion,
    Set<String> roles,
    Set<String> capabilities,
    List<RemoteConsoleExtension> extensions
  ) {
    this.weblogicVersion = weblogicVersion;
    this.roles = roles;
    this.capabilities = capabilities;
    this.extensions = extensions;
  }

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
}
