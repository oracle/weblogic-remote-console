// Copyright (c) 2020, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.connection;

import java.util.Map;

/**
 * The ConnectionLifecycleCache interface is used for caching and obtaining objects that are
 * associated with the lifecycle of a Console Backend Connection.
 * <p>
 * The Connection created by the Connection Manager implements ConnectionLifecycleCache such that
 * the Console Backend resources can cache objects used with a specific WebLogic Domain connection.
 */
public interface ConnectionLifecycleCache {

  /**
   * Place an instance of the Class type into the Connection cache.
   *
   * @param key The Class type for cached object
   * @param value The instance to be placed into the Connection cache
   */
  public <T extends ConnectionCached> T putCache(Class<T> key, T value);

  /**
   * Obtain the cached Class type associated with the Connection.
   *
   * @param key The Class type used to place the object into the cache
   */
  public <T> T getCache(Class<T> key);

  /** Obtain all the cached Connection objects (for the Connection Manager). */
  public Map<Class<?>, ConnectionCached> getCache();
}
