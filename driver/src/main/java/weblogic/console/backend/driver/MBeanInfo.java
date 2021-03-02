// Copyright (c) 2020, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.driver;

/**
 * This POJO contains information that the UI needs about the underlying mbean property
 * that a form property or table column manages.
 */
public class MBeanInfo {

  // The mbean type, e.g. ServerMBean or ServerRuntimeMBean
  private String type;

  public String getType() {
    return this.type;
  }

  public void setType(String type) {
    this.type = type;
  }

  // The mbean attribute, e.g. ListenPort
  private String attribute;

  public String getAttribute() {
    return this.attribute;
  }

  public void setAttribute(String attribute) {
    this.attribute = attribute;
  }

  // The folded containment path (dot separated mbean property names)
  // from the top level folded bean to this attribute's mbean.
  // e.g. for ServerMBean.getSSL().getListenPort(), "SSL"
  // e.g. for ServerMBean.getListenPort(), null
  private String path;

  public String getPath() {
    return this.path;
  }

  public void setPath(String path) {
    this.path = path;
  }

  // The url of the corresponding public oracle mbean javadoc.
  // Null if there is none.
  private String javadocHref;

  public String getJavadocHref() {
    return this.javadocHref;
  }

  public void setJavadocHref(String javadocHref) {
    this.javadocHref = javadocHref;
  }
}
