// Copyright (c) 2020, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.pagedesc;

/**
 * This POJO mirrors the yaml source file format for configuring information
 * about a link to a non-console help topic.
 */
public class HelpTopicSource {
  private String href;

  public String getHref() {
    return href;
  }

  public void setHref(String href) {
    this.href = href;
  }

  public enum Type {
    edocs,
    generic
  }

  private Type type;

  public Type getType() {
    return type;
  }

  public void setType(Type type) {
    this.type = type;
  }

  private String label;

  public String getLabel() {
    return label;
  }

  public void setLabel(String label) {
    this.label = label;
  }
}
