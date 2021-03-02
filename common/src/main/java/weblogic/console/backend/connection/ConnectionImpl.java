// Copyright (c) 2020, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.connection;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import javax.ws.rs.client.Client;

/** The implementation of Connection interface holding connection information */
public class ConnectionImpl implements Connection, ConnectionLifecycleCache {
  // Connection State
  private String id;
  private String domainUrl;
  private String domainName;
  private String domainVersion;
  private String username;
  private Client client;

  // Connection Lifecycle Cache
  private ConcurrentHashMap<Class<?>, ConnectionCached> cache = new ConcurrentHashMap<>();

  /** Package level contructor for use by the ConnectionManager */
  ConnectionImpl(
    String id,
    String domainUrl,
    String domainName,
    String domainVersion,
    String username,
    Client client
  ) {
    this.id = id;
    this.domainUrl = domainUrl;
    this.domainName = domainName;
    this.domainVersion = domainVersion;
    this.username = username;
    this.client = client;
  }

  @Override
  public String getId() {
    return id;
  }

  @Override
  public String getDomainUrl() {
    return domainUrl;
  }

  @Override
  public String getDomainName() {
    return domainName;
  }

  @Override
  public String getDomainVersion() {
    return domainVersion;
  }

  @Override
  public String getUsername() {
    return username;
  }

  @Override
  public Client getClient() {
    return client;
  }

  @Override
  public <T extends ConnectionCached> T putCache(Class<T> key, T value) {
    // Place the instance object into the cache
    cache.put(key, value);
    return value;
  }

  @Override
  public Map<Class<?>, ConnectionCached> getCache() {
    return cache;
  }

  @Override
  public <T> T getCache(Class<T> key) {
    T result = null;

    // Look for the cached object and cast to the specified type
    ConnectionCached object = cache.get(key);
    if ((object != null) && object.getClass().isAssignableFrom(key)) {
      result = key.cast(object);
    }

    // Return result or null when not available...
    return result;
  }
}
