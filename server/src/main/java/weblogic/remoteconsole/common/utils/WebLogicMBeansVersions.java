// Copyright (c) 2021, 2023, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.utils;

import java.lang.ref.WeakReference;
import java.util.Map;
import java.util.Set;
import java.util.TreeSet;
import java.util.concurrent.ConcurrentHashMap;

/** Contains information about the WebLogic mbean versions that the console supports. */
public class WebLogicMBeansVersions {

  private WebLogicMBeansVersions() {
  }

  // Maps from a weblogic version + roles to a WebLogicMBeansVersion
  private static Map<String, WeakReference<WebLogicMBeansVersion>> versionsMap = new ConcurrentHashMap<>();

  public static WebLogicMBeansVersion getVersion(
    WebLogicVersion weblogicVersion,
    Set<String> capabilities
  ) {
    return getVersion(weblogicVersion, WebLogicRoles.ADMIN_ROLES, capabilities);
  }

  public static WebLogicMBeansVersion getVersion(
    WebLogicVersion weblogicVersion,
    Set<String> roles,
    Set<String> capabilities
  ) {
    String key = computeKey(weblogicVersion, roles, capabilities);
    WeakReference<WebLogicMBeansVersion> ret =
      versionsMap.computeIfAbsent(
        key,
        k -> new WeakReference<WebLogicMBeansVersion>(new WebLogicMBeansVersion(weblogicVersion, roles, capabilities))
      );
    if (ret.get() == null) {
      ret = new WeakReference<WebLogicMBeansVersion>(
        new WebLogicMBeansVersion(weblogicVersion, roles, capabilities));
      versionsMap.put(key, ret);
    }
    return ret.get();
  }

  private static String computeKey(
    WebLogicVersion weblogicVersion,
    Set<String> roles,
    Set<String> capabilities
  ) {
    StringBuilder sb = new StringBuilder();
    sb.append(weblogicVersion.getDomainVersion());
    if (roles.contains(WebLogicRoles.ADMIN)) {
      // The user is an Admin and has permission to do anything.
      // The user's other roles don't matter.
      // Cache under just the Admin role so that the entry
      // can be shared by other users that are in the Admin
      // role plus any other roles.
      roles = WebLogicRoles.ADMIN_ROLES;
    }
    for (String role : new TreeSet<String>(roles)) { // sort the roles
      sb.append("_role_").append(role);
    }
    for (String capability : new TreeSet<String>(capabilities)) { // sort the capabilities
      sb.append("_capability_").append(capability);
    }
    return sb.toString();
  }
}