// Copyright (c) 2022, 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

import java.lang.ref.WeakReference;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import javax.json.Json;
import javax.json.JsonObject;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ResourceContext;
import javax.ws.rs.sse.Sse;
import javax.ws.rs.sse.SseEventSink;

import weblogic.console.utils.StringUtils;
import weblogic.remoteconsole.server.BookmarkManager;
import weblogic.remoteconsole.server.ConsoleBackendRuntimeConfig;
import weblogic.remoteconsole.server.HistoryManager;
import weblogic.remoteconsole.server.providers.ProjectManager;

/**
 * The Frontend class corresponds to one session.  It holds
 * the cookie and keeps a link to the Provider Manager for this particular
 * session.
*/
public class Frontend {
  private String id;
  private String subId;
  private SseEventSink sseSink;
  private Sse sseObject;
  private JsonObject contexts = Json.createObjectBuilder().build();
  private long lastRequestTime;
  private ProjectManager projectManager;
  private HistoryManager historyManager = new HistoryManager();
  private BookmarkManager bookmarkManager = new BookmarkManager();
  private static boolean isSameSiteCookieEnabled =
    ConsoleBackendRuntimeConfig.isSameSiteCookieEnabled();
  private static String valueSameSiteCookie =
    ConsoleBackendRuntimeConfig.getSameSiteCookieValue();
  private Map<String, StoredDataObject> storedData = new HashMap<>();

  public Frontend(String id, String subId) {
    this.id = id;
    this.subId = subId;
  }

  public void initIfNeeded(InvocationContext ic) {
    if (projectManager == null) {
      projectManager = new ProjectManager(ic);
    }
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
    getProjectManager().terminate();
    if (sseSink != null) {
      sseSink.close();
      sseSink = null;
      sseObject = null;
    }
  }

  public void storeInRequestContext(ContainerRequestContext context) {
    context.setProperty(Frontend.class.getName(), this);
  }

  public static Frontend getFromContext(ContainerRequestContext context) {
    return (Frontend) context.getProperty(Frontend.class.getName());
  }

  public static Frontend getFromContext(ResourceContext context) {
    return Frontend.getFromContext(
      context.getResource(ContainerRequestContext.class));
  }

  public ProjectManager getProjectManager() {
    return projectManager;
  }

  public HistoryManager getHistoryManager() {
    return historyManager;
  }

  public BookmarkManager getBookmarkManager() {
    return bookmarkManager;
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

  public void setSSESink(SseEventSink sseSink) {
    this.sseSink = sseSink;
  }

  public void setSSEObject(Sse sseObject) {
    this.sseObject = sseObject;
  }

  public SseEventSink getSSESink() {
    if (sseSink == null) {
      for (Frontend other : FrontendManager. getFrontendsWithID(id)) {
        if (other.sseSink != null) {
          sseSink = other.sseSink;
          sseObject = other.sseObject;
          return sseSink;
        }
      }
    }
    return sseSink;
  }

  public Sse getSSEObject() {
    return sseObject;
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

  public synchronized void removeData(String key, Object referenceKey) {
    storedData.remove(key + referenceKey);
    clean();
  }

  public JsonObject getContexts() {
    return contexts;
  }

  public void setContexts(JsonObject contexts) {
    this.contexts = contexts;
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
