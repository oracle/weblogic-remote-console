// Copyright (c) 2020, 2024, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.utils;

/**
 * Contains overall information about a Weblogic version, including how to get to its public
 * documentation.
 */
public class WebLogicVersion {

  // Whether this instance is the latest wls version.
  private boolean latestVersion;

  // The version returned by DomainMBean.getDomainVersion():
  private String domainVersion;

  // The FMW_VERSION environment variable for the weblogic version's kit.
  // Used for constructing generic documentation urls.
  private String fmwVersion;

  // The top level url of the website containing this release's public weblogic documentation
  private String webLogicDocsUrl;

  // The top level url of the website containing this release's public coherence documentation
  private String coherenceDocsUrl;

  // The directory, relative to docsUrl, of the url containing this release's public mbean javadoc
  private String mbeanJavadocDirectory;

  WebLogicVersion(
    boolean latestVersion,
    String domainVersion,
    String fmwVersion,
    String webLogicDocsUrl,
    String coherenceDocsUrl,
    String mbeanJavadocDirectory
  ) {
    this.latestVersion = latestVersion;
    this.domainVersion = domainVersion;
    this.fmwVersion = fmwVersion;
    this.webLogicDocsUrl = webLogicDocsUrl;
    this.coherenceDocsUrl = coherenceDocsUrl;
    this.mbeanJavadocDirectory = mbeanJavadocDirectory;
  }

  public boolean isLatestVersion() {
    return this.latestVersion;
  }

  public String getDomainVersion() {
    return this.domainVersion;
  }

  private String getFmwVersion() {
    return this.fmwVersion;
  }

  private String getWebLogicDocsUrl() {
    return this.webLogicDocsUrl;
  }

  private String getCoherenceDocsUrl() {
    return this.coherenceDocsUrl;
  }

  private String getMBeanJavadocDirectory() {
    return this.mbeanJavadocDirectory;
  }

  // Get the url for the public mbean javadoc for an mbean interface
  // mbeanType is the leaf class name of the mbean type, e.g. ServerMBean or ServerRuntimeMBean
  public String getMBeanTypeJavadocUrl(String mbeanType) {
    return getWebLogicDocsUrl() + "/" + getMBeanJavadocDirectory() + "/" + mbeanType + ".html";
  }

  // Get the url for the public mbean javadoc for an mbean attribute
  public String getMBeanAttributeJavadocUrl(String mbeanType, String attribute) {
    return getMBeanTypeJavadocUrl(mbeanType) + "#" + attribute;
  }

  // Get the url for the public mbean javadoc for an mbean operation
  public String getMBeanOperationJavadocUrl(String mbeanType, String operation) {
    return getMBeanTypeJavadocUrl(mbeanType) + "#" + operation;
  }

  // Get the url for an edocs help topic
  public String getEdocsHelpTopicUrl(String relativeHelpTopicUrl) {
    return getWebLogicDocsUrl() + "/" + relativeHelpTopicUrl;
  }

  // Get the url for a coherence edocs help topic
  public String getCoherenceEdocsHelpTopicUrl(String relativeHelpTopicUrl) {
    return getCoherenceDocsUrl() + "/" + relativeHelpTopicUrl;
  }

  // Get the url for a generic help topic, replacing @FMW_VERSION with this verion's fmw version
  public String getGenericHelpTopicUrl(String genericTopicUrl) {
    return genericTopicUrl.replaceAll("@FMW_VERSION@&amp;", getFmwVersion() + "&");
  }

  @Override
  public String toString() {
    return getDomainVersion();
  }
}
