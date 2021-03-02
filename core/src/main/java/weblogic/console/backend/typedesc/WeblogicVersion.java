// Copyright (c) 2020, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.typedesc;

/**
 * Contains overall information about a Weblogic version, including how to get to its public
 * documentation.
 */
public class WeblogicVersion {

  // The version returned by DomainMBean.getDomainVersion():
  private String domainVersion;

  public String getDomainVersion() {
    return this.domainVersion;
  }

  // The FMW_VERSION environment variable for the weblogic version's kit.
  // Used for constructing generic documentation urls.
  private String fmwVersion;

  private String getFmwVersion() {
    return this.fmwVersion;
  }

  // The top level url of the website containing this release's public documentation
  private String docsUrl;

  private String getDocsUrl() {
    return this.docsUrl;
  }

  // The directory, relative to docsUrl, of the url containing this release's public mbean javadoc
  private String mbeanJavadocDirectory;

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

  /*package*/ WeblogicVersion(
    String domainVersion,
    String fmwVersion,
    String docsUrl,
    String mbeanJavadocDirectory
  ) {
    this.domainVersion = domainVersion;
    this.fmwVersion = fmwVersion;
    this.docsUrl = docsUrl;
    this.mbeanJavadocDirectory = mbeanJavadocDirectory;
  }
}
