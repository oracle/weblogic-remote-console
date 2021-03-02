// Copyright (c) 2020, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.typedesc;

/**
 * This POJO mirrors the yaml file format for configuring console-specific information
 * about one of a weblogic bean property's legal values, e.g. WTCLocalTuxDomMBean/type.yaml
 * <p>
 * For example, a WTCLocalTuxDomMBean's SSLProtocolVersion's TLSv1.0 property should have
 * the label 'TLS v1.0'.
 */
public class ConsoleWeblogicBeanLegalValue {
  private Object value;

  public Object getValue() {
    return value;
  }

  public void setValue(Object value) {
    this.value = value;
  }

  private String label;

  public String getLabel() {
    return label;
  }

  public void setLabel(String label) {
    this.label = label;
  }
}
