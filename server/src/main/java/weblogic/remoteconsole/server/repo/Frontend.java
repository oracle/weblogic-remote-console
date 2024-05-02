// Copyright (c) 2022, 2024, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

import java.lang.ref.WeakReference;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import javax.ws.rs.container.ContainerRequestContext;

import weblogic.remoteconsole.common.utils.StringUtils;
import weblogic.remoteconsole.server.ConsoleBackendRuntimeConfig;
import weblogic.remoteconsole.server.providers.ProviderManager;

/**
 * The Frontend class corresponds to one session.  It holds
 * the cookie and keeps a link to the Provider Manager for this particular
 * session.
*/
public class Frontend {
  private String id;
  private String subId;
  private long lastRequestTime;
  private ProviderManager pm = new ProviderManager();
  private static boolean isSameSiteCookieEnabled =
    ConsoleBackendRuntimeConfig.isSameSiteCookieEnabled();
  private static String valueSameSiteCookie =
    ConsoleBackendRuntimeConfig.getSameSiteCookieValue();
  private Map<String, StoredDataObject> storedData = new HashMap<>();

  public Frontend(String id, String subId) {
    this.id = id;
    this.subId = subId;
  }

  public String getID() {
    return id;
  }

  public String getSubID() {
    return subId;
  }

  public String getFullID() {
    return makeFullID(id, subId);
  }

  public static String makeFullID(String id, String subId) {
    return id + "-" + subId;
  }

  public void setLastRequestTime() {
    lastRequestTime = new Date().getTime();
  }

  public long getLastRequestTime() {
    return lastRequestTime;
  }

  public void terminate() {
    pm.terminate();
  }

  public void storeInRequestContext(ContainerRequestContext context) {
    context.setProperty(Frontend.class.getName(), this);
  }

  public static Frontend getFromContext(ContainerRequestContext context) {
    return (Frontend) context.getProperty(Frontend.class.getName());
  }

  public ProviderManager getProviderManager() {
    return pm;
  }

  public boolean isSameSiteCookieEnabled() {
    return isSameSiteCookieEnabled && !StringUtils.isEmpty(valueSameSiteCookie);
  }

  public String getValueSameSiteCookie() {
    return valueSameSiteCookie;
  }

  // Use the key and the reference key to form a single key
  public synchronized Object getData(
    String key,
    Object referenceKey
  ) {
    clean();
    StoredDataObject ret = storedData.get(key + referenceKey);
    if (ret == null) {
      return null;
    }
    return ret.value;
  }

  public void clean() {
    List<String> removeList = new LinkedList<>();
    for (Map.Entry<String, StoredDataObject> entry : storedData.entrySet()) {
      if (entry.getValue().referenceKey.get() == null) {
        removeList.add(entry.getKey());
      }
    }
    for (String key : removeList) {
      storedData.remove(key);
    }
  }

  public synchronized void storeData(
    String key,
    Object referenceKey,
    Object data
  ) {
    storedData.put(
      key + referenceKey, new StoredDataObject(referenceKey, data));
    clean();
  }

  private static class StoredDataObject {
    public WeakReference<Object> referenceKey;
    public Object value;

    private StoredDataObject(Object referenceKey, Object value) {
      this.referenceKey = new WeakReference<Object>(referenceKey);
      this.value = value;
    }
  }
}
