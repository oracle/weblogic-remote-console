// Copyright (c) 2020, 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.utils;

import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.TreeMap;
import java.util.logging.Logger;

/** Contains information about the Weblogic versions that the console supports. */
public class WebLogicVersions {

  private static final Logger LOGGER = Logger.getLogger(WebLogicVersions.class.getName());

  // Maps from a supported version (i.e. DomainMBean.getDomainVersion)
  // to information about that version.
  private static Map<String, WebLogicVersion> versionStringToVersion = new HashMap<>();

  // Maps from a supported version (converted to a long, e.g. 12.2.1.4.0 -> 1202010400)
  // to information about that version.
  // It's sorted, oldest to newest
  private static Map<Long, WebLogicVersion> versionNumberToVersion = new TreeMap<>();

  // Records the latest version
  private static WebLogicVersion latestVersion = null;

  // Initialize the versions.
  // Must be newest to oldest.
  static {

    // No 15.1.1.0.0 specific docs yet since 15.1.1 hasn't shipped yet
    // The 15.1.1.0.0 release is in progress
    addVersion(
      "15.1.1.0.0",
      "wls14120",
      "https://docs.oracle.com/en/middleware/fusion-middleware/weblogic-server/14.1.2",
      "https://docs.oracle.com/en/middleware/fusion-middleware/coherence/14.1.2",
      "wlmbr/mbeans"
    );

    addVersion(
      "14.1.2.0.0",
      "wls14120",
      "https://docs.oracle.com/en/middleware/fusion-middleware/weblogic-server/14.1.2",
      "https://docs.oracle.com/en/middleware/fusion-middleware/coherence/14.1.2",
      "wlmbr/mbeans"
    );

    addVersion(
      "14.1.1.0.0",
      "wls14110",
      "https://docs.oracle.com/en/middleware/standalone/weblogic-server/14.1.1.0",
      "https://docs.oracle.com/en/middleware/standalone/coherence/14.1.1.0",
      "wlmbr/mbeans"
    );

    // No 12.2.1.6.0 specific docs yet:
    // The 12.2.1.6.0 release is used by Oracle applications and is not a public release
    addVersion(
      "12.2.1.6.0",
      "fmw122140",
      "https://docs.oracle.com/en/middleware/fusion-middleware/weblogic-server/12.2.1.4",
      "https://docs.oracle.com/en/middleware/fusion-middleware/coherence/12.2.1.4",
      "wlmbr/mbeans"
    );

    // No 12.2.1.5.0 specific docs yet:
    // The 12.2.1.5.0 release is used by Oracle applications and is not a public release
    addVersion(
      "12.2.1.5.0",
      "fmw122140",
      "https://docs.oracle.com/en/middleware/fusion-middleware/weblogic-server/12.2.1.4",
      "https://docs.oracle.com/en/middleware/fusion-middleware/coherence/12.2.1.4",
      "wlmbr/mbeans"
    );

    addVersion(
      "12.2.1.4.0",
      "fmw122140",
      "https://docs.oracle.com/en/middleware/fusion-middleware/weblogic-server/12.2.1.4",
      "https://docs.oracle.com/en/middleware/fusion-middleware/coherence/12.2.1.4",
      "wlmbr/mbeans"
    );

    addVersion(
      "12.2.1.3.0",
      "fmw122130",
      "https://docs.oracle.com/middleware/12213/wls",
      "https://docs.oracle.com/middleware/12213/coherence",
      "WLMBR/mbeans"
    );

  }

  private static void addVersion(
    String domainVersion,
    String fmwVersion,
    String webLogicDocsUrl,
    String coherenceDocsUrl,
    String mbeanJavadocDirectory
  ) {
    String resourceName = "harvestedWeblogicBeanTypes/" + domainVersion + "/DomainMBean.yaml";
    if (Thread.currentThread().getContextClassLoader().getResource(resourceName) == null) {
      // There are no harvested yamls for this release in this RC build.
      // Don't add this version
      return;
    }
    boolean isLatestVersion = versionStringToVersion.isEmpty();
    WebLogicVersion version =
      new WebLogicVersion(
        isLatestVersion,
        domainVersion,
        fmwVersion,
        webLogicDocsUrl,
        coherenceDocsUrl,
        mbeanJavadocDirectory
      );
    versionStringToVersion.put(domainVersion, version);
    versionNumberToVersion.put(getVersionNumber(domainVersion), version);
    if (isLatestVersion) {
      latestVersion = version;
    }
  }

  // Get the latest weblogic version.
  public static WebLogicVersion getLatestVersion() {
    return latestVersion;
  }

  // Get the list of supported weblogic versions.
  public static Collection<WebLogicVersion> getSupportedVersions() {
    return versionStringToVersion.values();
  }

  public static Set<String> getVersionCapabilities(WebLogicVersion version) {
    Set<String> capabilities = new HashSet<>();
    long versionNumber = getVersionNumber(version.getDomainVersion());
    for (WebLogicVersion supportedVersion : getSupportedVersions()) {
      String supportedDomainVersion = supportedVersion.getDomainVersion();
      long supportedVersionNumber = getVersionNumber(supportedDomainVersion);
      if (versionNumber < supportedVersionNumber) {
        capabilities.add("Before" + supportedDomainVersion);
      } else {
        capabilities.add(supportedDomainVersion + "OrAfter");
      }
    }
    return capabilities;
  }

  // Looks up a version given its domain version.
  public static WebLogicVersion getVersion(String domainVersion) {
    WebLogicVersion weblogicVersion = versionStringToVersion.get(domainVersion);
    if (weblogicVersion != null) {
      // This is a known version. Return it.
      return weblogicVersion;
    }
    // If this is for a version that hasn't been released yet,
    // return the closest previous released version.
    long versionNumber = getVersionNumber(domainVersion);
    long nearestPreviousVersionNumber = 0;
    // versions's keys are sorted:
    for (Long supportedVersionNumber : versionNumberToVersion.keySet()) {
      if (versionNumber > supportedVersionNumber) {
        nearestPreviousVersionNumber = supportedVersionNumber;
      }
    }
    LOGGER.finest(
      "Using nearest previous weblogic version. want: "
      + versionNumber
      + " using: "
      + nearestPreviousVersionNumber
    );
    return versionNumberToVersion.get(nearestPreviousVersionNumber);
  }

  // Return whether a weblogic version is supported by the console.
  public static boolean isSupportedVersion(String version) {
    return getVersion(version) != null;
  }

  // Convert a domainVersion string, e.g. 12.2.1.4.0, into an integer, e.g. 1202010400
  // so we can order them chronologically.
  // So far, all the version numbers look like 12.2.1.4.0.
  // This method only support 5 numbers, dot separated, where each number is < 100.
  private static long getVersionNumber(String domainVersion) {
    String[] numbers = domainVersion.split("\\.");
    if (numbers.length != 5) {
      throw unsupportedDomainVersionSyntax(domainVersion);
    }
    long versionNumber = 0;
    for (String number : numbers) {
      try {
        int num = Integer.parseUnsignedInt(number);
        versionNumber = (versionNumber * 100) + num;
      } catch (NumberFormatException e) {
        throw unsupportedDomainVersionSyntax(domainVersion);
      }
    }
    return versionNumber;
  }

  private static AssertionError unsupportedDomainVersionSyntax(String domainVersion) {
    return new AssertionError(
      "Unsupported domain version syntax: "
      + domainVersion
      + " expect xx.xx.xx.xx.xx, e.g. 14.1.1.0.0"
    );
  }
}
