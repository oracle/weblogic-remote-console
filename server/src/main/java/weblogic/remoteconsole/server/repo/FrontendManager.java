// Copyright (c) 2021, 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

import java.util.Collection;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;

/**
 * The FrontendManager keeps a table of Frontends.  One key function is that the
 * FrontendManager is the piece of code which keeps the cache of frontends and
 * expires them.  The default policy is that once there are more than 10
 * frontends, expire any frontend that hasn't been touched in more than an hour.
 * Once there are 10 * 10 entries, kick out the oldest.
*/
public class FrontendManager {
  private static final Logger LOGGER = Logger.getLogger(FrontendManager.class.getName());
  private static Map<String, Frontend> frontends = new HashMap<>();
  private static final int MAX_ENTRIES_CHECK = 10;
  private static final int HOUR = 3600 * 1000;

  public static synchronized Frontend find(String id, String subId) {
    return frontends.get(Frontend.makeFullID(id, subId));
  }

  public static synchronized Frontend create(String id, String subId) {
    Frontend ret = new Frontend(id, subId);
    if (frontends.size() >= MAX_ENTRIES_CHECK) {
      Frontend oldest = null;
      for (Frontend walk : frontends.values()) {
        if (oldest == null) {
          oldest = walk;
        } else if (walk.getLastRequestTime() < oldest.getLastRequestTime()) {
          oldest = walk;
        }
      }
      if ((frontends.size() > 10 * MAX_ENTRIES_CHECK)
          || (oldest.getLastRequestTime() + HOUR < new Date().getTime())) {
        LOGGER.fine("Terminating frontend: " + oldest.getFullID() + ", " + oldest);
        oldest.terminate();
        frontends.remove(oldest.getFullID());
      }
    }
    LOGGER.fine("Creating frontend with ID: " + ret.getID());
    frontends.put(id + "-" + subId, ret);
    return ret;
  }

  public static synchronized boolean destroy(String id) {
    boolean ret = false;
    // Clone the list to avoid a ConcurrentModificationException
    for (Frontend frontend : new LinkedList<Frontend>(frontends.values())) {
      if (frontend.getID().equals(id)) {
        frontend.terminate();
        frontends.remove(frontend.getFullID());
        ret = true;
      }
    }
    return ret;
  }

  public static Collection<Frontend> getFrontendsWithID(String id) {
    List<Frontend> ret = new LinkedList<>();
    for (Frontend frontend : frontends.values()) {
      if (frontend.getID().equals(id)) {
        ret.add(frontend);
      }
    }
    return ret;
  }
}
