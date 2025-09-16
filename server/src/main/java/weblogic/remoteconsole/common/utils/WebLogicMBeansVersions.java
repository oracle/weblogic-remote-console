// Copyright (c) 2021, 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.utils;

import java.lang.ref.WeakReference;
import java.util.Map;
import java.util.Set;
import java.util.TreeSet;
import java.util.concurrent.ConcurrentHashMap;

import weblogic.remoteconsole.server.connection.Connection;

/** Contains information about the WebLogic mbean versions that the console supports. */
public class WebLogicMBeansVersions {

  // Maps from a weblogic version + capabilities to a sharable OfflineWebLogicMBeansVersion
  private static Map<String, WeakReference<OfflineWebLogicMBeansVersion>> offlineVersionsMap =
    new ConcurrentHashMap<>();

  private WebLogicMBeansVersions() {
  }

  public static WebLogicMBeansVersion getVersion(Connection connection) {
    // Online ones can't be shared since each domain can support different
    // discoverable mbean types (like custom resources and custom security providers)
    return new OnlineWebLogicMBeansVersion(connection);
  }

  public static WebLogicMBeansVersion getVersion(WebLogicVersion weblogicVersion, Set<String> capabilities) {
    // Offline ones can be shared since they never vary
    String key = computeOfflineKey(weblogicVersion, capabilities);
    WeakReference<OfflineWebLogicMBeansVersion> ret =
      offlineVersionsMap.computeIfAbsent(
        key,
        k -> new WeakReference<OfflineWebLogicMBeansVersion>(
          new OfflineWebLogicMBeansVersion(weblogicVersion, capabilities)
        )
      );
    if (ret.get() == null) {
      ret = new WeakReference<OfflineWebLogicMBeansVersion>(
        new OfflineWebLogicMBeansVersion(weblogicVersion, capabilities)
      );
      offlineVersionsMap.put(key, ret);
    }
    return ret.get();
  }

  private static String computeOfflineKey(WebLogicVersion weblogicVersion, Set<String> capabilities) {
    StringBuilder sb = new StringBuilder();
    sb.append(weblogicVersion.getDomainVersion());
    for (String capability : new TreeSet<String>(capabilities)) { // sort the capabilities
      sb.append("_capability_").append(capability);
    }
    return sb.toString();
  }
}
