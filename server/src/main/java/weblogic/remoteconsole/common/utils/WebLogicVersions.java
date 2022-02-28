// Copyright (c) 2020, 2021, Oracle and/or its affiliates.
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

  // Records the current version (i.e. during the build, we check that all of the pages
  // in the current version refer to properties that exist, v.s. for earlier versions,
  // the property might be missing)
  private static WebLogicVersion currentVersion = null;

  // Initialize the versions.
  // Must be newest to oldest.
  static {

    addVersion(
      "14.1.1.0.0",
      "wls14110",
      "https://docs.oracle.com/en/middleware/standalone/weblogic-server/14.1.1.0",
      "wlmbr/mbeans",
      new WebLogicPSU(
        "psu210930",
        "securityConfiguration.secureMode.warnOnInsecureDataSources"
      ),
       new WebLogicPSU(
        "psu210701",
        "securityConfiguration.checkCertificatesExpirationDays",
        "securityConfiguration.checkCertificatesIntervalDays",
        "securityConfiguration.checkIdentityCertificates",
        "securityConfiguration.checkTrustCertificates",
        "securityConfiguration.secureMode.warnOnAnonymousRequests",
        "securityConfiguration.secureMode.warnOnPatches",
        "securityConfiguration.secureMode.warnOnPorts",
        "securityConfiguration.secureMode.warnOnUserLockout",
        "securityConfiguration.secureMode.warnOnUsernamePasswords"
      )
    );

    addVersion(
      "12.2.1.4.0",
      "fmw122140",
      "https://docs.oracle.com/en/middleware/fusion-middleware/weblogic-server/12.2.1.4",
      "wlmbr/mbeans",
      new WebLogicPSU(
        "psu210930",
        "securityConfiguration.secureMode.warnOnInsecureDataSources"
      ),
      new WebLogicPSU(
        "psu210630",
        "securityConfiguration.checkCertificatesExpirationDays",
        "securityConfiguration.checkCertificatesIntervalDays",
        "securityConfiguration.checkIdentityCertificates",
        "securityConfiguration.checkTrustCertificates",
        "securityConfiguration.secureMode.warnOnAnonymousRequests",
        "securityConfiguration.secureMode.warnOnPatches",
        "securityConfiguration.secureMode.warnOnPorts",
        "securityConfiguration.secureMode.warnOnUserLockout",
        "securityConfiguration.secureMode.warnOnUsernamePasswords"
      ),
      new WebLogicPSU(
        "psu210330",
        "securityConfiguration.remoteAnonymousRMIIIOPEnabled",
        "securityConfiguration.remoteAnonymousRMIT3Enabled"
      ),
      new WebLogicPSU(
        "psu200624",
        "restfulManagementServices.CORSAllowedCredentials",
        "restfulManagementServices.CORSAllowedHeaders",
        "restfulManagementServices.CORSAllowedMethods",
        "restfulManagementServices.CORSAllowedOrigins",
        "restfulManagementServices.CORSEnabled",
        "restfulManagementServices.CORSExposedHeaders",
        "restfulManagementServices.CORSMaxAge"
      )
    );

    addVersion(
      "12.2.1.3.0",
      "fmw122130",
      "https://docs.oracle.com/middleware/12213/wls",
      "WLMBR/mbeans",
      new WebLogicPSU(
        "psu210923",
        "securityConfiguration.secureMode.warnOnInsecureDataSources"        
      ),
      new WebLogicPSU(
        "psu210630",
        "securityConfiguration.checkCertificatesExpirationDays",
        "securityConfiguration.checkCertificatesIntervalDays",
        "securityConfiguration.checkIdentityCertificates",
        "securityConfiguration.checkTrustCertificates",
        "securityConfiguration.secureMode.warnOnAnonymousRequests",
        "securityConfiguration.secureMode.warnOnPatches",
        "securityConfiguration.secureMode.warnOnPorts",
        "securityConfiguration.secureMode.warnOnUserLockout",
        "securityConfiguration.secureMode.warnOnUsernamePasswords"
      ),
      new WebLogicPSU(
        "psu210329",
        "securityConfiguration.remoteAnonymousRMIIIOPEnabled",
        "securityConfiguration.remoteAnonymousRMIT3Enabled"
      ),
      new WebLogicPSU(
        "psu200227",
        "restfulManagementServices.CORSAllowedCredentials",
        "restfulManagementServices.CORSAllowedHeaders",
        "restfulManagementServices.CORSAllowedMethods",
        "restfulManagementServices.CORSAllowedOrigins",
        "restfulManagementServices.CORSEnabled",
        "restfulManagementServices.CORSExposedHeaders",
        "restfulManagementServices.CORSMaxAge"        
      )
    );
  }

  private static WebLogicVersion addVersion(
    String domainVersion,
    String fmwVersion,
    String docsUrl,
    String mbeanJavadocDirectory,
    WebLogicPSU... psus // newest to oldest
  ) {
    boolean isCurrentVersion = versionStringToVersion.isEmpty();
    WebLogicVersion version =
      new WebLogicVersion(isCurrentVersion, domainVersion, fmwVersion, docsUrl, mbeanJavadocDirectory, psus);
    versionStringToVersion.put(domainVersion, version);
    versionNumberToVersion.put(getVersionNumber(domainVersion), version);
    if (isCurrentVersion) {
      currentVersion = version;
    }
    return version;
  }

  // Get the current (i.e. latest) weblogic version.  All of the properties on all the pages
  // must exist for this version.
  public static WebLogicVersion getCurrentVersion() {
    return currentVersion;
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
