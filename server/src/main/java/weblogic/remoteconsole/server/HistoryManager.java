// Copyright (c) 2026, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server;

import java.util.LinkedList;
import java.util.List;
import java.util.Random;
import javax.ws.rs.core.UriInfo;

import weblogic.remoteconsole.server.repo.InvocationContext;

public class HistoryManager {
  private List<Entry> history = new LinkedList<>();
  private Entry returnedLastTime;

  public BackAndForward record(
    InvocationContext ic,
    String label,
    String resourceData,
    UriInfo uri) {
    if (resourceData.startsWith("/api/-current-/")) {
      resourceData = resourceData.replaceAll("^/api/-current-/",
        "/api/" + ic.getProvider().getName() + "/");
    }
    // First thing to do is see if this entry is within a new provider, in
    // which case, we clear the history
    if (history.size() > 0) {
      String provider = history.get(0).getResourceData().split("/")[2];
      String newProvider = resourceData.split("/")[2];
      if (!provider.equals(newProvider)) {
        history.clear();
      }
    }
    List<String> params = uri.getQueryParameters().get("key");
    // This means that we got here through the history.  We need to find
    // where in the history, to reset the pointer there.
    if (params != null) {
      String key = params.get(0);
      Entry found = null;
      Entry prev = null;
      Entry next = null;
      for (Entry entry : history) {
        if (found != null) {
          next = entry;
          break;
        }
        if (entry.getKey().equals(key)) {
          found = entry;
        } else {
          prev = entry;
        }
      }
      // Theoretically, found == null should never happen, but we'll just treat it
      // like a new entry
      if (found != null) {
        returnedLastTime = found;
        if (prev != null) {
          if (next != null) {
            return new BackAndForward(prev.getResourceData(), next.getResourceData());
          }
          return new BackAndForward(prev.getResourceData(), null);
        } else {
          if (next != null) {
            return new BackAndForward(null, next.getResourceData());
          }
        }
        return new BackAndForward(null, null);
      }
    }
    // If we are creating a new entry and we are in the middle of the history,
    // then we need to chop off the rest of the history.
    if (returnedLastTime != null) {
      int where = history.indexOf(returnedLastTime);
      if (where != -1) {
        history = history.subList(0, where + 1);
      }
      returnedLastTime = null;
    }
    // There can be duplicates in the history, but not consecutively
    if (history.size() > 0) {
      String back = history.get(history.size() - 1).getResourceData();
      String backWithoutKey;
      if (back.contains("?key=")) {
        backWithoutKey = back.substring(0, back.lastIndexOf("?key="));
      } else {
        backWithoutKey = back.substring(0, back.lastIndexOf("&key="));
      }
      if (backWithoutKey.equals(resourceData)) {
        resourceData = null;
      }
    }
    if (resourceData != null) {
      add(label, resourceData);
    }
    String back = null;
    if (history.size() >= 2) {
      back = history.get(history.size() - 2).getResourceData();
    }
    return new BackAndForward(back, null);
  }

  private Entry add(String label, String resourceData) {
    // FortifyIssueSuppression Insecure Randomness
    // It does not need to be secure random
    String key = "" + new Random().nextInt();
    Entry ret;
    if (resourceData.contains("?")) {
      ret = new Entry(label, resourceData + "&key=" + key, key);
    } else {
      ret = new Entry(label, resourceData + "?key=" + key, key);
    }
    history.add(ret);
    return ret;
  }

  public List<Entry> getAll() {
    return history;
  }

  public static class Entry {
    private String label;
    private String resourceData;
    private String key;

    public Entry(String label, String resourceData, String key) {
      this.label = label;
      this.resourceData = resourceData;
      this.key = key;
    }

    public String getLabel() {
      return label;
    }

    public String getResourceData() {
      return resourceData;
    }

    public String getKey() {
      return key;
    }

    public String toString() {
      return resourceData;
    }
  }

  public static class BackAndForward {
    private String back;
    private String forward;

    public BackAndForward(String back, String forward) {
      this.back = back;
      this.forward = forward;
    }

    public String getBack() {
      return back;
    }

    public String getForward() {
      return forward;
    }
  }
}
