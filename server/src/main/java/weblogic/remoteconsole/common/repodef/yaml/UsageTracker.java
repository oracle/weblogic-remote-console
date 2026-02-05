// Copyright (c) 2024, 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.yaml;

import java.util.Set;
import java.util.TreeSet;

/**
 * Yaml-based implementation of the BeanRepoDef interface.
 */
public class UsageTracker {

  private static boolean trackUsage = false;

  private static Set<String> used = new TreeSet<>();
  private static Set<String> notFound = new TreeSet<>();

  static {
    // known and vetted complaints:

    // Aggregated types don't include the slice tables of the unaggregated types:
    used.add("slice AggregatedJMSServerRuntimeMBean Transactions");
    used.add("slice AggregatedJTARuntimeMBean Transactions");
    used.add("slice AggregatedDomainKeystoresServerRuntimeMBean MachineIdentityKeystore");
    used.add("slice AggregatedDomainKeystoresServerRuntimeMBean MachineTrustKeystore");
    used.add("slice AggregatedDomainKeystoresServerRuntimeMBean ServerIdentityKeystore");
    used.add("slice AggregatedDomainKeystoresServerRuntimeMBean ServerTrustKeystore");

    // Tables for heterogenous types can include columns that only some derived types have:
    used.add("property AggregatedComponentRuntimeMBean ContextRootURL");
    used.add("property MessageDrivenDescriptorDBean EjbClass");

    // publishSingleSignOnServices declared in CombinedServerRuntimeMBean but referred
    // to by a ServerRuntimeMBean form.  It works.  Not worth addressing.
    used.add("action DelegatedServerRuntimeServerRuntimeMBean publishSingleSignOnServices");

    // I think this is because these three authenticators have been removed in some releases.
    used.add("property IPlanetAuthenticatorMBean UserDescriptionAttribute");
    used.add("property NovellAuthenticatorMBean UserDescriptionAttribute");
    used.add("property OracleVirtualDirectoryAuthenticatorMBean UserDescriptionAttribute");
  }

  public static void trackUsage() {
    trackUsage = true;
  }

  public static void reportMissing() {
    if (!trackUsage) {
      return;
    }
    boolean foundMissing = false;
    for (String id : notFound) {
      if (!used.contains(id)) {
        System.err.println("Missing " + id);
        foundMissing = true;
      }
    }
    if (foundMissing) {
      throw new RuntimeException(
        "Yamls refer to missing items. See the list above."
        + " Either fix the problems or add them to UsageTracker.java if they're expected."
      );
    }
  }

  public static void used(String usageId) {
    if (trackUsage) {
      used.add(usageId);
    }
  }

  public static void notFound(String usageId) {
    if (trackUsage) {
      notFound.add(usageId);
    }
  }
}