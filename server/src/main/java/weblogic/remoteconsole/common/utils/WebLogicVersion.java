// Copyright (c) 2020, 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.utils;

import java.util.ArrayList;
import java.util.List;

/**
 * Contains overall information about a Weblogic version, including how to get to its public
 * documentation.
 */
public class WebLogicVersion {

  // Whether this instance is the current wls version,
  // i.e. the one that the hand coded yaml files were
  // written to match.
  private boolean currentVersion;

  // The version returned by DomainMBean.getDomainVersion():
  private String domainVersion;

  // The FMW_VERSION environment variable for the weblogic version's kit.
  // Used for constructing generic documentation urls.
  private String fmwVersion;

  // The top level url of the website containing this release's public documentation
  private String docsUrl;

  // The directory, relative to docsUrl, of the url containing this release's public mbean javadoc
  private String mbeanJavadocDirectory;

  private List<WebLogicPSU> psus = new ArrayList<>();

  WebLogicVersion(
    boolean currentVersion,
    String domainVersion,
    String fmwVersion,
    String docsUrl,
    String mbeanJavadocDirectory,
    WebLogicPSU... psus // newest to oldest
  ) {
    this.currentVersion = currentVersion;
    this.domainVersion = domainVersion;
    this.fmwVersion = fmwVersion;
    this.docsUrl = docsUrl;
    this.mbeanJavadocDirectory = mbeanJavadocDirectory;
    WebLogicPSU lastPSU = null;
    for (WebLogicPSU psu : psus) {
      this.psus.add(psu);
      psu.setWebLogicVersion(this);
      if (lastPSU == null) {
        // The first version is the current version
        psu.setCurrentPSU(true);
      } else {
        // Not the first version.
        // Set the newer's PSU's previousPSU to this PSU
        lastPSU.setPreviousPSU(psu);
      }
      lastPSU = psu;
    }
  }

  public boolean isCurrentVersion() {
    return this.currentVersion;
  }

  public String getDomainVersion() {
    return this.domainVersion;
  }

  private String getFmwVersion() {
    return this.fmwVersion;
  }

  private String getDocsUrl() {
    return this.docsUrl;
  }

  private String getMBeanJavadocDirectory() {
    return this.mbeanJavadocDirectory;
  }

  // Get the url for the public mbean javadoc for an mbean interface
  // mbeanType is the leaf class name of the mbean type, e.g. ServerMBean or ServerRuntimeMBean
  public String getMBeanTypeJavadocUrl(String mbeanType) {
    return getDocsUrl() + "/" + getMBeanJavadocDirectory() + "/" + mbeanType + ".html";
  }

  // Get the url for the public mbean javadoc for an mbean attribute
  public String getMBeanAttributeJavadocUrl(String mbeanType, String attribute) {
    return getMBeanTypeJavadocUrl(mbeanType) + "#" + attribute;
  }

  // Get the url for an edocs help topic
  public String getEdocsHelpTopicUrl(String relativeHelpTopicUrl) {
    return getDocsUrl() + "/" + relativeHelpTopicUrl;
  }

  // Get the url for a generic help topic, replacing @FMW_VERSION with this verion's fmw version
  public String getGenericHelpTopicUrl(String genericTopicUrl) {
    return genericTopicUrl.replaceAll("@FMW_VERSION@&amp;", getFmwVersion() + "&");
  }

  public List<WebLogicPSU> getPSUs() {
    return psus;
  }

  public WebLogicPSU getCurrentPSU() {
    return psus.isEmpty() ? null : psus.get(0);
  }

  @Override
  public String toString() {
    return getDomainVersion();
  }
}
