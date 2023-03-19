// Copyright (c) 2020, 2023, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.utils;

import java.util.Collection;
import java.util.HashMap;
import java.util.Map;
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

  // Records the latest version (i.e. during the build, we check that all of the pages
  // in the latest version refer to properties that exist, v.s. for earlier versions,
  // the property might be missing)
  private static WebLogicVersion latestVersion = null;

  // Records the current version (i.e. the latest shipped WLS version that we support)
  // (e.g. WDT uses this version)
  private static WebLogicVersion currentVersion = null;

  // Initialize the versions.
  // Must be newest to oldest.
  static {

    // No 14.1.2.0.0 specific docs yet since 14.1.2 hasn't shipped yet
    // The 14.1.2.0.0 release is in progress
    addVersion(
      "14.1.2.0.0",
      "wls14110",
      "https://docs.oracle.com/en/middleware/standalone/weblogic-server/14.1.1.0",
      "wlmbr/mbeans"
    );

    addVersion(
      "14.1.1.0.0",
      "wls14110",
      "https://docs.oracle.com/en/middleware/standalone/weblogic-server/14.1.1.0",
      "wlmbr/mbeans",
      true // this is the latest shipped WLS version we support (i.e. the current version)
    );

    // No 12.2.1.6.0 specific docs yet:
    // The 12.2.1.6.0 release is used by Oracle applications and is not a public release
    addVersion(
      "12.2.1.6.0",
      "fmw122140",
      "https://docs.oracle.com/en/middleware/fusion-middleware/weblogic-server/12.2.1.4",
      "wlmbr/mbeans"
    );

    // No 12.2.1.5.0 specific docs yet:
    // The 12.2.1.5.0 release is used by Oracle applications and is not a public release
    addVersion(
      "12.2.1.5.0",
      "fmw122140",
      "https://docs.oracle.com/en/middleware/fusion-middleware/weblogic-server/12.2.1.4",
      "wlmbr/mbeans"
    );

    addVersion(
      "12.2.1.4.0",
      "fmw122140",
      "https://docs.oracle.com/en/middleware/fusion-middleware/weblogic-server/12.2.1.4",
      "wlmbr/mbeans"
    );

    addVersion(
      "12.2.1.3.0",
      "fmw122130",
      "https://docs.oracle.com/middleware/12213/wls",
      "WLMBR/mbeans"
    );

  }

  private static void addVersion(
    String domainVersion,
    String fmwVersion,
    String docsUrl,
    String mbeanJavadocDirectory
  ) {
    addVersion(domainVersion, fmwVersion, docsUrl, mbeanJavadocDirectory, false);
  }

  private static void addVersion(
    String domainVersion,
    String fmwVersion,
    String docsUrl,
    String mbeanJavadocDirectory,
    boolean isCurrentVersion
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
        isCurrentVersion,
        domainVersion,
        fmwVersion,
        docsUrl,
        mbeanJavadocDirectory
      );
    versionStringToVersion.put(domainVersion, version);
    versionNumberToVersion.put(getVersionNumber(domainVersion), version);
    if (isLatestVersion) {
      latestVersion = version;
    }
    if (isCurrentVersion) {
      currentVersion = version;
    }
  }

  // Get the current (i.e. latest shipped) weblogic version.
  public static WebLogicVersion getCurrentVersion() {
    return currentVersion;
  }

  // Get the current (i.e. latest) weblogic version.
  // All of the properties on all the pages must exist for this version.
  public static WebLogicVersion getLatestVersion() {
    return latestVersion;
  }

  // Get the list of supported weblogic versions.
  public static Collection<WebLogicVersion> getSupportedVersions() {
    return versionStringToVersion.values();
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
