// Copyright (c) 2020, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.pagedesc;

/**
 * This POJO mirrors the yaml source file format for configuring information
 * about the nav tree for a type, e.g. DomainMBean/navigation.yaml
 */
public class LinkSource {
  private String match;
  private String label;
  private String resourceData;
  private String notFoundMessage;

  public String getMatch() {
    return match;
  }

  public void setMatch(String match) {
    // this.match = match;
    throw new Error("Not implemented");
  }

  public String getResourceData() {
    return resourceData;
  }
  
  public void setResourceData(String resourceData) {
    this.resourceData = resourceData;
  }

  
  public String getNotFoundMessage() {
    return notFoundMessage;
  }

  public void setNotFoundMessage(String notFoundMessage) {
    this.notFoundMessage = notFoundMessage;
  }

  public String getLabel() {
    return label;
  }

  public void setLabel(String label) {
    this.label = label;
  }
}
