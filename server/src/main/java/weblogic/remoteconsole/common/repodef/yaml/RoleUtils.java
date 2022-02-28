// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.yaml;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import weblogic.remoteconsole.common.repodef.schema.BeanActionDefSource;
import weblogic.remoteconsole.common.repodef.schema.BeanPropertyDefSource;
import weblogic.remoteconsole.common.repodef.schema.BeanTypeDefSource;
import weblogic.remoteconsole.common.repodef.schema.NavTreeNodeDefSource;
import weblogic.remoteconsole.common.repodef.schema.RolesDefSource;
import weblogic.remoteconsole.common.utils.WebLogicRoles;

/**
 * Utilities to calculate which roles are allowed to access a feature.
 * 
 * It must match the same rules as WebLogic, i.e. weblogic.management.internal.DefaultJMXPolicyManager
 */
class RoleUtils {

  private RoleUtils() {
  }

  static Set<String> computeGetRoles(BeanTypeDefSource typeSource, BeanPropertyDefSource propertySource) {
    // There are no WebLogic role annotations at the type level for controlling GET access.
    // If the roles are specified at the property level, use them.
    // Otherwise, use ADMIN if it's a sensitive/encrypted property and use ALL if not.
    Set<String> roles = computeRoles(propertySource.getGetRoles());
    if (roles == null) {
      if (propertySource.isEncrypted() || propertySource.isSensitive()) {
        roles = WebLogicRoles.ADMIN_ROLES;
      } else {
        // Note: DefaultJMXPolicyManager only allows Admin, Deployer, Operator and Monitor
        // if the domain is in secure mode, and allows any user otherwise.
        // However, the WebLogic REST api only grants access to those four roles.
        // Since the remote console only uses the WebLogic REST api (v.s. e.g. the JMX api),
        // we can simplify the logic and always only allow those roles.
        roles = WebLogicRoles.ALL;
      }
    }
    return roles;
  }

  static Set<String> computeNavTreeNodeRoles(NavTreeNodeDefSource nodeSource) {
    // If the roles are specified at the node level, use them.
    // Otherwise, use ALL.
    Set<String> roles = computeRoles(nodeSource.getRoles());
    if (roles == null) {
      roles = WebLogicRoles.ALL;
    }
    return roles;
  }

  static Set<String> computeSetRoles(BeanTypeDefSource typeSource, BeanPropertyDefSource propertySource) {
    // If the roles are specified at the property level, use them.
    // Else if the roles are specified at the type level, use them.
    // Otherwise use ADMIN.
    Set<String> roles = computeRoles(propertySource.getSetRoles());
    if (roles == null) {
      roles = computeRoles(typeSource.getRoles());
    }
    if (roles == null) {
      roles = WebLogicRoles.ADMIN_ROLES;
    }
    return roles;
  }

  static Set<String> computeCreateRoles(BeanTypeDefSource typeSource, BeanPropertyDefSource propertySource) {
    // There are no WebLogic annotations at the property level for controlling CREATE access.
    // If the roles are specified at the type level, use them.
    // Otherwise use ADMIN.
    Set<String> roles = computeRoles(typeSource.getRoles());
    if (roles == null) {
      roles = WebLogicRoles.ADMIN_ROLES;
    }
    return roles;
  }

  static Set<String> computeDeleteRoles(BeanTypeDefSource typeSource, BeanPropertyDefSource propertySource) {
    // Same rules as create
    return computeCreateRoles(typeSource, propertySource);
  }

  static Set<String> computeInvokeRoles(BeanTypeDefSource typeSource, BeanActionDefSource actionSource) {
    // If the roles are specified at the action level, use them.
    // Else if the roles are specified at the type level, use them.
    // Otherwise use ADMIN.
    Set<String> roles = computeRoles(actionSource.getRoles());
    if (roles == null) {
      roles = computeRoles(typeSource.getRoles());
    }
    if (roles == null) {
      roles = WebLogicRoles.ADMIN_ROLES;
    }
    return roles;
  }

  private static Set<String> computeRoles(RolesDefSource rolesSource) {
    if (rolesSource != null) {
      List<String> allowed = rolesSource.getAllowed();
      if (!allowed.isEmpty()) {
        Set<String> roles = new HashSet<>(allowed);
        // Admin is always implied:
        roles.add(WebLogicRoles.ADMIN);
        return roles;
      }
      if (rolesSource.isPermitAll()) {
        return WebLogicRoles.ALL;
      }
    }
    return null; // no roles specified
  }
}
