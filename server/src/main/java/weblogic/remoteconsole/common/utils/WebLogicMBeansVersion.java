// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.utils;

import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

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

  // Whether this version supports security warnings
  // (i.e. is using the PSU that adds their mbeans)
  private boolean supportsSecurityWarnings;

  // The set of role for viewing the mbeans
  // (since what mbeans a user can see depends on the user's roles)
  private Set<String> roles;

  public WebLogicVersion getWebLogicVersion() {
    return weblogicVersion;
  }

  public boolean isSupportsSecurityWarnings() {
    return supportsSecurityWarnings;
  }

  public Set<String> getRoles() {
    return roles;
  }

  WebLogicMBeansVersion(
    WebLogicVersion weblogicVersion,
    boolean supportsSecurityWarnings,
    Set<String> roles
  ) {
    this.weblogicVersion = weblogicVersion;
    this.supportsSecurityWarnings = supportsSecurityWarnings;
    this.roles = roles;
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
